import { MoveRight } from "lucide-react";
import { useState } from "react";
import toast from 'react-hot-toast';
const LoginModal =  ({ setIsLoggedIn, onClose, onSwitchToRegister, onSwitchToForgot })=> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const handleLogin = (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("registeredUser"));
  if (user && user.email === email && user.password === password) {
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true); // This will trigger useEffect in Listings.jsx
    toast.success("user logged in");
    onClose();
  } else {
    alert("Invalid credentials");
  }
};

return (
  <div className="z-50 fixed inset-0 flex items-center justify-center">
    {/* Blurred Background */}
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

    {/* Modal Content */}
    <div className="relative bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md modal-pop border border-black dark:border-gray-700 hover:shadow-xl z-10">
      <h3 className="text-2xl font-semibold mb-4 text-center text-black dark:text-white">Login</h3>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Your Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 dark:text-white rounded-lg pl-3.5"
        />
        <input
          type="password"
          placeholder="Your Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[50px] bg-[#f0f2f3] dark:bg-gray-800 dark:text-white rounded-lg pl-3.5"
        />
        <button
          type="submit"
          className="w-full h-[50px] bg-[#007580] rounded-lg text-white font-semibold flex justify-center items-center gap-2"
        >
          Login <MoveRight />
        </button>

        <button
          type="button"
          className="w-full h-[50px] border border-[#ccc] dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white font-medium flex justify-center items-center gap-2 hover:shadow-md transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </form>

      <p
        onClick={onSwitchToRegister}
        className="text-center mt-4 text-[#007580] dark:text-[#38b2ac] cursor-pointer"
      >
        Don’t have an account? Register
      </p>
      <p
        onClick={onSwitchToForgot}
        className="text-center mt-2 text-[#007580] dark:text-[#38b2ac] cursor-pointer"
      >
        Forgot Password?
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

export default LoginModal;
