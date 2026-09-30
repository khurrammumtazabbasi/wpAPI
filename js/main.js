/**
 * ==============================================================================
 * DigiCrafts AI — Main JavaScript
 * File: js/main.js
 * 
 * Description:
 * This script handles all interactive features and animations on the landing page:
 * 1. Typewriter typing effect for the hero headline.
 * 2. Sticky navbar shadow on scroll.
 * 3. Mobile hamburger menu toggle.
 * 4. Scroll-reveal fade and slide-in animations.
 * 5. Animated number counters for statistics.
 * 6. Interactive "Copy Code" button with visual feedback.
 * 7. 3D tilt and mouse-following spotlight glow on feature cards.
 * ==============================================================================
 */

// Run all initialization functions once the HTML document has fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initInteractiveCopy();
  initBentoCardTilt();
});

/**
 * ------------------------------------------------------------------------------
 * 1. TYPEWRITER EFFECT
 * Types out the hero headline character by character.
 * ------------------------------------------------------------------------------
 */
function initTypewriter() {
  const targetElement = document.getElementById('typewriter');
  if (!targetElement) return;

  const textToType = 'Enterprise WhatsApp Cloud API.';
  let characterIndex = 0;
  targetElement.textContent = '';

  // Create and attach a blinking text cursor
  const cursorElement = document.createElement('span');
  cursorElement.className = 'cursor';
  targetElement.parentNode.insertBefore(cursorElement, targetElement.nextSibling);

  // Function to add one letter at a time
  function typeNextCharacter() {
    if (characterIndex < textToType.length) {
      targetElement.textContent += textToType.charAt(characterIndex);
      characterIndex++;
      setTimeout(typeNextCharacter, 45); // Speed between each letter (in milliseconds)
    } else {
      // After typing is finished, soften the blinking cursor
      setTimeout(() => {
        cursorElement.style.opacity = '0.5';
      }, 1500);
    }
  }

  // Short pause before typing starts
  setTimeout(typeNextCharacter, 250);
}

/**
 * ------------------------------------------------------------------------------
 * 2. NAVBAR SCROLL EFFECT
 * Adds a shadow and subtle border to the navigation bar when user scrolls down.
 * ------------------------------------------------------------------------------
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Check scroll position and toggle the 'scrolled' CSS class
  function updateNavbarOnScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
  updateNavbarOnScroll(); // Run once immediately on page load
}

/**
 * ------------------------------------------------------------------------------
 * 3. MOBILE MENU TOGGLE
 * Opens and closes the mobile navigation drawer when hamburger icon is clicked.
 * ------------------------------------------------------------------------------
 */
function initMobileMenu() {
  const hamburgerButton = document.getElementById('hamburger');
  const mobileMenuDrawer = document.getElementById('mobileMenu');
  if (!hamburgerButton || !mobileMenuDrawer) return;

  // Toggle open class on button click
  hamburgerButton.addEventListener('click', () => {
    hamburgerButton.classList.toggle('open');
    mobileMenuDrawer.classList.toggle('open');
  });

  // Automatically close the menu when any link inside it is clicked
  const mobileMenuLinks = mobileMenuDrawer.querySelectorAll('a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerButton.classList.remove('open');
      mobileMenuDrawer.classList.remove('open');
    });
  });
}

/**
 * ------------------------------------------------------------------------------
 * 4. SCROLL REVEAL ANIMATIONS
 * Fades and slides elements into view as the user scrolls down the page.
 * Uses the browser's native IntersectionObserver API.
 * ------------------------------------------------------------------------------
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealElements.length) return;

  // Configuration for when to trigger the animation
  const observerOptions = {
    root: null,                  // Use the browser viewport
    rootMargin: '0px 0px -20px 0px', // Trigger slightly before element enters view
    threshold: 0.05              // Trigger as soon as 5% of element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        // Read optional delay (in ms) from data-delay attribute
        const delay = parseInt(element.getAttribute('data-delay') || '0', 10);

        setTimeout(() => {
          element.classList.add('visible');
        }, delay);

        // Stop watching once the animation has been triggered
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => revealObserver.observe(element));
}

/**
 * ------------------------------------------------------------------------------
 * 5. NUMBER COUNTER ANIMATION
 * Counts statistics numbers up from zero to their target values.
 * ------------------------------------------------------------------------------
 */
function initCounters() {
  const counterElements = document.querySelectorAll('.stat-number[data-target], .bento-big-stat[data-target]');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        animateNumberCount(element);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(element => counterObserver.observe(element));
}

/**
 * Helper function to run the count animation for a single element.
 */
function animateNumberCount(element) {
  const targetNumber = parseFloat(element.getAttribute('data-target'));
  const prefix = element.getAttribute('data-prefix') || '';
  const suffix = element.getAttribute('data-suffix') || '';
  const decimalPlaces = parseInt(element.getAttribute('data-decimal') || '0', 10);

  const durationMs = 1400; // Total animation time (1.4 seconds)
  const framesPerSecond = 60;
  const totalFrames = Math.round(durationMs / (1000 / framesPerSecond));
  let currentFrame = 0;

  // Easing formula: starts fast, slows down gently at the end (ease-out)
  function easeOut(progress) {
    return 1 - Math.pow(1 - progress, 4);
  }

  const intervalId = setInterval(() => {
    currentFrame++;
    const progress = easeOut(currentFrame / totalFrames);
    const currentValue = progress * targetNumber;

    // Display formatted number
    if (decimalPlaces > 0) {
      element.textContent = `${prefix}${currentValue.toFixed(decimalPlaces)}${suffix}`;
    } else {
      element.textContent = `${prefix}${Math.round(currentValue)}${suffix}`;
    }

    // Stop when animation completes
    if (currentFrame >= totalFrames) {
      clearInterval(intervalId);
      if (decimalPlaces > 0) {
        element.textContent = `${prefix}${targetNumber.toFixed(decimalPlaces)}${suffix}`;
      } else {
        element.textContent = `${prefix}${targetNumber}${suffix}`;
      }
    }
  }, 1000 / framesPerSecond);
}

/**
 * ------------------------------------------------------------------------------
 * 6. INTERACTIVE COPY BUTTON
 * Copies the sample OTP verification code to clipboard and gives visual feedback.
 * ------------------------------------------------------------------------------
 */
function initInteractiveCopy() {
  const copyButton = document.querySelector('.wa-btn');
  if (!copyButton) return;

  copyButton.addEventListener('click', () => {
    const codeElement = document.querySelector('.wa-code');
    const codeText = codeElement ? codeElement.textContent.trim() : '847-291';

    // Copy to system clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeText).then(() => {
        displayCopySuccess(copyButton);
      }).catch(() => {
        displayCopySuccess(copyButton);
      });
    } else {
      displayCopySuccess(copyButton);
    }
  });
}

/**
 * Helper function to temporarily change button appearance after copying.
 */
function displayCopySuccess(button) {
  const originalButtonHtml = button.innerHTML;

  button.innerHTML = '✓ Code Copied to Clipboard!';
  button.style.backgroundColor = '#16a34a';
  button.style.color = '#ffffff';
  button.style.borderColor = '#16a34a';

  // Restore original button after 2.2 seconds
  setTimeout(() => {
    button.innerHTML = originalButtonHtml;
    button.style.backgroundColor = '';
    button.style.color = '';
    button.style.borderColor = '';
  }, 2200);
}

/**
 * ------------------------------------------------------------------------------
 * 7. 3D CARD TILT & CURSOR SPOTLIGHT
 * Tracks mouse movement over bento cards to produce a dynamic spotlight glow
 * and subtle 3D perspective tilt effect.
 * ------------------------------------------------------------------------------
 */
function initBentoCardTilt() {
  const bentoCards = document.querySelectorAll('.bento-card');
  if (!bentoCards.length) return;

  // Skip 3D tilt calculation on touch screen devices
  if (window.matchMedia('(hover: none)').matches) return;

  bentoCards.forEach(card => {
    let animationFrameId = null;

    // Track mouse movement across the card
    card.addEventListener('mousemove', (event) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const cardRect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to the card's top-left corner
        const mouseX = event.clientX - cardRect.left;
        const mouseY = event.clientY - cardRect.top;

        // Set CSS variables for the radial spotlight gradient
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);

        // Calculate 3D tilt angles based on distance from card center (max ±5.5 degrees)
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        const rotateX = ((mouseY - centerY) / centerY) * -5.5;
        const rotateY = ((mouseX - centerX) / centerX) * 5.5;

        card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      });
    });

    // Reset card back to flat position when mouse leaves
    card.addEventListener('mouseleave', () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--ty', '0px');
      card.style.setProperty('--sc', '1');
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}
