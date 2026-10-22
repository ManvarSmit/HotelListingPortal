import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import flatpickr from "flatpickr";

export default function ListingShow({ currUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Booking Form State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/listings/${id}`, {
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setListing(data.listing);
      setHasCheckedIn(data.hasCheckedIn || false);
      setBookedRanges(data.bookedRanges || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Initialize Flatpickr and Live Price Calculation
  useEffect(() => {
    if (!listing || !checkInRef.current || !checkOutRef.current) return;

    const disabledDates = bookedRanges.map((range) => ({
      from: range.from,
      to: range.to,
    }));

    const fpOut = flatpickr(checkOutRef.current, {
      minDate: "today",
      dateFormat: "Y-m-d",
      disable: disabledDates,
      onChange: (selectedDates, dateStr) => {
        setCheckOut(dateStr);
      },
    });

    const fpIn = flatpickr(checkInRef.current, {
      minDate: "today",
      dateFormat: "Y-m-d",
      disable: disabledDates,
      onChange: (selectedDates, dateStr) => {
        setCheckIn(dateStr);
        if (selectedDates[0]) {
          fpOut.set("minDate", selectedDates[0]);
        }
      },
    });

    return () => {
      fpIn.destroy();
      fpOut.destroy();
    };
  }, [listing, bookedRanges]);

  // Recalculate price when checkIn / checkOut changes
  useEffect(() => {
    if (checkIn && checkOut && listing) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end > start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTotalNights(diffDays);
        setTotalPrice(diffDays * listing.price);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    } else {
      setTotalNights(0);
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, listing]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${listing.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/listings/${id}?_method=DELETE`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete listing.");
        setDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting listing.");
      setDeleting(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!currUser) {
      alert("You must be logged in first!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/listings/${id}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ booking: { checkIn, checkOut } }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(`Booking successful! Total: ₹ ${totalPrice.toLocaleString("en-IN")}`);
        navigate("/bookings");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing booking!");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/listings/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ review: { rating, comment } }),
      });
      if (res.ok) {
        setComment("");
        fetchListing();
      } else {
        alert("Error submitting review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !listing) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const images = listing.imagesList || (listing.image ? [listing.image] : []);

  return (
    <div className="container my-4">
      {/* Admin Action Buttons */}
      {currUser?.role === "admin" && (
        <div className="d-flex gap-2 justify-content-end mb-3">
          <Link
            to={`/listings/${id}/edit`}
            className="btn btn-outline-dark btn-sm rounded-3 fw-semibold px-3"
          >
            <i className="fa-solid fa-pen-to-square me-1"></i> Edit Listing
          </Link>
          <button
            className="btn btn-danger btn-sm rounded-3 fw-semibold px-3"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting
              ? <><span className="spinner-border spinner-border-sm me-1" />Deleting...</>
              : <><i className="fa-solid fa-trash me-1"></i> Delete Listing</>}
          </button>
        </div>
      )}

      {/* Title & Location Header */}
      <div className="row mb-3">
        <div className="col-12">
          <h2 className="fw-bold text-dark mb-1">{listing.title}</h2>
          <p className="text-secondary fs-6 mb-0">
            <i className="fa-solid fa-location-dot text-danger me-1"></i>
            {listing.location}, {listing.country}
          </p>
        </div>
      </div>

      {/* Sliding Image Carousel */}
      <div className="row mb-4">
        <div className="col-12">
          <div id="listingCarousel" className="carousel slide shadow-sm rounded-4 overflow-hidden" data-bs-ride="carousel">
            <div className="carousel-inner">
              {images.map((img, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                  <div className="ratio ratio-16x9 bg-light">
                    <img src={img.url} className="d-block w-100 h-100" alt="hotel" style={{ objectFit: "cover" }} />
                  </div>
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#listingCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#listingCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail Layout Grid */}
      <div className="row g-4">
        {/* Left Column - Details & Reviews */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "48px", height: "48px" }}>
                <i className="fa-solid fa-user-tie fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-0">Hosted by {listing.owner?.username || "Admin"}</h5>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 mt-1">Superhost</span>
              </div>
            </div>

            <div className="mb-4 pb-3 border-bottom">
              <h5 className="fw-bold text-dark mb-3">About this place</h5>
              <p className="text-secondary lh-lg mb-0" style={{ whiteSpace: "pre-line" }}>
                {listing.description}
              </p>
            </div>

            {/* Guest Reviews Section */}
            <div>
              <h5 className="fw-bold text-dark mb-3">Guest Reviews</h5>

              {currUser && hasCheckedIn ? (
                <div className="card border-0 bg-light p-3 rounded-3 mb-4">
                  <h6 className="fw-bold mb-3 text-success">
                    <i className="fa-solid fa-circle-check me-1"></i> Verified Guest Review
                  </h6>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Rating (1 to 5)</label>
                      <select className="form-select" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value={5}>5 Stars - Amazing</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Not Good</option>
                        <option value={1}>1 Star - Terrible</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Comment</label>
                      <textarea className="form-control" rows="3" placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                    </div>
                    <button className="btn btn-dark btn-sm rounded-2">Submit Review</button>
                  </form>
                </div>
              ) : currUser ? (
                <div className="alert alert-secondary border-0 p-3 rounded-3 mb-4 small text-secondary">
                  <i className="fa-solid fa-lock text-muted me-2"></i>
                  <strong>Verified Stay Required:</strong> Only guests who have booked and checked in to this hotel can leave a review.
                </div>
              ) : null}

              <div className="row g-3">
                {(!listing.reviews || listing.reviews.length === 0) ? (
                  <p className="text-muted small ms-1">No reviews yet. Be the first to leave a review!</p>
                ) : (
                  listing.reviews.map((rev) => (
                    <div key={rev.id} className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm p-3 rounded-3 bg-light">
                        <h6 className="fw-bold mb-1">@{rev.author?.username || "Guest"}</h6>
                        <div className="text-warning small mb-2">{"★".repeat(rev.rating)}</div>
                        <p className="card-text text-secondary small">{rev.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
            <div className="d-flex align-items-baseline justify-content-between mb-3 pb-3 border-bottom">
              <div>
                <span className="fs-3 fw-bold text-dark">₹ {listing.price?.toLocaleString("en-IN")}</span>
                <span className="text-secondary small"> / night</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="border rounded-3 overflow-hidden mb-3">
                <div className="p-2 border-bottom bg-light">
                  <label className="form-label small fw-bold mb-1 text-uppercase text-secondary" style={{ fontSize: "0.7rem" }}>Check-In</label>
                  <input ref={checkInRef} type="text" className="form-control border-0 bg-transparent p-0 shadow-none fw-semibold" placeholder="Select check-in date" required />
                </div>
                <div className="p-2 bg-light">
                  <label className="form-label small fw-bold mb-1 text-uppercase text-secondary" style={{ fontSize: "0.7rem" }}>Check-Out</label>
                  <input ref={checkOutRef} type="text" className="form-control border-0 bg-transparent p-0 shadow-none fw-semibold" placeholder="Select check-out date" required />
                </div>
              </div>

              <div className="bg-light p-3 rounded-3 mb-3 border">
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Duration</span>
                  <span className="fw-bold text-dark">{totalNights} night(s)</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Rate</span>
                  <span>₹ {listing.price?.toLocaleString("en-IN")} / night</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold text-dark">
                  <span>Total Amount</span>
                  <span className="text-danger fs-5">₹ {totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-danger btn-lg w-100 py-3 rounded-3 fw-bold shadow-sm">
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
