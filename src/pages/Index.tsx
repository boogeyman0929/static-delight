import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { team } from "@/data/team";
import { TelegramIcon } from "@/components/Icon";
import { click } from "@/lib/sound";

const TITLE_REDIRECT = "https://t.me/cybsexx/";
const KL_LINKS_REDIRECT = "https://t.me/cybersexcc";

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

    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let startAngle = 0;
    let currentAngle = 0;
    let targetAngle = 0;
    let velocity = 0;
    let autoRotateSpeed = 0;
    let hasInteracted = false;
    let hoveredCard: HTMLDivElement | null = null;
    let introBlend = 0;
    let swayTime = 0;
    let raf = 0;
    let selectedSlug: string | null = null;
    let selectionBlend = 0;
    let selectionTarget = 0;
    let returning = false;
    
    const config = {
      dragSensitivity: 0.005,
      friction: 0.95,
      introGap: window.innerWidth < 600 ? 140 : window.innerWidth < 900 ? 180 : 240,
      tilt: -8,
    };

    const onFirstInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        autoRotateSpeed = 0.0003;
      }
    };

    cards.forEach((card, i) => {
      card.dataset.index = String(i);

      card.addEventListener("click", () => {
        if (hasDragged) return;
        if (activeRef.current) return;

        onFirstInteraction();

        const slug = card.getAttribute("data-profile");
        if (!slug) return;

        click(660);

        hoveredCard = null;
        autoRotateSpeed = 0;
        velocity = 0;

        selectedSlug = slug;
        selectionTarget = 1;

        window.setTimeout(() => {
          if (!activeRef.current) openProfile(slug);
        }, 320);
      });

      card.addEventListener("mouseenter", () => {
        if (activeRef.current) return;
        hoveredCard = card;
        autoRotateSpeed = 0;
        click(1400, 0.025);
      });

      card.addEventListener("mouseleave", () => {
        if (hoveredCard === card) hoveredCard = null;
        if (hasInteracted && !activeRef.current) autoRotateSpeed = 0.0003;
      });
    });

    const onMouseDown = (e: MouseEvent) => {
      if (activeRef.current) return;
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
      if (hasInteracted && !activeRef.current) autoRotateSpeed = 0.0003;
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
      if (activeRef.current) return;
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
      if (hasInteracted && !activeRef.current) autoRotateSpeed = 0.0003;
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
      if (activeRef.current) return;
      if (e.key === "ArrowLeft") {
        onFirstInteraction();
        targetAngle -= 0.5;
      } else if (e.key === "ArrowRight") {
        onFirstInteraction();
        targetAngle += 0.5;
      }
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
        introBlend += 0.025;
        if (introBlend > 1) introBlend = 1;
      }

      if (!isDragging && !hoveredCard && !activeRef.current) targetAngle += autoRotateSpeed;
      if (!isDragging) {
        velocity *= config.friction;
        targetAngle += velocity;
      }
      currentAngle += (targetAngle - currentAngle) * 0.1;

      if (activeRef.current) {
        selectionTarget = 1;
        selectedSlug = activeRef.current;
      } else if (!selectedSlug) {
        selectionTarget = 0;
      }

      selectionBlend += (selectionTarget - selectionBlend) * 0.08;

      cards.forEach((card, i) => {
        const slug = card.getAttribute("data-profile");
        const isSelected = !!slug && slug === selectedSlug;
        const isReturning = returning;
        const isHovered = hoveredCard === card && !activeRef.current && !selectedSlug;

        const swayOff = i * 0.8;
        const swayY = Math.sin(swayTime + swayOff) * 8;
        const swayRZ = Math.sin(swayTime * 0.55 + swayOff) * 1.2;

        const introOffset = i - (total - 1) / 2;
        const introX = introOffset * config.introGap;

        const baseOffset = i - (total - 1) / 2;
        const landingX = baseOffset * 220;

        let selectedX = 0;
        let selectedZ = 0;

       if (selectedSlug) {
        selectedX = isSelected ? 0 : baseOffset < 0 ? -130 : 130;
        selectedZ = isSelected ? 120 : -120;
       } else if (returning) {
        selectedX = baseOffset * 220;
        selectedZ = 0;
       }
        const selectedScale = isSelected ? 1.05 : 0.88;
        const selectedOpacity = isSelected ? 1 : 0.38;
        const selectedRotY = isSelected ? 0 : baseOffset < 0 ? -10 : 10;

        const hoverScale = 1;
        const hoverZ = isHovered ? 18 : 0;

        const tIntro = introBlend;
        const xPre = introX * (1 - tIntro) + landingX * tIntro;
        const zPre = 40 * (1 - tIntro);
        const rotYPre = baseOffset * 6 * (1 - tIntro);
        const opacityPre = 1;
        const scalePre = hoverScale;
        const extraHoverZ = hoverZ;

        const tSel = selectionBlend;
        const x = xPre * (1 - tSel) + selectedX * tSel;
        const z = (zPre + extraHoverZ) * (1 - tSel) + selectedZ * tSel;
        const rotY = rotYPre * (1 - tSel) + selectedRotY * tSel;
        const opacity = opacityPre * (1 - tSel) + selectedOpacity * tSel;
        const scale = scalePre * (1 - tSel) + selectedScale * tSel;

        card.style.zIndex = String(Math.floor(z + 400));
        card.style.transform = `
          translateX(${x}px)
          translateY(${swayY}px)
          translateZ(${z}px)
          rotateY(${rotY}deg)
          rotateX(${config.tilt}deg)
          rotateZ(${swayRZ}deg)
        `;
        card.style.opacity = String(opacity);
        card.dataset.front = !selectedSlug ? "1" : isSelected ? "1" : "0";
        card.style.pointerEvents = activeRef.current ? "none" : "auto";

        const face = card.querySelector<HTMLDivElement>(".card-face");
        if (face) {
          face.style.transform = `scale(${scale})`;
        }
      });

      raf = requestAnimationFrame(animate);
    };

    animate();

    const onVis = () => {
      if (hasInteracted && !activeRef.current) autoRotateSpeed = document.hidden ? 0 : 0.0003;
    };
    document.addEventListener("visibilitychange", onVis);

const resetSelection = () => {
  returning = true;
  selectionTarget = 0;
};

    window.addEventListener("lost-reset-cards", resetSelection as EventListener);

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
      window.removeEventListener("lost-reset-cards", resetSelection as EventListener);
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
      gsap.to(profEl, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => profEl.classList.remove("active"),
      });
    }

    const back = backBtnRef.current;
    if (back) {
      gsap.to(back, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => back.classList.remove("visible"),
      });
    }

    if (blackCoverRef.current) blackCoverRef.current.classList.remove("active");

    setTimeout(() => {
      const landingEls = [titleRef.current, taglineRef.current, cornerLRef.current, cornerRRef.current];
      landingEls.forEach((el, i) => {
        if (el) gsap.to(el, { autoAlpha: i === 0 ? 1 : i === 1 ? 1 : 0.6, duration: 0.6, ease: "power2.out" });
      });
      setActive(null);
      window.dispatchEvent(new Event("lost-reset-cards"));
    }, 300);

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

      <audio ref={audioRef} src={asset("audio/lost.mp3")} loop preload="auto" />
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
            <span key={i} className="word" style={{ opacity: 0, visibility: "hidden" }}>
              {w}{i < quote.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      </div>

      <div ref={cornerLRef} className="landing-corner" style={{ opacity: 0 }}>
        <span className="corner-label"></span>
        <span className="corner-val">lost · sh</span>
      </div>
      <div ref={cornerRRef} className="landing-corner-right" style={{ opacity: 0 }}>
        <span className="corner-label"></span>
        <span className="corner-val">kl · party</span>
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
