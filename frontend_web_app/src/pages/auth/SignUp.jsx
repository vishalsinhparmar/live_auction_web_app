import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { resetAuthState } from "../../features/auth/authSlice"; 
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { loading, error, message } = useSelector((state) => state.auth);

  // Handle success and error with toast
  useEffect(() => {
    if (message?.signUp) {
      toast.success(message.signUp);
      dispatch(resetAuthState());
      navigate("/login")
    }
    if (error?.signUp) {
      toast.error(error.signUp);
      dispatch(resetAuthState());
    }
  }, [message?.signUp, error?.signUp, dispatch]);

  const handleFormsubmit = (e) => {
    e.preventDefault();
    dispatch(signUp(form));
  };

  const handleChangeVal = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-300 flex justify-center items-center px-4">
      <form
        onSubmit={handleFormsubmit}
        className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-white space-y-4"
      >
        <h2 className="text-center text-3xl font-bold text-gray-700">Sign Up</h2>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChangeVal}
            required
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChangeVal}
            required
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChangeVal}
            required
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 mt-2 rounded hover:bg-slate-700 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;