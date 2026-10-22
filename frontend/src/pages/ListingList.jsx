import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function ListingList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    fetch(`/listings?q=${encodeURIComponent(q)}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setListings(data.allListings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [q]);

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary mt-2">Loading hotels...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {q && (
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-secondary small">
            Showing results for <strong>"{q}"</strong>
          </span>
          <Link to="/" className="btn btn-link btn-sm text-danger text-decoration-none p-0 fw-semibold">
            Clear search
          </Link>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4 my-4">
          <div className="mb-3">
            <i className="fa-solid fa-magnifying-glass text-muted" style={{ fontSize: "3rem" }}></i>
          </div>
          <h5 className="fw-bold text-dark">No hotels found</h5>
          <p className="text-secondary small mb-3">We couldn't find any hotels matching your search.</p>
          <div>
            <Link to="/" className="btn btn-dark btn-sm rounded-pill px-4">
              View All Hotels
            </Link>
          </div>
        </div>
      ) : (
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-2">
          {listings.map((listing) => (
            <div key={listing.id} className="col">
              <Link to={`/listings/${listing.id}`} className="listing-link">
                <div className="card listing-card">
                  <div className="ratio ratio-4x3 rounded-4 overflow-hidden shadow-sm">
                    <img
                      src={listing.image?.url || listing.image_url}
                      className="card-img-top w-100 h-100"
                      alt={listing.title}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body mt-2">
                    <p className="card-text mb-0">
                      <b className="fs-6 text-dark d-block text-truncate">{listing.title}</b>
                      <span className="text-secondary small d-block mb-1">
                        <i className="fa-solid fa-location-dot text-danger me-1"></i>
                        {listing.location}, {listing.country}
                      </span>
                      <span className="fw-bold text-dark">
                        ₹ {listing.price?.toLocaleString("en-IN")}
                      </span>{" "}
                      <span className="text-secondary small">/ night</span>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
