import { useState } from "react";
import toast from 'react-hot-toast';
import { authAPI } from '../services/Api';

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate terms acceptance
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      toast.error("Please accept the terms and privacy policy");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authAPI.register(formData);

      if (result.success) {
        toast.success(result.message || "Registration successful!");
        onSwitchToLogin();
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/60" ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md modal-pop border border-black dark:border-gray-700 hover:shadow-xl z-10">
        <h3 className="text-2xl font-semibold mb-4 text-center text-black dark:text-white">Register</h3>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="userName"
            placeholder="Username..."
            value={formData.userName}
            onChange={handleChange}
            required
            className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-3.5"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name..."
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-3.5"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name..."
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-3.5"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Your Email..."
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-3.5"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number..."
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-3.5"
          />
          <input
            type="password"
            name="password"
            placeholder="Choose Password..."
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-3.5"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password..."
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-3.5"
          />
          <div className="space-y-2">
            <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 accent-[#007580]"
              />
              <span>I accept the terms and conditions</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="acceptPrivacy"
                checked={formData.acceptPrivacy}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 accent-[#007580]"
              />
              <span>I accept the privacy policy</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] bg-[#007580] dark:bg-[#0f9ca4] rounded-lg text-white font-semibold disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            className="w-full h-[50px] border border-[#ccc] dark:border-gray-600 rounded-lg text-black dark:text-white font-medium flex justify-center items-center gap-2 hover:shadow-md transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>
        </form>

        <p
          onClick={onSwitchToLogin}
          className="text-center mt-4 text-[#007580] dark:text-[#34d4db] cursor-pointer"
        >
          Already have an account? Login
        </p>

        <p
          onClick={onClose}
          className="text-center mt-2 text-gray-500 dark:text-gray-400 underline cursor-pointer"
        >
          Close
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;

