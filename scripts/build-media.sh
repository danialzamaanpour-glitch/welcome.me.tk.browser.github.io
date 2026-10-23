#!/usr/bin/env bash
# Rebuilds every derived media asset from the original uploads in ./assets:
#   - 121 scroll-scrub frames per breakpoint (one WebP per video frame)
#   - optimized hero / logo / still / section images
#
#   ./scripts/build-media.sh
#
# ffmpeg runs in a container, so nothing needs to be installed on the host.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FF=(docker run --rm -v "$ROOT:/w" --entrypoint ffmpeg linuxserver/ffmpeg:latest -y -v error)

mkdir -p "$ROOT/web/public/frames/desktop" "$ROOT/web/public/frames/mobile" "$ROOT/web/public/media"

echo "→ cinematic frames (desktop 1176px)"
"${FF[@]}" -i /w/assets/cinematic-source.mp4 -vf fps=24 \
  -c:v libwebp -quality 62 -compression_level 5 /w/web/public/frames/desktop/f%03d.webp

echo "→ cinematic frames (mobile 640px)"
"${FF[@]}" -i /w/assets/cinematic-source.mp4 -vf "fps=24,scale=640:-2" \
  -c:v libwebp -quality 58 -compression_level 5 /w/web/public/frames/mobile/f%03d.webp

echo "→ hero (branded opening scene)"
"${FF[@]}" -i /w/assets/hero.jpg -vf "scale=1920:-2" -q:v 3 /w/web/public/media/hero-1920.jpg
"${FF[@]}" -i /w/assets/hero.jpg -vf "scale=1600:-2" -q:v 4 /w/web/public/media/hero-1600.jpg
"${FF[@]}" -i /w/assets/hero.jpg -vf "scale=1024:-2" -q:v 5 /w/web/public/media/hero-1024.jpg

echo "→ brand mark + clean product still"
"${FF[@]}" -i /w/assets/logo.jpg -vf "scale=720:-2" -q:v 3 /w/web/public/media/logo-720.jpg
"${FF[@]}" -i /w/assets/still.png -vf "scale=1600:-2" -q:v 4 /w/web/public/media/still-1600.jpg
"${FF[@]}" -i /w/assets/still.png -vf "scale=900:-2" -q:v 6 /w/web/public/media/still-900.jpg

echo "→ section imagery"
"${FF[@]}" -i /w/assets/framed.jpg -vf "scale=1000:-2" -q:v 4 /w/web/public/media/framed-1000.jpg
"${FF[@]}" -i /w/assets/boxed.jpg -vf "scale=1200:-2" -q:v 4 /w/web/public/media/boxed-1200.jpg
"${FF[@]}" -i /w/assets/gallery.jpg -vf "scale=1800:-2" -q:v 4 /w/web/public/media/gallery-1800.jpg
"${FF[@]}" -i /w/assets/polaroids.jpg -vf "scale=900:-2" -q:v 4 /w/web/public/media/polaroids-900.jpg

echo "done: $(ls "$ROOT/web/public/frames/desktop" | wc -l) desktop frames, $(ls "$ROOT/web/public/frames/mobile" | wc -l) mobile frames"
