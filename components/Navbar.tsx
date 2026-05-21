"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevTotalRef = useRef(totalItems);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (prevTotalRef.current !== totalItems) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 400);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigateTo = (path: string) => {
    setMobileOpen(false);
    router.push(path);
  };

  const navLinkBase: React.CSSProperties = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 500,
    fontSize: "0.9375rem",
    color: "#1a1a1a",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "8px",
    transition:
      "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
    letterSpacing: "0.01em",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#faf7f2",
          boxShadow: scrolled
            ? "0 2px 16px 0 rgba(26,26,26,0.10)"
            : "0 1px 0 0 rgba(26,26,26,0.06)",
          transition:
            "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <button
            onClick={() => navigateTo("/")}
            aria-label="Crisp — go to homepage"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 700,
                fontSize: "1.75rem",
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

          {/* Desktop Center Nav */}
          <div
            className="hidden md:flex"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <button
              onClick={() => navigateTo("/shop")}
              style={navLinkBase}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "#c8e6a0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              Our Menu
            </button>

            <button
              onClick={() => scrollToSection("about")}
              style={navLinkBase}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "#c8e6a0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
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
              onClick={() => scrollToSection("locations")}
              style={navLinkBase}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "#c8e6a0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
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
              onClick={() => scrollToSection("catering")}
              style={navLinkBase}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "#c8e6a0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
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
          </div>

          {/* Desktop Right — Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={() => navigateTo("/checkout")}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition:
                  "background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#c8e6a0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9999px",
                    backgroundColor: "#a4d65e",
                    color: "#1a1a1a",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    fontFamily: "'Source Sans 3', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    lineHeight: 1,
                    transform: badgePulse ? "scale(1.3)" : "scale(1)",
                    transition:
                      "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: "0 1px 4px rgba(26,26,26,0.25)",
                  }}
                  aria-hidden="true"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "center",
                justifyContent: "center",
                transition:
                  "background 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#c8e6a0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {mobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Overlay Menu */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 49,
          backgroundColor: "#faf7f2",
          display: "flex",
          flexDirection: "column",
          padding: "96px 32px 48px",
          gap: "8px",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition:
            "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
        }}
      >
        <button
          onClick={() => navigateTo("/shop")}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 500,
            fontSize: "2rem",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "16px 0",
            borderBottom: "1px solid rgba(26,26,26,0.08)",
            letterSpacing: "-0.01em",
            transition:
              "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
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
          Our Menu
        </button>

        <button
          onClick={() => scrollToSection("about")}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 500,
            fontSize: "2rem",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "16px 0",
            borderBottom: "1px solid rgba(26,26,26,0.08)",
            letterSpacing: "-0.01em",
            transition:
              "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
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
          onClick={() => scrollToSection("locations")}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 500,
            fontSize: "2rem",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "16px 0",
            borderBottom: "1px solid rgba(26,26,26,0.08)",
            letterSpacing: "-0.01em",
            transition:
              "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
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
          onClick={() => scrollToSection("catering")}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 500,
            fontSize: "2rem",
            color: "#1a1a1a",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: "16px 0",
            borderBottom: "1px solid rgba(26,26,26,0.08)",
            letterSpacing: "-0.01em",
            transition:
              "color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
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

        <div style={{ marginTop: "auto", paddingTop: "32px" }}>
          <button
            onClick={() => navigateTo("/checkout")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 500,
              fontSize: "1rem",
              color: "#1a1a1a",
              background: "#c8e6a0",
              border: "none",
              cursor: "pointer",
              padding: "16px 24px",
              borderRadius: "12px",
              width: "100%",
              justifyContent: "center",
              transition:
                "background 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.15s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#a4d65e";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#c8e6a0";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "2px solid #a4d65e";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            View Cart
            {totalItems > 0 && (
              <span
                style={{
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "9999px",
                  backgroundColor: "#1a1a1a",
                  color: "#faf7f2",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
                aria-hidden="true"
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}