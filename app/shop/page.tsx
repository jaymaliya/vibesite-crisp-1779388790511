"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const products = [
  { id: 1, img: "/product-1.jpg", name: "Golden yellow fried", description: "Golden yellow fried potato sticks in a red paper carton with a yellow McDonald's 'M' logo.", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "tall, chunky double", description: "A tall, chunky double cheeseburger features a sesame seed bun, two beef patties, melted", price: 30, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "round pepperoni pizza", description: "A round pepperoni pizza with a golden-brown crust, stringy melted cheese, and red", price: 40, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "pile golden-brown crispy", description: "A pile of golden-brown crispy fried chicken tenders, one revealing white meat, with a", price: 50, badge: "" }
];

  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFryTypes, setActiveFryTypes] = useState<string[]>([]);
  const [activeSeasonings, setActiveSeasonings] = useState<string[]>([]);
  const [activePairings, setActivePairings] = useState<string[]>([]);
  const [filterGroupOpen, setFilterGroupOpen] = useState<Record<string, boolean>>({ fryType: true, seasoning: true, pairings: true });
  const [activePage, setActivePage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    revealRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const handleQuickAdd = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const toggleFilter = (group: string, value: string, current: string[], setter: (v: string[]) => void) => {
    setter(current.includes(value) ? current.filter((x) => x !== value) : [...current, value]);
  };

  const clearAll = () => {
    setActiveFryTypes([]);
    setActiveSeasonings([]);
    setActivePairings([]);
  };

  const navLinks = [
    { label: "Our Menu", action: () => { setMenuOpen(false); router.push("/shop"); } },
    { label: "Our Story", action: () => { setMenuOpen(false); document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }); } },
    { label: "Locations", action: () => { setMenuOpen(false); document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" }); } },
    { label: "Catering", action: () => { setMenuOpen(false); setShowSubscribeModal(true); } },
  ];

  return (
    <div style={{ fontFamily: "'Source Sans 3', sans-serif", backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --bg: #faf7f2;
          --surface: #c8e6a0;
          --primary: #1a1a1a;
          --accent: #a4d65e;
          --text: #1a1a1a;
          --muted: #c9b8a3;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); }
        ::selection { background: var(--accent); color: #fff; }
        :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .nav-link-line { position: relative; display: inline-block; }
        .nav-link-line::after { content: ""; position: absolute; bottom: -2px; left: 50%; right: 50%; height: 2px; background: var(--accent); transition: left 0.18s ease, right 0.18s ease; }
        .nav-link-line:hover::after { left: 0; right: 0; }
        @media (max-width: 768px) {
          .filter-sidebar { display: none !important; }
          .filter-mobile-btn { display: flex !important; }
          .grid-4col { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .grid-4col { grid-template-columns: 1fr !important; }
        }
        .filter-mobile-btn { display: none; }
        .quick-add-btn { opacity: 0; transform: translateY(8px); transition: opacity 0.25s ease, transform 0.25s ease; pointer-events: none; }
        .card-hover-active .quick-add-btn { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .card-hover-active { transform: translateY(-4px); box-shadow: 0 12px 40px -8px #1a1a1a40; }
        .product-img { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .product-img:hover { transform: scale(1.05); }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "var(--bg)" : "transparent",
        boxShadow: scrolled ? "0 2px 20px #1a1a1a20" : "none",
        transition: "background 0.2s ease-out, box-shadow 0.2s ease-out",
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", fontWeight: 700, color: scrolled ? "var(--text)" : "#fff", letterSpacing: "-0.02em" }}>
            Crisp
          </button>

          {/* Desktop nav links */}
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
            {navLinks.map((link) => (
              <button key={link.label} onClick={link.action} className="nav-link-line" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9375rem", fontWeight: 600, color: scrolled ? "var(--text)" : "#fff", letterSpacing: "0.01em" }}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Cart icon */}
          <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "var(--text)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>

          {/* Hamburger (mobile) */}
          <button onClick={() => setMenuOpen(true)} className="filter-mobile-btn" style={{ background: "none", border: "none", cursor: "pointer", alignItems: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "var(--text)" : "#fff"} strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", cursor: "pointer" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {navLinks.map((link) => (
            <button key={link.label} onClick={link.action} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Serif Display', serif", fontSize: "2.5rem", color: "#fff", fontWeight: 700 }}>
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* SHOP HERO BANNER */}
      <section style={{ paddingTop: "72px", background: "var(--primary)", minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/product-1.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.25 }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "80px 24px 64px" }}>
          <span ref={addRevealRef} style={{ display: "inline-block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "16px" }}>
            The Full Range
          </span>
          <h1 ref={addRevealRef} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#fff", marginBottom: "16px" }}>
            Every Craving,<br />Covered.
          </h1>
          <p ref={addRevealRef} style={{ fontSize: "1.0625rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Explore our full selection — from golden classics to loaded bites.
          </p>
        </div>
      </section>

      {/* MAIN SHOP LAYOUT */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 48px 96px", display: "flex", gap: "48px", alignItems: "flex-start" }}>

        {/* FILTER SIDEBAR — desktop */}
        <aside className="filter-sidebar" style={{ width: "240px", flexShrink: 0, position: "sticky", top: "96px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)" }}>Filters</h2>
            <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, color: "var(--accent)", textDecoration: "underline" }}>Clear All</button>
          </div>

          {[
            { key: "fryType", label: "Fry Type", options: ["Classic", "Waffle", "Sweet Potato"], active: activeFryTypes, setter: setActiveFryTypes },
            { key: "seasoning", label: "Seasoning", options: ["Classic Salt", "Garlic Parmesan", "Spicy Cajun"], active: activeSeasonings, setter: setActiveSeasonings },
            { key: "pairings", label: "Pairings", options: ["Sauces", "Beverages"], active: activePairings, setter: setActivePairings },
          ].map((group) => (
            <div key={group.key} style={{ borderTop: "1px solid #1a1a1a18", paddingTop: "20px", marginBottom: "20px" }}>
              <button onClick={() => setFilterGroupOpen((prev) => ({ ...prev, [group.key]: !prev[group.key] }))} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{group.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" style={{ transform: filterGroupOpen[group.key] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {filterGroupOpen[group.key] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {group.options.map((opt) => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem", color: group.active.includes(opt) ? "var(--text)" : "var(--muted)", fontWeight: group.active.includes(opt) ? 600 : 400 }}>
                      <span style={{
                        width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${group.active.includes(opt) ? "var(--accent)" : "#1a1a1a30"}`,
                        background: group.active.includes(opt) ? "var(--accent)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s, border-color 0.2s"
                      }}
                        onClick={() => toggleFilter(group.key, opt, group.active, group.setter)}
                      >
                        {group.active.includes(opt) && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2 6 5 9 10 3" />
                          </svg>
                        )}
                      </span>
                      <span onClick={() => toggleFilter(group.key, opt, group.active, group.setter)}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* PRODUCT GRID */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile filter toggle */}
          <div className="filter-mobile-btn" style={{ display: "none", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: 500 }}>4 products</p>
            <button onClick={() => setFilterOpen(!filterOpen)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--surface)", border: "none", borderRadius: "9999px", padding: "8px 20px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
              </svg>
              Filters
            </button>
          </div>

          {/* Mobile filter accordion */}
          {filterOpen && (
            <div style={{ background: "var(--surface)", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>Filters</span>
                <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--accent)", fontWeight: 600 }}>Clear All</button>
              </div>
              {[
                { key: "fryType", label: "Fry Type", options: ["Classic", "Waffle", "Sweet Potato"], active: activeFryTypes, setter: setActiveFryTypes },
                { key: "seasoning", label: "Seasoning", options: ["Classic Salt", "Garlic Parmesan", "Spicy Cajun"], active: activeSeasonings, setter: setActiveSeasonings },
                { key: "pairings", label: "Pairings", options: ["Sauces", "Beverages"], active: activePairings, setter: setActivePairings },
              ].map((group) => (
                <div key={group.key} style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", color: "var(--text)" }}>{group.label}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {group.options.map((opt) => (
                      <button key={opt} onClick={() => toggleFilter(group.key, opt, group.active, group.setter)} style={{
                        padding: "6px 14px", borderRadius: "9999px", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", border: "2px solid",
                        borderColor: group.active.includes(opt) ? "var(--accent)" : "#1a1a1a30",
                        background: group.active.includes(opt) ? "var(--accent)" : "transparent",
                        color: group.active.includes(opt) ? "#fff" : "var(--muted)",
                        transition: "all 0.15s ease"
                      }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <p style={{ fontSize: "0.9375rem", color: "var(--muted)", fontWeight: 500 }}>
              Showing <strong style={{ color: "var(--text)" }}>4</strong> products
            </p>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: 500 }}>Sort by:</span>
              <select style={{ background: "var(--bg)", border: "1.5px solid #1a1a1a20", borderRadius: "8px", padding: "6px 12px", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>
                <option>Most Popular</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {products.map((p, i) => (
              <article
                key={p.id}
                ref={addRevealRef}
                className={hoveredCard === p.id ? "card-hover-active" : ""}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                style={{
                  cursor: "pointer", borderRadius: "16px", background: "var(--bg)", border: "1.5px solid #1a1a1a10",
                  overflow: "hidden", position: "relative",
                  boxShadow: hoveredCard === p.id ? "0 12px 40px -8px #1a1a1a40" : "0 2px 12px #1a1a1a0d",
                  transform: hoveredCard === p.id ? "translateY(-4px)" : "translateY(0)",
                  transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                  transitionDelay: `${i * 60}ms`
                }}
              >
                {/* 3:2 image */}
                <div style={{ overflow: "hidden", aspectRatio: "3/2", position: "relative" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    className="product-img"
                    style={{
                      width: "100%", height: "100%", objectFit: "cover", display: "block",
                      transform: hoveredCard === p.id ? "scale(1.05)" : "scale(1)",
                      transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)"
                    }}
                  />
                </div>

                {/* Card content */}
                <div style={{ padding: "16px 16px 56px" }}>
                  <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text)", marginBottom: "4px", lineHeight: 1.3, textTransform: "capitalize" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)" }}>₹{p.price.toLocaleString("en-IN")}</p>
                </div>

                {/* Quick Add */}
                <div
                  className="quick-add-btn"
                  style={{
                    position: "absolute", bottom: "12px", right: "12px", left: "12px",
                    opacity: hoveredCard === p.id ? 1 : 0,
                    transform: hoveredCard === p.id ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                    pointerEvents: hoveredCard === p.id ? "auto" : "none"
                  }}
                  onClick={(e) => { e.stopPropagation(); handleQuickAdd(p); }}
                >
                  <button
                    style={{
                      width: "100%", padding: "10px 0", borderRadius: "10px", border: "none", cursor: "pointer",
                      background: addedIds[p.id] ? "#22c55e" : "var(--primary)",
                      color: "#fff", fontSize: "0.875rem", fontWeight: 700,
                      transition: "background 0.2s ease, transform 0.15s ease",
                      letterSpacing: "0.01em"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                  >
                    {addedIds[p.id] ? "Added ✓" : "Quick Add"}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div ref={addRevealRef} style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "64px", alignItems: "center" }}>
            {[1, 2, 3].map((pg) => (
              <button
                key={pg}
                onClick={() => setActivePage(pg)}
                style={{
                  width: "40px", height: "40px", borderRadius: "10px", border: "1.5px solid",
                  borderColor: activePage === pg ? "var(--accent)" : "#1a1a1a20",
                  background: activePage === pg ? "var(--accent)" : "transparent",
                  color: activePage === pg ? "#fff" : "var(--text)",
                  fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s, color 0.15s"
                }}
              >{pg}</button>
            ))}
            <button
              onClick={() => setActivePage(Math.min(activePage + 1, 3))}
              style={{
                padding: "0 20px", height: "40px", borderRadius: "10px", border: "1.5px solid #1a1a1a20",
                background: "transparent", color: "var(--text)", fontWeight: 600, fontSize: "0.9375rem", cursor: "pointer",
                transition: "background 0.15s ease, transform 0.15s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Next →
            </button>
          </div>
        </div>
      </main>

      {/* OUR STORY SECTION */}
      <section id="our-story" ref={addRevealRef} style={{ background: "var(--surface)", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div style={{ overflow: "hidden", borderRadius: "24px", boxShadow: "0 40px 80px -20px #1a1a1a30" }}>
            <img
              src="/product-4.jpg"
              alt="Fresh ingredients being prepared in the Crisp kitchen"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--primary)", opacity: 0.6, display: "block", marginBottom: "16px" }}>Our Golden Standard</span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", marginBottom: "24px" }}>
              Made with intention.<br />Served with pride.
            </h2>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--primary)", opacity: 0.75, marginBottom: "16px", maxWidth: "440px" }}>
              Every fry starts with hand-selected potatoes, cut fresh daily. We control the temperature, the oil quality, and the timing — so every batch is exactly as it should be.
            </p>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--primary)", opacity: 0.75, marginBottom: "32px", maxWidth: "440px" }}>
              No shortcuts. No reheats. Just honest food, done right.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{ padding: "14px 36px", borderRadius: "12px", border: "2px solid var(--primary)", background: "transparent", color: "var(--primary)", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer", transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--primary)"; }}
            >
              Explore the Menu
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--primary)", color: "#fff", padding: "80px 48px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px", marginBottom: "64px" }}>
            {/* Col 1 */}
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", marginBottom: "16px" }}>Crisp</div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: "24px", maxWidth: "220px" }}>
                Golden, crunchy, endlessly simple. India's favourite elevated fry experience.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                {["instagram", "facebook", "twitter"].map((social) => (
                  <button key={social} style={{ background: "#ffffff15", border: "none", cursor: "pointer", width: "36px", height: "36px", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {social === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="var(--muted)" stroke="none" /></>}
                      {social === "facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                      {social === "twitter" && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            {/* Col 2 */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--muted)", marginBottom: "20px" }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Menu", "About Us", "Careers", "Contact"].map((link) => (
                  <button key={link} onClick={() => router.push(link === "Menu" ? "/shop" : "/")} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.9375rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, transition: "color 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                  >{link}</button>
                ))}
              </div>
            </div>
            {/* Col 3 */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--muted)", marginBottom: "20px" }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Privacy Policy", "Terms of Service", "Accessibility"].map((link) => (
                  <button key={link} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.9375rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, transition: "color 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                  >{link}</button>
                ))}
              </div>
            </div>
            {/* Col 4 — Newsletter */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--muted)", marginBottom: "8px" }}>Join Our Fry Fan Club</h4>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "16px" }}>New drops, deals, and crispy news — delivered fresh.</p>
              {subscribed ? (
                <div style={{ background: "#a4d65e20", border: "1px solid var(--accent)", borderRadius: "10px", padding: "14px 16px", fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600 }}>
                  ✓ You're in the club!
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #ffffff20", background: "#ffffff10", color: "#fff", fontSize: "0.9375rem", outline: "none" }}
                  />
                  <button type="submit" style={{ padding: "12px 0", borderRadius: "10px", border: "none", background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer", transition: "transform 0.15s ease, opacity 0.15s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid #ffffff15", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)" }}>© {new Date().getFullYear()} The Fry Society. All rights reserved.</p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {["Visa", "MC", "Amex", "UPI"].map((pay) => (
                <span key={pay} style={{ fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: "#ffffff12", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>{pay}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Catering modal */}
      {showSubscribeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#1a1a1a80", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }} onClick={() => setShowSubscribeModal(false)}>
          <div style={{ background: "var(--bg)", borderRadius: "20px", padding: "48px 40px", maxWidth: "480px", width: "100%", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowSubscribeModal(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", cursor: "pointer" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, color: "var(--accent)", display: "block", marginBottom: "12px" }}>Catering Enquiry</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.75rem", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.02em" }}>Feed your event with Crisp</h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: "28px" }}>Tell us about your event and we'll get back with a bespoke fry menu.</p>
            <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={(e) => { e.preventDefault(); setShowSubscribeModal(false); }}>
              <input placeholder="Your name" style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #1a1a1a20", background: "var(--bg)", fontSize: "0.9375rem", outline: "none", color: "var(--text)" }} />
              <input type="email" placeholder="Email address" style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #1a1a1a20", background: "var(--bg)", fontSize: "0.9375rem", outline: "none", color: "var(--text)" }} />
              <input placeholder="Event date & size" style={{ padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #1a1a1a20", background: "var(--bg)", fontSize: "0.9375rem", outline: "none", color: "var(--text)" }} />
              <button type="submit" style={{ padding: "14px 0", borderRadius: "12px", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginTop: "4px" }}>
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}