import React, { useState } from 'react';
import { User, UserRole } from '../../types';

interface UserProfileSetupModalProps {
  isOpen: boolean;
  onComplete: (userData: { name: string; role: UserRole }) => void;
  currentUser?: User;
}

const UserProfileSetupModal: React.FC<UserProfileSetupModalProps> = ({ 
  isOpen, 
  onComplete, 
  currentUser 
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [role, setRole] = useState<UserRole>(currentUser?.role || 'Member');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete({ name: name.trim(), role });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center p-6 border-b">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SyncFlow!</h2>
          <p className="text-gray-600">Let's set up your profile to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Member">Member</option>
              <option value="Manager">Manager</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              You can change this later in your profile settings
            </p>
          </div>

          {/* Role Descriptions */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Role Permissions:</h4>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <span className="font-medium text-gray-900">Member:</span>
                <span className="text-sm text-gray-600 ml-2">
                  View and update tasks, participate in sprints
                </span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <span className="font-medium text-gray-900">Manager:</span>
                <span className="text-sm text-gray-600 ml-2">
                  All Member permissions plus: create/edit tasks, manage sprints
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Setting up profile...
              </div>
            ) : (
              'Complete Setup'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSetupModal;
