import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// Declare Deno global for TypeScript compatibility
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

serve(async (req) => {
  // ✅ CORS preflight
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*", // DO NOT CHANGE THIS
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*" // DO NOT CHANGE THIS
      }
    });
  }
  
  try {
    const { reportId, reportData, govEmail } = await req?.json();
    
    // Resend API configuration
    const RESEND_API_KEY = Deno?.env?.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Format violation types for email
    const violationTypes = reportData?.violations?.map(v => {
      const labels = {
        'oversized': 'Oversized Dimensions',
        'unsafe_placement': 'Unsafe Placement', 
        'missing_permit': 'Missing Permits',
        'traffic_obstruction': 'Traffic Signal Proximity',
        'structural_damage': 'Structural Damage',
        'content_violation': 'Content Violation'
      };
      return labels?.[v] || v;
    })?.join(', ') || 'Not specified';

    // Format priority level
    const priorityLabels = {
      'low': 'Low Priority',
      'medium': 'Medium Priority',
      'high': 'High Priority', 
      'emergency': 'Emergency'
    };
    const priority = priorityLabels?.[reportData?.priority] || 'Medium Priority';

    // Generate email content
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .priority-high { border-left: 4px solid #DC2626; }
            .priority-medium { border-left: 4px solid #EA580C; }
            .priority-low { border-left: 4px solid #16A34A; }
            .priority-emergency { border-left: 4px solid #DC2626; background: #FEF2F2; }
            .details-table { width: 100%; border-collapse: collapse; }
            .details-table td { padding: 8px; border-bottom: 1px solid #ddd; }
            .details-table .label { font-weight: bold; background: #f1f5f9; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚨 New Billboard Violation Report</h1>
            <p>Report ID: ${reportId}</p>
        </div>
        
        <div class="content">
            <div class="section priority-${reportData?.priority}">
                <h2>📋 Report Summary</h2>
                <table class="details-table">
                    <tr>
                        <td class="label">Priority Level:</td>
                        <td><strong>${priority}</strong></td>
                    </tr>
                    <tr>
                        <td class="label">Violations Detected:</td>
                        <td>${violationTypes}</td>
                    </tr>
                    <tr>
                        <td class="label">Submitted Date:</td>
                        <td>${new Date(reportData?.created_at || Date.now())?.toLocaleString('en-IN')}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>📍 Location Information</h2>
                <table class="details-table">
                    <tr>
                        <td class="label">Address:</td>
                        <td>${reportData?.location_data?.address || 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td class="label">City:</td>
                        <td>${reportData?.location_data?.city || 'Not provided'}, ${reportData?.location_data?.state || ''}</td>
                    </tr>
                    <tr>
                        <td class="label">Coordinates:</td>
                        <td>${reportData?.location_data?.latitude || 'N/A'}, ${reportData?.location_data?.longitude || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="label">Nearby Landmarks:</td>
                        <td>${reportData?.location_data?.landmarks?.join(', ') || 'None specified'}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>📝 Violation Details</h2>
                <table class="details-table">
                    <tr>
                        <td class="label">Description:</td>
                        <td>${reportData?.description || 'No description provided'}</td>
                    </tr>
                    <tr>
                        <td class="label">Estimated Size:</td>
                        <td>${reportData?.estimated_size || 'Not measured'}</td>
                    </tr>
                    <tr>
                        <td class="label">Distance from Road:</td>
                        <td>${reportData?.distance_from_road || 'Not measured'}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <h2>📞 Reporter Information</h2>
                <table class="details-table">
                    ${reportData?.contact_anonymous ? 
                        '<tr><td colspan="2"><em>Anonymous Report - Contact details not available</em></td></tr>' :
                        `<tr>
                            <td class="label">Name:</td>
                            <td>${reportData?.contact_name || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td class="label">Email:</td>
                            <td>${reportData?.contact_email || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td class="label">Phone:</td>
                            <td>${reportData?.contact_phone || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td class="label">Follow-up Allowed:</td>
                            <td>${reportData?.allow_follow_up ? 'Yes' : 'No'}</td>
                        </tr>`
                    }
                </table>
            </div>

            <div class="section">
                <h2>🖼️ Evidence</h2>
                <p><strong>Main Evidence Image:</strong> ${reportData?.image_url ? 'Available (attached/linked)' : 'Not provided'}</p>
                <p><strong>Additional Images:</strong> ${reportData?.additional_images?.length || 0} images</p>
                <p><strong>AI Analysis:</strong> ${reportData?.ai_annotations?.length || 0} annotations detected</p>
            </div>

            <div class="section">
                <h2>⚡ Immediate Actions Required</h2>
                <ul>
                    <li>✅ Verify the reported location</li>
                    <li>✅ Dispatch inspection team</li>
                    <li>✅ Document findings</li>
                    <li>✅ Issue notice if violation confirmed</li>
                    <li>✅ Update report status in system</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated email from the Billboard Monitoring System</p>
            <p>Please respond promptly to ensure public safety compliance</p>
            <p>Report generated at: ${new Date()?.toLocaleString('en-IN')}</p>
        </div>
    </body>
    </html>
    `;

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [govEmail || "government.billboard@municipal.gov.in"],
        subject: `🚨 URGENT: Billboard Violation Report ${reportId} - ${priority}`,
        html: emailHtml,
        text: `New Billboard Violation Report\n\nReport ID: ${reportId}\nPriority: ${priority}\nLocation: ${reportData?.location_data?.address || 'Not provided'}\nViolations: ${violationTypes}\n\nPlease review and take appropriate action.`
      }),
    });

    if (!emailResponse?.ok) {
      const errorData = await emailResponse?.json();
      throw new Error(`Email API error: ${errorData.message}`);
    }

    const emailResult = await emailResponse?.json();

    return new Response(JSON.stringify({
      success: true,
      message: "Report email sent successfully to government authorities",
      emailId: emailResult?.id,
      reportId: reportId,
      sentTo: govEmail || "government.billboard@municipal.gov.in",
      timestamp: new Date().toISOString()
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // DO NOT CHANGE THIS
      }
    });

  } catch (error) {
    console.error("Error sending report email:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: "Failed to send email notification"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // DO NOT CHANGE THIS
      }
    });
  }
});