// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close nav when a link is clicked (on mobile)
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (nav.classList.contains("open")) {
                nav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    });
}

// Optional: highlight active section in nav (simple version)
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".site-nav a");

const onScroll = () => {
    let currentId = null;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom > 80) {
            currentId = section.id;
        }
    });

    navLinks.forEach((link) => {
        if (link.hash === "#" + currentId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
};

window.addEventListener("scroll", onScroll);
onScroll();

// Lecturer bio expand / collapse (animated accordion: close others first, then open)
let bioAccordionSeq = 0;
const BIO_CLOSE_MS = 480; // slightly above CSS grid transition (0.42s)

function syncBioClosed(panel, toggleBtn) {
    panel.classList.remove("is-open");
    toggleBtn.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    const label = toggleBtn.querySelector(".bio-toggle-label");
    if (label) label.textContent = "See Bio";
}

function syncBioOpen(panel, toggleBtn) {
    panel.classList.add("is-open");
    toggleBtn.classList.add("is-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    const label = toggleBtn.querySelector(".bio-toggle-label");
    if (label) label.textContent = "Hide Bio";
}

document.querySelectorAll(".bio-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        if (!panel || !panel.classList.contains("person-bio")) return;

        if (panel.classList.contains("is-open")) {
            bioAccordionSeq += 1;
            syncBioClosed(panel, btn);
            return;
        }

        bioAccordionSeq += 1;
        const seq = bioAccordionSeq;

        const openClicked = () => {
            if (seq !== bioAccordionSeq) return;
            syncBioOpen(panel, btn);
        };

        const openPanels = [...document.querySelectorAll(".person-bio.is-open")];

        if (openPanels.length === 0) {
            openClicked();
            return;
        }

        const closingPanel = openPanels[0];
        openPanels.forEach((p) => {
            const otherBtn = p.previousElementSibling;
            if (otherBtn?.classList.contains("bio-toggle")) {
                syncBioClosed(p, otherBtn);
            }
        });

        const onEnd = (e) => {
            if (e.propertyName !== "grid-template-rows") return;
            if (seq !== bioAccordionSeq) return;
            clearTimeout(fallback);
            closingPanel.removeEventListener("transitionend", onEnd);
            openClicked();
        };

        const fallback = setTimeout(() => {
            closingPanel.removeEventListener("transitionend", onEnd);
            if (seq !== bioAccordionSeq) return;
            openClicked();
        }, BIO_CLOSE_MS);

        closingPanel.addEventListener("transitionend", onEnd);
    });
});

// FAQ & schedule unrolling (same grid animation as lecturer bios; independent toggles)
document.querySelectorAll(".faq-summary, .schedule-summary").forEach((btn) => {
    btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item, .schedule-item");
        const panel = item?.querySelector(".faq-answer, .schedule-answer");
        if (!item || !panel) return;

        const open = !item.classList.contains("is-open");
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
        panel.setAttribute("aria-hidden", String(!open));
    });
});
