import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthState } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error, message } = useSelector((state) => state.auth);

  const handleChangeVal = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormsubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  useEffect(() => {
    if (message.login) {
      toast.success(message.login);
      dispatch(resetAuthState());
      navigate("/");
    }
    if (error.login) {
      toast.error(error.login);
      dispatch(resetAuthState());
    }
  }, [message.login, error.login, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-300 flex justify-center items-center px-4">
      <form
        onSubmit={handleFormsubmit}
        className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-white space-y-4"
      >
        <h2 className="text-center text-3xl font-bold text-gray-700">Sign In</h2>

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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;