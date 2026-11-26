// Places world-tag pills so none sits under a HUD tape or panel, over the aircraft, on a ring's rim, or over another tag; a moved pill keeps a pointer line to its place.

const PILL_H = 16, LIFT = 34;

// Area of the rect that lies on a ring's rim (the hole in the middle stays usable).
function onRim(a, ring) {
  let n = 0;
  for (let x = a.x; x < a.x + a.w; x += 4) for (let y = a.y; y < a.y + a.h; y += 4) {
    const d = Math.hypot(x - ring.cx, y - ring.cy);
    if (d > ring.r * 0.78 && d < ring.r * 1.12) n += 16;
  }
  return n;
}

function overlap(a, b) {
  if (b.rim) return onRim(a, b.rim);
  const x = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const y = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return x > 0 && y > 0 ? x * y : 0;
}

// tags: [{ x, y, text, kind, ring? }] with x/y the place on screen; widths: pill width per tag.
// keepOut: [{ x, y, w, h }] screen rectangles the HUD draws over. Returns [{ tag, px, top, tw }].
export function placeTags(tags, widths, keepOut, w, h) {
  const blocks = keepOut.slice();
  for (const t of tags) if (t.ring) blocks.push({ rim: t.ring, own: t });
  const placed = [];
  tags.forEach((t, i) => {
    const tw = widths[i];
    let best = null;
    for (const dy of [0, -26, 26, -52, 52]) {
      for (let dx = 0; dx <= 320; dx += 6) {
        for (const s of dx ? [-1, 1] : [1]) {
          const px = t.x + s * dx, top = t.y - LIFT + dy;
          const r = { x: px - tw / 2, y: top, w: tw, h: PILL_H };
          if (r.x < 4 || r.x + r.w > w - 4 || r.y < 4 || r.y + r.h > h - 4) continue;
          let hit = 0;
          for (const b of blocks) if (b.own !== t) hit += overlap(r, b);
          const cost = hit * 20 + dx + Math.abs(dy) * 2;
          if (!best || cost < best.cost) best = { tag: t, px, top, tw, cost, rect: r };
        }
      }
    }
    if (!best) return;
    blocks.push(best.rect);
    placed.push(best);
  });
  return placed;
}
