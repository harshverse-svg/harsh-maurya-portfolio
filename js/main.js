// Custom Cursor Logic
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

// Update cursor position
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  // Add a slight delay to the follower for a smooth trailing effect
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 50);
});

// Add hover effect to interactive elements
const interactives = document.querySelectorAll('a, button, .bento-item, .glass-card, .media-card, .media-item, .approach-item');

interactives.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorFollower.classList.add('cursor-hover');
  });
  
  el.addEventListener('mouseleave', () => {
    cursorFollower.classList.add('cursor-leave'); // Optional transition class
    cursorFollower.classList.remove('cursor-hover');
  });
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Initial Console Log (Adding to the hacker aesthetic)
console.log('%c> sys.init("harsh_maurya")', 'color: #00f0ff; font-family: monospace; font-size: 16px;');
console.log('%c> Status: All systems nominal. Ready to engineer the future.', 'color: #a0a0a0; font-family: monospace; font-size: 12px;');

// ===== Scroll Progress Indicator =====
window.addEventListener("scroll", () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progress = document.getElementById("scrollProgress");
  if (progress) progress.style.width = scrolled + "%";
});

// ===== Vanilla Tilt Initialization =====
if (typeof VanillaTilt !== "undefined") {
  VanillaTilt.init(document.querySelectorAll(".project-card, .cert-card, .bento-item, .glass-card, .approach-item, .about-card"), {
    max: 5,
    speed: 400,
    glare: true,
    "max-glare": 0.1,
  });
}

// ===== Terminal Typing Effect =====
const terminalText1 = "> sys.init(\"harsh_maurya\")";
const terminalText2 = "Study. Code. Architect. <br><span class=\"accent-text\">Deploy.</span>";
const terminalText3 = "Computer Science Engineer focused on building hyper-local solutions and exploring the bleeding edge of AI research.";

const typeText = async (element, htmlContent, speed = 30) => {
  if (!element) return;
  element.style.opacity = "1";
  let isTag = false;
  let text = "";
  
  for (let i = 0; i < htmlContent.length; i++) {
    const char = htmlContent.charAt(i);
    if (char === "<") isTag = true;
    text += char;
    if (char === ">") isTag = false;
    
    if (!isTag) {
      element.innerHTML = text + "<span class=\"cursor-blink\">_</span>";
      await new Promise(r => setTimeout(r, speed));
    }
  }
  element.innerHTML = text;
};

document.addEventListener("DOMContentLoaded", async () => {
  const sysInitElem = document.getElementById("type-sys-init");
  const titleElem = document.getElementById("type-title");
  const subtitleElem = document.getElementById("type-subtitle");
  
  if (sysInitElem && titleElem && subtitleElem) {
    sysInitElem.innerHTML = "";
    titleElem.innerHTML = "";
    subtitleElem.innerHTML = "";
    
    await typeText(sysInitElem, terminalText1, 50);
    await new Promise(r => setTimeout(r, 300));
    await typeText(titleElem, terminalText2, 40);
    await new Promise(r => setTimeout(r, 300));
    await typeText(subtitleElem, terminalText3, 20);
  }
});

