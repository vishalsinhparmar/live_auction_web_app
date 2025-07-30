import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp, resetAuthState } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (message?.signUp) {
      toast.success(message.signUp);
      dispatch(resetAuthState());
      navigate("/login");
    }
    if (error?.signUp) {
      toast.error(error.signUp);
      dispatch(resetAuthState());
    }
  }, [message?.signUp, error?.signUp, dispatch, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(signUp(form));
  };

  const handleChangeVal = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4 relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-60 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="loader rounded-full border-8 border-t-8 border-gray-300 h-20 w-20"></div>
          <p className="mt-4 text-gray-700 font-medium">Creating Account...</p>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className={`w-full max-w-md p-6 shadow-xl rounded-2xl bg-white space-y-4 transition duration-300 ${
          loading ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-3xl text-center font-bold text-gray-800">Sign Up</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChangeVal}
            required
            className="w-full border border-gray-300 p-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChangeVal}
            required
            className="w-full border border-gray-300 p-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChangeVal}
            required
            className="w-full border border-gray-300 p-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
