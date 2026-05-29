import {
  getElementsByTrigger,
  observeViewportOnce,
  prefersReducedMotion,
  revealElements,
  sanitizeTriggerAttributes,
} from 'src/typescript/viewportTrigger';

/** Webflow custom attribute: `trigger="fadeInSection"` */
const TRIGGER = 'fadeInSection';

const OBSERVER_OPTIONS = {
  threshold: 0.15,
  rootMargin: '0px 0px -5% 0px',
} as const;

/**
 * Slide-up fade-in for sections when they enter the viewport.
 *
 * Webflow setup:
 * - Add `trigger="fadeInSection"` on the section (or block) to animate.
 */
export const initFadeInSection = (): void => {
  const elements = getElementsByTrigger(TRIGGER);
  if (!elements.length) return;

  sanitizeTriggerAttributes(elements, TRIGGER);

  if (prefersReducedMotion()) {
    revealElements(elements);
    return;
  }

  observeViewportOnce(elements, OBSERVER_OPTIONS);
};
