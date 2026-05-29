/** Applied once when a trigger element enters the viewport. */
export const VISIBLE_CLASS = 'is-visible';

export type ViewportObserverOptions = {
  threshold?: number;
  rootMargin?: string;
};

/**
 * Returns true when the user prefers reduced motion.
 * Animations should be skipped and content shown immediately.
 */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Normalizes Webflow custom attribute values (e.g. trailing `&quot;`).
 */
export const normalizeTriggerValue = (value: string | null): string => {
  if (!value) return '';

  return value
    .replace(/&quot;/gi, '')
    .replace(/['"]/g, '')
    .trim();
};

/**
 * Finds elements with `trigger="<name>"`.
 * Uses a partial attribute match, then validates the normalized value.
 */
export const getElementsByTrigger = (triggerName: string): HTMLElement[] =>
  [...document.querySelectorAll<HTMLElement>(`[trigger*="${triggerName}"]`)].filter(
    (element) => normalizeTriggerValue(element.getAttribute('trigger')) === triggerName
  );

/**
 * Ensures each element has a clean `trigger` attribute value.
 */
export const sanitizeTriggerAttributes = (elements: HTMLElement[], triggerName: string): void => {
  elements.forEach((element) => element.setAttribute('trigger', triggerName));
};

/**
 * Adds {@link VISIBLE_CLASS} to elements immediately (reduced motion / fallback).
 */
export const revealElements = (elements: HTMLElement[]): void => {
  elements.forEach((element) => element.classList.add(VISIBLE_CLASS));
};

/**
 * Watches elements and adds {@link VISIBLE_CLASS} once when they enter the viewport.
 * Each element is unobserved after it becomes visible.
 */
export const observeViewportOnce = (
  elements: HTMLElement[],
  { threshold = 0.15, rootMargin = '0px' }: ViewportObserverOptions = {}
): void => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;
        target.classList.add(VISIBLE_CLASS);
        observer.unobserve(target);
      });
    },
    { threshold, rootMargin }
  );

  elements.forEach((element) => observer.observe(element));
};
