// Track pointer to create a soft glow that follows the cursor on cards
(function attachPointerGlow() {
  const container = document.querySelector(".grid-container");
  if (!container) return;
  container.addEventListener("pointermove", (e) => {
    const target = e.target.closest(".card");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mx", x + "px");
    target.style.setProperty("--my", y + "px");
  });
})();

// Reveal animations when cards enter viewport (for browsers without CSS prefers-reduced-motion set)
(function observeCards() {
  const cards = document.querySelectorAll(".card");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c) => (c.style.opacity = 1));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );
  cards.forEach((card) => {
    card.style.animationPlayState = "paused";
    observer.observe(card);
  });
})();
