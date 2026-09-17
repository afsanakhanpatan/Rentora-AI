import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "";

const CITIES = [
  "All cities",
  "Chirala",
  "Ongole",
  "Vijayawada",
  "Guntur",
  "Nellore",
  "Visakhapatnam",
  "Tirupati",
];

const TYPES = [
  "All types",
  "car",
  "bike",
  "scooter",
  "cycle",
];

const TYPE_LABELS = {
  car: "Car",
  bike: "Bike",
  scooter: "Scooter",
  cycle: "Cycle",
};

function Dashboard({ setActivePage, setSelectedVehicle }) {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All cities");
  const [type, setType] = useState("All types");
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/vehicles`
        );

        if (!response.ok) {
          throw new Error(
            `Vehicle API returned ${response.status}`
          );
        }

        const data = await response.json();

        const vehicleList = Array.isArray(data)
          ? data
          : Array.isArray(data.vehicles)
          ? data.vehicles
          : [];

        if (!vehicleList.length) {
          throw new Error("No vehicles were returned.");
        }

        setVehicles(vehicleList);
      } catch (err) {
        console.error("Dashboard vehicle loading error:", err);

        setError(
          "We couldn't load the available rentals right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return vehicles.filter((vehicle) => {
      const vehicleName = String(
        vehicle.name || ""
      ).toLowerCase();

      const vehicleCity = String(
        vehicle.city || vehicle.location || ""
      ).toLowerCase();

      const vehicleCategory = String(
        vehicle.category || vehicle.type || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        vehicleName.includes(query) ||
        vehicleCity.includes(query) ||
        vehicleCategory.includes(query);

      const matchesCity =
        city === "All cities" ||
        vehicleCity === city.toLowerCase();

      const matchesType =
        type === "All types" ||
        vehicleCategory === type.toLowerCase();

      return (
        matchesSearch &&
        matchesCity &&
        matchesType
      );
    });
  }, [vehicles, search, city, type]);

  const totalVehicles = vehicles.length;

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.available !== false
  ).length;

  const cityCount = new Set(
    vehicles
      .map((vehicle) =>
        vehicle.city || vehicle.location
      )
      .filter(Boolean)
  ).size;

  const getVehicleCategory = (vehicle) => {
    return String(
      vehicle.category || vehicle.type || ""
    ).toLowerCase();
  };

  const getVehicleIcon = (vehicle) => {
    const category = getVehicleCategory(vehicle);

    switch (category) {
      case "car":
        return "🚗";

      case "bike":
      case "motorbike":
        return "🏍️";

      case "scooter":
        return "🛵";

      case "cycle":
        return "🚲";

      default:
        return "🚘";
    }
  };

  const getTypeLabel = (vehicle) => {
    const category = getVehicleCategory(vehicle);

    return (
      TYPE_LABELS[category] ||
      category ||
      "Vehicle"
    );
  };

  const handleRent = (vehicle) => {
    const selectedVehicle = {
      id: vehicle.id,
      name: vehicle.name,
      category:
        vehicle.category ||
        vehicle.type ||
        "",
      city:
        vehicle.city ||
        vehicle.location ||
        "",
      pricePerDay:
        Number(vehicle.pricePerDay) || 0,
      available:
        vehicle.available !== false,
      durationDays: duration,
    };

    setSelectedVehicle(selectedVehicle);
    setActivePage("assistant");
  };

  return (
    <div className="explore-page">
      <style>{`
        .explore-page {
          min-height: calc(100vh - 76px);
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(124, 58, 237, 0.10),
              transparent 30%
            ),
            #fbfaff;
          color: #171327;
          padding: 46px 24px 70px;
        }

        .explore-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        .explore-hero {
          background: linear-gradient(
            135deg,
            #4c1d95 0%,
            #6d28d9 52%,
            #8b5cf6 100%
          );
          border-radius: 30px;
          padding: 42px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 24px 60px rgba(76, 29, 149, 0.22);
        }

        .explore-hero::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.09);
          right: -90px;
          top: -120px;
        }

        .explore-hero::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          right: 180px;
          bottom: -100px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .hero-title {
          font-size: clamp(34px, 5vw, 54px);
          line-height: 1.04;
          margin: 0 0 16px;
          letter-spacing: -1.8px;
        }

        .hero-text {
          margin: 0;
          max-width: 610px;
          color: rgba(255,255,255,0.82);
          font-size: 16px;
          line-height: 1.7;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 28px;
        }

        .stat-box {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 16px;
          padding: 16px;
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: 800;
        }

        .stat-label {
          display: block;
          color: rgba(255,255,255,0.68);
          font-size: 12px;
          margin-top: 3px;
        }

        .filter-card {
          margin-top: 26px;
          background: white;
          border: 1px solid #e8e0f4;
          border-radius: 22px;
          padding: 20px;
          box-shadow:
            0 12px 35px rgba(58, 35, 96, 0.07);
        }

        .filter-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr;
          gap: 14px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 12px;
          font-weight: 800;
          color: #5d536d;
        }

        .search-input,
        .filter-select {
          width: 100%;
          box-sizing: border-box;
          height: 48px;
          border: 1px solid #ddd3ec;
          border-radius: 13px;
          background: #fff;
          color: #171327;
          padding: 0 15px;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
        }

        .search-input:focus,
        .filter-select:focus {
          border-color: #7c3aed;
          box-shadow:
            0 0 0 4px rgba(124,58,237,0.10);
        }

        .duration-area {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid #eee8f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .duration-title {
          font-size: 13px;
          font-weight: 800;
          color: #514762;
        }

        .duration-buttons {
          display: flex;
          gap: 8px;
        }

        .duration-button {
          border: 1px solid #ddd3ec;
          background: #fff;
          color: #5d536d;
          padding: 10px 18px;
          border-radius: 11px;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s;
        }

        .duration-button:hover {
          border-color: #8b5cf6;
          color: #6d28d9;
        }

        .duration-button.active {
          background: #6d28d9;
          border-color: #6d28d9;
          color: white;
          box-shadow:
            0 8px 18px rgba(109,40,217,0.22);
        }

        .results-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin: 40px 0 20px;
        }

        .results-title {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.5px;
        }

        .results-subtitle {
          margin: 6px 0 0;
          color: #746b80;
          font-size: 14px;
        }

        .result-count {
          background: #f0eaff;
          color: #6d28d9;
          border: 1px solid #dfd1ff;
          padding: 8px 13px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
        }

        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .vehicle-card {
          background: white;
          border: 1px solid #e8e0f4;
          border-radius: 22px;
          overflow: hidden;
          box-shadow:
            0 10px 30px rgba(58, 35, 96, 0.06);
          transition:
            transform 0.2s,
            box-shadow 0.2s,
            border-color 0.2s;
        }

        .vehicle-card:hover {
          transform: translateY(-5px);
          border-color: #cdb8f5;
          box-shadow:
            0 18px 42px rgba(76,29,149,0.13);
        }

        .vehicle-top {
          height: 150px;
          background:
            radial-gradient(
              circle at 70% 30%,
              rgba(139,92,246,0.25),
              transparent 34%
            ),
            linear-gradient(
              135deg,
              #f4efff,
              #eee7ff
            );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .vehicle-icon {
          font-size: 68px;
          filter: drop-shadow(
            0 10px 12px rgba(76,29,149,0.12)
          );
        }

        .available-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: white;
          color: #15803d;
          border: 1px solid #d6f1df;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .unavailable-badge {
          color: #b42318;
          border-color: #f5d0cd;
        }

        .vehicle-body {
          padding: 20px;
        }

        .vehicle-type {
          color: #7c3aed;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .vehicle-name {
          margin: 6px 0 4px;
          font-size: 20px;
          letter-spacing: -0.4px;
        }

        .vehicle-location {
          color: #766d82;
          font-size: 13px;
          margin-bottom: 17px;
        }

        .vehicle-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .meta-pill {
          background: #f7f4fb;
          border: 1px solid #ebe5f3;
          color: #5c536b;
          padding: 7px 9px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 700;
        }

        .vehicle-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .price-label {
          display: block;
          color: #8a8195;
          font-size: 11px;
        }

        .price {
          color: #4c1d95;
          font-size: 21px;
          font-weight: 900;
        }

        .price-total {
          display: block;
          color: #8a8195;
          font-size: 10px;
          margin-top: 2px;
        }

        .rent-button {
          border: none;
          background: linear-gradient(
            135deg,
            #6d28d9,
            #8b5cf6
          );
          color: white;
          border-radius: 11px;
          padding: 11px 15px;
          cursor: pointer;
          font-weight: 800;
          font-size: 12px;
          box-shadow:
            0 8px 18px rgba(109,40,217,0.20);
          transition: 0.2s;
        }

        .rent-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 11px 23px rgba(109,40,217,0.28);
        }

        .rent-button:disabled {
          background: #d7d1df;
          box-shadow: none;
          cursor: not-allowed;
        }

        .empty-card,
        .error-card {
          grid-column: 1 / -1;
          background: white;
          border: 1px solid #e8e0f4;
          border-radius: 22px;
          padding: 50px 25px;
          text-align: center;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .empty-card h3,
        .error-card h3 {
          margin: 0 0 8px;
        }

        .empty-card p,
        .error-card p {
          margin: 0;
          color: #766d82;
        }

        .skeleton {
          height: 330px;
          border-radius: 22px;
          background: linear-gradient(
            90deg,
            #f1edf6 25%,
            #faf8fc 50%,
            #f1edf6 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          from {
            background-position: 200% 0;
          }

          to {
            background-position: -200% 0;
          }
        }

        @media (max-width: 950px) {
          .vehicle-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filter-grid {
            grid-template-columns: 1fr 1fr;
          }

          .filter-grid .field:first-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 650px) {
          .explore-page {
            padding: 25px 14px 50px;
          }

          .explore-hero {
            padding: 28px 22px;
            border-radius: 23px;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .filter-grid {
            grid-template-columns: 1fr;
          }

          .filter-grid .field:first-child {
            grid-column: auto;
          }

          .vehicle-grid {
            grid-template-columns: 1fr;
          }

          .results-header {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="explore-container">

        <section className="explore-hero">
          <div className="hero-content">

            <div className="hero-label">
              ✦ Rentora Rentals
            </div>

            <h1 className="hero-title">
              Find your perfect ride.
            </h1>

            <p className="hero-text">
              Explore cars, bikes, scooters and cycles
              available across our rental locations.
              Choose your ride, check the price and
              let Rentora AI help you book it.
            </p>

            <div className="stats-row">

              <div className="stat-box">
                <span className="stat-number">
                  {totalVehicles}
                </span>

                <span className="stat-label">
                  Vehicles listed
                </span>
              </div>

              <div className="stat-box">
                <span className="stat-number">
                  {availableVehicles}
                </span>

                <span className="stat-label">
                  Currently available
                </span>
              </div>

              <div className="stat-box">
                <span className="stat-number">
                  {cityCount}
                </span>

                <span className="stat-label">
                  Rental cities
                </span>
              </div>

            </div>
          </div>
        </section>

        <section className="filter-card">

          <div className="filter-grid">

            <div className="field">
              <label>SEARCH</label>

              <input
                className="search-input"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search vehicle, city or type..."
              />
            </div>

            <div className="field">
              <label>CITY</label>

              <select
                className="filter-select"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
              >
                {CITIES.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>VEHICLE TYPE</label>

              <select
                className="filter-select"
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
              >
                {TYPES.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All types"
                      ? item
                      : TYPE_LABELS[item]}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="duration-area">

            <div>
              <div className="duration-title">
                HOW LONG DO YOU NEED IT?
              </div>
            </div>

            <div className="duration-buttons">

              {[1, 3, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  className={
                    "duration-button " +
                    (duration === days
                      ? "active"
                      : "")
                  }
                  onClick={() =>
                    setDuration(days)
                  }
                >
                  {days}{" "}
                  {days === 1
                    ? "day"
                    : "days"}
                </button>
              ))}

            </div>
          </div>

        </section>

        <div className="results-header">

          <div>

            <h2 className="results-title">
              Available rentals
            </h2>

            <p className="results-subtitle">
              Prices below are calculated for{" "}
              <strong>
                {duration}{" "}
                {duration === 1
                  ? "day"
                  : "days"}
              </strong>
              .
            </p>

          </div>

          <div className="result-count">
            {filteredVehicles.length} results
          </div>

        </div>

        <div className="vehicle-grid">

          {loading &&
            Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  className="skeleton"
                  key={index}
                />
              )
            )}

          {!loading && error && (
            <div className="error-card">

              <div className="empty-icon">
                ⚠️
              </div>

              <h3>
                Unable to load rentals
              </h3>

              <p>
                {error}
              </p>

            </div>
          )}

          {!loading &&
            !error &&
            filteredVehicles.length === 0 && (
              <div className="empty-card">

                <div className="empty-icon">
                  🔎
                </div>

                <h3>
                  No matching rentals
                </h3>

                <p>
                  Try another city, vehicle
                  type or search term.
                </p>

              </div>
            )}

          {!loading &&
            !error &&
            filteredVehicles.map((vehicle) => {

              const vehiclePrice =
                Number(
                  vehicle.pricePerDay
                ) || 0;

              const totalPrice =
                vehiclePrice * duration;

              const isAvailable =
                vehicle.available !== false;

              const vehicleCity =
                vehicle.city ||
                vehicle.location ||
                "Location unavailable";

              const category =
                getVehicleCategory(vehicle);

              return (
                <article
                  className="vehicle-card"
                  key={vehicle.id}
                >

                  <div className="vehicle-top">

                    <div className="vehicle-icon">
                      {getVehicleIcon(vehicle)}
                    </div>

                    <span
                      className={
                        isAvailable
                          ? "available-badge"
                          : "available-badge unavailable-badge"
                      }
                    >
                      {isAvailable
                        ? "● Available"
                        : "● Unavailable"}
                    </span>

                  </div>

                  <div className="vehicle-body">

                    <div className="vehicle-type">
                      {getTypeLabel(vehicle)}
                    </div>

                    <h3 className="vehicle-name">
                      {vehicle.name}
                    </h3>

                    <div className="vehicle-location">
                      📍 {vehicleCity}
                    </div>

                    <div className="vehicle-meta">

                      <span className="meta-pill">
                        👥{" "}
                        {vehicle.passengers ||
                          (category === "car"
                            ? 5
                            : 2)}{" "}
                        passengers
                      </span>

                      <span className="meta-pill">
                        {TYPE_LABELS[category] ||
                          category ||
                          "Vehicle"}
                      </span>

                    </div>

                    <div className="vehicle-bottom">

                      <div>

                        <span className="price-label">
                          From
                        </span>

                        <span className="price">
                          ₹{vehiclePrice}
                        </span>

                        <span className="price-label">
                          / day
                        </span>

                        <span className="price-total">
                          ₹{totalPrice} total
                        </span>

                      </div>

                      <button
                        type="button"
                        className="rent-button"
                        disabled={!isAvailable}
                        onClick={() =>
                          handleRent(vehicle)
                        }
                      >
                        {isAvailable
                          ? "Rent now →"
                          : "Unavailable"}
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;