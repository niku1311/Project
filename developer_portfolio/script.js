const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const modal = document.getElementById("projectModal");

document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle: remembers the visitor's choice in this browser.
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") root.classList.add("light");
updateThemeButton();

themeToggle.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("portfolio-theme", root.classList.contains("light") ? "light" : "dark");
  updateThemeButton();
});
function updateThemeButton() {
  const light = root.classList.contains("light");
  themeToggle.textContent = light ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.title = light ? "Switch to dark theme" : "Switch to light theme";
}

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

// Project detail popup
const projectInfo = {
  cyber: {
    eyebrow: "PROJECT 01 / SECURITY",
    title: "AI-Powered Cyber Threat Detection",
    description: "A cybersecurity project concept focused on helping users identify potentially suspicious activity and understand alerts in one place. Describe only the detection methods and features that are implemented in your actual version.",
    highlights: ["Review suspicious URLs or activity indicators", "Display a clear result or alert to the user", "Present findings through a simple interface"],
    tags: ["Python", "Cybersecurity", "Prototype"]
  },
 
  portfolio: {
    eyebrow: "PROJECT 02/ FRONTEND",
    title: "Personal Developer Portfolio",
    description: "A mobile-first portfolio website built with semantic HTML, modern CSS, and JavaScript interactions.",
    highlights: ["Responsive Flexbox and CSS Grid layouts", "Dark/light theme toggle and mobile menu", "Project details modal and contact shortcuts"],
    tags: ["HTML5", "CSS3", "JavaScript"]
  }
};
document.querySelectorAll(".project-details").forEach(button => {
  button.addEventListener("click", () => {
    const project = projectInfo[button.dataset.project];
    document.getElementById("modalEyebrow").textContent = project.eyebrow;
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalDescription").textContent = project.description;
    const list = document.getElementById("modalHighlights");
    list.replaceChildren(...project.highlights.map(item => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
    const tags = document.getElementById("modalTags");
    tags.replaceChildren(...project.tags.map(item => {
      const span = document.createElement("span");
      span.textContent = item;
      return span;
    }));
    modal.showModal();
  });
});
document.getElementById("modalClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});

// Update this address in index.html and here before publishing.
const portfolioEmail = "your.email@example.com";
document.getElementById("copyEmail").addEventListener("click", async () => {
  const status = document.getElementById("copyStatus");
  try {
    await navigator.clipboard.writeText(portfolioEmail);
    status.textContent = "Email copied to clipboard.";
  } catch {
    status.textContent = `Replace the placeholder email: ${portfolioEmail}`;
  }
});
