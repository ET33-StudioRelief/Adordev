import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  getElementsByTrigger,
  prefersReducedMotion,
  sanitizeTriggerAttributes,
} from 'src/typescript/viewportTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Webflow custom attribute: `trigger="parallaxImage"` */
const TRIGGER = 'parallaxImage';

/** Class applied to the image wrapper (overflow clip). */
const WRAPPER_CLASS = 'parallaxImage-wrapper';

/** Class applied to the animated image (used by CSS). */
const IMAGE_CLASS = 'parallaxImage-image';

/** CSS custom property animated on scroll (used by CSS). */
const OFFSET_VAR = '--parallax-y';

/** Default child selector when `image-target` is not set. */
const DEFAULT_IMAGE_TARGET = 'software_image';

/** Default vertical travel in % (from `-offset` to `+offset`). */
const DEFAULT_OFFSET = 12;

type ParallaxSetup = {
  image: HTMLElement;
  boundary: HTMLElement;
  offset: number;
};

/**
 * Resolves the image selector from the optional `image-target` attribute.
 * Accepts `software_image` or `.software_image`.
 */
const getImageSelector = (element: HTMLElement): string => {
  const target = element.getAttribute('image-target') ?? DEFAULT_IMAGE_TARGET;
  return target.startsWith('.') ? target : `.${target}`;
};

/**
 * Reads optional `parallax-offset` (number, in %).
 */
const parseOffset = (element: HTMLElement): number => {
  const raw = element.getAttribute('parallax-offset');
  if (!raw) return DEFAULT_OFFSET;

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_OFFSET;
};

/**
 * Returns the scroll boundary element (defaults to closest `section`).
 * Override with `scroll-trigger="#section-id"`.
 */
const getScrollBoundary = (element: HTMLElement): HTMLElement => {
  const selector = element.getAttribute('scroll-trigger');
  if (selector) {
    const custom = document.querySelector<HTMLElement>(selector);
    if (custom) return custom;
  }

  return element.closest('section') ?? element;
};

/**
 * Finds the image, tags DOM nodes, and returns scroll settings.
 */
const buildSetup = (triggerElement: HTMLElement): ParallaxSetup | null => {
  const selector = getImageSelector(triggerElement);
  const image = triggerElement.matches(selector)
    ? triggerElement
    : triggerElement.querySelector<HTMLElement>(selector);

  if (!image?.parentElement) return null;

  image.parentElement.classList.add(WRAPPER_CLASS);
  image.classList.add(IMAGE_CLASS);

  return {
    image,
    boundary: getScrollBoundary(triggerElement),
    offset: parseOffset(triggerElement),
  };
};

/**
 * Vertical parallax on images while scrolling.
 *
 * Webflow setup (recommended on the image wrapper):
 * - `trigger="parallaxImage"` on `.software_image-wrapper`
 * - Optional: `image-target="software_image"` for a different class
 * - Optional: `parallax-offset="12"` for travel distance in %
 * - Optional: `scroll-trigger="#travaux-publics"` to pin scroll bounds to a section
 */
export const initParallaxImage = (): void => {
  const triggers = getElementsByTrigger(TRIGGER);
  if (!triggers.length) return;

  sanitizeTriggerAttributes(triggers, TRIGGER);

  const setups = triggers.map(buildSetup).filter((setup): setup is ParallaxSetup => setup !== null);

  if (!setups.length) return;

  if (prefersReducedMotion()) {
    setups.forEach(({ image }) => image.style.setProperty(OFFSET_VAR, '0%'));
    return;
  }

  setups.forEach(({ image, boundary, offset }) => {
    gsap.fromTo(
      image,
      { [OFFSET_VAR]: `${-offset}%` },
      {
        [OFFSET_VAR]: `${offset}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: boundary,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  });
};
