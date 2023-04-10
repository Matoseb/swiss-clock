import './style.css'
import paper from 'paper'
import { addMilliseconds, hourToAngle, minuteToAngle, secondToAngle } from '/utils.js'
import { findClosest } from '/paper-utils.js'
import { getDeltaAngle, AngleSpring } from '/math-utils.js'

import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);
const fpsGraph = pane.addBlade({
  view: 'fpsgraph',
  label: 'fpsgraph',
});
pane.hidden = !import.meta.env.DEV;

console.log("https://matoseb.com");

paper.setup('paperCanvas');
const { view, project, Path, Tool, Point } = paper
const tool = new Tool();

let startTime = new Date() // 1971
let timeOffset = 0
let selectedNeedle = false

const springs = {
  seconds: new AngleSpring({
    drag: 0.9,
    strength: 0.1,
    value: snappySeconds(secondToAngle(startTime, false), 1.5),
  }),

  minutes: new AngleSpring({
    drag: 0.9,
    strength: 0.1,
    value: minuteToAngle(startTime, true),
  }),
  hours: new AngleSpring({
    drag: 0.9,
    strength: 0.1,
    value: hourToAngle(startTime, false),
  })
}

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

  // HOUR MARKS
  const path = new Path.Line({
    strokeColor: 'black',
    strokeWidth: 3.2,
    parent,
    to: [0, p - 11],
    from: [0, p],
  });

  path.rotate(angle, [0, 0]);

  // MINUTE MARKS
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
const needleHour = new paper.Group({
  data: {
    type: 'needle',
    timeFactor: 60 * 60 * 12,
  },
  pivot: [0, 0],
})
needleHour.applyMatrix = false
needleHour.parent = parent

new Path({
  segments: [[-2.5, -31.2], [2.5, -31.2], [3, 11.4], [-3, 11.4]],
  fillColor: 'black',
  parent: needleHour,
  closed: true,
});

// NEEDLE MIN
const needleMin = new paper.Group({
  data: {
    type: 'needle',
    timeFactor: 60 * 60,
  },
  pivot: [0, 0],
})
needleMin.applyMatrix = false
needleMin.parent = parent

new Path({
  segments: [[-1.78, -43.7], [1.78, -43.7], [2.35, 11.7], [-2.35, 11.7]],
  fillColor: 'black',
  parent: needleMin,
  closed: true,
});

// NEEDLE SEC
const needleSec = new paper.Group({
  data: {
    type: 'needle',
    timeFactor: 60,
  },
  pivot: [0, 0],
})

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

view.onResize = () => {

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

  fpsGraph.begin();

  if (!selectedNeedle) timeOffset += event.delta

  const time = addMilliseconds(startTime, timeOffset * 1000)
  const angleHour = hourToAngle(time, false);
  const angleMin = minuteToAngle(time, true);
  const angleSec = snappySeconds(secondToAngle(time, false), 1.5);

  needleSec.matrix.reset()
  needleSec.rotate(springs.seconds.update(angleSec, event.delta));

  needleMin.matrix.reset()
  needleMin.rotate(springs.minutes.update(angleMin, event.delta));

  needleHour.matrix.reset()
  needleHour.rotate(springs.hours.update(angleHour, event.delta));

  fpsGraph.end();
}

function snappySeconds(angleSec, delay) {
  const waitDelay = secondToAngle(delay);
  return Math.min(360, (angleSec % 360) / 360 * (360 + waitDelay))
}

function findNeedle(point) {
  const hitResult = project.hitTest(point, {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5,
    match: (hit) => findClosest(hit.item, isNeedle)
  });

  if (hitResult) return findClosest(hitResult.item, isNeedle)
}

tool.onMouseDown = (event) => {

  const foundNeedle = findNeedle(event.point);

  project.activeLayer.selected = false;
  if (foundNeedle) {
    selectedNeedle = foundNeedle;
    const anchor = selectedNeedle.localToGlobal(selectedNeedle.pivot)
    selectedNeedle.data.angle = findAngle(event.downPoint, anchor)
    setClass('--active', true);
  }
}


tool.onMouseMove = (event) => {
  const foundNeedle = findNeedle(event.point);
  setClass('--hover', foundNeedle);
}

tool.onMouseDrag = (event) => {
  if (!selectedNeedle) return;

  const anchor = selectedNeedle.localToGlobal(selectedNeedle.pivot)
  const newAngle = findAngle(event.lastPoint, anchor)
  const delta = getDeltaAngle(selectedNeedle.data.angle, newAngle)
  selectedNeedle.data.angle = newAngle
  timeOffset += delta / 360 * selectedNeedle.data.timeFactor;
}

tool.onMouseUp = (event) => {
  selectedNeedle = false
  setClass('--active', false);
}

function findAngle(p1, p2) {
  return p1.subtract(p2).angle
}

function isNeedle(item) {
  return item.data.type === 'needle'
}

function setClass(className, enable) {
  document.body.classList.toggle(className, Boolean(enable))
}