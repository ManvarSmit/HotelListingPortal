import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditListing({ currUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("trending");
  const [files, setFiles] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Guard: only admin can access
  if (!currUser || currUser.role !== "admin") {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger p-4 rounded-4">
          <h4>Access Denied</h4>
          <p>Only the Admin can edit listings.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetch(`/listings/${id}`, {
      headers: { Accept: "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const l = data.listing;
        setTitle(l.title || "");
        setDescription(l.description || "");
        setPrice(l.price || "");
        setLocation(l.location || "");
        setCountry(l.country || "");
        setCategory(l.category || "trending");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("listing[title]", title);
    formData.append("listing[description]", description);
    formData.append("listing[price]", price);
    formData.append("listing[location]", location);
    formData.append("listing[country]", country);
    formData.append("listing[category]", category);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("listing[image]", files[i]);
      }
    }

    try {
      const res = await fetch(`/listings/${id}?_method=PUT`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        navigate(`/listings/${id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Error updating listing");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating listing. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-danger" role="status" />
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: "600px" }}>
      <div className="card border-0 shadow-sm p-4 rounded-4">
        <h3 className="fw-bold text-center mb-4">Edit Hotel Listing</h3>
        {error && <div className="alert alert-danger p-2 small">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label small fw-semibold">Title</label>
            <input type="text" className="form-control rounded-3" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Description</label>
            <textarea className="form-control rounded-3" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Category</label>
            <select className="form-select rounded-3" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="trending">Trending</option>
              <option value="beachfront">Beachfront</option>
              <option value="mountains">Mountains</option>
              <option value="villas">Villas</option>
              <option value="camping">Camping</option>
              <option value="pools">Pools</option>
              <option value="iconic_cities">Iconic Cities</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">
              Upload New Images <span className="text-muted">(optional — replaces current images)</span>
            </label>
            <input type="file" className="form-control rounded-3" multiple onChange={(e) => setFiles(e.target.files)} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Price per night (₹)</label>
            <input type="number" className="form-control rounded-3" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-semibold">Location / City</label>
              <input type="text" className="form-control rounded-3" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-semibold">Country</label>
              <input type="text" className="form-control rounded-3" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn btn-danger w-100 py-2 rounded-3 fw-bold">
              <i className="fa-solid fa-floppy-disk me-2"></i>Save Changes
            </button>
            <button type="button" className="btn btn-outline-secondary w-100 py-2 rounded-3 fw-bold" onClick={() => navigate(`/listings/${id}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
