import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewListing({ currUser }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [files, setFiles] = useState(null);
  const [error, setError] = useState("");

  if (!currUser || currUser.role !== "admin") {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger p-4 rounded-4">
          <h4>Access Denied</h4>
          <p>Only the Admin can create new hotel listings.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("listing[title]", title);
    formData.append("listing[description]", description);
    formData.append("listing[price]", price);
    formData.append("listing[location]", location);
    formData.append("listing[country]", country);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("listing[image]", files[i]);
      }
    }

    try {
      const res = await fetch("/listings", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        navigate("/");
      } else {
        setError("Error creating listing");
      }
    } catch (err) {
      console.error(err);
      setError("Error creating listing");
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: "600px" }}>
      <div className="card border-0 shadow-sm p-4 rounded-4">
        <h3 className="fw-bold text-center mb-4">Create New Hotel Listing</h3>
        {error && <div className="alert alert-danger p-2 small">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label small fw-semibold">Title</label>
            <input type="text" className="form-control rounded-3" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Description</label>
            <textarea className="form-control rounded-3" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Upload Images (Multiple supported)</label>
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
          <button type="submit" className="btn btn-danger w-100 py-2 rounded-3 fw-bold mt-2">
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}
