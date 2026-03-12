import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthState } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading, error, message } = useSelector((state) => state.auth);
  const isSubmitting = loading.login;

  useEffect(() => {
    if (message?.login) {
      toast.success(message.login);
      dispatch(resetAuthState());
      navigate("/");
    }

    if (error?.login) {
      toast.error(error.login);
    }
  }, [message?.login, error?.login, dispatch, navigate]);

  const validateForm = () => {
    const errors = {};

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

  const handleChangeVal = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(login(form));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md p-8 shadow-xl rounded-2xl bg-white space-y-5 border border-slate-100"
      >
        <div className="space-y-1 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-sm text-gray-500">Login to continue bidding in live auctions.</p>
        </div>

        {error?.login && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error.login}
          </div>
        )}

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
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-600 hover:text-blue-700 font-medium" to="/signUp">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
