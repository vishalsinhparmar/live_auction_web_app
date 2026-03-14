import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, resetAuthState } from "../../features/auth/authSlice";

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
  }, [dispatch, error?.login, message?.login, navigate]);

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

  const handleChangeVal = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    dispatch(login(form));
  };

  return (
    <section className="auth-shell">
      <div className="auth-showcase">
        <span className="eyebrow bg-white/10 text-white/70">Bid with clarity</span>
        <h1 className="headline mt-6 max-w-lg text-5xl font-bold leading-[0.95]">
          Step into a cleaner, production-ready auction room.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
          Monitor active lots, react to socket-driven bid updates, and manage your inventory in a single refined experience.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Real-time flow</p>
            <p className="mt-3 text-lg font-bold">Instant bid visibility and active countdowns.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Seller control</p>
            <p className="mt-3 text-lg font-bold">Create lots, activate inventory, and track wins without friction.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="auth-card section-card space-y-5">
        <div>
          <span className="eyebrow">Account access</span>
          <h2 className="headline mt-4 text-4xl font-bold text-stone-950">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">Sign in to continue bidding, settle wins, and manage your seller listings.</p>
        </div>

        {error?.login && (
          <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.login}
          </div>
        )}

        <div>
          <label className="field-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChangeVal}
            required
            className="field-control"
            placeholder="you@example.com"
          />
          {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
        </div>

        <div>
          <label className="field-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChangeVal}
            required
            className="field-control"
            placeholder="Enter password"
          />
          {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
        </div>

        <button type="submit" className="primary-button w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-stone-600">
          Need an account?{" "}
          <Link className="font-bold text-[var(--brand)]" to="/signUp">
            Create one
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignIn;
