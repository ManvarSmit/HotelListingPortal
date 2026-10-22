import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyBookings({ currUser }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currUser) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [currUser]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/bookings", {
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        alert("Booking cancelled successfully!");
        fetchBookings();
      } else {
        alert("Error cancelling booking");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold text-dark mb-1">
            <i className="fa-solid fa-calendar-check text-danger me-2"></i> My Booked Hotels
          </h2>
          <p className="text-secondary small mb-0">View all your confirmed hotel reservations and stay details.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4">
          <div className="mb-3">
            <i className="fa-solid fa-hotel text-muted" style={{ fontSize: "3.5rem" }}></i>
          </div>
          <h4 className="fw-bold text-dark">No bookings yet</h4>
          <p className="text-secondary small mb-4">You haven't booked any hotels yet. Explore our listings and book your next stay!</p>
          <div>
            <Link to="/" className="btn btn-danger px-4 py-2 fw-semibold rounded-3">
              Explore Hotels
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                {booking.listing ? (
                  <img
                    src={booking.listing.image?.url || booking.listing.image_url}
                    className="card-img-top"
                    alt={booking.listing.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
                    <i className="fa-solid fa-hotel fs-1"></i>
                  </div>
                )}
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark text-truncate mb-0" style={{ maxWidth: "75%" }}>
                      {booking.listing ? booking.listing.title : "Hotel Reservation"}
                    </h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      <i className="fa-solid fa-circle-check me-1"></i>Confirmed
                    </span>
                  </div>

                  {booking.listing && (
                    <p className="text-secondary small mb-3">
                      <i className="fa-solid fa-location-dot text-danger me-1"></i>
                      {booking.listing.location}, {booking.listing.country}
                    </p>
                  )}

                  <div className="bg-light p-2 rounded-3 mb-3 border text-secondary small">
                    <div className="d-flex justify-content-between mb-1">
                      <span><i className="fa-solid fa-calendar-days text-primary me-1"></i> Check-In:</span>
                      <span className="fw-semibold text-dark">{booking.checkIn}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span><i className="fa-solid fa-calendar-days text-danger me-1"></i> Check-Out:</span>
                      <span className="fw-semibold text-dark">{booking.checkOut}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span><i className="fa-solid fa-clock text-warning me-1"></i> Duration:</span>
                      <span className="fw-semibold text-dark">{booking.totalDays} night(s)</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-top">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <span className="text-secondary small d-block">Total Paid</span>
                        <span className="fw-bold text-success fs-5">₹ {booking.totalPrice?.toLocaleString("en-IN")}</span>
                      </div>
                      {booking.listing && (
                        <Link to={`/listings/${booking.listing.id}`} className="btn btn-outline-dark btn-sm rounded-2">
                          View Hotel
                        </Link>
                      )}
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm w-100 rounded-2"
                      onClick={() => handleCancel(booking.id)}
                    >
                      <i className="fa-solid fa-ban me-1"></i> Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
