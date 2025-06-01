"use client";
import React, { useEffect, useState } from 'react';
import { Lock, Mail, User, Trash2, Loader2 } from 'lucide-react';
import { getUsername, getUseremail } from '@/app/utils/getUsername';
import { updateUsername } from '@/app/api/auth.service';
import toast from 'react-hot-toast';

export default function SettingsPage() {
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
  }, [])

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
    setSuccess('Email updated successfully');
    setActiveDialog(null);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
    window.location.href = '/auth/signin';
  };

  return (
    <div className="relative z-[1]">
      <div className="max-w-4xl mx-auto space-y-8 mt-20 p-4 ">
        <h1 className="text-xl sm:text-2xl font-bold text-violet-800">ACCOUNT SETTINGS</h1>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Username card */}
          <div className="bg-white/80 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <User className="sm:w-6 sm:h-6 w-5 h-5 text-violet-600" />
              <h2 className="text-xs sm:text-md md:text-[15px] font-semibold">Username</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-md md:text-[15px] text-gray-600">{username}</span>
              <button
                onClick={() => setActiveDialog("username")}
                className="text-xs sm:text-md md:text-[15px] text-violet-600 hover:text-violet-700 font-medium"
              >
                Change
              </button>
            </div>
          </div>
          
          {/* Email card */}
          <div className="bg-white/80 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Mail className="sm:w-6 sm:h-6 w-5 h-5 text-violet-600" />
              <h2 className="text-xs sm:text-md md:text-[15px] font-semibold">Email</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-md md:text-[15px] text-gray-600">{usermail}</span>
              <button
                onClick={() => setActiveDialog("email")}
                className="text-xs sm:text-md md:text-[15px] text-violet-600 hover:text-violet-700 font-medium"
              >
                Change
              </button>
            </div>
          </div>
          
          {/* Password card */}
          <div className="bg-white/80 p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Lock className="sm:w-6 sm:h-6 w-5 h-5 text-violet-600" />
              <h2 className="text-xs sm:text-md md:text-[15px] font-semibold">Password</h2>
            </div>
            <button
              onClick={sendPasswordReset}
              disabled={loading}
              className="w-full text-xs sm:text-md md:text-[15px] text-violet-600 hover:text-violet-700 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : "Send Reset Link"}
            </button>
          </div>
          
          {/* Delete account card */}
          <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-red-100">
            <div className="flex items-center gap-4 mb-4">
              <Trash2 className="sm:w-6 sm:h-6 w-5 h-5 text-red-600" />
              <h2 className="text-xs sm:text-md md:text-[15px] font-semibold text-red-600">Delete Account</h2>
            </div>
            <button
              onClick={() => setActiveDialog("delete")}
              className="w-full text-xs sm:text-md md:text-[15px] text-red-600 hover:text-red-700 font-medium"
            >
              Delete Account Permanently
            </button>
          </div>
        </div>
        
        {/* Username or Email dialog */}
        {(activeDialog === "username" || activeDialog === "email") && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <form 
              onSubmit={handleSubmit} 
              className="bg-white rounded-xl p-6 max-w-md w-full space-y-6"
            >
              <h3 className="text-md sm:text-lg md:text-xl font-semibold text-violet-800">
                Change {activeDialog === "username" ? "Username" : "Email"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-md md:text-[15px] font-medium text-gray-700 mb-1">
                    New {activeDialog === "username" ? "Username" : "Email"}
                  </label>
                  <input
                    type={activeDialog === "email" ? "email" : "text"}
                    name={activeDialog === "username" ? "newUsername" : "newEmail"}
                    value={activeDialog === "username" ? formData.newUsername : formData.newEmail}
                    onChange={handleInputChange}
                    className="text-xs sm:text-md md:text-[15px] w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-md md:text-[15px] font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="text-xs sm:text-md md:text-[15px] w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setActiveDialog(null)}
                  className="px-4 py-2 text-xs sm:text-md md:text-[15px] text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xs sm:text-md md:text-[15px] px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete account dialog */}
        {activeDialog === "delete" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <form 
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-6 max-w-md w-full space-y-6"
            >
              <h3 className="text-md sm:text-lg md:text-xl font-semibold text-red-600">
                Delete Account Permanently
              </h3>
              <div className="space-y-4">
                <p className="text-xs sm:text-md md:text-[14px] leading-5 text-gray-600">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div>
                  <label className="block text-xs sm:text-md md:text-[14px] font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="deletePassword"
                    value={formData.deletePassword}
                    onChange={handleInputChange}
                    className="text-xs sm:text-md md:text-[15px] w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setActiveDialog(null)}
                  className="text-xs sm:text-md md:text-[15px] px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xs sm:text-md md:text-[15px] px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}