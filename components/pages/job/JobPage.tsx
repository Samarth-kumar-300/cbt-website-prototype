"use client";

import { useCallback, useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { ApplyDialog } from "./ApplyDialog";
import type { Job } from "./content";
import { Section0 } from "./sections/Section0";
import { Section1 } from "./sections/Section1";

type Phase = "idle" | "form" | "success" | "applied";

export function JobPage({ job }: { job: Job }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const applied = phase === "applied";
  const onApply = useCallback(() => setPhase("form"), []);
  const onSubmitted = useCallback(() => setPhase("success"), []);
  const onDismiss = useCallback(
    () => setPhase((p) => (p === "success" ? "applied" : "idle")),
    [],
  );

  return (
    <>
      <Section0 job={job} applied={applied} onApply={onApply} />
      <Reveal>
        <Section1 job={job} applied={applied} onApply={onApply} />
      </Reveal>
      {phase === "form" || phase === "success" ? (
        <ApplyDialog
          job={job}
          view={phase}
          onDismiss={onDismiss}
          onSubmitted={onSubmitted}
        />
      ) : null}
    </>
  );
}
