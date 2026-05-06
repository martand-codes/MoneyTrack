import React, { memo, useCallback, useEffect, useState } from "react";
import { modalStyles, profileStyles } from "../assets/dummyStyles";
import Modal from "react-modal";
import { Eye, EyeOff, Lock, User, X } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import  { toast, ToastContainer } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE;;

Modal.setAppElement('#root');
// Move PasswordInput component outside of ProfilePage to prevent recreation on every render
const PasswordInput = (({ name, label, value, error, showField, onToggle, onChange, disabled }) => (
  <div>
    <label htmlFor={name} className={profileStyles.passwordLabel}>
      {label}
    </label>
    <div className={profileStyles.passwordContainer}>
      <input
        id={name}
        type={showField ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`${profileStyles.inputWithError} ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
        placeholder={`Enter ${label}`}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onToggle}
        className={profileStyles.passwordToggle}
        disabled={disabled}
      >
        {showField ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className={profileStyles.errorText}>{error}</p>
    )}
  </div>
));

PasswordInput.displayName = 'PasswordInput';

const Profile = ({onUpdateProfile, onLogout}) => {
    const navigate = useNavigate();
  const [user, setUser] = useState({ 
    name: '', 
    email: '',
    joinDate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  // const [loading, setLoading] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const getAuthToken = useCallback(() => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  }, []);

  // For Api Handling

  const handleApiRequest = useCallback(async(method, endpoint, data = null) => {
    const token = getAuthToken();
    if(!token) {
        navigate("/login");
        throw new Error("No token");
    }
    try {
        // setLoading(true);
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {Authorization: `Bearer ${token}`},
        };
        if(data) config.data = data;
        const response = await axios(config);
        return response.data;
    } catch(error) {
        console.error(`${method} request error: `, error);
        if(error.response?.status === 401) {
            navigate("/login");
        }
        throw error;
    }  // finally {
        // setLoading(false);
    // }
  },
  [getAuthToken, navigate],
);

// For Fetching

useEffect(() => {
    const fetchUserData = async () => {
        try {
            const data = await handleApiRequest("get", "/api/user/me");
            if(data) {
                const userData = data.user || data;
                setUser(userData);
                setTempUser(userData);
            }
        } catch (error) {
            toast.error("Failed to Load User Data!");
        } finally {
          setLoadingUser(false);
        }
    };
    fetchUserData();
}, [handleApiRequest]);

// For Input Change

const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // Password visibility toggle
  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  // For Saving the Profile

  const handleSaveProfile = async () => {
    try {
      setLoadingProfile(true);
        const data = await handleApiRequest("put", "/user/profile", tempUser);
        if(data) {
            const updatedUser = data.user || data;
            setUser(updatedUser);
            setTempUser(updatedUser);
            setEditMode(false);

            onUpdateProfile?.(updatedUser);
            toast.success("Profile updated Successfully!");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to Update Profile");

    } finally {
      setLoadingProfile(false);
    }
  };

  const handleCancelEdit = useCallback(() => {
    setTempUser(user);
    setEditMode(false);
  }, [user]);

  // For Password Validation

  const validatePassword = useCallback(() => {
    const errors = {};
    if (!passwordData.current) errors.current = 'Current password is required';
    if (!passwordData.new) {
      errors.new = 'New password is required';
    } else if (passwordData.new.length < 8) {
      errors.new = 'Password must be at least 8 characters';
    } else if (passwordData.current === passwordData.new) {
      errors.new = "New Password must be Different!";
    }
    if (!passwordData.confirm) {
      errors.confirm = "Confirm password is required";
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordData]);

  // To Change Password

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if(!validatePassword()) return;

    try {
      setLoadingPassword(true);
        await handleApiRequest("put", "/user/password", {
            currentPassword: passwordData.current,
            newPassword: passwordData.new,
        });

        toast.success("Password Changed SuccessFully!");
        setShowPasswordModal(false);
        setPasswordData({ current: "", new: "", confirm: ""});
        setPasswordErrors({});

        // Reset Password VisiBility

        setShowPassword({ current: false, new: false, confirm: false });
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to Change Password!");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = useCallback(() => {
    onLogout?.();
    navigate("/login");
  }, [onLogout, navigate]);

  const closePasswordModal = useCallback(() => {
    if(!loadingPassword) {
        setShowPasswordModal(false);
        setPasswordData({ current: "", new: "", confirm: ""});
        setPasswordErrors({});
        setShowPassword({current: false, new: false, confirm: false});
    }
  }, [loadingPassword]);
    return (
        <div className={profileStyles.container}>
            
             {/* Toast container */}
            
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className={profileStyles.mainContainer}>
                <div className={profileStyles.header}>
                    <div className={profileStyles.avatar}>
                        <User className="w-12 h-12 text-white" />
                    </div>
                    <h1 className={profileStyles.userName}>
                        {user.name || "Loading..."}
                    </h1>
                    <p className={profileStyles.userEmail}>
                        {user.email || "Loading..."}
                    </p>
                </div>

                <div className={profileStyles.content}>
                    <div className={profileStyles.grid}>
                        <div className={profileStyles.card}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={profileStyles.cardTitle}>
                                    <User className={profileStyles.icon} />
                                    Personal Info:
                                </h2>
                                {!editMode && (
                                    <button 
                                        onClick={() => setEditMode (true)}
                                        className={profileStyles.editButton}
                                        disabled={loadingProfile}
                                    >
                                        {loadingProfile ? "Loading..." : "Edit"}
                                    </button>
                                )}
                            </div>
                            {editMode ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className={profileStyles.label}>Full Name:</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={tempUser.name}
                                            onChange={handleInputChange}
                                            className={profileStyles.input}
                                            disabled={loadingProfile} />
                                    </div>

                                    <div>
                                        <label className={profileStyles.label}>Email:</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={tempUser.email}
                                            onChange={handleInputChange}
                                            className={profileStyles.input}
                                            disabled={loadingProfile} />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            onClick={handleSaveProfile}
                                            className={profileStyles.buttonPrimary}
                                            disabled={loadingProfile}>
                                                {loadingProfile ? "Saving..." : "Save Changes"}
                                        </button>

                                        <button 
                                            onClick={handleCancelEdit}
                                            className={profileStyles.buttonSecondary}
                                            disabled={loadingProfile}>
                                                Cancel
                                            </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className={profileStyles.label}>Full Name:</p>
                                        <p className="font-medium text-gray-800">{user.name}</p>
                                    </div>

                                    <div>
                                        <p className={profileStyles.label}>Email:</p>
                                        <p className="font-medium text-gray-800">{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={profileStyles.card}>
                            <h2 className={profileStyles.cardTitle}>
                                <Lock className={profileStyles.icon} />
                                Account Security:
                            </h2>

                            <div className="space-y-4">
                                <div className={profileStyles.securityItem}>
                                    <div>
                                        <p className={profileStyles.securityText}>Password</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className={profileStyles.changeButton}
                                        disabled={loadingPassword}>
                                            Change:
                                        </button>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className={`${profileStyles.buttonPrimary}
                                mt-6 w-full hover:opacity-90 transition-opacity`}
                                disabled={loadingProfile || loadingPassword}
                            >
                                {loadingPassword ? "Processing.." : "Logout"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className={modalStyles.modalContainer}
        overlayClassName={modalStyles.overlay}
        // Prevent unnecessary re-renders
        shouldCloseOnOverlayClick={!loadingPassword}
        shouldCloseOnEsc={!loadingPassword}
        shouldFocusAfterRender={false}
        shouldReturnFocusAfterClose={false}
      >
        <div className={profileStyles.modalContent}>
          <div className={profileStyles.modalHeader}>
            <h3 className={"text-lg font-semibold text-gray-800"}>Change Password:</h3>
            <button 
              onClick={closePasswordModal}
              className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
              disabled={loadingPassword}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4 lg:-mx-20">
            <PasswordInput
              name="current"
              label="Current Password"
              value={passwordData.current}
              error={passwordErrors.current}
              showField={showPassword.current}
              onToggle={() => togglePasswordVisibility('current')}
              onChange={handlePasswordChange}
              disabled={loadingPassword}
            />
            
            <PasswordInput
              name="new"
              label="New Password"
              value={passwordData.new}
              error={passwordErrors.new}
              showField={showPassword.new}
              onToggle={() => togglePasswordVisibility('new')}
              onChange={handlePasswordChange}
              disabled={loadingPassword}
            />
            
            <PasswordInput
              name="confirm"
              label="Confirm New Password"
              value={passwordData.confirm}
              error={passwordErrors.confirm}
              showField={showPassword.confirm}
              onToggle={() => togglePasswordVisibility('confirm')}
              onChange={handlePasswordChange}
              disabled={loadingPassword}
            />
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className={profileStyles.buttonPrimary}
                disabled={loadingPassword}
              >
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={closePasswordModal}
                className={profileStyles.buttonSecondary}
                disabled={loadingPassword}
              >
                Cancel:
              </button>
            </div>
          </form>
        </div>
      </Modal>

        </div>
    )
}

export default Profile;