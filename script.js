
document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Create the cinematic scroll progress bar
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    let ticking = false;

    function updateProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progress.style.width = percentage + "%";
        ticking = false;
    }

    function requestProgressUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }

    window.addEventListener("scroll", requestProgressUpdate, {
        passive: true
    });

    window.addEventListener("resize", requestProgressUpdate);
    updateProgress();

    // 3. Cinematic scroll reveal animations
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Animate the element into view
                        entry.target.classList.add("visible");
                    } else {
                        // Reset it so the animation can replay
                        entry.target.classList.remove("visible");
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
    }

    // 4. Make interest cards appear one after another
    const interestCards = document.querySelectorAll(
        ".interest-card.reveal"
    );

    interestCards.forEach(function (card, index) {
        card.style.transitionDelay = (index % 3) * 120 + "ms";
    });

    // 5. Highlight the navigation link for the visible section
    const sections = document.querySelectorAll(
        "#home, #about, #interests, #contact"
    );

    const navLinks = document.querySelectorAll(".nav-links a");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        navLinks.forEach(function (link) {
                            const isActive =
                                link.getAttribute("href") ===
                                "#" + entry.target.id;

                            link.classList.toggle("active", isActive);
                        });
                    }
                });
            },
            {
                rootMargin: "-25% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }
});
