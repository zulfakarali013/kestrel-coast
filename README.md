# Kestrel Coast

[![make.fun bounty](https://make.fun/badge/best-flight-game-20261126-0057.svg)](https://make.fun/bounty/best-flight-game-20261126-0057)
[![rank](https://make.fun/badge/best-flight-game-20261126-0057/zulfakarali013/kestrel-coast/rank.svg)](https://make.fun/bounty/best-flight-game-20261126-0057)
[![reward](https://make.fun/badge/best-flight-game-20261126-0057/zulfakarali013/kestrel-coast/reward.svg)](https://make.fun/bounty/best-flight-game-20261126-0057)

An original browser flight game. You fly the Kestrel K-2, a little high-wing tourer, over one island
with three airfields, in four sorties with different goals:

| Sortie | Goal | What makes it hard |
| --- | --- | --- |
| **First Light** (circuit) | Take off, fly five circuit rings, land back on runway 07 | A tidy landing on the numbers scores most |
| **Lighthouse Mail** (ferry) | Carry the mail to Gull Island | A third of a tank and a headwind: lean the throttle |
| **Ridge Run** (slalom) | Nine rings through the northern ridges | Time and low flying score; rock does not forgive |
| **High Meadow Supply** (short field) | Land on a short strip at 1,350 ft | Gusting crosswind, stop before the trees |

Fuel burns with throttle; damage from hard landings, overspeed and over-g leaks fuel and shows as smoke.
Touchdowns are graded on sink rate, centreline, touchdown zone and bank ("Greaser" to "Hard landing"),
and crashes say what happened (sink rate, wingtip strike, ditching, hillside).

## Play

```
node serve.ts      # then open http://localhost:8080
```

Keys: **W/S** pitch · **A/D** roll · **Q/E** rudder · **Shift/Ctrl** or mouse wheel throttle · **G/V** flaps ·
**Space** brakes · click to fly with the mouse · right-drag to look · **C** chase / cockpit / tower ·
**P** pause · **M** mute · **Esc** mission board.

## How it is built

No build step and no network request: `game/index.html` loads ES modules from `game/src/`, one job per file in ten folders (core, world, sky, airfields, aircraft, flight, mission, hud, ui, game and more), and three.js
from `game/vendor/three.module.min.js` through an import map. Sounds are synthesised with WebAudio.

| File | What it does |
|---|---|
| `src/main.js` | Kestrel Coast starts here: size the view, then open the mission board (or pose a screenshot with ?shot=). |
| `src/aircraft/control-surfaces.js` | Moves the ailerons, elevator, rudder and flaps and spins the prop from the pilot's inputs. |
| `src/aircraft/kestrel-model.js` | Builds the Kestrel K-2: fuselage, high wing, tail, hinged control surfaces, prop and gear. |
| `src/airfields/airfield-mesh.js` | Builds an airfield: strip, edge and approach lights, hangar, tower and windsock. |
| `src/airfields/fields.js` | The three airfields as data: where they are, which way the runway points, how long it is. |
| `src/airfields/runway-frame.js` | Converts between world positions and runway coordinates (along and across the centreline). |
| `src/airfields/runway-texture.js` | Paints the runway surface: centreline, threshold bars and the runway numbers. |
| `src/audio/chimes.js` | Ring chime and crash thud. |
| `src/audio/engine-sound.js` | Synthesised engine, wind and stall horn that follow throttle, airspeed and angle of attack. |
| `src/core/config.js` | Tuning numbers: world size, the Kestrel K-2's airframe, landing limits and unit conversions. |
| `src/core/noise.js` | Seeded random numbers and value noise (fbm, ridges) that shape the island the same way every time. |
| `src/flight/atmosphere.js` | Air density falling off with altitude. |
| `src/flight/crash.js` | Ends the flight with a crash and the plain-language reason for it. |
| `src/flight/dynamics.js` | One physics step: lift, drag, thrust, stall, fuel burn, damage, ground roll and touchdown judgement. |
| `src/flight/fuel-range.js` | How far the fuel left will carry the aircraft at the current throttle, and whether that reaches a point. |
| `src/flight/state.js` | The aircraft's flight state, placing it on a runway or in the air, and reading heading and attitude. |
| `src/fx/bursts.js` | Touchdown dust and crash fireballs. |
| `src/fx/particles.js` | One pool of particles for smoke, dust and fire, and the damage smoke trail. |
| `src/game/fixed-step.js` | The physics clock: steps the flight model at 120 Hz, then the sortie, then its chimes and callouts. |
| `src/game/frame.js` | One drawn frame: step the game (or the idle flight behind the board), move the aircraft and camera, render, draw the HUD. |
| `src/game/game-state.js` | The one game object every part of the loop shares: world, flight, sortie, input, camera, HUD, sound. |
| `src/game/hotkeys.js` | One-shot keys: camera, pause, mute, flap notches, back to the board, start. |
| `src/game/resize.js` | Keeps the 3D view and the HUD canvas the size of the window. |
| `src/game/session.js` | Moving between screens: open the mission board, start a sortie, end it with a debrief. |
| `src/hud/aircraft-panel.js` | Top-right card: the aircraft's state as decisions — will the fuel reach, what is the wind doing, how hurt is it. |
| `src/hud/approach-guide.js` | Approach lights in the HUD: four lamps like a runway's PAPI, the glide angle, and the centreline offset. |
| `src/hud/callouts.js` | Big centre-screen callouts ("RING 3 ✓", "GREASER") that fade after a few seconds. |
| `src/hud/cockpit-panel.js` | The instrument panel drawn in cockpit view: airspeed, attitude, altitude, heading, climb and fuel. |
| `src/hud/controls-bar.js` | The key strip along the bottom: every control in view, with the current camera named. |
| `src/hud/gauges.js` | Bar meters for the HUD and the round lit gauges and attitude ball for the cockpit. |
| `src/hud/hud.js` | The heads-up display drawn on a 2D canvas over the 3D view: lays out every HUD part for one frame. |
| `src/hud/minimap.js` | The north-up minimap: coastline, airfields, rings and the aircraft. |
| `src/hud/pitch-ladder.js` | Pitch ladder, horizon, flight-path marker and bank scale. |
| `src/hud/sortie-panel.js` | Top-left card: the sortie's name, clock against par, and its checklist with ticks and misses. |
| `src/hud/style.js` | The HUD's look: its colours, glowing text and outlined boxes. |
| `src/hud/system-bars.js` | The four bars bottom-left: throttle, fuel, flaps and hull, each turning amber then red as it matters. |
| `src/hud/tape-readouts.js` | Small readouts under the tapes: height above ground and climb rate on the right, g-load and angle of attack on the left. |
| `src/hud/tapes.js` | Speed and altitude tapes and the heading tape. |
| `src/hud/target-arrow.js` | The arrow that points to the next ring or the destination runway, with its distance. |
| `src/hud/warnings.js` | Flashing warnings: stall, fuel, sink rate near the ground, overspeed, brakes. |
| `src/hud/windscreen.js` | The K-2's windscreen seen from the left seat: roof bow, two corner pillars and the glareshield lip. |
| `src/input/controls.js` | Keyboard and mouse into one set of controls: stick, rudder, throttle and brakes. |
| `src/input/keyboard.js` | Which keys are held and which were just pressed. |
| `src/mission/checklist.js` | The sortie written out as a checklist: what is done, what was missed, what is next. |
| `src/mission/landing-grade.js` | Grades a touchdown 0 to 100 and names it, from "Greaser" to "Hard landing". |
| `src/mission/missions.js` | The four sorties: where they start, their rings, fuel, wind, par time and where they end. |
| `src/mission/objective.js` | What the pilot should do right now, and where the HUD arrow should point. |
| `src/mission/rings.js` | Puts a sortie's rings in the world and tells which side of a ring the aircraft is on. |
| `src/mission/scoring.js` | Scores a finished sortie: rings, time against par, the landing and low flying, then the stars. |
| `src/mission/sortie-progress.js` | Follows a sortie as it is flown: ring passes, the landing, success and every way to fail. |
| `src/shots/poses.js` | Screenshot poses: ?shot=cover/cockpit/ridge/board puts the game in a fixed moment so the maker's |
| `src/sky/clouds.js` | Clusters of soft cloud puffs at 900 to 1,400 m. |
| `src/sky/sky-dome.js` | Sky dome with the low sun, haze and the hemisphere and sun lights. |
| `src/ui/best-scores.js` | Best score and stars per sortie, kept in the browser. |
| `src/ui/debrief.js` | The debrief after a sortie: what happened, the touchdown, the flight log, the score breakdown and stars. |
| `src/ui/mission-board.js` | The mission board: pick a sortie and see its goal, fuel, weather and best score. |
| `src/ui/touchdown-chart.js` | A small drawing of the runway seen from above, with the touchdown zone and where the wheels met it. |
| `src/view/camera-rig.js` | The three camera views and switching between them. |
| `src/view/follow-camera.js` | Moves the camera each frame: a lagging chase view, the cockpit eye, or the tower. |
| `src/world/build-world.js` | Puts the whole world on stage: renderer, sky, island, sea, trees, landmarks, clouds, airfields and the aircraft. |
| `src/world/ground-colours.js` | Sand, grass, forest, rock and snow: the colour of the ground by height and slope. |
| `src/world/height.js` | Ground height anywhere on the map, with every airfield levelled; shared by meshes and the flight model. |
| `src/world/islands.js` | Where the two islands are and the raw shape of their hills and northern peaks. |
| `src/world/landmarks.js` | The Gull Point lighthouse and the harbour village: landmarks to steer by. |
| `src/world/sea.js` | The sea plane around the islands. |
| `src/world/terrain-mesh.js` | Builds the island mesh from the height field, flat-shaded with vertex colours. |
| `src/world/trees.js` | Plants pines and broadleaf trees on gentle green slopes, never on a runway. |

The screenshots are real renders of this code, taken with `node tools/shoot.mjs` and stored as one-line
base64 text in `screenshots/`; `main.ts` decodes them. `node tools/flight-test.mjs` flies the model headless
(cruise, turn, takeoff, stall, landing).

Built by an AI agent (Muse) for make.fun's "Make the best flight game" bounty. MIT licensed.
