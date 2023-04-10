import { animation, math, time } from '@matoseb/utils'

export function findClosest(item, condition) {
  if (condition(item)) return item;
  if (item.parent) return findClosest(item.parent, condition);
  return null;
}


export function computeTime(time) {
  const fs = 1000;
  const fm = fs * 60;
  const fh = fm * 60;
  const fc = fh * 12;

  const ms = time.getMilliseconds();
  const ss = time.getSeconds() * fs;
  const mn = time.getMinutes() * fm;
  const hr = time.getHours() * fh;

  const as = Math.floor(time.getTime() / fs) * fs
  const am = Math.floor(time.getTime() / fm) * fm

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
      seconds: as,
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
    },
    time
  }
}
export function addMilliseconds(t, milliseconds) {
  const date = new Date(t.valueOf());
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};

export function hourToAngle(date, snap) {
  let hours = date.getHours()
  if (!snap) {
    const millis = date.getMilliseconds() / 1000 / 60 / 60
    const seconds = date.getSeconds() / 60 / 60
    const minutes = date.getMinutes() / 60
    hours += minutes + seconds + millis
  };
  return (hours) / 12 * (360)
}

export function minuteToAngle(date, snap) {
  const ms = date.getTime()
  let minutes = ms / (1000 * 60) // minutes since 1970

  if (snap) minutes = Math.floor(minutes)

  return minutes / 60 * 360
}

export function secondToAngle(seconds, snap) {
  if (seconds instanceof Date) {
    const ms = seconds.getTime()
    seconds = ms / (1000) // seconds since 1970
  }
  if (snap) seconds = Math.floor(seconds)
  return seconds / 60 * 360
}

export class AngleSpring extends animation.Spring {
  constructor(options) {
    super(options);
    this.delta = 0;
  }
  update(target) {
    this.delta = getDeltaAngle(this.target, target)
    this.target += this.delta
    return super.update();
  }
}

var mod = function (a, n) { return (a % n + n) % n; }
export function getDeltaAngle(current, target) {
  var a = mod((current - target), 360);
  var b = mod((target - current), 360);
  return a < b ? -a : b;
};

// export function absAngle(a, range = 360) {
//   // this yields correct counter-clock-wise numbers, like 350deg for -370
//   return (range + (a % range)) % range;
// }