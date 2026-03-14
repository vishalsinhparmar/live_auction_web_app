import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetAuthState, signUp } from "../../features/auth/authSlice";

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
  }, [dispatch, error?.signUp, message?.signUp, navigate]);

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

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    dispatch(signUp(form));
  };

  const handleChangeVal = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <section className="auth-shell">
      <div className="auth-showcase">
        <span className="eyebrow bg-white/10 text-white/70">New bidder onboarding</span>
        <h1 className="headline mt-6 max-w-lg text-5xl font-bold leading-[0.95]">
          Join the marketplace with a sharper first-run experience.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
          Create your account to start bidding live, launch inventory as a seller, and keep every active auction under one roof.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Fast setup</p>
            <p className="mt-3 text-lg font-bold">Simple account creation with immediate access to the bidding floor.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Single workspace</p>
            <p className="mt-3 text-lg font-bold">Seller listings, live auctions, and winning lots all in one interface.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="auth-card section-card space-y-5">
        <div>
          <span className="eyebrow">Create account</span>
          <h2 className="headline mt-4 text-4xl font-bold text-stone-950">Get started</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">Set up your profile so you can place bids and publish lots without switching tools.</p>
        </div>

        {error?.signUp && (
          <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.signUp}
          </div>
        )}

        <div>
          <label className="field-label">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChangeVal}
            required
            className="field-control"
            placeholder="Display name"
          />
          {fieldErrors.username && <p className="field-error">{fieldErrors.username}</p>}
        </div>

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
            placeholder="Minimum 6 characters"
          />
          {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
        </div>

        <button type="submit" className="primary-button w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-stone-600">
          Already a member?{" "}
          <Link className="font-bold text-[var(--brand)]" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignUp;
