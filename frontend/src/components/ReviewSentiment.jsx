import React, { useEffect, useState } from "react";

export default function ReviewSentiment({ listingId, reviewCount }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // Only fetch if there are reviews
    if (!listingId || reviewCount === 0) return;
    fetchSummary();
  }, [listingId, reviewCount]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/review-summary/${listingId}`, {
        credentials: "include",
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("AI review summary error:", err);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  // Don't render if no reviews
  if (reviewCount === 0) return null;

  // Star rating display
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span style={{ color: "#f59e0b", fontSize: "14px", letterSpacing: "1px" }}>
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(empty)}
      </span>
    );
  };

  // Sentiment badge color based on avg rating
  const getSentimentBadge = (rating) => {
    if (rating >= 4.5) return { label: "Exceptional", color: "#10b981", bg: "#d1fae5" };
    if (rating >= 4.0) return { label: "Very Good", color: "#3b82f6", bg: "#dbeafe" };
    if (rating >= 3.0) return { label: "Average", color: "#f59e0b", bg: "#fef3c7" };
    return { label: "Mixed", color: "#ef4444", bg: "#fee2e2" };
  };

  return (
    <div
      id="ai-review-summary"
      style={{
        background: "linear-gradient(135deg, #fff9f0, #fff5ee)",
        border: "1px solid #fde8d8",
        borderRadius: "14px",
        padding: "16px 20px",
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* AI Badge */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "14px",
          background: "linear-gradient(135deg, #e53935, #ff7043)",
          color: "white",
          fontSize: "10px",
          fontWeight: "700",
          padding: "3px 8px",
          borderRadius: "20px",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        ✨ AI Summary
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ fontSize: "20px" }}>🤖</span>
        <span
          style={{
            fontWeight: "700",
            fontSize: "14px",
            color: "#1f2937",
          }}
        >
          AI Guest Insights
        </span>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#9ca3af", fontSize: "13px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid #e53935",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
            }}
          />
          Analyzing {reviewCount} guest review{reviewCount > 1 ? "s" : ""}...
        </div>
      ) : data && data.summary ? (
        <>
          {/* Rating Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontWeight: "800", fontSize: "26px", color: "#1f2937" }}>
                {data.avgRating}
              </span>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>/5</span>
            </div>
            {renderStars(data.avgRating)}
            {(() => {
              const badge = getSentimentBadge(data.avgRating);
              return (
                <span
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "3px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {badge.label}
                </span>
              );
            })()}
            <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "auto" }}>
              {data.totalReviews} review{data.totalReviews > 1 ? "s" : ""}
            </span>
          </div>

          {/* AI Summary Text */}
          <p
            style={{
              margin: 0,
              fontSize: "13.5px",
              color: "#374151",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            "{data.summary}"
          </p>
        </>
      ) : fetched ? (
        <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
          Summary unavailable right now.
        </p>
      ) : null}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
