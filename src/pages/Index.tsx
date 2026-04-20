import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { team } from "@/data/team";
import { TelegramIcon } from "@/components/Icon";
import { click } from "@/lib/sound";

const TITLE_REDIRECT = "https://t.me/cybsexx/";
const KL_LINKS_REDIRECT = "https://t.me/cybersexcc";

// Resolve URLs relative to Vite's base so the build works on GitHub Pages
// subpaths as well as at the root.
const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const cornerLRef = useRef<HTMLDivElement>(null);
  const cornerRRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const blackCoverRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const profileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [active, setActive] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  activeRef.current = active;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLDivElement>(".vortex-card"));
    const total = cards.length;
    if (total === 0) return;

    let currentAngle = 0;
    let targetAngle = 0;
    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let startAngle = 0;
    let hoveredCard: HTMLDivElement | null = null;
    let autoRotateSpeed = 0;
    let velocity = 0;
    let hasInteracted = false;
    let introBlend = 0;
    let raf = 0;
    let swayTime = 0;

    const config = {
      radius: window.innerWidth < 600 ? 130 : window.innerWidth < 900 ? 170 : 220,
      cardSpacing: (Math.PI * 2) / total,
      tilt: -8,
      dragSensitivity: 0.005,
      friction: 0.95,
      introGap: window.innerWidth < 600 ? 140 : window.innerWidth < 900 ? 180 : 240,
      introSlant: 6,
    };

    const onFirstInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        autoRotateSpeed = 0.0003;
      }
    };

    cards.forEach((card, i) => {
      card.dataset.index = String(i);
      card.dataset.baseAngle = String(i * config.cardSpacing);

      card.addEventListener("click", () => {
        if (hasDragged) return;
        if (activeRef.current) return;

        onFirstInteraction();

        const slug = card.getAttribute("data-profile");
        const baseAngle = parseFloat(card.dataset.baseAngle || "0");

        if (!slug) return;

        click(660);

        hoveredCard = null;
        autoRotateSpeed = 0;
        velocity = 0;

        targetAngle = -baseAngle;

        window.setTimeout(() => {
          if (!activeRef.current) openProfile(slug);
        }, 380);
      });

      card.addEventListener("mouseenter", () => {
        if (card.dataset.front !== "1") return;
        hoveredCard = card;
        autoRotateSpeed = 0;
        click(1400, 0.025);
      });
      card.addEventListener("mouseleave", () => {
        hoveredCard = null;
        if (hasInteracted) autoRotateSpeed = 0.0003;
      });
    });

    const onMouseDown = (e: MouseEvent) => {
      onFirstInteraction();
      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startAngle = targetAngle;
      velocity = 0;
      container.style.cursor = "grabbing";
      autoRotateSpeed = 0;
    };
    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = "default";
      targetAngle += velocity * 20;
      if (hasInteracted) autoRotateSpeed = 0.0003;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 10) hasDragged = true;
      const newAngle = startAngle + delta * config.dragSensitivity;
      velocity = newAngle - targetAngle;
      targetAngle = newAngle;
    };
    const onTouchStart = (e: TouchEvent) => {
      onFirstInteraction();
      isDragging = true;
      hasDragged = false;
      startX = e.touches[0].clientX;
      startAngle = targetAngle;
      velocity = 0;
      autoRotateSpeed = 0;
    };
    const onTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      targetAngle += velocity * 20;
      if (hasInteracted) autoRotateSpeed = 0.0003;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - startX;
      if (Math.abs(delta) > 10) hasDragged = true;
      const newAngle = startAngle + delta * config.dragSensitivity;
      velocity = newAngle - targetAngle;
      targetAngle = newAngle;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { onFirstInteraction(); targetAngle -= 0.5; }
      else if (e.key === "ArrowRight") { onFirstInteraction(); targetAngle += 0.5; }
    };

    container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("keydown", onKey);

    const animate = () => {
      swayTime += 0.02;
      if (hasInteracted && introBlend < 1) {
        introBlend += 0.02;
        if (introBlend > 1) introBlend = 1;
      }
      if (!isDragging && !hoveredCard) targetAngle += autoRotateSpeed;
      if (!isDragging) { velocity *= config.friction; targetAngle += velocity; }
      currentAngle += (targetAngle - currentAngle) * 0.1;

      cards.forEach((card, i) => {
        const baseAngle = parseFloat(card.dataset.baseAngle || "0");
        const angle = baseAngle + currentAngle;
        const swayOff = i * 0.8;
        const swayY = Math.sin(swayTime + swayOff) * 8;
        const swayRZ = Math.sin(swayTime * 0.5 + swayOff) * 1.5;

        const introOffset = i - (total - 1) / 2;
        const introX = introOffset * config.introGap;
        const introSlant = introOffset * config.introSlant;
        const introZ = introOffset === 0 ? 40 : 0;

        const orbX = Math.sin(angle) * config.radius;
        const orbZ = Math.cos(angle) * config.radius;
        const orbRotY = -angle * (180 / Math.PI);
        const depthRatio = (orbZ + config.radius) / (config.radius * 2);
        const isFront = depthRatio > 0.5;
        const orbOpacity = isFront ? 1 : 0.35 + depthRatio * 0.3;
        const orbScale = isFront ? 1 : 0.75 + depthRatio * 0.15;

        const t = introBlend;
        const x = introX * (1 - t) + orbX * t;
        const z = introZ * (1 - t) + orbZ * t;
        const rotY = introSlant * (1 - t) + orbRotY * t;
        const opacity = 1 * (1 - t) + orbOpacity * t;
        const scale = 1 * (1 - t) + orbScale * t;

        card.style.zIndex = String(Math.floor(z + config.radius));
        card.style.transform = `translateX(${x}px) translateY(${swayY}px) translateZ(${z}px) rotateY(${rotY}deg) rotateX(${config.tilt}deg) rotateZ(${swayRZ}deg)`;
        card.style.opacity = String(opacity);
        // Disable interactions on back-facing cards so clicks always hit the
        // visually front-most card. Pre-intro: every card is interactive.
        const interactive = t < 0.5 ? true : isFront;
        card.dataset.front = isFront ? "1" : "0";
        card.style.pointerEvents = activeRef.current ? "none" : "auto";
        const face = card.querySelector<HTMLDivElement>(".card-face");
        if (face) face.style.transform = `scale(${scale})`;
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    const onVis = () => {
      if (hasInteracted) autoRotateSpeed = document.hidden ? 0 : 0.0003;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (titleRef.current) gsap.to(titleRef.current, { opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.4 });
    if (taglineRef.current) {
      const spans = taglineRef.current.querySelectorAll("span.word");
      gsap.fromTo(spans, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, stagger: 0.18, delay: 1.2, ease: "power2.out" });
    }
    if (cornerLRef.current) gsap.to(cornerLRef.current, { opacity: 0.6, duration: 1, delay: 1.5 });
    if (cornerRRef.current) gsap.to(cornerRRef.current, { opacity: 0.6, duration: 1, delay: 1.5 });
  }, []);

  // Audio is always on. We try to autoplay, then fall back to first user gesture.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    const tryPlay = async () => {
      try {
        await audio.play();
      } catch {
        const onFirst = async () => {
          try { await audio.play(); } catch { /* noop */ }
          window.removeEventListener("pointerdown", onFirst);
          window.removeEventListener("keydown", onFirst);
        };
        window.addEventListener("pointerdown", onFirst, { once: true });
        window.addEventListener("keydown", onFirst, { once: true });
      }
    };
    tryPlay();
  }, []);

  const openProfile = (slug: string) => {
    if (activeRef.current) return;
    setActive(slug);
    if (blackCoverRef.current) blackCoverRef.current.classList.add("active");
    const landingEls = [titleRef.current, taglineRef.current, cornerLRef.current, cornerRRef.current];
    landingEls.forEach((el) => {
      if (el) gsap.to(el, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" });
    });
    const profEl = profileRefs.current[slug];
    if (profEl) {
      profEl.classList.add("active");
      gsap.fromTo(profEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out", delay: 0.15 });
    }
    const back = backBtnRef.current;
    if (back) {
      back.classList.add("visible");
      gsap.fromTo(back, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out", delay: 0.2 });
    }
    history.pushState(null, "", "#" + slug);
  };

  const closeProfile = () => {
    const cur = activeRef.current;
    if (!cur) return;
    click(440);
    const profEl = profileRefs.current[cur];
    if (profEl) {
      gsap.to(profEl, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut", onComplete: () => profEl.classList.remove("active") });
    }
    const back = backBtnRef.current;
    if (back) {
      gsap.to(back, { autoAlpha: 0, duration: 0.3, onComplete: () => back.classList.remove("visible") });
    }
    if (blackCoverRef.current) blackCoverRef.current.classList.remove("active");
    setTimeout(() => {
      const landingEls = [titleRef.current, taglineRef.current, cornerLRef.current, cornerRRef.current];
      landingEls.forEach((el, i) => {
        if (el) gsap.to(el, { autoAlpha: i === 0 ? 1 : i === 1 ? 1 : 0.6, duration: 0.6, ease: "power2.out" });
      });
    }, 300);
    setActive(null);
    history.pushState(null, "", window.location.pathname);
  };

  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.replace("#", "");
      const exists = team.find((m) => m.slug === hash);
      if (exists && !activeRef.current) openProfile(hash);
      else if (!exists && activeRef.current) closeProfile();
    };
    window.addEventListener("popstate", onPop);
    const initialHash = window.location.hash.replace("#", "");
    if (team.find((m) => m.slug === initialHash)) {
      setTimeout(() => openProfile(initialHash), 1200);
    }
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLinkClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    click(660);
    const url = slug === "kl" ? KL_LINKS_REDIRECT : team.find((m) => m.slug === slug)?.telegram || "";
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    navigator.clipboard?.writeText(url).then(() => {
      setToast("opened: " + url);
      window.setTimeout(() => setToast(null), 1800);
    }).catch(() => { /* noop */ });
  };

  const handleTitleClick = () => {
    click(660);
    window.open(TITLE_REDIRECT, "_blank", "noopener,noreferrer");
  };

  const quote = "even the darkness has arms";

  return (
    <div>
      <img src={asset("images/bg.gif")} alt="" className="bg-stars" draggable={false} />
      <div className="black-fade" />
      <div className="scanlines" />
      <div className="grain-overlay" />
      <div className="dither-overlay" />
      <div className="crunch-overlay" />
      <div className="flicker" />

      <audio ref={audioRef} src={asset("audio/song.mp3")} loop preload="auto" />
      <div ref={blackCoverRef} className="bg-black-cover" />

      <div ref={titleRef} className="page-title" onClick={handleTitleClick}>
        <span className="title-main">lost.移动</span>
      </div>

      <div className="vortex-container" ref={containerRef}>
        <div className="vortex-scene">
          <div className="vortex-group">
            {team.map((m) => (
              <div
                key={m.slug}
                className="vortex-card"
                data-profile={m.slug}
              >
                <div className="card-face">
                  <img className="card-image" src={m.image} alt={m.name} draggable={false} />
                  <div className="card-label">{m.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={taglineRef} className="tagline-bottom">
        <span>
          {quote.split(" ").map((w, i) => (
            <span key={i} className="word" style={{ opacity: 0, visibility: "hidden" }}>{w}{i < quote.split(" ").length - 1 ? " " : ""}</span>
          ))}
        </span>
      </div>

      <div ref={cornerLRef} className="landing-corner" style={{ opacity: 0 }}>
        <span className="corner-label">collective</span>
        <span className="corner-val">underground · cybersec</span>
      </div>
      <div ref={cornerRRef} className="landing-corner-right" style={{ opacity: 0 }}>
        <span className="corner-label">est.</span>
        <span className="corner-val">mmxxiii</span>
      </div>

      {team.map((m) => (
        <div
          key={m.slug}
          ref={(el) => { profileRefs.current[m.slug] = el; }}
          className="profile-view"
        >
          <div className="profile-card-large">
            <img src={m.image} alt={m.name} draggable={false} />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{m.name}</h2>
            <p className="profile-tagline">{m.tagline}</p>

            <div className="profile-section">
              <span className="profile-section-label">links</span>
              <div className="profile-links">
                <a href="#" className="profile-link" onClick={(e) => handleLinkClick(e, m.slug)}>
                  <TelegramIcon size={12} />
                  telegram
                </a>
              </div>
            </div>

            <div className="profile-section">
              <span className="profile-section-label">interests</span>
              <div className="profile-interests">
                {m.interests.map((it, i) => (
                  <span key={it}>
                    {it}
                    {i < m.interests.length - 1 && <span className="sep">✧</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <span className="profile-section-label">achievements</span>
              <div className="profile-achievements">
                {m.achievements.map((a, i) => (
                  <div key={a} className="achievement">
                    <span className="achievement-num">0{i + 1}</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button ref={backBtnRef} className="back-btn" onClick={closeProfile}>← return</button>

      {toast && <div className="copy-toast show">{toast}</div>}
    </div>
  );
}

export default Index;
