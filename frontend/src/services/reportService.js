import { supabase } from '../lib/supabase';

export const reportService = {
  // Create new billboard report
  async createReport(reportData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to submit reports')
      }

      // Upload main image to storage if provided
      let imageUrl = reportData?.image
      if (reportData?.imageFile) {
        const fileExt = reportData?.imageFile?.name?.split('.')?.pop()
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase?.storage?.from('billboard-evidence')?.upload(fileName, reportData?.imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase?.storage?.from('billboard-evidence')?.getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Upload additional images if provided
      const additionalImageUrls = []
      if (reportData?.additionalImages?.length > 0) {
        for (const imageFile of reportData?.additionalImages) {
          const fileExt = imageFile?.name?.split('.')?.pop()
          const fileName = `${user?.id}/additional/${Date.now()}-${Math.random()?.toString(36)?.substring(7)}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase?.storage?.from('billboard-evidence')?.upload(fileName, imageFile)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase?.storage?.from('billboard-evidence')?.getPublicUrl(fileName)

          additionalImageUrls?.push(publicUrl)
        }
      }

      // Create the report record
      const { data, error } = await supabase?.from('billboard_reports')?.insert({
          reporter_id: user?.id,
          image_url: imageUrl,
          additional_images: additionalImageUrls,
          location_data: reportData?.location,
          violations: reportData?.violations || [],
          priority: reportData?.priority || 'medium',
          description: reportData?.description || '',
          estimated_size: reportData?.estimatedSize || '',
          distance_from_road: reportData?.distanceFromRoad || '',
          traffic_impact: reportData?.trafficImpact || {},
          ai_annotations: reportData?.annotations || [],
          contact_anonymous: reportData?.contact?.anonymous || false,
          contact_name: reportData?.contact?.name || '',
          contact_email: reportData?.contact?.email || '',
          contact_phone: reportData?.contact?.phone || '',
          allow_follow_up: reportData?.contact?.allowFollowUp || false,
          notification_preferences: reportData?.contact?.notifications || {},
          has_witnesses: reportData?.contact?.hasWitnesses || false,
          data_consent: reportData?.contact?.dataConsent || false
        })?.select()

      if (error) throw error

      // Send email notification to government authorities
      if (data?.[0]) {
        await this.sendEmailNotification(data?.[0])
      }

      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error creating report:', error)
      return { data: null, error }
    }
  },

  // Send email notification to government authorities
  async sendEmailNotification(reportData) {
    try {
      const { data: { session } } = await supabase?.auth?.getSession()
      const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
      const token = session?.access_token

      const response = await fetch(`${supabaseUrl}/functions/v1/send-report-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reportId: reportData?.id,
          reportData: reportData,
          govEmail: 'government.billboard@municipal.gov.in' // Government email ID
        })
      })

      if (!response?.ok) {
        throw new Error('Failed to send email notification')
      }

      const result = await response?.json()
      return { data: result, error: null }
    } catch (error) {
      console.error('Error sending email notification:', error)
      return { data: null, error }
    }
  },

  // Get reports by user
  async getUserReports(userId) {
    try {
      const { data, error } = await supabase?.from('billboard_reports')?.select(`
          *,
          reporter:user_profiles(id, full_name, email)
        `)?.eq('reporter_id', userId)?.order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user reports:', error)
      return { data: null, error }
    }
  },

  // Get all reports (for authorities)
  async getAllReports(filters = {}) {
    try {
      let query = supabase?.from('billboard_reports')?.select(`
          *,
          reporter:user_profiles(id, full_name, email)
        `)

      // Apply filters
      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }
      if (filters?.priority) {
        query = query?.eq('priority', filters?.priority)
      }
      if (filters?.location) {
        query = query?.ilike('location_data->address', `%${filters?.location}%`)
      }
      if (filters?.dateFrom) {
        query = query?.gte('created_at', filters?.dateFrom)
      }
      if (filters?.dateTo) {
        query = query?.lte('created_at', filters?.dateTo)
      }

      query = query?.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching all reports:', error)
      return { data: null, error }
    }
  },

  // Update report status (for authorities)
  async updateReportStatus(reportId, status, notes = '') {
    try {
      const { data, error } = await supabase?.from('billboard_reports')?.update({
          status,
          status_notes: notes,
          updated_at: new Date()?.toISOString()
        })?.eq('id', reportId)?.select()

      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error updating report status:', error)
      return { data: null, error }
    }
  },

  // Get report statistics
  async getReportStatistics() {
    try {
      const { data, error } = await supabase?.rpc('get_report_statistics')

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching report statistics:', error)
      return { data: null, error }
    }
  },

  // Subscribe to real-time updates
  subscribeToReports(callback) {
    const channel = supabase?.channel('billboard_reports')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'billboard_reports'
        },
        (payload) => {
          callback?.(payload)
        }
      )?.subscribe()

    return () => supabase?.removeChannel(channel);
  }
}