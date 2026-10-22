import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Navbar({ currUser, setCurrUser, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/logout", { credentials: "include" });
      setCurrUser(null);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand me-3" to="/">
          <i className="fa-regular fa-compass"></i>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto">
            <Link className="nav-link" to="/">
              <b>Explore Hotels</b>
            </Link>
          </div>

          {/* Destination Search Bar */}
          <form
            className="d-flex mx-auto my-2 my-md-0 shadow-sm rounded-pill overflow-hidden border"
            onSubmit={handleSearchSubmit}
            style={{ maxWidth: "380px", width: "100%" }}
          >
            <input
              className="form-control border-0 ps-3 bg-transparent shadow-none small"
              type="search"
              placeholder="Search destinations or hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-danger px-3 border-0 rounded-pill me-1 my-1" type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          <div className="navbar-nav ms-auto">
            {currUser && currUser.role === "admin" && (
              <Link className="nav-link fw-semibold" to="/listings/new">
                + Add new Listing
              </Link>
            )}

            {!currUser ? (
              <>
                <Link className="nav-link" to="/signup">
                  <b>Sign up</b>
                </Link>
                <Link className="nav-link" to="/login">
                  <b>Log in</b>
                </Link>
              </>
            ) : (
              <>
                <Link className="nav-link me-2" to="/bookings">
                  My Bookings
                </Link>
                <button
                  className="btn btn-link nav-link text-danger fw-semibold border-0 bg-transparent p-0 ms-1"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
