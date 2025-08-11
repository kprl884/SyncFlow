import React, { useState, useEffect } from 'react'
import { X, UserPlus, Users, Crown, Shield, Eye, Trash2, Edit3 } from 'lucide-react'
import { InvitationService } from '../../src/lib/invitation-service'
import { EmailService } from '../../src/lib/email-service'
import toast from 'react-hot-toast'

interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: 'admin' | 'member' | 'viewer'
  created_at: string
  user_email: string
  user_name?: string
}

interface ManageMembersModalProps {
  isOpen: boolean
  onClose: () => void
  workspaceId: string
  workspaceName: string
  currentUserId: string
}

const roleOptions = [
  { value: 'admin', label: 'Admin', icon: Crown, color: 'bg-red-100 text-red-800' },
  { value: 'member', label: 'Member', icon: Shield, color: 'bg-blue-100 text-blue-800' },
  { value: 'viewer', label: 'Viewer', icon: Eye, color: 'bg-gray-100 text-gray-800' }
]

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  workspaceName,
  currentUserId
}) => {
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member')
  const [inviting, setInviting] = useState(false)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<'admin' | 'member' | 'viewer'>('member')

  useEffect(() => {
    if (isOpen) {
      loadMembers()
    }
  }, [isOpen, workspaceId])

  const loadMembers = async () => {
    setLoading(true)
    try {
      const result = await InvitationService.getWorkspaceMembers(workspaceId)
      if (result.success && result.members) {
        setMembers(result.members)
      } else {
        toast.error(result.error || 'Failed to load members')
      }
    } catch (error) {
      console.error('Error loading members:', error)
      toast.error('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setInviting(true)
    try {
      const result = await InvitationService.inviteUser({
        workspaceId,
        email: inviteEmail.trim(),
        role: inviteRole,
        currentUserId
      })

      if (result.success) {
        toast.success('Invitation sent successfully!')
        setInviteEmail('')
        setInviteRole('member')
        
        // Send email notification
        await EmailService.sendInvitationEmail({
          to: inviteEmail.trim(),
          workspaceName,
          inviterName: 'You', // TODO: Get actual inviter name
          invitationLink: `${window.location.origin}/invite/${Date.now()}`, // TODO: Get actual token
          role: inviteRole
        })
      } else {
        toast.error(result.error || 'Failed to send invitation')
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      toast.error('Failed to send invitation')
    } finally {
      setInviting(false)
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member' | 'viewer') => {
    try {
      const result = await InvitationService.updateMemberRole(
        workspaceId,
        memberId,
        newRole,
        currentUserId
      )

      if (result.success) {
        toast.success('Member role updated successfully!')
        setEditingMember(null)
        loadMembers() // Reload to get updated data
      } else {
        toast.error(result.error || 'Failed to update member role')
      }
    } catch (error) {
      console.error('Error updating member role:', error)
      toast.error('Failed to update member role')
    }
  }

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from this workspace?`)) {
      return
    }

    try {
      const result = await InvitationService.removeMember(
        workspaceId,
        memberId,
        currentUserId
      )

      if (result.success) {
        toast.success('Member removed successfully!')
        loadMembers() // Reload to get updated data
      } else {
        toast.error(result.error || 'Failed to remove member')
      }
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Failed to remove member')
    }
  }

  const getRoleIcon = (role: string) => {
    const roleOption = roleOptions.find(option => option.value === role)
    if (roleOption) {
      const Icon = roleOption.icon
      return <Icon className="w-4 h-4" />
    }
    return null
  }

  const getRoleColor = (role: string) => {
    const roleOption = roleOptions.find(option => option.value === role)
    return roleOption?.color || 'bg-gray-100 text-gray-800'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Manage Workspace Members
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Members List */}
          <div className="flex-1 p-6 border-r">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Current Members ({members.length})
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No members yet</p>
                <p className="text-sm">Invite team members to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {member.user_name?.[0] || member.user_email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.user_name || member.user_email}
                        </p>
                        <p className="text-sm text-gray-500">{member.user_email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Role Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </span>

                      {/* Action Buttons */}
                      {member.user_id !== currentUserId && (
                        <>
                          <button
                            onClick={() => {
                              setEditingMember(member.id)
                              setEditingRole(member.role)
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit role"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id, member.user_email)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invite Form */}
          <div className="w-full lg:w-80 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Invite New Member
            </h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member' | 'viewer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={inviting || !inviteEmail.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {inviting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </form>

            {/* Role Descriptions */}
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Role Permissions</h4>
              {roleOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2">
                  <div className={`p-1 rounded ${option.color}`}>
                    {React.createElement(option.icon, { className: 'w-3 h-3' })}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500">
                      {option.value === 'admin' && 'Full access to workspace settings and member management'}
                      {option.value === 'member' && 'Can create and edit tasks, participate in discussions'}
                      {option.value === 'viewer' && 'Read-only access to workspace content'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Member Role</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Role
                </label>
                <select
                  value={editingRole}
                  onChange={(e) => setEditingRole(e.target.value as 'admin' | 'member' | 'viewer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleUpdateRole(editingMember, editingRole)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Role
                </button>
                <button
                  onClick={() => setEditingMember(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
