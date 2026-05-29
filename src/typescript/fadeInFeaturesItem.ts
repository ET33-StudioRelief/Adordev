import {
  getElementsByTrigger,
  observeViewportOnce,
  prefersReducedMotion,
  revealElements,
  sanitizeTriggerAttributes,
} from 'src/typescript/viewportTrigger';

/** Webflow custom attribute: `trigger="fadeInFeaturesItem"` */
const TRIGGER = 'fadeInFeaturesItem';

/** Class added to each animated child (used by CSS). */
const ITEM_CLASS = 'fadeInFeaturesItem-item';

/** CSS custom property for stagger delay (used by CSS). */
const DELAY_VAR = '--fadeInFeaturesItem-delay';

/** Default child selector when `item-target` is not set. */
const DEFAULT_ITEM_TARGET = 'features_item';

/** Stagger timing (ms). */
const BASE_DELAY_MS = 100;
const STEP_DELAY_MS = 120;

const OBSERVER_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px',
} as const;

/**
 * Resolves the child selector from the optional `item-target` attribute.
 * Accepts `features_item` or `.features_item`.
 */
const getItemSelector = (container: HTMLElement): string => {
  const target =
    container.getAttribute('item-target') ??
    container.getAttribute('stagger-target') ??
    DEFAULT_ITEM_TARGET;
  return target.startsWith('.') ? target : `.${target}`;
};

/**
 * Tags children and assigns a stagger delay via CSS variable.
 */
const prepareItems = (container: HTMLElement): void => {
  const items = [...container.querySelectorAll<HTMLElement>(getItemSelector(container))];

  items.forEach((item, index) => {
    item.classList.add(ITEM_CLASS);
    item.style.setProperty(DELAY_VAR, `${BASE_DELAY_MS + index * STEP_DELAY_MS}ms`);
  });
};

/**
 * Staggered slide-up fade-in for child items when the container enters the viewport.
 *
 * Webflow setup:
 * - Add `trigger="fadeInFeaturesItem"` on the list/grid container.
 * - Optional: `item-target="features_item"` to target a different class (legacy: `stagger-target`).
 */
export const initFadeInFeaturesItem = (): void => {
  const containers = getElementsByTrigger(TRIGGER);
  if (!containers.length) return;

  sanitizeTriggerAttributes(containers, TRIGGER);
  containers.forEach(prepareItems);

  if (prefersReducedMotion()) {
    revealElements(containers);
    return;
  }

  observeViewportOnce(containers, OBSERVER_OPTIONS);
};
