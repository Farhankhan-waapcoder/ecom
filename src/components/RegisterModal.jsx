import { useState } from "react";
import toast from 'react-hot-toast';
const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const user = { email, password };
    localStorage.setItem("registeredUser", JSON.stringify(user));
    toast.success("User Registered");
    onSwitchToLogin(); // Go back to login after registering
  };

  return (
  <div className="z-50 fixed inset-0 flex items-center justify-center">
    {/* Blurred Background */}
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" ></div>

    {/* Modal Content */}
    <div className="relative bg-white rounded-lg p-8 w-full max-w-md modal-pop border border-black hover:shadow-xl z-10">
      <h3 className="text-2xl font-semibold mb-4 text-center">Register</h3>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Your Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[50px] bg-[#f0f2f3] rounded-lg pl-3.5"
        />
        <input
          type="password"
          placeholder="Choose Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[50px] bg-[#f0f2f3] rounded-lg pl-3.5"
        />
        <button
          type="submit"
          className="w-full h-[50px] bg-[#007580] rounded-lg text-white font-semibold"
        >
          Register
        </button>
        <button
          type="button"
          className="w-full h-[50px] border border-[#ccc] rounded-lg text-black font-medium flex justify-center items-center gap-2 hover:shadow-md transition"
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
        className="text-center mt-4 text-[#007580] cursor-pointer"
      >
        Already have an account? Login
      </p>

      <p
        onClick={onClose}
        className="text-center mt-2 text-gray-500 underline cursor-pointer"
      >
        Close
      </p>
    </div>
  </div>
);

};

export default RegisterModal;

