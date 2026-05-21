"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 500,
    fontSize: "0.9375rem",
    color: "#1a1a1a",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    textAlign: "left",
    textDecoration: "none",
    display: "block",
    transition:
      "color 0.2s cubic-bezier(0.4,0,0.2,1)",
    lineHeight: 1.7,
  };

  return (
    <footer
      style={{
        backgroundColor: "#faf7f2",
        borderTop: "1px solid rgba(26,26,26,0.08)",
        paddingTop: "96px",
        paddingBottom: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            paddingBottom: "64px",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <button
              onClick={() => router.push("/")}
              aria-label="Crisp — go to homepage"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginBottom: "16px",
                display: "inline-block",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 700,
                  fontSize: "1.875rem",
                  color: "#1a1a1a",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                Crisp
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#a4d65e",
                    marginLeft: "3px",
                    marginBottom: "12px",
                    verticalAlign: "bottom",
                  }}
                />
              </span>
            </button>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 400,
                fontSize: "0.9375rem",
                color: "#c9b8a3",
                lineHeight: 1.7,
                maxWidth: "240px",
                margin: "0 0 24px",
              }}
            >
              Golden, crunchy, endlessly simple. India's favourite potato stick, made with love.
            </p>
            {/* Trust pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  color: "#4a4e1e",
                  backgroundColor: "#c8e6a0",
                  borderRadius: "9999px",
                  padding: "4px 12px",
                  lineHeight: 1.5,
                  letterSpacing: "0.02em",
                }}
              >
                Made in India
              </span>
              <span
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  color: "#4a4e1e",
                  backgroundColor: "#c8e6a0",
                  borderRadius: "9999px",
                  padding: "4px 12px",
                  lineHeight: 1.5,
                  letterSpacing: "0.02em",
                }}
              >
                Free delivery over ₹299
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 600,
                fontSize: "1.0625rem",
                color: "#1a1a1a",
                marginBottom: "20px",
                letterSpacing: "-0.01em",
              }}
            >
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <button
                onClick={() => router.push("/")}
                style={linkStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#4a4e1e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Home
              </button>
              <button
                onClick={() => router.push("/shop")}
                style={linkStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#4a4e1e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Shop
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("about");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={linkStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#4a4e1e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Our Story
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("locations");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={linkStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#4a4e1e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Locations
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("catering");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={linkStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#4a4e1e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                  (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = "none";
                }}
              >
                Catering
              </button>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 600,
                fontSize: "1.0625rem",
                color: "#1a1a1a",
                marginBottom: "12px",
                letterSpacing: "-0.01em",
              }}
            >
              Stay in the loop
            </h3>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 400,
                fontSize: "0.875rem",
                color: "#c9b8a3",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              New flavours, offers, and the crunchiest news — straight to your inbox.
            </p>
            {subscribed ? (
              <div
                style={{
                  backgroundColor: "#c8e6a0",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a4e1e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: "#4a4e1e",
                  }}
                >
                  You're subscribed — thanks!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label
                    htmlFor="footer-newsletter-email"
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "#1a1a1a",
                    }}
                  >
                    Email address
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="you@example.com"
                    aria-describedby={emailError ? "footer-email-error" : undefined}
                    aria-invalid={!!emailError}
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.9375rem",
                      fontWeight: 400,
                      color: "#1a1a1a",
                      backgroundColor: "#fff",
                      border: emailError
                        ? "1.5px solid #8b3a2f"
                        : "1.5px solid rgba(26,26,26,0.16)",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      outline: "none",
                      width: "100%",
                      boxSizing: "border-box",
                      transition:
                        "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = "#a4d65e";
                    }}
                    onBlur={(e) => {
                      if (!emailError) {
                        (e.target as HTMLInputElement).style.borderColor =
                          "rgba(26,26,26,0.16)";
                      }
                    }}
                  />
                  {emailError && (
                    <p
                      id="footer-email-error"
                      role="alert"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.8125rem",
                        color: "#8b3a2f",
                        margin: "0",
                        lineHeight: 1.5,
                      }}
                    >
                      {emailError}
                    </p>
                  )}
                  <button
                    type="submit"
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "#1a1a1a",
                      backgroundColor: "#a4d65e",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 24px",
                      cursor: "pointer",
                      marginTop: "4px",
                      transition:
                        "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.15s cubic-bezier(0.4,0,0.2,1)",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#c8e6a0";
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#a4d65e";
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #1a1a1a";
                      (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline = "none";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid rgba(26,26,26,0.08)",
            paddingTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Copyright */}
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 400,
              fontSize: "0.875rem",
              color: "#c9b8a3",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            © {new Date().getFullYear()} Crisp. All rights reserved. Powered by Razorpay.
          </p>

          {/* Social Icons */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
            aria-label="Social media links"
          >
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Crisp on Instagram"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "#1a1a1a",
                transition:
                  "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#c8e6a0";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #a4d65e";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="#1a1a1a" stroke="none" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Crisp on Twitter"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "#1a1a1a",
                transition:
                  "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#c8e6a0";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #a4d65e";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Crisp on WhatsApp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "#1a1a1a",
                transition:
                  "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#c8e6a0";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid #a4d65e";
                (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}