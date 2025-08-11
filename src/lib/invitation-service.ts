import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from './supabase'

type Invitation = Database['public']['Tables']['invitations']['Row']
type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row']

export interface InvitationDetails {
  id: string
  workspace_id: string
  invited_by_id: string
  invitee_email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'pending' | 'accepted' | 'expired'
  created_at: string
  expires_at: string
  workspace_name: string
  inviter_name: string
}

export interface InviteUserParams {
  workspaceId: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  currentUserId: string
}

export class InvitationService {
  /**
   * Invite a new user to a workspace
   */
  static async inviteUser({
    workspaceId,
    email,
    role,
    currentUserId
  }: InviteUserParams): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if current user is admin of the workspace
      const { data: memberCheck, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', currentUserId)
        .single()

      if (memberError || !memberCheck || memberCheck.role !== 'admin') {
        return {
          success: false,
          error: 'You do not have permission to invite users to this workspace'
        }
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('workspace_members')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('user_id', email)
        .single()

      if (existingMember) {
        return {
          success: false,
          error: 'User is already a member of this workspace'
        }
      }

      // Check if there's already a pending invitation
      const { data: existingInvitation } = await supabase
        .from('invitations')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('invitee_email', email)
        .eq('status', 'pending')
        .single()

      if (existingInvitation) {
        return {
          success: false,
          error: 'An invitation has already been sent to this email'
        }
      }

      // Generate secure token and expiration
      const token = uuidv4()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

      // Create invitation
      const { error: insertError } = await supabase
        .from('invitations')
        .insert({
          workspace_id: workspaceId,
          invited_by_id: currentUserId,
          invitee_email: email,
          role,
          token,
          expires_at: expiresAt.toISOString()
        })

      if (insertError) {
        console.error('Error creating invitation:', insertError)
        return {
          success: false,
          error: 'Failed to create invitation'
        }
      }

      // TODO: Send email with invitation link
      // This would integrate with your email service (Resend, SendGrid, etc.)
      console.log('Invitation created successfully. Email should be sent to:', email)
      console.log('Invitation link:', `${window.location.origin}/invite/${token}`)

      return { success: true }
    } catch (error) {
      console.error('Error in inviteUser:', error)
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Get invitation details by token
   */
  static async getInvitationDetails(token: string): Promise<{
    success: boolean
    invitation?: InvitationDetails
    error?: string
  }> {
    try {
      const { data: invitation, error } = await supabase
        .from('invitations')
        .select(`
          *,
          workspaces!inner(name),
          workspace_members!inner(
            users!inner(email)
          )
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (error || !invitation) {
        return {
          success: false,
          error: 'Invitation not found or already used'
        }
      }

      // Check if invitation has expired
      if (new Date(invitation.expires_at) < new Date()) {
        return {
          success: false,
          error: 'Invitation has expired'
        }
      }

      // Get workspace name and inviter name
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('name')
        .eq('id', invitation.workspace_id)
        .single()

      const { data: inviter } = await supabase.auth.getUser(invitation.invited_by_id)

      const invitationDetails: InvitationDetails = {
        ...invitation,
        workspace_name: workspace?.name || 'Unknown Workspace',
        inviter_name: inviter?.user?.email || 'Unknown User'
      }

      return {
        success: true,
        invitation: invitationDetails
      }
    } catch (error) {
      console.error('Error in getInvitationDetails:', error)
      return {
        success: false,
        error: 'Failed to retrieve invitation details'
      }
    }
  }

  /**
   * Accept an invitation
   */
  static async acceptInvitation(
    token: string,
    currentUserId: string
  ): Promise<{ success: boolean; workspaceId?: string; error?: string }> {
    try {
      // Get invitation details
      const invitationResult = await this.getInvitationDetails(token)
      if (!invitationResult.success || !invitationResult.invitation) {
        return {
          success: false,
          error: invitationResult.error
        }
      }

      const invitation = invitationResult.invitation

      // Check if current user's email matches the invitation
      const { data: currentUser } = await supabase.auth.getUser()
      if (!currentUser.user || currentUser.user.email !== invitation.invitee_email) {
        return {
          success: false,
          error: 'This invitation was sent to a different email address'
        }
      }

      // Start a transaction (Supabase doesn't support transactions in client, so we'll do it manually)
      // First, add user to workspace members
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: invitation.workspace_id,
          user_id: currentUserId,
          role: invitation.role
        })

      if (memberError) {
        console.error('Error adding user to workspace:', memberError)
        return {
          success: false,
          error: 'Failed to join workspace'
        }
      }

      // Then, update invitation status to accepted
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id)

      if (updateError) {
        console.error('Error updating invitation status:', updateError)
        // Try to rollback by removing the user from workspace
        await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', invitation.workspace_id)
          .eq('user_id', currentUserId)

        return {
          success: false,
          error: 'Failed to complete invitation acceptance'
        }
      }

      return {
        success: true,
        workspaceId: invitation.workspace_id
      }
    } catch (error) {
      console.error('Error in acceptInvitation:', error)
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Get workspace members
   */
  static async getWorkspaceMembers(workspaceId: string): Promise<{
    success: boolean
    members?: Array<WorkspaceMember & { user_email: string; user_name?: string }>
    error?: string
  }> {
    try {
      const { data: members, error } = await supabase
        .from('workspace_members')
        .select(`
          *,
          users!inner(email)
        `)
        .eq('workspace_id', workspaceId)

      if (error) {
        console.error('Error fetching workspace members:', error)
        return {
          success: false,
          error: 'Failed to fetch workspace members'
        }
      }

      // Get user details for each member
      const membersWithDetails = await Promise.all(
        members.map(async (member) => {
          const { data: user } = await supabase.auth.getUser(member.user_id)
          return {
            ...member,
            user_email: user?.user?.email || 'Unknown',
            user_name: user?.user?.user_metadata?.full_name || user?.user?.email || 'Unknown'
          }
        })
      )

      return {
        success: true,
        members: membersWithDetails
      }
    } catch (error) {
      console.error('Error in getWorkspaceMembers:', error)
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Update member role
   */
  static async updateMemberRole(
    workspaceId: string,
    userId: string,
    newRole: 'admin' | 'member' | 'viewer',
    currentUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if current user is admin
      const { data: currentMember, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', currentUserId)
        .single()

      if (memberError || !currentMember || currentMember.role !== 'admin') {
        return {
          success: false,
          error: 'You do not have permission to update member roles'
        }
      }

      // Update member role
      const { error: updateError } = await supabase
        .from('workspace_members')
        .update({ role: newRole })
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating member role:', updateError)
        return {
          success: false,
          error: 'Failed to update member role'
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in updateMemberRole:', error)
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Remove member from workspace
   */
  static async removeMember(
    workspaceId: string,
    userId: string,
    currentUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if current user is admin
      const { data: currentMember, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', currentUserId)
        .single()

      if (memberError || !currentMember || currentMember.role !== 'admin') {
        return {
          success: false,
          error: 'You do not have permission to remove members'
        }
      }

      // Prevent removing the last admin
      if (userId === currentUserId) {
        const { data: adminCount } = await supabase
          .from('workspace_members')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('role', 'admin')

        if (adminCount && adminCount.length <= 1) {
          return {
            success: false,
            error: 'Cannot remove the last admin from the workspace'
          }
        }
      }

      // Remove member
      const { error: deleteError } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)

      if (deleteError) {
        console.error('Error removing member:', deleteError)
        return {
          success: false,
          error: 'Failed to remove member'
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in removeMember:', error)
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }
}
