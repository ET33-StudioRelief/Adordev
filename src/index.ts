import './index.css';

import { initFadeInFeaturesItem } from 'src/typescript/fadeInFeaturesItem';
import { initFadeInSection } from 'src/typescript/fadeInSection';
import { initParallaxImage } from 'src/typescript/parallaxImage';

window.Webflow ||= [];
window.Webflow.push(() => {
  initFadeInSection();
  initFadeInFeaturesItem();
  initParallaxImage();
});
