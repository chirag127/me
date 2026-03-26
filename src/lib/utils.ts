/**
 * Utility: Scroll Animations Observer
 * Provides a simple wrapper around IntersectionObserver for scroll-based animations.
 */
export function observeElements(
  selector: string,
  options: {
    threshold?: number;
    rootMargin?: string;
    stagger?: number;
  } = {},
) {
  if (typeof window === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;

        // Handle staggered children if specified
        if (options.stagger) {
          const children = el.children;
          Array.from(children).forEach((child, index) => {
            (child as HTMLElement).style.transitionDelay = `${
              index * options.stagger!
            }ms`;
            child.classList.add('is-visible');
          });
        }

        el.classList.add('is-visible');
        // Stop observing once animated
        observer.unobserve(el);
      }
    });
  }, options);

  document.querySelectorAll(selector).forEach((el) => {
    observer.observe(el);
  });
}
