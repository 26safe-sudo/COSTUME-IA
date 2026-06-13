import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, ShoppingBag, Sparkles, ExternalLink, X, ChevronRight, Star } from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#050505",
  surface: "#0f0f0f",
  card: "#111111",
  cardHover: "#161616",
  border: "#1e1e1e",
  borderAccent: "#2a2a2a",
  amber: "#C9A84C",
  amberLight: "#E4C06A",
  amberDim: "#8a6e30",
  text: "#e8e4dc",
  textMuted: "#6b6660",
  textDim: "#3a3835",
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_ITEMS = [
  {
    id: 1,
    title: "Blazer Estructurado Lana Merino",
    brand: "Massimo Dutti",
    price: 249,
    category: "Chaquetas",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4503?w=400&q=80",
    tag: "Selección Premium",
  },
  {
    id: 2,
    title: "Trench Coat Gabardina Clásico",
    brand: "Burberry Vintage",
    price: 420,
    category: "Abrigos",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=80",
    tag: "Icónico",
  },
  {
    id: 3,
    title: "Camisa Oxford Slim Fit",
    brand: "Ralph Lauren",
    price: 89,
    category: "Camisas",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
    tag: "Atemporal",
  },
  {
    id: 4,
    title: "Pantalón Pinzas Wool Blend",
    brand: "COS",
    price: 139,
    category: "Pantalones",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
    tag: "Trending",
  },
  {
    id: 5,
    title: "Jersey Cachemira Cuello Vuelto",
    brand: "Loro Piana",
    price: 680,
    category: "Jerseys",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80",
    tag: "Lujo Silencioso",
  },
  {
    id: 6,
    title: "Chelsea Boots Cuero Plena Flor",
    brand: "Grenson",
    price: 310,
    category: "Calzado",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&q=80",
    tag: "Artesanal",
  },
];

const AI_SUGGESTIONS: Record<string, string> = {
  default:
    "Bienvenido a tu asesor de estilo personal. Escribe una prenda, ocasión o mood para recibir un consejo editorial personalizado.",
  blazer:
    "Un blazer de lana merino es la pieza maestra del 'quiet luxury'. Combínalo con pantalón pinzas en tono crema y mocasines de cuero sin calcetín visible. Evita el negro absoluto — prueba el camel o el gris marengo para una silueta más sofisticada.",
  trench:
    "El trench coat es arquitectura para el cuerpo. Llévalo desabrochado sobre un outfit monocromático en beige o greige. La regla de oro: que el cinturón quede ligeramente suelto, nunca ceñido. Añade una bufanda de seda doblada al cuello para el toque editorial.",
  jean:
    "El denim bien entendido es minimalismo en su máxima expresión. Opta por un corte straight leg en índigo oscuro sin distress. El contraste con una camisa blanca de algodón pesado y loafers crea la tensión perfecta entre casual e intencional.",
  casual:
    "El 'effortless chic' se construye con piezas de gran calidad en colores neutros. Base: pantalón de sastre, camiseta de punto fino en off-white. Capa intermedia: bomber de nylon técnico. La asimetría en las proporciones — oversized arriba, ceñido abajo — es la clave.",
  formal:
    "Para ocasiones formales, menos es exponencialmente más. Un traje de dos piezas en gris antracita o azul medianoche, camisa blanca sin gemelos y un único accesorio de calidad. El corbatín es más interesante que la corbata convencional ahora mismo.",
};

function getAIAdvice(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("blazer") || q.includes("americana")) return AI_SUGGESTIONS.blazer;
  if (q.includes("trench") || q.includes("gabardina") || q.includes("abrigo")) return AI_SUGGESTIONS.trench;
  if (q.includes("jean") || q.includes("denim") || q.includes("vaquero")) return AI_SUGGESTIONS.jean;
  if (q.includes("casual") || q.includes("diario") || q.includes("día")) return AI_SUGGESTIONS.casual;
  if (q.includes("formal") || q.includes("evento") || q.includes("boda") || q.includes("oficina")) return AI_SUGGESTIONS.formal;
  return AI_SUGGESTIONS.default;
}

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Header({ onWardrobeClick }: { onWardrobeClick: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: `1px solid ${COLORS.border}`,
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(5,5,5,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
        height: "64px",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ color: COLORS.amber, fontSize: "18px" }}>✦</span>
        <div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: COLORS.text,
              textTransform: "uppercase",
            }}
          >
            StyleAI
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.3em",
              color: COLORS.amber,
              display: "block",
              marginTop: "-3px",
              textTransform: "uppercase",
            }}
          >
            Universal
          </span>
        </div>
      </div>

      {/* Nav center */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLORS.textMuted,
        }}
      >
        {["Discover", "Colecciones", "Editorial"].map((item) => (
          <span
            key={item}
            style={{ cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
          >
            {item}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={onWardrobeClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "transparent",
          border: `1px solid ${COLORS.amber}`,
          color: COLORS.amber,
          padding: "8px 18px",
          cursor: "pointer",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = COLORS.amber;
          (e.currentTarget as HTMLButtonElement).style.color = COLORS.bg;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = COLORS.amber;
        }}
      >
        <ShoppingBag size={13} />
        Mi Armario
      </motion.button>
    </motion.header>
  );
}

function HeroSearch({
  query,
  setQuery,
  onSearch,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <section
      style={{
        paddingTop: "160px",
        paddingBottom: "80px",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: `radial-gradient(ellipse at center, ${COLORS.amberDim}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: COLORS.amber,
            display: "block",
            marginBottom: "1.2rem",
          }}
        >
          ✦ Inteligencia de Estilo ✦
        </span>
      </motion.div>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
          fontWeight: 300,
          lineHeight: 1.05,
          color: COLORS.text,
          marginBottom: "0.4rem",
          letterSpacing: "-0.01em",
        }}
      >
        Viste con Propósito.
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1rem, 2vw, 1.3rem)",
          fontStyle: "italic",
          color: COLORS.textMuted,
          marginBottom: "3rem",
          fontWeight: 300,
        }}
      >
        Tu asesor de moda personal, curado por IA
      </motion.p>

      {/* Search Bar */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          position: "relative",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: COLORS.card,
            border: `1px solid ${COLORS.borderAccent}`,
            transition: "border-color 0.3s",
          }}
        >
          <Search
            size={18}
            style={{ marginLeft: "1.4rem", color: COLORS.textMuted, flexShrink: 0 }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Busca 'blazer formal', 'look casual verano', 'outfit boda'..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "1.1rem 1rem",
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.95rem",
              color: COLORS.text,
              letterSpacing: "0.01em",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: COLORS.textMuted,
                padding: "0 0.8rem",
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          )}
          <motion.button
            onClick={onSearch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: COLORS.amber,
              border: "none",
              color: COLORS.bg,
              padding: "1.1rem 1.6rem",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.amberLight)}
            onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.amber)}
          >
            <Sparkles size={13} />
            Buscar
          </motion.button>
        </div>

        {/* Suggestions */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            marginTop: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {["Blazer casual", "Trench coat", "Look formal", "Denim premium"].map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); }}
              style={{
                background: "transparent",
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textMuted,
                padding: "4px 12px",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.amberDim;
                (e.currentTarget as HTMLButtonElement).style.color = COLORS.amber;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.border;
                (e.currentTarget as HTMLButtonElement).style.color = COLORS.textMuted;
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function AIAdvisor({ advice, isVisible }: { advice: string; isVisible: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      style={{
        maxWidth: "900px",
        margin: "0 auto 5rem",
        padding: "0 1.5rem",
      }}
    >
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.borderAccent}`,
          borderLeft: `3px solid ${COLORS.amber}`,
          padding: "2rem 2.5rem",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "1.2rem",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: `${COLORS.amber}15`,
              border: `1px solid ${COLORS.amberDim}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={13} color={COLORS.amber} />
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLORS.amber,
            }}
          >
            Asesor AI · Consejo Editorial
          </span>
          <span
            style={{
              marginLeft: "auto",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px #4ade80",
              display: "inline-block",
            }}
          />
        </div>

        {/* Advice text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={advice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem",
              fontWeight: 300,
              lineHeight: 1.75,
              color: isVisible ? COLORS.text : COLORS.textMuted,
              fontStyle: "italic",
            }}
          >
            "{advice}"
          </motion.p>
        </AnimatePresence>

        {/* Decorative corner */}
        <div
          style={{
            position: "absolute",
            bottom: "1.2rem",
            right: "1.5rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: COLORS.textDim,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Star size={9} color={COLORS.textDim} />
          StyleAI · Curación Experta
        </div>
      </div>
    </motion.section>
  );
}

function ItemCard({ item, index }: { item: (typeof MOCK_ITEMS)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? COLORS.cardHover : COLORS.card,
        border: `1px solid ${hovered ? COLORS.borderAccent : COLORS.border}`,
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tag */}
      <div
        style={{
          position: "absolute",
          top: "0.8rem",
          left: "0.8rem",
          background: `${COLORS.bg}cc`,
          backdropFilter: "blur(8px)",
          border: `1px solid ${COLORS.border}`,
          padding: "3px 10px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLORS.amber,
          zIndex: 2,
        }}
      >
        {item.tag}
      </div>

      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
        <motion.img
          src={item.image}
          alt={item.title}
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "brightness(0.88) saturate(0.9)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${COLORS.bg}99 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "1.2rem" }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: COLORS.textMuted,
            display: "block",
            marginBottom: "0.4rem",
          }}
        >
          {item.brand} · {item.category}
        </span>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontWeight: 400,
            color: COLORS.text,
            lineHeight: 1.3,
            marginBottom: "1rem",
          }}
        >
          {item.title}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem",
              fontWeight: 300,
              color: COLORS.text,
            }}
          >
            {item.price}
            <span
              style={{
                fontSize: "0.75rem",
                color: COLORS.amber,
                fontFamily: "'DM Mono', monospace",
                marginLeft: "4px",
              }}
            >
              EUR
            </span>
          </span>

          <motion.a
            href={`https://www.ebay.es/sch/i.html?_nkw=${encodeURIComponent(item.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: COLORS.amber,
              color: COLORS.bg,
              padding: "7px 14px",
              textDecoration: "none",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.56rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 400,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = COLORS.amberLight)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = COLORS.amber)}
          >
            <ExternalLink size={10} />
            Ver en eBay
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

function WardrobeModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,5,5,0.92)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.borderAccent}`,
          padding: "3rem",
          maxWidth: "480px",
          width: "90%",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLORS.textMuted,
            display: "flex",
          }}
        >
          <X size={18} />
        </button>

        <span style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }}>✦</span>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem",
            fontWeight: 300,
            color: COLORS.text,
            marginBottom: "0.6rem",
          }}
        >
          Mi Armario
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: COLORS.textMuted,
            lineHeight: 1.7,
            marginBottom: "2rem",
            fontSize: "1rem",
          }}
        >
          Tu colección personal está en desarrollo. Pronto podrás guardar prendas, crear outfits y recibir sugerencias basadas en tu guardarropa.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          style={{
            background: COLORS.amber,
            border: "none",
            color: COLORS.bg,
            padding: "12px 32px",
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ChevronRight size={13} />
          Próximamente
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [query, setQuery] = useState("");
  const [activeAdvice, setActiveAdvice] = useState(AI_SUGGESTIONS.default);
  const [hasSearched, setHasSearched] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setActiveAdvice(getAIAdvice(query));
    setHasSearched(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text }}>
      <Header onWardrobeClick={() => setShowWardrobe(true)} />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <HeroSearch query={query} setQuery={setQuery} onSearch={handleSearch} />

        <AIAdvisor advice={activeAdvice} isVisible={hasSearched} />

        {/* Grid Section */}
        <section style={{ paddingBottom: "6rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2.5rem",
              borderBottom: `1px solid ${COLORS.border}`,
              paddingBottom: "1.2rem",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: COLORS.amber,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                Curación IA
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.9rem",
                  fontWeight: 300,
                  color: COLORS.text,
                  lineHeight: 1,
                }}
              >
                {hasSearched ? `Resultados para "${query}"` : "Selección de la Semana"}
              </h2>
            </div>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                color: COLORS.textMuted,
                letterSpacing: "0.1em",
              }}
            >
              {MOCK_ITEMS.length} prendas
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1px",
              background: COLORS.border,
            }}
          >
            {MOCK_ITEMS.map((item, i) => (
              <div key={item.id} style={{ background: COLORS.bg }}>
                <ItemCard item={item} index={i} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          padding: "2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: COLORS.textMuted,
          }}
        >
          StyleAI Universal — Moda con Intención
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: COLORS.textDim,
          }}
        >
          © 2025 ✦ All rights reserved
        </span>
      </footer>

      <AnimatePresence>
        {showWardrobe && <WardrobeModal onClose={() => setShowWardrobe(false)} />}
      </AnimatePresence>
    </div>
  );
}