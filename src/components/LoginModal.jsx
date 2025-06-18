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
    <div className="z-50 flex items-center justify-center fixed inset-0">
      <div  className="bg-white rounded-lg p-8 w-full max-w-md modal-pop border border-black hover:shadow-xl">
        <h3 className="text-2xl font-semibold mb-4 text-center">Login</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Your Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[50px] bg-[#f0f2f3] rounded-lg pl-3.5"
          />
          <input
            type="password"
            placeholder="Your Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[50px] bg-[#f0f2f3] rounded-lg pl-3.5"
          />
          <button
            type="submit"
            className="w-full h-[50px] bg-[#007580] rounded-lg text-white font-semibold flex justify-center items-center gap-2"
          >
            Login <MoveRight />
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
  Continue with Google
</button>

        </form>

        <p
          onClick={onSwitchToRegister}
          className="text-center mt-4 text-[#007580] cursor-pointer"
        >
          Don’t have an account? Register
        </p>
        <p
  onClick={onSwitchToForgot}
  className="text-center mt-2 text-[#007580] cursor-pointer"
>
  Forgot Password?
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

export default LoginModal;
