import React from "react";

function LandingPage({ setActivePage }) {
  return (
    <div className="rentora-home">
      <style>{`
        .rentora-home {
          min-height: calc(100vh - 76px);
          background:
            radial-gradient(
              circle at 8% 5%,
              rgba(124, 58, 237, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 92% 85%,
              rgba(139, 92, 246, 0.08),
              transparent 30%
            ),
            #fbfaff;
          color: #171327;
          overflow: hidden;
        }

        .home-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 70px 24px 80px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 65px;
          min-height: 590px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #f0eaff;
          border: 1px solid #dfd1ff;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 20px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(44px, 6vw, 72px);
          line-height: 1;
          letter-spacing: -3px;
          color: #21152e;
        }

        .hero-title span {
          color: #6d28d9;
        }

        .hero-description {
          max-width: 600px;
          margin: 24px 0 0;
          color: #71677e;
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .primary-button {
          border: none;
          background: linear-gradient(
            135deg,
            #5b21b6,
            #6d28d9,
            #8b5cf6
          );
          color: white;
          padding: 14px 22px;
          border-radius: 13px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          box-shadow:
            0 12px 25px rgba(109,40,217,0.22);
          transition: 0.2s;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 16px 30px rgba(109,40,217,0.28);
        }

        .secondary-button {
          border: 1px solid #dcd1eb;
          background: white;
          color: #5d4c70;
          padding: 14px 22px;
          border-radius: 13px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .secondary-button:hover {
          border-color: #bda3eb;
          color: #6d28d9;
          background: #faf8ff;
        }

        .trust-line {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #918797;
          font-size: 11px;
        }

        .trust-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 0 4px rgba(34,197,94,0.09);
        }

        /* HERO VISUAL */

        .hero-visual {
          position: relative;
          min-height: 470px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visual-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(124,58,237,0.22),
              rgba(124,58,237,0.04) 55%,
              transparent 70%
            );
        }

        .main-visual-card {
          width: min(100%, 440px);
          position: relative;
          z-index: 2;
          background: white;
          border: 1px solid #e4d9f2;
          border-radius: 30px;
          padding: 25px;
          box-shadow:
            0 28px 70px rgba(76,29,149,0.14);
          transform: rotate(1deg);
        }

        .visual-top {
          height: 225px;
          border-radius: 21px;
          background:
            radial-gradient(
              circle at 75% 25%,
              rgba(139,92,246,0.24),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #f3edff,
              #e9ddff
            );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .visual-road {
          position: absolute;
          width: 150%;
          height: 95px;
          bottom: -35px;
          left: -25%;
          background: #d6c8e9;
          transform: rotate(-9deg);
        }

        .visual-car {
          position: relative;
          z-index: 2;
          font-size: 108px;
          filter:
            drop-shadow(
              0 17px 13px rgba(76,29,149,0.17)
            );
        }

        .visual-label {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 4;
          background: white;
          color: #6d28d9;
          border: 1px solid #e1d6f1;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
        }

        .visual-info {
          padding: 20px 5px 4px;
        }

        .visual-info small {
          color: #806f92;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .visual-info h3 {
          margin: 5px 0 3px;
          font-size: 23px;
          color: #281735;
        }

        .visual-info p {
          margin: 0;
          color: #81768c;
          font-size: 12px;
        }

        .visual-price {
          margin-top: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .visual-price strong {
          color: #4c1d95;
          font-size: 21px;
        }

        .visual-price span {
          color: #8a8193;
          font-size: 10px;
        }

        .floating-card {
          position: absolute;
          z-index: 5;
          background: white;
          border: 1px solid #e5dbf2;
          border-radius: 17px;
          padding: 13px 15px;
          box-shadow:
            0 14px 35px rgba(58,35,96,0.12);
        }

        .floating-one {
          top: 55px;
          left: 0;
        }

        .floating-two {
          right: -10px;
          bottom: 70px;
        }

        .floating-title {
          color: #6d28d9;
          font-size: 10px;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .floating-text {
          color: #63586e;
          font-size: 11px;
          font-weight: 700;
        }

        /* FEATURES */

        .features-section {
          margin-top: 35px;
        }

        .section-heading {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 32px;
        }

        .section-heading small {
          color: #7c3aed;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .section-heading h2 {
          margin: 9px 0;
          font-size: 34px;
          letter-spacing: -1px;
          color: #241633;
        }

        .section-heading p {
          margin: 0;
          color: #7b7186;
          font-size: 14px;
          line-height: 1.65;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .feature-card {
          background: white;
          border: 1px solid #e7e0f2;
          border-radius: 21px;
          padding: 23px;
          box-shadow:
            0 10px 30px rgba(58,35,96,0.05);
          transition: 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: #cdb8f3;
          box-shadow:
            0 17px 40px rgba(76,29,149,0.09);
        }

        .feature-icon {
          width: 43px;
          height: 43px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0eaff;
          font-size: 19px;
          margin-bottom: 15px;
        }

        .feature-card h3 {
          margin: 0 0 7px;
          font-size: 16px;
        }

        .feature-card p {
          margin: 0;
          color: #7b7185;
          font-size: 12px;
          line-height: 1.65;
        }

        /* CTA */

        .home-cta {
          margin-top: 65px;
          border-radius: 27px;
          padding: 38px;
          background: linear-gradient(
            135deg,
            #4c1d95,
            #6d28d9 55%,
            #8b5cf6
          );
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          overflow: hidden;
          position: relative;
        }

        .home-cta::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          right: -100px;
          top: -140px;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-content h2 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.7px;
        }

        .cta-content p {
          margin: 8px 0 0;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
        }

        .cta-button {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          border: none;
          background: white;
          color: #5b21b6;
          padding: 13px 20px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .hero-content {
            text-align: center;
          }

          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-buttons,
          .trust-line {
            justify-content: center;
          }

          .hero-visual {
            min-height: 430px;
          }

          .features-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .home-container {
            padding: 42px 15px 55px;
          }

          .hero-title {
            font-size: 43px;
            letter-spacing: -1.8px;
          }

          .hero-description {
            font-size: 14px;
          }

          .hero-visual {
            min-height: 380px;
          }

          .main-visual-card {
            padding: 16px;
            border-radius: 23px;
          }

          .visual-top {
            height: 190px;
          }

          .visual-car {
            font-size: 85px;
          }

          .floating-one {
            left: -4px;
            top: 35px;
          }

          .floating-two {
            right: -4px;
            bottom: 45px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .home-cta {
            flex-direction: column;
            align-items: flex-start;
            padding: 28px 23px;
          }
        }
      `}</style>

      <div className="home-container">

        {/* HERO */}
        <section className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              ✦ AI-POWERED RENTALS
            </div>

            <h1 className="hero-title">
              Rent smarter.
              <br />
              Ride <span>better.</span>
            </h1>

            <p className="hero-description">
              Welcome to Rentora, your intelligent rental
              platform for cars, bikes, scooters and cycles.
              Discover available vehicles, compare prices
              and get help from Rentora AI.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() =>
                  setActivePage("explore")
                }
              >
                Explore Rentals →
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  setActivePage("assistant")
                }
              >
                Talk to Rentora AI
              </button>
            </div>

            <div className="trust-line">
              <span className="trust-dot" />
              Live rental availability
              <span>•</span>
              Multiple cities
              <span>•</span>
              AI assistance
            </div>

          </div>

          {/* VISUAL */}
          <div className="hero-visual">

            <div className="visual-glow" />

            <div className="floating-card floating-one">
              <div className="floating-title">
                RENTORA AI
              </div>

              <div className="floating-text">
                Find your ride instantly ✨
              </div>
            </div>

            <div className="main-visual-card">

              <div className="visual-top">

                <div className="visual-label">
                  AVAILABLE NOW
                </div>

                <div className="visual-road" />

                <div className="visual-car">
                  🚗
                </div>

              </div>

              <div className="visual-info">
                <small>
                  Featured rental
                </small>

                <h3>
                  Premium rides,
                  <br />
                  simple booking.
                </h3>

                <p>
                  Search by city, vehicle type
                  or simply ask Rentora AI.
                </p>

                <div className="visual-price">
                  <strong>
                    ₹450+
                  </strong>

                  <span>
                    starting price / day
                  </span>
                </div>
              </div>

            </div>

            <div className="floating-card floating-two">
              <div className="floating-title">
                7 CITIES
              </div>

              <div className="floating-text">
                Explore more locations 📍
              </div>
            </div>

          </div>

        </section>

        {/* FEATURES */}
        <section className="features-section">

          <div className="section-heading">

            <small>
              WHY RENTORA
            </small>

            <h2>
              Everything you need to rent
            </h2>

            <p>
              A clean rental experience backed by
              real vehicle availability and an AI
              assistant that understands what you need.
            </p>

          </div>

          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon">
                ✨
              </div>

              <h3>
                AI Rental Assistant
              </h3>

              <p>
                Tell Rentora what you need in natural
                language and get help finding the right
                vehicle.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                🚗
              </div>

              <h3>
                Wide Vehicle Choice
              </h3>

              <p>
                Explore cars, motorbikes, scooters and
                cycles across multiple rental cities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                💜
              </div>

              <h3>
                Clear Pricing
              </h3>

              <p>
                See daily pricing and estimated total
                rental cost based on your selected duration.
              </p>
            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="home-cta">

          <div className="cta-content">

            <h2>
              Not sure what to rent?
            </h2>

            <p>
              Just tell Rentora AI where you're going
              and what kind of ride you need.
            </p>

          </div>

          <button
            className="cta-button"
            onClick={() =>
              setActivePage("assistant")
            }
          >
            Ask Rentora AI →
          </button>

        </section>

      </div>
    </div>
  );
}

export default LandingPage;