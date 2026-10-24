/*
 * Back-to-top button driven by scroll position instead of scroll direction.
 *
 * The navigation.top theme feature reveals the button only while the page is
 * moving upward, so it fades away again as soon as you keep reading down,
 * however far you are from the top. This replaces that rule with a plain
 * threshold: visible past SCROLL_FROM pixels, hidden above it, in both
 * directions.
 *
 * Only a class is toggled here, deliberately. The theme keeps running its own
 * script and writes `hidden` and `tabindex` off its scroll-direction pipeline,
 * which would undo any direct styling shortly after each scroll. extra.css
 * cancels the styling behind `hidden`, and the tabIndex assignment below
 * overwrites that attribute, which leaves the class as the only thing that
 * decides whether the button is on screen.
 */

const SCROLL_FROM = 400;

const backToTop = document.querySelector("[data-md-component=top]");

if (backToTop) {
  const updateBackToTop = () => {
    const visible = window.scrollY > SCROLL_FROM;
    backToTop.classList.toggle("is-visible", visible);
    backToTop.tabIndex = visible ? 0 : -1;
  };

  // document$ replays its latest value to late subscribers, so this runs once
  // on load even when the browser restored a scroll position and no scroll
  // event follows.
  document$.subscribe(updateBackToTop);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
}
