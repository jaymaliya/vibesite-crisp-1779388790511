"use client";
export const dynamic = 'force-dynamic';

import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Golden yellow fried", description: "Golden yellow fried potato sticks in a red paper carton with a yellow McDonald's \"M\" logo.", price: 149 },
  { id: 2, img: "/product-2.jpg", name: "tall, chunky double", description: "A tall, chunky double cheeseburger features a sesame seed bun, two beef patties, melted yellow cheese, lettuce, tomato.", price: 30 },
  { id: 3, img: "/product-3.jpg", name: "round pepperoni pizza", description: "A round pepperoni pizza with a golden-brown crust, stringy melted cheese, and red pepperoni, with a silver peel lifting.", price: 40 },
  { id: 4, img: "/product-4.jpg", name: "pile golden-brown crispy", description: "A pile of golden-brown crispy fried chicken tenders, one revealing white meat, with a white ramekin of red dipping sauce.", price: 50 },
];

const reviews = [
  { name: "Priya S.", date: "12 Jan 2025", stars: 5, text: "Absolutely the best fries I've had! Golden, crispy, perfectly salted. Couldn't stop at one serving. The Garlic Parmesan seasoning is a game changer." },
  { name: "Arjun M.", date: "3 Feb 2025", stars: 5, text: "Crisp delivers exactly what the name promises. The texture is unreal — that satisfying crunch every single time. Ordered three times this month already." },
  { name: "Meghna R.", date: "18 Feb 2025", stars: 4, text: "Really premium quality for the price. The Spicy Cajun had just the right kick. Would love more sauce options but overall a fantastic product." },
  { name: "Rohit K.", date: "27 Feb 2025", stars: 5, text: "Reminds me of street-side fresh-cut fries but elevated. The freshness is evident — no frozen-fry taste whatsoever. Will definitely reorder." },
];

const sauceOptions = ["Classic Ketchup", "Smoky BBQ", "Chipotle Mayo", "Peri Peri", "Truffle Aioli"];
const sizeData: Record<string, number> = { Small: 0, Medium: 40, Large: 80 };
const seasoningOptions = ["Classic Salt", "Garlic Parmesan", "Spicy Cajun"];

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Golden yellow fried";
  const basePrice = paramPrice && paramPrice > 0 ? paramPrice : 149;

  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const [activeImg, setActiveImg] = useState(displayImg);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedSauce, setSelectedSauce] = useState(sauceOptions[0]);
  const [selectedSeasonings, setSelectedSeasonings] = useState<string[]>(["Classic Salt"]);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const thumbnails = [displayImg, "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"];
  const lightboxImgs = thumbnails;

  const computedPrice = basePrice + sizeData[selectedSize];
  const totalPrice = computedPrice * quantity;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const handler = () => setNavSolid(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(20px)";
      (el as HTMLElement).style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % lightboxImgs.length);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + lightboxImgs.length) % lightboxImgs.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, lightboxImgs.length]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const toggleSeasoning = (s: string) => {
    setSelectedSeasonings((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleAddToCart = () => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: computedPrice, quantity, image: displayImg });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: computedPrice, quantity, image: displayImg });
    router.push("/checkout");
  };

  const nowHour = new Date().getHours();
  const deliveryMsg = nowHour < 14 ? "Order before 3pm for same-day delivery" : "Estimated delivery: tomorrow by 12pm";

  const navLinks = [
    { label: "Our Menu", action: () => router.push("/shop") },
    { label: "Our Story", action: () => { document.getElementById("our-story-section")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); } },
    { label: "Locations", action: () => router.push("/shop") },
    { label: "Catering", action: () => router.push("/shop") },
  ];

  return (
    <div style={{ fontFamily: "'Source Sans 3', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Global CSS variables */}
      <div style={{ display: "none" }} dangerouslySetInnerHTML={{
        __html: `<style>:root{--bg:#faf7f2;--surface:#c8e6a0;--primary:#1a1a1a;--accent:#a4d65e;--text:#1a1a1a;--muted:#c9b8a3;}</style>`
      }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navSolid ? "rgba(250,247,242,0.97)" : "transparent",
        backdropFilter: navSolid ? "blur(12px)" : "none",
        boxShadow: navSolid ? "0 2px 20px rgba(26,26,26,0.08)" : "none",
        transition: "background 200ms ease-out, box-shadow 200ms ease-out",
        borderBottom: navSolid ? "1px solid rgba(26,26,26,0.06)" : "none",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>Crisp</span>
          </button>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
            {navLinks.map((link) => (
              <button key={link.label} onClick={link.action} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)", padding: "4px 0", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget.querySelector(".underline-bar") as HTMLElement).style.width = "100%"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector(".underline-bar") as HTMLElement).style.width = "0"; }}>
                {link.label}
                <span className="underline-bar" style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", height: "2px", width: "0", background: "var(--accent)", transition: "width 180ms ease", borderRadius: "2px" }} />
              </button>
            ))}
          </div>

          {/* Right: cart */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              style2={{ transition: "transform 200ms ease" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
            {/* Hamburger mobile */}
            <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }} className="hamburger-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px" }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", cursor: "pointer" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {navLinks.map((link) => (
            <button key={link.label} onClick={link.action} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(26,26,26,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + lightboxImgs.length) % lightboxImgs.length); }}
            style={{ position: "absolute", left: "24px", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          <img src={lightboxImgs[lightboxIndex]} alt={`Gallery ${lightboxIndex + 1}`} onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "16px", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} />
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % lightboxImgs.length); }}
            style={{ position: "absolute", right: "24px", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>
          </button>
          <button onClick={() => setLightbox(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* MAIN PRODUCT SECTION */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "128px 32px 96px", display: "grid", gridTemplateColumns: "60fr 40fr", gap: "64px", alignItems: "start" }} className="product-grid">

        {/* LEFT — Image gallery */}
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Main image */}
          <div onClick={() => { setLightboxIndex(thumbnails.indexOf(activeImg)); setLightbox(true); }}
            style={{ overflow: "hidden", borderRadius: "24px", cursor: "zoom-in", background: "var(--surface)", boxShadow: "0 24px 60px -12px rgba(26,26,26,0.15)" }}>
            <img src={activeImg} alt={displayName}
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)", display: "block" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
          {/* Thumbnails */}
          <div style={{ display: "flex", gap: "12px" }}>
            {thumbnails.map((t, i) => (
              <button key={i} onClick={() => setActiveImg(t)} style={{
                padding: 0, border: `2px solid ${activeImg === t ? "var(--accent)" : "transparent"}`,
                borderRadius: "12px", overflow: "hidden", cursor: "pointer", flex: "0 0 72px", height: "72px",
                background: "var(--surface)", transition: "border-color 200ms ease, transform 200ms ease",
                transform: activeImg === t ? "scale(1.05)" : "scale(1)"
              }}>
                <img src={t} alt={`Thumbnail ${i + 1}`} style={{ width: "72px", height: "72px", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Product info */}
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "96px" }}>
          {/* Eyebrow */}
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: "var(--accent)" }}>Crisp Signature</span>

          {/* Name */}
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text)", margin: 0, textTransform: "capitalize" }}>{displayName}</h1>

          {/* Stars + review count */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: "1.125rem", color: "#f59e0b" }}>★</span>)}
            </div>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: 500 }}>4.9 · 2,847 reviews</span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent)", fontFamily: "'Source Sans 3', sans-serif" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>({selectedSize} × {quantity})</span>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Free delivery above ₹499", "Made in India", "Always Fresh"].map((b) => (
              <span key={b} style={{ fontSize: "0.75rem", fontWeight: 600, padding: "4px 12px", borderRadius: "9999px", background: "var(--surface)", color: "var(--text)", letterSpacing: "0.02em" }}>{b}</span>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", margin: 0, maxWidth: "440px" }}>{products.find(p => p.name === displayName)?.description ?? "Crisp golden fries, made fresh to order with premium potatoes and hand-blended seasonings."}</p>

          {/* Size selector */}
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "10px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Size</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {Object.keys(sizeData).map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} style={{
                  padding: "10px 24px", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  border: `2px solid ${selectedSize === size ? "var(--accent)" : "rgba(26,26,26,0.15)"}`,
                  background: selectedSize === size ? "var(--accent)" : "transparent",
                  color: selectedSize === size ? "#fff" : "var(--text)",
                  transition: "all 200ms ease",
                  transform: "scale(1)"
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                  {size} {sizeData[size] > 0 ? `+₹${sizeData[size]}` : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Sauce selector */}
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "10px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Dipping Sauce</p>
            <select value={selectedSauce} onChange={e => setSelectedSauce(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid rgba(26,26,26,0.12)", background: "var(--bg)", fontSize: "0.9375rem", fontFamily: "'Source Sans 3', sans-serif", color: "var(--text)", cursor: "pointer", outline: "none", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a1a1a' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
              {sauceOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Seasoning checkboxes */}
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "10px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Seasoning</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {seasoningOptions.map((s) => (
                <label key={s} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", userSelect: "none" }}>
                  <span onClick={() => toggleSeasoning(s)} style={{
                    width: "20px", height: "20px", borderRadius: "6px", border: `2px solid ${selectedSeasonings.includes(s) ? "var(--accent)" : "rgba(26,26,26,0.2)"}`,
                    background: selectedSeasonings.includes(s) ? "var(--accent)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 200ms ease", cursor: "pointer"
                  }}>
                    {selectedSeasonings.includes(s) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </span>
                  <span style={{ fontSize: "0.9375rem", color: "var(--text)", fontWeight: 500 }}>{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity stepper */}
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "10px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Quantity</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0", border: "2px solid rgba(26,26,26,0.12)", borderRadius: "12px", overflow: "hidden", width: "fit-content" }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "44px", height: "44px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.25rem", fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.95)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
                −
              </button>
              <span style={{ minWidth: "40px", textAlign: "center", fontSize: "1rem", fontWeight: 600, color: "var(--text)", borderLeft: "2px solid rgba(26,26,26,0.12)", borderRight: "2px solid rgba(26,26,26,0.12)", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} style={{ width: "44px", height: "44px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.25rem", fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.95)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
                +
              </button>
            </div>
          </div>

          {/* Delivery banner */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "12px", background: "var(--surface)", border: "1.5px solid rgba(164,214,94,0.4)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{deliveryMsg}</span>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button onClick={handleAddToCart} style={{
              width: "100%", padding: "16px 32px", borderRadius: "12px", border: "none", cursor: "pointer",
              background: addedMsg ? "#16a34a" : "var(--primary)", color: "#fff", fontSize: "1rem", fontWeight: 700,
              letterSpacing: "0.02em", transition: "background 200ms ease, transform 150ms ease",
              boxShadow: "0 8px 24px -8px rgba(26,26,26,0.4)"
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
              {addedMsg ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <button onClick={handleBuyNow} style={{
              width: "100%", padding: "16px 32px", borderRadius: "12px", border: "2px solid var(--accent)", cursor: "pointer",
              background: "var(--accent)", color: "var(--text)", fontSize: "1rem", fontWeight: 700,
              letterSpacing: "0.02em", transition: "transform 150ms ease, box-shadow 200ms ease",
              boxShadow: "0 8px 24px -8px rgba(164,214,94,0.5)"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px rgba(164,214,94,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(164,214,94,0.5)"; }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
              Buy Now — ₹{totalPrice.toLocaleString("en-IN")}
            </button>
          </div>

          {/* Micro-trust row */}
          <div style={{ display: "flex", gap: "24px", paddingTop: "8px", flexWrap: "wrap" }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Secure Checkout" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, text: "Easy Returns" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: "30 min prep" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {item.icon}
                <span style={{ fontSize: "0.8125rem", color: "var(--muted)", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS TABS */}
      <section id="our-story-section" className="reveal" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px 96px" }}>
        <div style={{ borderTop: "1.5px solid rgba(26,26,26,0.08)", paddingTop: "48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "48px" }} className="details-grid">
          {[
            { title: "Ingredients", body: "Hand-selected Russet potatoes, refined sunflower oil, Himalayan pink salt. Nothing artificial, nothing you can't pronounce. Every batch cooked to a precise 175°C for uniform golden perfection." },
            { title: "Nutrition", body: "Serving size: 115g (Medium). Calories: 340 kcal · Fat: 16g · Carbs: 44g · Protein: 4g · Sodium: 320mg. Available in Small (230 kcal) and Large (440 kcal)." },
            { title: "How it's made", body: "Potatoes are hand-cut each morning, blanched in clean water, and twice-fried for that unmistakable crunch. Zero preservatives. Served immediately from the fryer to your carton." },
          ].map((tab) => (
            <div key={tab.title}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.375rem", fontWeight: 700, marginBottom: "12px", color: "var(--text)" }}>{tab.title}</h3>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--muted)" }}>{tab.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reveal" style={{ background: "var(--surface)", padding: "96px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: "var(--primary)", opacity: 0.6 }}>Customer Reviews</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3vw, 2.75rem)", fontWeight: 700, marginTop: "8px", letterSpacing: "-0.02em", color: "var(--text)" }}>What people are saying</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "2px" }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: "1.25rem", color: "#f59e0b" }}>★</span>)}</div>
              <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>4.9</span>
              <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>from 2,847 reviews</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {reviews.map((r, i) => (
              <div key={i} className="reveal" style={{
                background: "var(--bg)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px",
                boxShadow: "0 4px 20px rgba(26,26,26,0.06)", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms ease",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(26,26,26,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(26,26,26,0.06)"; }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {Array.from({ length: r.stars }).map((_, s) => <span key={s} style={{ fontSize: "0.875rem", color: "#f59e0b" }}>★</span>)}
                </div>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text)", margin: 0 }}>{r.text}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid rgba(26,26,26,0.06)" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{r.name}</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="reveal" style={{ maxWidth: "1280px", margin: "0 auto", padding: "96px 32px" }}>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: "var(--accent)" }}>You might also like</span>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)", fontWeight: 700, marginTop: "8px", marginBottom: "40px", letterSpacing: "-0.02em", color: "var(--text)" }}>More from Crisp</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
          {products.filter(p => p.img !== displayImg).map((p) => {
            const pPrice = p.price > 0 ? p.price : 149;
            return (
              <article key={p.id} className="reveal" onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${pPrice}&img=${encodeURIComponent(p.img)}`)}
                style={{ cursor: "pointer", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                <div style={{ overflow: "hidden", borderRadius: "16px", background: "var(--surface)", marginBottom: "16px", boxShadow: "0 4px 20px rgba(26,26,26,0.08)", transition: "box-shadow 300ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(26,26,26,0.14)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,26,26,0.08)")}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)", display: "block" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
                <h3 style={{ fontWeight: 600, fontSize: "1.0625rem", color: "var(--text)", textTransform: "capitalize", marginBottom: "4px" }}>{p.name}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "8px", lineHeight: 1.5 }}>{p.description.slice(0, 60)}…</p>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>₹{pPrice.toLocaleString("en-IN")}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--primary)", color: "#faf7f2", padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "64px" }}>
            {/* Col 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 700 }}>Crisp</span>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(250,247,242,0.6)", maxWidth: "240px" }}>Golden, crunchy, endlessly simple. Honest fast food, elevated through restraint and craft.</p>
              <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(250,247,242,0.6)", transition: "color 200ms ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(250,247,242,0.6)")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(250,247,242,0.6)", transition: "color 200ms ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(250,247,242,0.6)")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                {/* Twitter */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(250,247,242,0.6)", transition: "color 200ms ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(250,247,242,0.6)")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
              </div>
            </div>
            {/* Col 2 — Quick Links */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--accent)", marginBottom: "20px" }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Menu", "About Us", "Careers", "Contact"].map(l => (
                  <button key={l} onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9375rem", color: "rgba(250,247,242,0.7)", textAlign: "left", padding: 0, transition: "color 200ms ease" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#faf7f2")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(250,247,242,0.7)")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Col 3 — Legal */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--accent)", marginBottom: "20px" }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Privacy Policy", "Terms of Service", "Accessibility"].map(l => (
                  <button key={l} onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9375rem", color: "rgba(250,247,242,0.7)", textAlign: "left", padding: 0, transition: "color 200ms ease" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#faf7f2")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(250,247,242,0.7)")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Col 4 — Newsletter */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--accent)", marginBottom: "20px" }}>Join the Fry Fan Club</h4>
              <p style={{ fontSize: "0.9375rem", color: "rgba(250,247,242,0.6)", marginBottom: "16px", lineHeight: 1.6 }}>Weekly drops, secret menu items, and members-only offers.</p>
              {subscribed ? (
                <p style={{ fontSize: "0.9375rem", color: "var(--accent)", fontWeight: 600 }}>✓ You're in! Welcome to the club.</p>
              ) : (
                <div style={{ display: "flex", gap: "0", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(250,247,242,0.15)" }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    style={{ flex: 1, padding: "12px 16px", background: "rgba(250,247,242,0.08)", border: "none", color: "#faf7f2", fontSize: "0.875rem", fontFamily: "'Source Sans 3', sans-serif", outline: "none" }} />
                  <button onClick={() => { if (email) setSubscribed(true); }} style={{ padding: "12px 20px", background: "var(--accent)", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", whiteSpace: "nowrap", transition: "opacity 200ms ease" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid rgba(250,247,242,0.1)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <span style={{ fontSize: "0.875rem", color: "rgba(250,247,242,0.4)" }}>© {new Date().getFullYear()} The Fry Society. All rights reserved.</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {["Visa", "MC", "Amex", "UPI"].map(pm => (
                <span key={pm} style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "4px 8px", borderRadius: "4px", background: "rgba(250,247,242,0.1)", color: "rgba(250,247,242,0.5)", letterSpacing: "0.04em" }}>{pm}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, background: "rgba(250,247,242,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(26,26,26,0.08)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }} className="mobile-bottom-bar">
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>{selectedSize} · {quantity} item{quantity > 1 ? "s" : ""}</p>
          <p style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--accent)" }}>₹{totalPrice.toLocaleString("en-IN")}</p>
        </div>
        <button onClick={handleAddToCart} style={{
          flex: 2, padding: "14px 24px", borderRadius: "12px", border: "none", cursor: "pointer",
          background: addedMsg ? "#16a34a" : "var(--primary)", color: "#fff", fontSize: "0.9375rem", fontWeight: 700,
          transition: "background 200ms ease"
        }}>
          {addedMsg ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>

      {/* Responsive styles via injected style block avoided — using media queries via inline JS approach */}
      <style>{`
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: 1fr !important; padding-top: 100px !important; }
          .details-grid { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-bottom-bar { display: none !important; }
        }
        *:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}