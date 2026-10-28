#!/bin/bash
# Restores the files the image motion plan changes to their pre-change baseline copies, and removes
# the files the plan adds. Without --yes it only lists what it would do.
set -euo pipefail
cd "$(dirname "$0")/../../../.."   # cbt-site/
B=docs/superpowers/baselines/2026-10-14-image-motion
ADDED=(
  components/shared/image-motion.ts
  components/shared/MotionImage.tsx
  tests/unit/image-motion.test.ts
  tests/unit/motion-image.test.tsx
  tests/e2e/image-motion.spec.ts
)
YES=0; [ "${1:-}" = "--yes" ] && YES=1

while IFS= read -r f; do
  if [ $YES -eq 1 ]; then mkdir -p "$(dirname "$f")"; cp "$B/files/$f" "$f"; echo "restored $f"
  else echo "would restore $f"; fi
done < <(cd "$B/files" && find . -type f | sed 's|^\./||' | sort)

for f in "${ADDED[@]}"; do
  if [ -e "$f" ]; then
    if [ $YES -eq 1 ]; then rm "$f"; echo "removed  $f"; else echo "would remove $f"; fi
  fi
done

[ $YES -eq 1 ] || echo "Dry run. Re-run with --yes to apply."
