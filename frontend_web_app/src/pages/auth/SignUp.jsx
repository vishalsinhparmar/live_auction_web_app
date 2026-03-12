import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp, resetAuthState } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading, error, message } = useSelector((state) => state.auth);
  const isSubmitting = loading.signUp;

  useEffect(() => {
    if (message?.signUp) {
      toast.success(message.signUp);
      dispatch(resetAuthState());
      navigate("/login");
    }

    if (error?.signUp) {
      toast.error(error.signUp);
    }
  }, [message?.signUp, error?.signUp, dispatch, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!form.username.trim()) {
      errors.username = "Username is required.";
    } else if (form.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required.";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(signUp(form));
  };

  const handleChangeVal = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md p-8 shadow-xl rounded-2xl bg-white space-y-5 border border-slate-100"
      >
        <div className="space-y-1 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create account</h2>
          <p className="text-sm text-gray-500">Join the platform to place and manage your bids.</p>
        </div>

        {error?.signUp && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error.signUp}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChangeVal}
            required
            className={`w-full border p-2.5 mt-1 rounded focus:outline-none focus:ring-2 ${
              fieldErrors.username
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter username"
          />
          {fieldErrors.username && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChangeVal}
            required
            className={`w-full border p-2.5 mt-1 rounded focus:outline-none focus:ring-2 ${
              fieldErrors.email
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter email"
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChangeVal}
            required
            className={`w-full border p-2.5 mt-1 rounded focus:outline-none focus:ring-2 ${
              fieldErrors.password
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter password"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold disabled:cursor-not-allowed disabled:bg-blue-400 inline-flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          )}
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:text-blue-700 font-medium" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
