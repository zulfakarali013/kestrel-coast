// Screen rectangles the HUD paints over in each view (tapes, panels, banner, aircraft), so world tags can keep clear of them.

export function hudKeepOut(w, h, cx, cy, cockpit, legend) {
  const r = [
    { x: cx - 338, y: cy - 172, w: 90, h: 372 },   // speed tape and its readouts
    { x: cx + 248, y: cy - 172, w: 90, h: 372 },   // altitude tape and its readouts
    { x: cx - 182, y: 22, w: 364, h: 64 },         // heading tape and box
    { x: cx - 240, y: 90, w: 480, h: 44 },         // callout banner
    { x: cx - 45, y: cy - 150, w: 90, h: 62 },     // target arrow's distance label
    { x: 18, y: 18, w: 286, h: 392 },              // sortie panel and pilot card
    { x: w - 284, y: 18, w: 268, h: !cockpit && legend ? 366 : 182 }, // aircraft card and legend
  ];
  if (cockpit) r.push({ x: 0, y: h * 0.66, w, h: h * 0.34 });  // instrument panel
  else r.push(
    { x: cx - 145, y: cy + 10, w: 290, h: 145 },   // the aircraft in chase view
    { x: 20, y: h - 190, w: 180, h: 175 },         // system bars
    { x: w - 200, y: h - 218, w: 184, h: 184 },    // minimap
    { x: cx - 395, y: h - 68, w: 790, h: 52 },     // controls bar
  );
  return r;
}
