import { useState } from "react";

function Signup({ setActivePage }) {
  const [mode, setMode] = useState("signup");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const endpoint = isSignup
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = isSignup
        ? {
            name: form.name,
            phone: form.phone,
            email: form.email,
            password: form.password,
          }
        : {
            email: form.email,
            password: form.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Something went wrong."
        );
      }

      if (isSignup) {
        setMessage(
          "Account created successfully! Welcome to Rentora."
        );
      } else {
        setMessage(
          "Welcome back! You're successfully signed in."
        );
      }

      if (data.customer) {
        localStorage.setItem(
          "rentoraCustomer",
          JSON.stringify(data.customer)
        );
      }

      setTimeout(() => {
        setActivePage("assistant");
      }, 1000);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to connect to Rentora."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage("");
    setError("");

    setForm({
      name: "",
      phone: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="get-started-page">
      <style>{`
        .get-started-page {
          min-height: calc(100vh - 76px);
          background:
            radial-gradient(
              circle at 8% 5%,
              rgba(124, 58, 237, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 92% 90%,
              rgba(139, 92, 246, 0.09),
              transparent 30%
            ),
            #fbfaff;
          color: #171327;
          padding: 45px 20px 65px;
        }

        .get-started-container {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 440px;
          gap: 60px;
          align-items: center;
          min-height: 650px;
        }

        .welcome-section {
          padding: 20px 0;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f0eaff;
          border: 1px solid #dfd1ff;
          color: #6d28d9;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 20px;
        }

        .welcome-title {
          margin: 0;
          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.03;
          letter-spacing: -2.5px;
          color: #241536;
        }

        .welcome-title span {
          color: #6d28d9;
        }

        .welcome-text {
          max-width: 560px;
          margin: 20px 0 0;
          color: #71677e;
          font-size: 16px;
          line-height: 1.75;
        }

        .benefits {
          margin-top: 30px;
          display: grid;
          gap: 13px;
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: 13px;
          color: #51475f;
          font-size: 14px;
          font-weight: 700;
        }

        .benefit-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #f0eaff;
          color: #6d28d9;
          border: 1px solid #e1d5f5;
        }

        .form-card {
          background: white;
          border: 1px solid #e6def1;
          border-radius: 28px;
          padding: 31px;
          box-shadow:
            0 22px 55px rgba(58, 35, 96, 0.10);
        }

        .form-heading {
          margin-bottom: 22px;
        }

        .form-heading h2 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.6px;
        }

        .form-heading p {
          margin: 7px 0 0;
          color: #81778d;
          font-size: 13px;
          line-height: 1.5;
        }

        .mode-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f5f1fa;
          padding: 4px;
          border-radius: 13px;
          margin-bottom: 23px;
        }

        .mode-button {
          border: none;
          background: transparent;
          color: #756b82;
          padding: 11px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          transition: 0.2s;
        }

        .mode-button.active {
          background: white;
          color: #6d28d9;
          box-shadow:
            0 4px 12px rgba(58,35,96,0.08);
        }

        .form {
          display: grid;
          gap: 14px;
        }

        .form-field {
          display: grid;
          gap: 6px;
        }

        .form-field label {
          color: #554b63;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.3px;
        }

        .form-field input {
          width: 100%;
          height: 47px;
          box-sizing: border-box;
          border: 1px solid #ddd4e9;
          border-radius: 12px;
          padding: 0 13px;
          background: #fff;
          color: #20172c;
          outline: none;
          font-size: 13px;
          transition: 0.2s;
        }

        .form-field input:focus {
          border-color: #7c3aed;
          box-shadow:
            0 0 0 4px rgba(124,58,237,0.09);
        }

        .form-field input::placeholder {
          color: #aaa2b2;
        }

        .submit-button {
          width: 100%;
          height: 49px;
          margin-top: 5px;
          border: none;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            #5b21b6,
            #6d28d9,
            #8b5cf6
          );
          color: white;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          box-shadow:
            0 10px 22px rgba(109,40,217,0.22);
          transition: 0.2s;
        }

        .submit-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 13px 27px rgba(109,40,217,0.28);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .status {
          border-radius: 11px;
          padding: 11px 13px;
          font-size: 12px;
          line-height: 1.45;
        }

        .success-message {
          background: #f0fdf4;
          border: 1px solid #ccebd5;
          color: #166534;
        }

        .error-message {
          background: #fff5f5;
          border: 1px solid #f0cecc;
          color: #a3261d;
        }

        .secure-note {
          margin-top: 16px;
          text-align: center;
          color: #958c9e;
          font-size: 10px;
          line-height: 1.5;
        }

        .secure-note strong {
          color: #6d28d9;
        }

        .bottom-link {
          margin-top: 20px;
          text-align: center;
          color: #82798d;
          font-size: 12px;
        }

        .bottom-link button {
          border: none;
          background: none;
          padding: 0;
          margin-left: 4px;
          color: #6d28d9;
          font-weight: 800;
          cursor: pointer;
        }

        @media (max-width: 850px) {
          .get-started-container {
            grid-template-columns: 1fr;
            gap: 25px;
            max-width: 560px;
          }

          .welcome-section {
            text-align: center;
          }

          .welcome-text {
            margin-left: auto;
            margin-right: auto;
          }

          .benefits {
            text-align: left;
            max-width: 390px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 500px) {
          .get-started-page {
            padding: 25px 13px 45px;
          }

          .welcome-title {
            font-size: 39px;
          }

          .form-card {
            padding: 23px 18px;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="get-started-container">

        {/* LEFT */}
        <section className="welcome-section">

          <div className="welcome-badge">
            ✦ WELCOME TO RENTORA
          </div>

          <h1 className="welcome-title">
            Your next ride
            <br />
            starts <span>here.</span>
          </h1>

          <p className="welcome-text">
            Create your Rentora account and get
            access to a smarter way to discover,
            compare and book rental vehicles.
          </p>

          <div className="benefits">

            <div className="benefit">
              <div className="benefit-icon">
                ✨
              </div>
              AI-powered rental assistance
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                🚗
              </div>
              Cars, bikes, scooters and cycles
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                📍
              </div>
              Rentals across multiple cities
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                🔒
              </div>
              Simple and secure account access
            </div>

          </div>
        </section>

        {/* FORM */}
        <section className="form-card">

          <div className="form-heading">
            <h2>
              {isSignup
                ? "Create your account"
                : "Welcome back"}
            </h2>

            <p>
              {isSignup
                ? "Join Rentora and start exploring rentals."
                : "Sign in to continue with Rentora."}
            </p>
          </div>

          <div className="mode-toggle">
            <button
              type="button"
              className={
                isSignup
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() =>
                switchMode("signup")
              }
            >
              Create Account
            </button>

            <button
              type="button"
              className={
                !isSignup
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() =>
                switchMode("login")
              }
            >
              Sign In
            </button>
          </div>

          {message && (
            <div className="status success-message">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="status error-message">
              {error}
            </div>
          )}

          <form
            className="form"
            onSubmit={handleSubmit}
            style={{
              marginTop:
                message || error ? "13px" : "0",
            }}
          >

            {isSignup && (
              <>
                <div className="form-field">
                  <label>FULL NAME</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>PHONE NUMBER</label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-field">
              <label>EMAIL ADDRESS</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-field">
              <label>PASSWORD</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Create Account →"
                : "Sign In →"}
            </button>

          </form>

          <div className="secure-note">
            🔒 Your account information is handled
            securely by <strong>Rentora</strong>.
          </div>

          <div className="bottom-link">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() =>
                switchMode(
                  isSignup ? "login" : "signup"
                )
              }
            >
              {isSignup
                ? "Sign in"
                : "Create one"}
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}

export default Signup;