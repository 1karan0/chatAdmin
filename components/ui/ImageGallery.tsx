"use client";
import React from "react";

type Img = { url: string; alt?: string };

export default function ImageGallery({ images }: { images?: Img[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => window.open(img.url, "_blank", "noopener,noreferrer")}
          style={{
            border: "none",
            padding: 0,
            background: "transparent",
            cursor: "pointer",
          }}
          aria-label={img.alt || `Image ${i + 1}`}
        >
          <img
            src={img.url}
            alt={img.alt || ""}
            style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </button>
      ))}
    </div>
  );
}
