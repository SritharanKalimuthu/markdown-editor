"use client";
import React, { useEffect, useState } from 'react';
import { 
  Lock, Mail, User, Trash2, Loader2, Settings, Shield, 
  Key, AlertTriangle, CheckCircle2, X, Edit3, Sparkles 
} from 'lucide-react';
import { getUsername, getUseremail } from '@/app/utils/getUsername';
import { updateUsername } from '@/app/api/auth.service';
import toast from 'react-hot-toast';

export default function FuturisticSettingsPage() {
  const [username, setUserName] = useState("");
  const [usermail, setUserMail] = useState("");
  const [activeDialog, setActiveDialog] = useState(null);
  const [formData, setFormData] = useState({
    newUsername: "",
    newEmail: "",
    currentPassword: "",
    deletePassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    try {
      const userName = getUsername();
      if (userName) {
        setUserName(userName);
      }
      const userMail = getUseremail();
      if (userMail) {
        setUserMail(userMail);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      switch (activeDialog) {
        case "username":
          await handleUsernameUpdate();
          break;
        case "email":
          await updateEmail();
          break;
        case "delete":
          await deleteAccount();
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    console.log("Processing username update");
    try {
      const response = await updateUsername({
        email: usermail,
        name: formData.newUsername,
        password: formData.currentPassword
      });

      if (response.status === 200) {
        setUserName(formData.newUsername);
        localStorage.removeItem('user');
        localStorage.setItem('updatedUser', JSON.stringify({
          name: formData.newUsername,
          email: usermail
        }));
        setSuccess('Username updated successfully');
        setActiveDialog(null);
        toast.success('Username updated successfully');
        setFormData({ ...formData, newUsername: "", currentPassword: "" });
      } else if (response.status === 400) {
        console.log("Invalid credentials");
        toast.error("Invalid credentials");
      } else {
        console.log("Internal Server Error");
        toast.error("Internal Server Error, try again");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username");
    }
  };

  const updateEmail = async () => {
    const response = await fetch('/api/settings/email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newEmail: formData.newEmail,
        currentPassword: formData.currentPassword
      })
    });
    if (!response.ok) throw new Error('Failed to update email');
    setUserMail(formData.newEmail);
    setSuccess('Email updated successfully');
    setActiveDialog(null);
    toast.success('Email updated successfully');
    setFormData({ ...formData, newEmail: "", currentPassword: "" });
  };

  const sendPasswordReset = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: usermail })
      });
      if (!response.ok) throw new Error('Failed to send reset link');
      setSuccess('Password reset link sent to your email');
      toast.success('Password reset link sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error('Failed to send password reset link');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    const response = await fetch('/api/settings/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: formData.deletePassword })
    });
    if (!response.ok) throw new Error('Failed to delete account');
    toast.success('Account deleted successfully');
    window.location.href = '/auth/signin';
  };

  const SettingCard = ({ icon: Icon, title, value, onAction, actionText, actionColor = "text-indigo-600", dangerous = false }) => (
    <div className={`group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 border ${dangerous ? 'border-red-200 hover:border-red-300' : 'border-gray-200 hover:border-indigo-200'} hover:shadow-xl transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${dangerous ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-md text-gray-600 truncate max-w-[200px]">{value}</p>
          </div>
        </div>
        <button
          onClick={onAction}
          disabled={loading}
          className={`px-4 pt-2 sm:pt-0 py-2 mx-auto sm:mx-0 rounded-xl text-sm sm:text-md font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2 ${
            dangerous 
              ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
              : `${actionColor} hover:bg-indigo-50 hover:text-indigo-700`
          }`}
        >
          {loading && actionText.includes('Sending') ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Edit3 size={16} />
              {actionText}
            </>
          )}
        </button>
      </div>
    </div>
  );

  const ActionModal = ({ isOpen, onClose, onSubmit, title, children, confirmText, confirmColor, dangerous = false }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${dangerous ? 'bg-red-100' : 'bg-indigo-100'}`}>
                {dangerous ? (
                  <AlertTriangle size={20} className="text-red-600" />
                ) : (
                  <Settings size={20} className="text-indigo-600" />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {children}
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 text-sm sm:text-md py-3 px-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={onSubmit}
                className={`flex-1 py-3 px-4 text-sm sm:text-md text-white ${confirmColor} hover:opacity-90 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    {confirmText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InputField = ({ label, type, name, value, onChange, required = true, placeholder }) => (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="relative min-h-full pt-20 sm:pt-8">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Manage your account preferences and security</p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SettingCard
            icon={User}
            title="Username"
            value={username || "Not set"}
            onAction={() => setActiveDialog("username")}
            actionText="Change"
          />
          
          <SettingCard
            icon={Mail}
            title="Email Address"
            value={usermail || "Not set"}
            onAction={() => setActiveDialog("email")}
            actionText="Update"
          />
          
          <SettingCard
            icon={Lock}
            title="Password"
            value="••••••••••••"
            onAction={sendPasswordReset}
            actionText={loading ? "Sending..." : "Reset"}
            actionColor="text-purple-600"
          />
          
          <SettingCard
            icon={Trash2}
            title="Delete Account"
            value="Permanently remove your account"
            onAction={() => setActiveDialog("delete")}
            actionText="Delete"
            dangerous={true}
          />
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span className="text-emerald-800 font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Username Update Modal */}
        <ActionModal
          isOpen={activeDialog === "username"}
          onClose={() => {
            setActiveDialog(null);
            setFormData({ ...formData, newUsername: "", currentPassword: "" });
          }}
          onSubmit={handleSubmit}
          title="Update Username"
          confirmText="Save Changes"
          confirmColor="bg-indigo-600"
        >
          <InputField
            label="New Username"
            type="text"
            name="newUsername"
            value={formData.newUsername}
            onChange={handleInputChange}
            placeholder="Enter your new username"
          />
          <InputField
            label="Current Password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Confirm with your current password"
          />
        </ActionModal>

        {/* Email Update Modal */}
        <ActionModal
          isOpen={activeDialog === "email"}
          onClose={() => {
            setActiveDialog(null);
            setFormData({ ...formData, newEmail: "", currentPassword: "" });
          }}
          onSubmit={handleSubmit}
          title="Update Email Address"
          confirmText="Update Email"
          confirmColor="bg-indigo-600"
        >
          <InputField
            label="New Email Address"
            type="email"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleInputChange}
            placeholder="Enter your new email address"
          />
          <InputField
            label="Current Password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Confirm with your current password"
          />
        </ActionModal>

        {/* Delete Account Modal */}
        <ActionModal
          isOpen={activeDialog === "delete"}
          onClose={() => {
            setActiveDialog(null);
            setFormData({ ...formData, deletePassword: "" });
          }}
          onSubmit={handleSubmit}
          title="Delete Account"
          confirmText="Delete Forever"
          confirmColor="bg-red-600"
          dangerous={true}
        >
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={20} className="text-red-600" />
              <span className="font-semibold text-red-800">Warning</span>
            </div>
            <p className="text-red-700 text-sm leading-relaxed">
              This action cannot be undone. All your data, including boards, projects, and account information will be permanently deleted.
            </p>
          </div>
          <InputField
            label="Confirm with Password"
            type="password"
            name="deletePassword"
            value={formData.deletePassword}
            onChange={handleInputChange}
            placeholder="Enter your password to confirm deletion"
          />
        </ActionModal>
      </div>
    </div>
  );
}