// Email service using Resend
// You'll need to install: npm install resend

interface SendInvitationEmailParams {
  to: string
  workspaceName: string
  inviterName: string
  invitationLink: string
  role: string
}

export class EmailService {
  private static resendApiKey = import.meta.env.VITE_RESEND_API_KEY
  private static fromEmail = import.meta.env.VITE_FROM_EMAIL || 'noreply@syncflow.app'

  /**
   * Send invitation email using Resend
   */
  static async sendInvitationEmail({
    to,
    workspaceName,
    inviterName,
    invitationLink,
    role
  }: SendInvitationEmailParams): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.resendApiKey) {
        console.warn('Resend API key not configured, skipping email send')
        return { success: true }
      }

      // Dynamic import to avoid SSR issues
      const { Resend } = await import('resend')
      const resend = new Resend(this.resendApiKey)

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: `You've been invited to join ${workspaceName} on SyncFlow`,
        html: this.generateInvitationEmailHTML({
          workspaceName,
          inviterName,
          invitationLink,
          role
        }),
        text: this.generateInvitationEmailText({
          workspaceName,
          inviterName,
          invitationLink,
          role
        })
      })

      if (error) {
        console.error('Error sending email:', error)
        return {
          success: false,
          error: 'Failed to send invitation email'
        }
      }

      console.log('Invitation email sent successfully:', data)
      return { success: true }
    } catch (error) {
      console.error('Error in sendInvitationEmail:', error)
      return {
        success: false,
        error: 'Failed to send invitation email'
      }
    }
  }

  /**
   * Generate HTML email template
   */
  private static generateInvitationEmailHTML({
    workspaceName,
    inviterName,
    invitationLink,
    role
  }: Omit<SendInvitationEmailParams, 'to'>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Workspace Invitation - SyncFlow</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
          }
          .invitation-text {
            font-size: 18px;
            margin-bottom: 20px;
            text-align: center;
          }
          .workspace-info {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .workspace-name {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .role-badge {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            text-transform: capitalize;
          }
          .cta-button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .cta-button:hover {
            background-color: #2563eb;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .expiry-notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SyncFlow</div>
            <h1>Workspace Invitation</h1>
          </div>
          
          <div class="invitation-text">
            <strong>${inviterName}</strong> has invited you to join their workspace on SyncFlow.
          </div>
          
          <div class="workspace-info">
            <div class="workspace-name">${workspaceName}</div>
            <div class="role-badge">${role}</div>
          </div>
          
          <div style="text-align: center;">
            <a href="${invitationLink}" class="cta-button">
              Accept Invitation
            </a>
          </div>
          
          <div class="expiry-notice">
            ⏰ This invitation expires in 7 days
          </div>
          
          <div class="footer">
            <p>SyncFlow helps teams collaborate and manage projects efficiently.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Generate plain text email template
   */
  private static generateInvitationEmailText({
    workspaceName,
    inviterName,
    invitationLink,
    role
  }: Omit<SendInvitationEmailParams, 'to'>): string {
    return `
SyncFlow - Workspace Invitation

${inviterName} has invited you to join their workspace on SyncFlow.

Workspace: ${workspaceName}
Role: ${role}

To accept this invitation, click the link below:
${invitationLink}

This invitation expires in 7 days.

---
SyncFlow helps teams collaborate and manage projects efficiently.
If you didn't expect this invitation, you can safely ignore this email.
    `.trim()
  }

  /**
   * Send welcome email to new workspace members
   */
  static async sendWelcomeEmail({
    to,
    workspaceName,
    role
  }: {
    to: string
    workspaceName: string
    role: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.resendApiKey) {
        console.warn('Resend API key not configured, skipping welcome email')
        return { success: true }
      }

      const { Resend } = await import('resend')
      const resend = new Resend(this.resendApiKey)

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: `Welcome to ${workspaceName} on SyncFlow!`,
        html: this.generateWelcomeEmailHTML({ workspaceName, role }),
        text: this.generateWelcomeEmailText({ workspaceName, role })
      })

      if (error) {
        console.error('Error sending welcome email:', error)
        return {
          success: false,
          error: 'Failed to send welcome email'
        }
      }

      console.log('Welcome email sent successfully:', data)
      return { success: true }
    } catch (error) {
      console.error('Error in sendWelcomeEmail:', error)
      return {
        success: false,
        error: 'Failed to send welcome email'
      }
    }
  }

  /**
   * Generate welcome email HTML template
   */
  private static generateWelcomeEmailHTML({
    workspaceName,
    role
  }: {
    workspaceName: string
    role: string
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SyncFlow</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 10px;
          }
          .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
            text-align: center;
          }
          .workspace-info {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .workspace-name {
            font-size: 20px;
            font-weight: bold;
            color: #065f46;
            margin-bottom: 10px;
          }
          .role-badge {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            text-transform: capitalize;
          }
          .cta-button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .cta-button:hover {
            background-color: #059669;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SyncFlow</div>
            <h1>Welcome to SyncFlow!</h1>
          </div>
          
          <div class="welcome-text">
            You've successfully joined the workspace!
          </div>
          
          <div class="workspace-info">
            <div class="workspace-name">${workspaceName}</div>
            <div class="role-badge">${role}</div>
          </div>
          
          <div style="text-align: center;">
            <a href="${import.meta.env.VITE_APP_URL || 'https://syncflow.app'}" class="cta-button">
              Go to Workspace
            </a>
          </div>
          
          <div class="footer">
            <p>You're all set! Start collaborating with your team on SyncFlow.</p>
            <p>If you have any questions, feel free to reach out to your workspace admin.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Generate welcome email plain text template
   */
  private static generateWelcomeEmailText({
    workspaceName,
    role
  }: {
    workspaceName: string
    role: string
  }): string {
    return `
Welcome to SyncFlow!

You've successfully joined the workspace!

Workspace: ${workspaceName}
Role: ${role}

To get started, visit your workspace:
${import.meta.env.VITE_APP_URL || 'https://syncflow.app'}

You're all set! Start collaborating with your team on SyncFlow.
If you have any questions, feel free to reach out to your workspace admin.

---
SyncFlow - Team Collaboration Made Simple
    `.trim()
  }
}
