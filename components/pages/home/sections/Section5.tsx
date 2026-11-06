import { TestimonialsSection } from "@/components/shared/TestimonialsSection";

// Mobile slides keep the order the Home carousel has always used; the desktop rail uses data order.
export function Section5() {
  return (
    <TestimonialsSection
      heading="Real experiences from the families we support"
      slideOrder={["mounila", "tejaswi", "chandrashekhar", "pavani"]}
      showMark
    />
  );
}
