import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileAPI } from '../services/Api.js';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    profilePictureUrl: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phoneNumber: response.data.phoneNumber || '',
          profilePictureUrl: response.data.profilePictureUrl || '',
          email: response.data.email || ''
        });
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If unauthorized, redirect to home
      if (error.response?.status === 401 || !localStorage.getItem('token')) {
        toast.error('Please login to view your profile');
        navigate('/');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Include all required fields for the API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        profilePictureUrl: formData.profilePictureUrl || null // Send null if empty
      };
      
      const response = await profileAPI.updateProfile(updateData);
      
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success(response.message || 'Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phoneNumber: profile.phoneNumber || '',
      profilePictureUrl: profile.profilePictureUrl || '',
      email: profile.email || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">Unable to load your profile information</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-slate-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/30 overflow-hidden">
          {/* Profile Header with Cover */}
          <div className="relative h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-xl overflow-hidden">
                  {profile.profilePictureUrl ? (
                    <img 
                      src={profile.profilePictureUrl} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                      }}
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <button 
                  onClick={() => isEditing && document.querySelector('input[name="profilePictureUrl"]')?.focus()}
                  className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-700 text-white p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors shadow-lg"
                  title={isEditing ? "Edit profile picture URL below" : "Edit profile to change picture"}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            {/* Name and Actions */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                    {profile.role}
                  </span>
                  {profile.isEmailVerified && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                  <User className="w-4 h-4" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{profile.firstName || 'N/A'}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                  <User className="w-4 h-4" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{profile.lastName || 'N/A'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <p className="text-gray-900 dark:text-slate-100 font-medium">{profile.email}</p>
                {!profile.isEmailVerified && (
                  <span className="text-xs text-orange-600 dark:text-orange-400 mt-1 inline-block">Not verified</span>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100 font-medium">{profile.phoneNumber || 'N/A'}</p>
                )}
              </div>

              {/* Profile Picture URL */}
              {isEditing && (
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                    <Camera className="w-4 h-4" />
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    name="profilePictureUrl"
                    value={formData.profilePictureUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/your-image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Enter a URL to your profile picture</p>
                </div>
              )}

              {/* Account Created */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <p className="text-gray-900 dark:text-slate-100 font-medium">{formatDate(profile.createdAt)}</p>
              </div>

              {/* Last Login */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Last Login
                </label>
                <p className="text-gray-900 dark:text-slate-100 font-medium">{formatDate(profile.lastLoginAt)}</p>
              </div>
            </div>

            {/* Security Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">Email Verification</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Verify your email address</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.isEmailVerified 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}>
                    {profile.isEmailVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">Two-Factor Auth</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">Extra security layer</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.isTwoFactorEnabled 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                  }`}>
                    {profile.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            {profile.addresses && profile.addresses.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Saved Addresses
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {profile.addresses.map((address, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-gray-900 dark:text-slate-100">{address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/order-history')}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">Order History</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">View your past orders</p>
          </button>
          
          <button
            onClick={() => navigate('/wishlist')}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">Wishlist</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">Manage your saved items</p>
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              toast.success('Logged out successfully');
              navigate('/');
            }}
            className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg shadow hover:shadow-md transition-shadow text-left border border-red-200 dark:border-red-800"
          >
            <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1">Logout</h4>
            <p className="text-sm text-red-500 dark:text-red-400">Sign out of your account</p>
          </button>
        </div>
      </div>
    </div>
  );
}
