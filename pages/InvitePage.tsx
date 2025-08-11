import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, Users, Crown, Shield, Eye } from 'lucide-react'
import { InvitationService } from '../src/lib/invitation-service'
import { supabase } from '../src/lib/supabase'
import toast from 'react-hot-toast'

interface InvitationDetails {
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

const roleIcons = {
  admin: Crown,
  member: Shield,
  viewer: Eye
}

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  member: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800'
}

export const InvitePage: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      loadInvitation()
      checkCurrentUser()
    }
  }, [token])

  const loadInvitation = async () => {
    if (!token) return

    try {
      const result = await InvitationService.getInvitationDetails(token)
      if (result.success && result.invitation) {
        setInvitation(result.invitation)
      } else {
        setError(result.error || 'Invitation not found')
      }
    } catch (error) {
      console.error('Error loading invitation:', error)
      setError('Failed to load invitation details')
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error checking current user:', error)
    }
  }

  const handleAcceptInvitation = async () => {
    if (!token || !currentUser) return

    setAccepting(true)
    try {
      const result = await InvitationService.acceptInvitation(token, currentUser.id)
      if (result.success && result.workspaceId) {
        toast.success('Welcome to the workspace!')
        // Redirect to the workspace
        navigate(`/workspace/${result.workspaceId}`)
      } else {
        toast.error(result.error || 'Failed to accept invitation')
      }
    } catch (error) {
      console.error('Error accepting invitation:', error)
      toast.error('Failed to accept invitation')
    } finally {
      setAccepting(false)
    }
  }

  const handleSignIn = () => {
    // Redirect to sign in page, then back to this invitation
    navigate('/login', { state: { returnTo: `/invite/${token}` } })
  }

  const handleSignUp = () => {
    // Redirect to sign up page, then back to this invitation
    navigate('/signup', { state: { returnTo: `/invite/${token}` } })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-gray-600 mb-6">This invitation link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const RoleIcon = roleIcons[invitation.role]
  const roleColor = roleColors[invitation.role]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center text-white">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Workspace Invitation</h1>
            <p className="text-blue-100">
              You've been invited to join a team workspace
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Workspace Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {invitation.workspace_name}
              </h2>
              <p className="text-gray-600">
                <strong>{invitation.inviter_name}</strong> has invited you to join this workspace
              </p>
            </div>

            {/* Role Badge */}
            <div className="text-center mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleColor}`}>
                <RoleIcon className="w-4 h-4 mr-2" />
                {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
              </span>
            </div>

            {/* Invitation Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Invited by:</span>
                  <span className="font-medium">{invitation.inviter_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Invited email:</span>
                  <span className="font-medium">{invitation.invitee_email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            {!currentUser ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  You need to be signed in to accept this invitation
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleSignIn}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                  >
                    Sign In to Accept
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            ) : currentUser.email !== invitation.invitee_email ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  This invitation was sent to <strong>{invitation.invitee_email}</strong>, 
                  but you're signed in as <strong>{currentUser.email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Please sign in with the correct email address to accept this invitation.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleAcceptInvitation}
                  disabled={accepting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {accepting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept Invitation
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  You'll be redirected to the workspace after accepting
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                SyncFlow helps teams collaborate and manage projects efficiently.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                If you didn't expect this invitation, you can safely ignore this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
