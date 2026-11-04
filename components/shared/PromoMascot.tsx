import Image from 'next/image';

// Placement picked by eye: moved right 18px and down 19px from the card's bottom-right corner, 129px tall.
const X = 18;
const Y = 19;
const HEIGHT = 129;
// The cropped mascot is 439 x 520.
const WIDTH = Math.round((HEIGHT * 439) / 520);

/** The waving mascot in the bottom-right of the Learn menu's demo card. The card must be `relative overflow-hidden`. */
export function PromoMascot() {
  return (
    <Image
      src="/images/nav/mascot-waving.webp"
      alt=""
      aria-hidden="true"
      width={439}
      height={520}
      draggable={false}
      className="pointer-events-none absolute bottom-0 right-0 select-none"
      style={{ width: WIDTH, height: HEIGHT, transform: `translate(${X}px, ${Y}px)` }}
    />
  );
}
