import { supabase } from '../lib/supabase';

export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return { data: null, error }
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()

      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { data: null, error }
    }
  },

  // Create user profile (called automatically by trigger)
  async createUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.insert({
          id: userId,
          ...profileData
        })?.select()

      if (error) throw error
      return { data: data?.[0], error: null }
    } catch (error) {
      console.error('Error creating user profile:', error)
      return { data: null, error }
    }
  },

  // Get user's report statistics
  async getUserStatistics(userId) {
    try {
      const { data, error } = await supabase?.rpc('get_user_report_statistics', { user_id: userId })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user statistics:', error)
      return { data: null, error }
    }
  }
}