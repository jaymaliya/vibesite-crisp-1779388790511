"use client";
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../components/CartContext"

const products = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Golden yellow fried",
    description: "Golden yellow fried potato sticks in a red paper carton with a yellow McDonald's \"M\" logo.",
    price: 199,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "tall, chunky double",
    description: "A tall, chunky double cheeseburger features a sesame seed bun, two beef patties, melted yellow cheese, lettuce, tomato.",
    price: 30,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "round pepperoni pizza",
    description: "A round pepperoni pizza with a golden-brown crust, stringy melted cheese, and red pepperoni, with a silver peel lifting.",
    price: 40,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "pile golden-brown crispy",
    description: "A pile of golden-brown crispy fried chicken tenders, one revealing white meat, with a white ramekin of red dipping sauce.",
    price: 50,
  },
]

export default function HomePage() {
  const router = useRouter()
  const { addItem, items } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [addedId, setAddedId] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [searchLocation, setSearchLocation] = useState("")
  const [hoveredSauce, setHoveredSauce] = useState<string | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img })
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const scrollGallery = (dir: "left" | "right") => {
    if (!galleryRef.current) return
    galleryRef.current.scrollBy({ left: dir === "right" ? 380 : -380, behavior: "smooth" })
  }

  const sauces = [
    { key: "chipotle", label: "Smoky Chipotle", desc: "A slow-burn heat with deep smokiness and a hint of tomato sweetness." },
    { key: "truffle", label: "Truffle Aioli", desc: "Earthy black truffle with a silky garlic emulsion. Pure luxury." },
    { key: "sriracha", label: "Sriracha Honey", desc: "The perfect sweet-heat balance. Goes with everything." },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #faf7f2;
          --surface: #c8e6a0;
          --primary: #1a1a1a;
          --accent: #a4d65e;
          --text: #1a1a1a;
          --muted: #c9b8a3;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; overflow-x: hidden; }
        h1, h2, h3 { font-family: 'DM Serif Display', serif; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
        .revealed { opacity: 1; transform: translateY(0); }
        .reveal:nth-child(2) { transition-delay: 60ms; }
        .reveal:nth-child(3) { transition-delay: 120ms; }
        .reveal:nth-child(4) { transition-delay: 180ms; }
        .gallery-scroll { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 16px; }
        .gallery-scroll::-webkit-scrollbar { display: none; }
        .gallery-card { scroll-snap-align: start; flex: 0 0 calc(33.333% - 16px); min-width: 280px; }
        @media (max-width: 768px) { .gallery-card { flex: 0 0 80vw; } }
        *:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }
        input:focus { outline: 2px solid var(--accent); }
        .nav-link { position: relative; font-weight: 600; font-size: 0.9375rem; cursor: pointer; background: none; border: none; padding: 0; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 50%; right: 50%; height: 2px; background: var(--accent); transition: left 0.18s ease, right 0.18s ease; }
        .nav-link:hover::after { left: 0; right: 0; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(250,247,242,0.97)" : "transparent",
        boxShadow: scrolled ? "0 1px 24px rgba(26,26,26,0.08)" : "none",
        transition: "background 0.2s ease-out, box-shadow 0.2s ease-out",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, color: scrolled ? "var(--text)" : "#fff" }}
            className="hamburger-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", color: scrolled ? "var(--text)" : "#fff" }}
          >
            Crisp
          </button>

          {/* Desktop nav links */}
          <div style={{ display: "flex", gap: 40, alignItems: "center" }} className="desktop-nav">
            {[
              { label: "Our Menu", action: () => router.push("/shop") },
              { label: "Our Story", action: () => document.getElementById("golden-standard")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Locations", action: () => document.getElementById("locate")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Catering", action: () => setShowSubscribeModal(true) },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="nav-link"
                style={{ color: scrolled ? "var(--text)" : "#fff" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Cart */}
          <button
            onClick={() => router.push("/checkout")}
            aria-label="View cart"
            style={{ background: "none", border: "none", cursor: "pointer", position: "relative", color: scrolled ? "var(--text)" : "#fff", padding: 8 }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2, background: "var(--accent)", color: "var(--text)",
                borderRadius: 9999, fontSize: "0.625rem", fontWeight: 700, width: 16, height: 16,
                display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200, background: "var(--primary)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40,
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", color: "#fff" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {[
            { label: "Our Menu", action: () => { setMenuOpen(false); router.push("/shop") } },
            { label: "Our Story", action: () => { setMenuOpen(false); setTimeout(() => document.getElementById("golden-standard")?.scrollIntoView({ behavior: "smooth" }), 300) } },
            { label: "Locations", action: () => { setMenuOpen(false); setTimeout(() => document.getElementById("locate")?.scrollIntoView({ behavior: "smooth" }), 300) } },
            { label: "Catering", action: () => { setMenuOpen(false); setShowSubscribeModal(true) } },
          ].map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Serif Display', serif", fontSize: "2.5rem", color: "#fff", fontWeight: 500 }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <img
          src="/product-1.jpg"
          alt="Golden crispy fries in a branded red carton with steam rising"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* warm gradient scrim */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(26,26,26,0.35) 0%, rgba(26,26,26,0.18) 40%, rgba(26,26,26,0.72) 100%)",
        }} />

        {/* Brand name top-left */}
        <div style={{ position: "absolute", top: 96, left: 48 }}>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 400,
          }}>Est. 2024 · Mumbai</span>
        </div>

        {/* Centered content */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px",
        }}>
          <span style={{
            fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em",
            fontWeight: 600, color: "var(--accent)", marginBottom: 16,
            fontFamily: "'Source Sans 3', sans-serif",
          }}>Golden. Crunchy. Endlessly Simple.</span>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: "#fff",
            maxWidth: 800,
            marginBottom: 32,
            textShadow: "0 4px 32px rgba(26,26,26,0.35)",
          }}>
            The Perfect<br />Fry, Every Time.
          </h1>

          <button
            onClick={() => router.push("/shop")}
            style={{
              background: "var(--accent)", color: "var(--text)", border: "none", cursor: "pointer",
              padding: "18px 52px", borderRadius: 12, fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 700, fontSize: "1.0625rem", letterSpacing: "0.01em",
              boxShadow: "0 16px 48px -12px rgba(164,214,94,0.55)",
              transition: "transform 0.18s cubic-bezier(0.4,0,0.2,1), box-shadow 0.18s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 20px 56px -12px rgba(164,214,94,0.7)" }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 16px 48px -12px rgba(164,214,94,0.55)" }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Order Now
          </button>

          <p style={{ marginTop: 16, color: "rgba(255,255,255,0.65)", fontSize: "0.9375rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 400, letterSpacing: "0.02em" }}>
            Always fresh, always crispy.
          </p>

          {/* Trust signals */}
          <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "★", text: "4.9 / 5 Rating" },
              { icon: null, text: "28,000+ Fry Fans" },
              { icon: null, text: "Made in India" },
              { icon: null, text: "Free delivery over ₹499" },
            ].map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "rgba(255,255,255,0.8)", fontSize: "0.875rem",
                fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500,
              }}>
                {t.icon && <span style={{ color: "var(--accent)" }}>{t.icon}</span>}
                {!t.icon && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />}
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)", fontFamily: "'Source Sans 3', sans-serif" }}>Scroll</span>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
        </div>
      </section>

      {/* OUR GOLDEN STANDARD */}
      <section id="golden-standard" style={{ background: "var(--bg)", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className="reveal" style={{ overflow: "hidden", borderRadius: 24, boxShadow: "0 40px 80px -20px rgba(26,26,26,0.18)" }}>
            <img
              src="/product-1.jpg"
              alt="Hand-cut potatoes being prepared for frying"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Source Sans 3', sans-serif" }}>
              Our Golden Standard
            </span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem, 4vw, 3.75rem)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.08, color: "var(--text)" }}>
              Farm-fresh potatoes,<br />precision-fried.
            </h2>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: 480, fontFamily: "'Source Sans 3', sans-serif" }}>
              We source hand-picked potatoes from small farms in Maharashtra and Uttar Pradesh — varieties selected specifically for their starch-to-moisture ratio. Every batch is sliced to within 0.5mm of our spec, blanched at exactly 82°C, then fried in refined sunflower oil at 175°C for a golden crust you'll hear before you taste.
            </p>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: 480, fontFamily: "'Source Sans 3', sans-serif" }}>
              No shortcuts. No freezer bags. No compromises. Just the honest, repeatable pleasure of a perfect fry.
            </p>

            {/* Animated SVG potato cross-section */}
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, opacity: 0.85 }}>
                <circle cx="32" cy="32" r="28" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
                <circle cx="32" cy="32" r="18" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
                <circle cx="32" cy="32" r="8" fill="var(--accent)" opacity="0.4" />
                <circle cx="20" cy="24" r="3" fill="var(--accent)" opacity="0.6" />
                <circle cx="44" cy="28" r="2.5" fill="var(--accent)" opacity="0.5" />
                <circle cx="26" cy="44" r="3.5" fill="var(--accent)" opacity="0.45" />
                <circle cx="40" cy="42" r="2" fill="var(--accent)" opacity="0.55" />
              </svg>
              <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.6 }}>
                Every potato inspected for optimal starch content before it reaches your carton.
              </span>
            </div>

            <button
              onClick={() => router.push("/shop")}
              style={{
                alignSelf: "flex-start", marginTop: 8,
                padding: "14px 36px", borderRadius: 12, border: "2px solid var(--primary)",
                background: "transparent", color: "var(--text)", cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.9375rem",
                transition: "background 0.2s ease, color 0.2s ease, transform 0.18s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.02)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.transform = "scale(1)" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Explore Our Menu
            </button>
          </div>
        </div>
      </section>

      {/* THE FRY VARIETIES */}
      <section style={{ background: "var(--surface)", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div className="reveal" style={{ marginBottom: 56, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", opacity: 0.55, fontFamily: "'Source Sans 3', sans-serif" }}>
                The Range
              </span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--text)", marginTop: 8, lineHeight: 1.1 }}>
                The Fry Varieties
              </h2>
            </div>
            <button onClick={() => router.push("/shop")} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
              fontSize: "0.9375rem", color: "var(--text)", display: "flex", alignItems: "center", gap: 6,
              textDecoration: "underline", textUnderlineOffset: 3,
            }}>
              View all varieties
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Gallery with arrows */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => scrollGallery("left")}
              style={{
                position: "absolute", left: -24, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "var(--bg)", border: "none", cursor: "pointer",
                width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(26,26,26,0.14)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div ref={galleryRef} className="gallery-scroll">
              {products.map((p, i) => (
                <article
                  key={p.id}
                  className="gallery-card reveal"
                  style={{
                    background: "var(--bg)", borderRadius: 20,
                    overflow: "hidden", cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(26,26,26,0.08)",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(26,26,26,0.14)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,26,26,0.08)" }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.6s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "24px" }}>
                    <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600 }}>
                      {i === 0 ? "Classic Cut" : i === 1 ? "Double Stack" : i === 2 ? "Waffle Style" : "Crispy Tenders"}
                    </span>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.375rem", fontWeight: 500, color: "var(--text)", marginTop: 6, marginBottom: 8, lineHeight: 1.2 }}>
                      {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                    </h3>
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", marginBottom: 20 }}>
                      {p.description.length > 80 ? p.description.slice(0, 80) + "…" : p.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.125rem", fontFamily: "'Source Sans 3', sans-serif" }}>
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(p) }}
                        style={{
                          background: addedId === p.id ? "var(--primary)" : "var(--accent)",
                          color: addedId === p.id ? "#fff" : "var(--text)",
                          border: "none", cursor: "pointer",
                          padding: "8px 20px", borderRadius: 9999,
                          fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                          transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
                        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                      >
                        {addedId === p.id ? "✓ Added" : "Quick Add"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              onClick={() => scrollGallery("right")}
              style={{
                position: "absolute", right: -24, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "var(--bg)", border: "none", cursor: "pointer",
                width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(26,26,26,0.14)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* PERFECT PAIRINGS */}
      <section style={{ background: "var(--bg)", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: 56 }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Source Sans 3', sans-serif" }}>
              The Sauce Lab
            </span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--text)", marginTop: 8, lineHeight: 1.1, maxWidth: 560 }}>
              Perfect Pairings
            </h2>
          </div>

          {/* Asymmetric grid */}
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, minHeight: 560 }}>
            {/* Large image left */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, boxShadow: "0 24px 64px rgba(26,26,26,0.12)" }}>
              <img
                src="/product-1.jpg"
                alt="Crispy fries with a selection of artisanal dipping sauces arranged artfully"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              {/* Sauce hover targets */}
              <div style={{ position: "absolute", inset: 0, padding: 32, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "20px 24px" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Hover a sauce →</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {sauces.map((s) => (
                      <button
                        key={s.key}
                        onMouseEnter={() => setHoveredSauce(s.key)}
                        onMouseLeave={() => setHoveredSauce(null)}
                        style={{
                          padding: "8px 16px", borderRadius: 9999,
                          border: "none", cursor: "pointer",
                          fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                          background: hoveredSauce === s.key ? "var(--accent)" : "var(--surface)",
                          color: "var(--text)",
                          transition: "background 0.2s ease, transform 0.15s ease",
                          transform: hoveredSauce === s.key ? "scale(1.04)" : "scale(1)",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right stacked blocks */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {sauces.map((s) => (
                <div
                  key={s.key}
                  style={{
                    flex: 1, background: hoveredSauce === s.key ? "var(--surface)" : "var(--bg)",
                    border: hoveredSauce === s.key ? "2px solid var(--accent)" : "2px solid rgba(164,214,94,0.25)",
                    borderRadius: 20, padding: 28,
                    transition: "background 0.25s ease, border-color 0.25s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                    transform: hoveredSauce === s.key ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: hoveredSauce === s.key ? "0 12px 32px rgba(164,214,94,0.2)" : "none",
                  }}
                >
                  <span style={{
                    display: "inline-block", marginBottom: 10, fontSize: "0.6875rem",
                    textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600,
                    color: hoveredSauce === s.key ? "var(--text)" : "var(--muted)",
                    fontFamily: "'Source Sans 3', sans-serif",
                    transition: "color 0.2s ease",
                  }}>
                    Sauce Spotlight
                  </span>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", fontWeight: 500, color: "var(--text)", marginBottom: 10, lineHeight: 1.2 }}>
                    {s.label}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
                    {s.desc}
                  </p>
                  {hoveredSauce === s.key && (
                    <button
                      onClick={() => router.push("/shop")}
                      style={{
                        marginTop: 16, background: "var(--accent)", border: "none", cursor: "pointer",
                        padding: "8px 20px", borderRadius: 9999,
                        fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                        color: "var(--text)",
                      }}
                    >
                      Order with this sauce →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATE YOUR CRAVING */}
      <section id="locate" style={{ background: "var(--primary)", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: 56, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Source Sans 3', sans-serif" }}>
              Find Us
            </span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1 }}>
              Locate Your Craving
            </h2>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: 480, fontFamily: "'Source Sans 3', sans-serif" }}>
              40+ locations across Mumbai, Pune, Bengaluru and Delhi NCR — or get it delivered in under 30 minutes.
            </p>
          </div>

          {/* Search bar */}
          <div className="reveal" style={{ maxWidth: 600, margin: "0 auto 40px", position: "relative" }}>
            <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 32px rgba(26,26,26,0.24)" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "0 16px", color: "var(--muted)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter your area, city or PIN code…"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{
                  flex: 1, border: "none", outline: "none", padding: "18px 8px",
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "var(--text)",
                  background: "transparent",
                }}
              />
              <button
                style={{
                  background: "var(--accent)", border: "none", cursor: "pointer",
                  padding: "0 28px", fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Find
              </button>
            </div>
          </div>

          {/* Mock map */}
          <div className="reveal" style={{ borderRadius: 24, overflow: "hidden", height: 360, position: "relative", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {/* Decorative map grid */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1200" height="360" fill="url(#grid)" />
              {/* Mock road lines */}
              <line x1="200" y1="0" x2="200" y2="360" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <line x1="500" y1="0" x2="500" y2="360" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <line x1="850" y1="0" x2="850" y2="360" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <line x1="0" y1="120" x2="1200" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <line x1="0" y1="240" x2="1200" y2="240" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              {/* Location pins */}
              {[{ x: 210, y: 115, label: "Andheri" }, { x: 490, y: 235, label: "Powai" }, { x: 840, y: 118, label: "BKC" }, { x: 640, y: 180, label: "Bandra" }].map((pin) => (
                <g key={pin.label}>
                  <circle cx={pin.x} cy={pin.y} r="12" fill="var(--accent)" opacity="0.9" />
                  <circle cx={pin.x} cy={pin.y} r="20" fill="var(--accent)" opacity="0.2" />
                  <text x={pin.x} y={pin.y + 36} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="'Source Sans 3', sans-serif" fontWeight="600">{pin.label}</text>
                </g>
              ))}
            </svg>

            {/* Overlay CTA */}
            <div style={{
              position: "absolute", bottom: 24, right: 24,
              background: "rgba(250,247,242,0.97)", backdropFilter: "blur(12px)",
              borderRadius: 16, padding: "20px 24px", maxWidth: 280,
              boxShadow: "0 8px 32px rgba(26,26,26,0.24)",
            }}>
              <h4 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.125rem", color: "var(--text)", marginBottom: 8 }}>
                Andheri West
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.6, marginBottom: 16 }}>
                Link Road, Lokhandwala. Open 11am–11pm daily.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => router.push("/shop")}
                  style={{
                    flex: 1, background: "var(--accent)", border: "none", cursor: "pointer",
                    padding: "10px 0", borderRadius: 9999,
                    fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "var(--text)",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Order Now
                </button>
                <button
                  onClick={() => document.getElementById("locate")?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    flex: 1, background: "transparent", border: "2px solid rgba(26,26,26,0.2)", cursor: "pointer",
                    padding: "10px 0", borderRadius: 9999,
                    fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)",
                    transition: "border-color 0.2s ease, transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "scale(1.02)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(26,26,26,0.2)"; e.currentTarget.style.transform = "scale(1)" }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Location list */}
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 32 }}>
            {[
              { city: "Mumbai", locs: "18 locations", eta: "~22 min" },
              { city: "Pune", locs: "9 locations", eta: "~28 min" },
              { city: "Bengaluru", locs: "8 locations", eta: "~25 min" },
              { city: "Delhi NCR", locs: "7 locations", eta: "~30 min" },
            ].map((l) => (
              <div
                key={l.city}
                style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "background 0.2s ease, transform 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(164,214,94,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
              >
                <h4 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", color: "#fff", marginBottom: 4 }}>{l.city}</h4>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>{l.locs}</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--accent)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, marginTop: 8 }}>Delivery {l.eta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--bg)", borderTop: "1px solid rgba(26,26,26,0.08)", padding: "80px 48px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: 48, marginBottom: 64 }}>
            {/* Col 1 */}
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 16 }}>
                Crisp
              </div>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", marginBottom: 24, maxWidth: 260 }}>
                We believe the perfect fry is an act of craft. Simple ingredients, obsessive attention, repeatable pleasure.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { label: "Twitter", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                ].map((social) => (
                  <button
                    key={social.label}
                    aria-label={social.label}
                    style={{
                      width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(26,26,26,0.15)",
                      background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.2s ease, background 0.2s ease, transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.transform = "scale(1.08)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(26,26,26,0.15)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text)">
                      <path d={social.path} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text)", marginBottom: 20 }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Menu", action: () => router.push("/shop") },
                  { label: "About Us", action: () => document.getElementById("golden-standard")?.scrollIntoView({ behavior: "smooth" }) },
                  { label: "Careers", action: () => setShowSubscribeModal(true) },
                  { label: "Contact", action: () => setShowSubscribeModal(true) },
                ].map((link) => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    style={{
                      background: "none", border: "none", cursor: "pointer", textAlign: "left",
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", color: "var(--muted)",
                      fontWeight: 400, transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3 */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text)", marginBottom: 20 }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Privacy Policy", "Terms of Service", "Accessibility"].map((l) => (
                  <button
                    key={l}
                    style={{
                      background: "none", border: "none", cursor: "pointer", textAlign: "left",
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", color: "var(--muted)",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text)", marginBottom: 8 }}>
                Join Our Fry Fan Club
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.6, marginBottom: 20 }}>
                New drops, secret menu launches, and exclusive deals — straight to your inbox.
              </p>
              {subscribed ? (
                <div style={{ background: "var(--surface)", borderRadius: 12, padding: "16px 20px", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>
                  ✓ You're in the club!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: "13px 16px", borderRadius: 10, border: "1.5px solid rgba(26,26,26,0.15)",
                      background: "#fff", fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.9375rem", color: "var(--text)", outline: "none",
                    }}
                  />
                  <button
                    onClick={() => { if (email.includes("@")) setSubscribed(true) }}
                    style={{
                      padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer",
                      background: "var(--accent)", color: "var(--text)",
                      fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "0.9375rem",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      boxShadow: "0 6px 20px rgba(164,214,94,0.35)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(164,214,94,0.5)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(164,214,94,0.35)" }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid rgba(26,26,26,0.08)", paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
              © {new Date().getFullYear()} The Fry Society. All rights reserved. Made in India 🇮🇳
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {["Visa", "MC", "Amex", "UPI"].map((p) => (
                <div
                  key={p}
                  style={{
                    background: "#fff", borderRadius: 6, padding: "4px 10px",
                    fontSize: "0.6875rem", fontWeight: 700, color: "var(--muted)",
                    fontFamily: "'Source Sans 3', sans-serif",
                    border: "1px solid rgba(26,26,26,0.1)", letterSpacing: "0.04em",
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* CATERING / SUBSCRIBE MODAL */}
      {showSubscribeModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 300, background: "rgba(26,26,26,0.6)",
            backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
          onClick={() => setShowSubscribeModal(false)}
        >
          <div
            style={{ background: "var(--bg)", borderRadius: 24, padding: 48, maxWidth: 480, width: "100%", position: "relative", boxShadow: "0 40px 80px rgba(26,26,26,0.24)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubscribeModal(false)}
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Source Sans 3', sans-serif" }}>Catering & Events</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 500, marginTop: 8, marginBottom: 8, color: "var(--text)", lineHeight: 1.15 }}>
              Feed the Crowd
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.7, marginBottom: 32 }}>
              Corporate events, weddings, parties — we bring the crispiest fries to your table. Share your details and we'll be in touch within 24 hours.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Your name"
                style={{ padding: "13px 16px", borderRadius: 10, border: "1.5px solid rgba(26,26,26,0.15)", background: "#fff", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", color: "var(--text)", outline: "none" }}
              />
              <input
                type="email"
                placeholder="your@email.com"
                style={{ padding: "13px 16px", borderRadius: 10, border: "1.5px solid rgba(26,26,26,0.15)", background: "#fff", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", color: "var(--text)", outline: "none" }}
              />
              <input
                type="tel"
                placeholder="Phone number"
                style={{ padding: "13px 16px", borderRadius: 10, border: "1.5px solid rgba(26,26,26,0.15)", background: "#fff", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", color: "var(--text)", outline: "none" }}
              />
              <button
                onClick={() => setShowSubscribeModal(false)}
                style={{
                  marginTop: 4, padding: "16px 0", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "var(--accent)", color: "var(--text)",
                  fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "1rem",
                  boxShadow: "0 8px 24px rgba(164,214,94,0.4)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(164,214,94,0.55)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(164,214,94,0.4)" }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive CSS overrides */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
        @media (max-width: 900px) {
          #golden-standard > div { grid-template-columns: 1fr !important; }
          .pairings-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .location-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .location-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}