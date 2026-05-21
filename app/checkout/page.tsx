"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items = [], clearCart } = useCart() ?? {};
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(items.reduce((s, i) => s + i.quantity, 0));
  }, [items]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const resolvePrice = (price: number) => (price === 0 ? 199 : price);

  const subtotal = items.reduce(
    (sum, item) => sum + resolvePrice(item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin))
      newErrors.pin = "Enter a valid 6-digit PIN code.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      let order: any = { amount: total * 100 };
      try {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        if (res.ok) order = await res.json();
      } catch {}

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Payment gateway failed to load. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: "rzp_test_",
        amount: order.amount || total * 100,
        currency: "INR",
        name: "Crisp",
        description: "Your crispy order",
        handler: () => {
          clearCart?.();
          router.push("/");
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#a4d65e" },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      });
      rzp.open();
    } catch {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir",
    "Ladakh","Puducherry","Chandigarh",
  ];

  const fieldStyle = (fieldName: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `2px solid ${errors[fieldName] ? "#e53e3e" : "#e8e0d4"}`,
    background: "#fff",
    fontSize: "1rem",
    color: "var(--text)",
    fontFamily: "'Source Sans 3', sans-serif",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "6px",
    fontFamily: "'Source Sans 3', sans-serif",
  };

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          fontFamily: "'Source Sans 3', sans-serif",
          padding: "48px 24px",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@400;500;600;700&display=swap');
          :root { --bg:#faf7f2; --surface:#c8e6a0; --primary:#1a1a1a; --accent:#a4d65e; --text:#1a1a1a; --muted:#c9b8a3; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.5rem", color: "var(--text)", textAlign: "center" }}>
          Your bag is empty
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.125rem", textAlign: "center", maxWidth: "400px", lineHeight: 1.7 }}>
          Looks like you haven't added anything yet. Explore our menu and fill it up!
        </p>
        <button
          onClick={() => router.push("/shop")}
          style={{
            padding: "16px 48px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.02em",
            fontFamily: "'Source Sans 3', sans-serif",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 24px -8px #1a1a1a50";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@400;500;600;700&display=swap');
        :root { --bg:#faf7f2; --surface:#c8e6a0; --primary:#1a1a1a; --accent:#a4d65e; --text:#1a1a1a; --muted:#c9b8a3; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); }
        input::placeholder, textarea::placeholder { color: #c9b8a3; }
        input:focus, select:focus { outline: none; border-color: var(--accent) !important; box-shadow: 0 0 0 3px #a4d65e30; }
        select option { color: var(--text); }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 640px) { .field-row { grid-template-columns: 1fr; } }
        @media (max-width: 1024px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .summary-col { order: -1; }
        }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.4s ease-out, transform 0.4s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .nav-link-checkout { position: relative; text-decoration: none; font-weight: 600; font-size: 0.9375rem; color: var(--text); font-family: 'Source Sans 3', sans-serif; transition: color 0.2s ease; }
        .nav-link-checkout::after { content: ''; position: absolute; bottom: -2px; left: 50%; right: 50%; height: 2px; background: var(--accent); transition: left 0.18s ease, right 0.18s ease; }
        .nav-link-checkout:hover::after { left: 0; right: 0; }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navScrolled ? "var(--bg)" : "var(--bg)",
          borderBottom: navScrolled ? "1px solid #e8e0d4" : "1px solid transparent",
          boxShadow: navScrolled ? "0 2px 20px -4px #1a1a1a20" : "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.75rem",
              color: "var(--text)",
              letterSpacing: "-0.03em",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--accent)",
              }}
            />
            Crisp
          </button>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {[
              { label: "Our Menu", action: () => router.push("/shop") },
              { label: "Our Story", action: () => router.push("/") },
              { label: "Locations", action: () => router.push("/") },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="nav-link-checkout"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "4px 0",
                  position: "relative",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Cart icon */}
          <button
            onClick={() => router.push("/checkout")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="View cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "9999px",
                  background: "var(--accent)",
                  color: "var(--text)",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Source Sans 3', sans-serif",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          paddingTop: "104px",
          paddingBottom: "96px",
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>

          {/* Page header */}
          <div
            className="reveal"
            style={{ marginBottom: "48px" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 600,
                color: "var(--accent)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Almost there
            </span>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                color: "var(--text)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Complete your order
            </h1>
          </div>

          {/* Trust strip */}
          <div
            className="reveal"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              marginBottom: "48px",
              padding: "20px 28px",
              borderRadius: "16px",
              background: "var(--surface)",
              alignItems: "center",
            }}
          >
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                text: "100% Secure Checkout",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
                text: subtotal > 500 ? "Free Delivery Unlocked!" : `Free delivery over ₹500`,
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ),
                text: "Made Fresh in India",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
                text: "4.9 / 5 from 12,000+ fans",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Checkout grid */}
          <div
            className="checkout-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 420px",
              gap: "48px",
              alignItems: "start",
            }}
          >
            {/* FORM */}
            <div className="reveal">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "40px",
                  boxShadow: "0 4px 24px -8px #1a1a1a20",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.75rem",
                    color: "var(--text)",
                    marginBottom: "32px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Delivery Details
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                  {/* Full Name */}
                  <div>
                    <label style={labelStyle} htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={handleChange}
                      style={fieldStyle("name")}
                    />
                    {errors.name && (
                      <p style={{ color: "#e53e3e", fontSize: "0.8125rem", marginTop: "6px", fontWeight: 500 }}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email + Phone */}
                  <div className="field-row">
                    <div>
                      <label style={labelStyle} htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="hello@example.com"
                        value={form.email}
                        onChange={handleChange}
                        style={fieldStyle("email")}
                      />
                      {errors.email && (
                        <p style={{ color: "#e53e3e", fontSize: "0.8125rem", marginTop: "6px", fontWeight: 500 }}>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        maxLength={10}
                        style={fieldStyle("phone")}
                      />
                      {errors.phone && (
                        <p style={{ color: "#e53e3e", fontSize: "0.8125rem", marginTop: "6px", fontWeight: 500 }}>
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={labelStyle} htmlFor="address">Street Address</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Flat 4B, 12 MG Road, Koramangala"
                      value={form.address}
                      onChange={handleChange}
                      style={fieldStyle("address")}
                    />
                    {errors.address && (
                      <p style={{ color: "#e53e3e", fontSize: "0.8125rem", marginTop: "6px", fontWeight: 500 }}>
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City + State */}
                  <div className="field-row">
                    <div>
                      <label style={labelStyle} htmlFor="city">City</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Bengaluru"
                        value={form.city}
                        onChange={handleChange}
                        style={fieldStyle("city")}
                      />
                      {errors.city && (
                        <p style={{ color: "#e53e3e", fontSize: "0.8125rem", marginTop: "6px", fontWeight: 500 }}>
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="state">State</label>
                      <select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        style={{
                          ...fieldStyle("state"),
                          appearance: "none",
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23c9b8a3' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 14px center",
                          paddingRight: "44px",
                          cursor: "pointer",
                          color: form.state ? "var(--text)" : "#c9b8a3",
                        }}
                      >
                        <option value="" disabled>Select state</option>
                        {indianStates.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p style={{ color: "#e53e3e", fontSize: "0.8125rem", marginTop: "6px", fontWeight: 500 }}>
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PIN */}
                  <div style={{ maxWidth: "200px" }}>
                    <label style={labelStyle} htmlFor="pin">PIN Code</label>
                    <input
                      id="pin"
                      name="pin"
                      type="text"
                      placeholder="560 034"
                      value={form.pin}
                      onChange={handleChange}
                      maxLength={6}
                      style={fieldStyle("pin")}
                    />
                    {errors.pin && (
                      <p style={{ color: "#e53e3e", fontSize: "0.8125rem", marginTop: "6px", fontWeight: 500 }}>
                        {errors.pin}
                      </p>
                    )}
                  </div>

                  {/* Delivery estimate */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      background: "#f0f9e0",
                      border: "1px solid #c8e6a0",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a8a1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Estimated Delivery</p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "2px" }}>
                        30–45 minutes · Hot & fresh to your door
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Payment info note */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "20px 24px",
                  borderRadius: "16px",
                  background: "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <p style={{ fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.6 }}>
                  <strong>Secure Payment</strong> — You'll be redirected to Razorpay to complete your payment safely with UPI, card, or netbanking.
                </p>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="reveal summary-col" style={{ position: "sticky", top: "96px" }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "36px",
                  boxShadow: "0 4px 24px -8px #1a1a1a20",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.5rem",
                    color: "var(--text)",
                    marginBottom: "28px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Order Summary
                </h2>

                {/* Items */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginBottom: "28px",
                    maxHeight: "320px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}
                >
                  {items.map((item) => {
                    const price = resolvePrice(item.price);
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            flexShrink: 0,
                            background: "var(--surface)",
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                background: "var(--surface)",
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontWeight: 600,
                              fontSize: "0.9375rem",
                              color: "var(--text)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textTransform: "capitalize",
                            }}
                          >
                            {item.name}
                          </p>
                          <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "2px" }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            color: "var(--accent)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹{(price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#f0ebe3", marginBottom: "20px" }} />

                {/* Subtotal / Shipping / Total */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>Subtotal</span>
                    <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>Delivery</span>
                    {shipping === 0 ? (
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#5a8a1c",
                          fontSize: "0.9375rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a8a1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        FREE
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>
                        ₹{shipping.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "#fff9f0",
                        border: "1px solid #f0d8b0",
                        fontSize: "0.8125rem",
                        color: "#9a6a2a",
                        fontWeight: 500,
                      }}
                    >
                      Add ₹{(500 - subtotal).toLocaleString("en-IN")} more to unlock free delivery!
                    </div>
                  )}
                  <div style={{ height: "1px", background: "#f0ebe3" }} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "1.25rem",
                        color: "var(--text)",
                        fontWeight: 700,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "1.5rem",
                        color: "var(--text)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Place Order button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "18px 24px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    background: isSubmitting ? "#c9b8a3" : "var(--primary)",
                    color: "#fff",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    letterSpacing: "0.01em",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                    boxShadow: isSubmitting ? "none" : "0 8px 28px -8px #1a1a1a50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={e => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 12px 36px -8px #1a1a1a60";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = isSubmitting ? "none" : "0 8px 28px -8px #1a1a1a50";
                  }}
                  onMouseDown={e => { if (!isSubmitting) e.currentTarget.style.transform = "scale(0.98)"; }}
                  onMouseUp={e => { if (!isSubmitting) e.currentTarget.style.transform = "scale(1.02)"; }}
                >
                  {isSubmitting ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10">
                          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                        </path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Pay Now — ₹{total.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                {/* Secure badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "16px",
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>256-bit SSL secured · Powered by Razorpay</span>
                </div>

                {/* Payment method icons */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    marginTop: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {["UPI", "Visa", "MC", "Amex"].map((method) => (
                    <span
                      key={method}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        border: "1px solid #e8e0d4",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: "var(--muted)",
                        letterSpacing: "0.05em",
                        background: "#fff",
                      }}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Continue shopping */}
              <button
                onClick={() => router.push("/shop")}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  padding: "14px 24px",
                  borderRadius: "12px",
                  border: "2px solid #e8e0d4",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--muted)",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  transition: "border-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.transform = "scale(1.01)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#e8e0d4";
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: "var(--primary)",
          color: "#fff",
          padding: "16px 32px",
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.8125rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span style={{ color: "#c9b8a3" }}>
          © {new Date().getFullYear()} Crisp · The Fry Society
        </span>
        <div style={{ display: "flex", gap: "24px", color: "#c9b8a3" }}>
          {["Privacy Policy", "Terms of Service", "Accessibility"].map((link) => (
            <button
              key={link}
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#c9b8a3",
                fontSize: "0.8125rem",
                fontFamily: "'Source Sans 3', sans-serif",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {link}
            </button>
          ))}
        </div>
      </footer>

      {/* Scroll reveal observer */}
      <RevealObserver />
    </>
  );
}

function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => el.classList.add("is-hidden"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.remove("is-hidden");
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}