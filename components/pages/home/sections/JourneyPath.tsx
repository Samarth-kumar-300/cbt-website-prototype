// The growth path: a light track plus a foreground line through the five step nodes, drawn in
// the container's own coordinate space (1248 x 1939, the same aspect ratio as the section).
// GSAP draws [data-journey-path] and moves [data-journey-marker] along it. Without JavaScript
// or under reduced motion the path is fully drawn and the marker stays hidden.
// The line passes through the node centres: (672,168) (593,576) (620,959) (648,1378) (575,1775).
const PATH_D =
  "M672 0 L672 168 C700 372 565 372 593 576 C560 767 655 767 620 959 C590 1168 685 1168 648 1378 C690 1576 545 1576 575 1775 L575 1939";

export function JourneyPath() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1248 1939"
      preserveAspectRatio="none"
      fill="none"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    >
      <path d={PATH_D} stroke="#f0dff2" strokeWidth="6" strokeLinecap="round" />
      <path data-journey-path d={PATH_D} stroke="#c79acc" strokeWidth="6" strokeLinecap="round" />
      <g data-journey-marker opacity="0">
        <circle r="9" fill="#b55aba" stroke="#ffffff" strokeWidth="3" />
      </g>
    </svg>
  );
}
