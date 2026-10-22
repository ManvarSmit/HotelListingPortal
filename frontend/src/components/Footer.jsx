import React from "react";

export default function Footer() {
  return (
    <footer className="footer mt-auto py-3 text-center">
      <div className="container">
        <div className="d-flex justify-content-center gap-3 mb-2 fs-5 text-secondary">
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-linkedin"></i>
        </div>
        <p className="text-secondary small mb-0">
          &copy; {new Date().getFullYear()} Wanderlust Private Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
