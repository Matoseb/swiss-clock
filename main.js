import './style.css'
import paper from 'paper'
import { animation } from '@matoseb/utils'

// javascript paper.js base template
// Keep global references to both tools, so the HTML
// links below can access them.
var tool1;

paper.setup('paperCanvas');
const { view, project, Path, Tool, Point } = paper

const startTime = new Date()
// // group
const mnSpring = new animation.Spring({
  drag: 0.9,
  strength: 0.1,
  value: computeTime(startTime).relative.minutes,
});

const margin = 200
const parent = new paper.Group();
parent.applyMatrix = false

// FRAME
new Path.Circle({
  fillColor: 'white',
  strokeWidth: 0.1,
  parent,
  radius: 100 / 2,
});

// CADRAN
for (let i = 0; i < 12; i++) {
  const angle = i / 12 * 360;
  const p = 93 / 2

  const path = new Path.Line({
    strokeColor: 'black',
    strokeWidth: 3.2,
    parent,
    to: [0, p - 11],
    from: [0, p],
  });

  path.rotate(angle, [0, 0]);

  for (let j = 0; j < 4; j++) {
    const angle2 = (j + 1) / 5 * 360 / 12 + angle;
    const path = new Path.Line({
      strokeColor: 'black',
      strokeWidth: 1.2,
      parent,
      to: [0, p - 3.6],
      from: [0, p],
    });
    path.rotate(angle2, [0, 0]);
  }
}

// NEEDLE HOUR
const needleHour = new paper.Group()
needleHour.applyMatrix = false
needleHour.parent = parent

new Path({
  segments: [[-2.5, -31.2], [2.5, -31.2], [3, 11.4], [-3, 11.4]],
  fillColor: 'black',
  parent: needleHour,
  closed: true,
});

// NEEDLE MIN
const needleMin = new paper.Group()
needleMin.applyMatrix = false
needleMin.parent = parent

new Path({
  segments: [[-1.78, -43.7], [1.78, -43.7], [2.35, 11.7], [-2.35, 11.7]],
  fillColor: 'black',
  parent: needleMin,
  closed: true,
});

// NEEDLE SEC
const needleSec = new paper.Group()
const anchor = new Point(0, -30);
needleSec.applyMatrix = false
needleSec.parent = parent

new Path.Line({
  strokeColor: 'red',
  strokeWidth: 1.37,
  parent: needleSec,
  from: anchor,
  to: [0, 16.23],
});

new Path.Circle({
  fillColor: 'red',
  parent: needleSec,
  radius: 4.9,
  position: anchor,
});

parent.fullySelected = true;

view.onResize = (event) => {

  // stroke scaling

  parent.matrix.reset()
  parent.strokeScaling = true;
  parent.position = view.center;

  const { width, height } = view.size;
  const min = Math.min(width, height);

  const scale = Math.max(min, 0) / 100;
  parent.scale(scale);
}
view.onResize();

view.onFrame = (event) => {
  const d = addMilliseconds(startTime, event.time * 1000)
  const t = computeTime(d);

  const waitDelay = t.secondToMillis(1.5);
  const angleSec = Math.min(1, (t.continuous.seconds / t.asMillis.minutes) * (1 + waitDelay / t.asMillis.minutes)) * 360;
  const angleHour = t.continuous.hours / t.asMillis.twelveHours * 360;

  let sm = mnSpring.update(t.relative.minutes)
  const angleMin = sm / t.asMillis.hours * 360;

  needleSec.matrix.reset()
  needleSec.rotate(angleSec, [0, 0]);

  needleMin.matrix.reset()
  needleMin.rotate(angleMin, [0, 0]);

  needleHour.matrix.reset()
  needleHour.rotate(angleHour, [0, 0]);
}

// // Create two drawing tools.
// // tool1 will draw straight lines,
// // tool2 will draw clouds.

// // Both share the mouseDown event:
// let path;

// tool1 = new Tool();

// tool1.onMouseDown = (event) => {
//   path = new Path();
//   path.strokeColor = 'black';
//   path.add(event.point);
// }

function computeTime(t) {
  const fs = 1000;
  const fm = fs * 60;
  const fh = fm * 60;
  const fc = fh * 12;

  const ms = t.getMilliseconds();
  const ss = t.getSeconds() * fs;
  const mn = t.getMinutes() * fm;
  const hr = t.getHours() * fh;

  const am = Math.floor(t.getTime() / fm) * fm


  const cs = ss + ms
  const cm = mn + cs
  const ch = hr + cm

  return {
    asMillis: {
      seconds: fs,
      minutes: fm,
      hours: fh,
      twelveHours: fc,
    },
    absolute: {
      minutes: am,
    },
    relative: {
      millis: ms,
      seconds: ss,
      minutes: mn,
      hours: hr,
    },
    continuous: {
      seconds: cs,
      minutes: cm,
      hours: ch,
    },
    secondToMillis(seconds) {
      return seconds * fs;
    }
  }
}
function addMilliseconds(t, milliseconds) {
  const date = new Date(t.valueOf());
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};