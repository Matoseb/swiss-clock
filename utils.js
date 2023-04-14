export function addMilliseconds(t, milliseconds) {
  const date = new Date(t.valueOf());
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};

export function hourToAngle(date, snap) {
  let hours = date.getHours()
  if (!snap) {
    // const millis = date.getMilliseconds() / 1000 / 60 / 60
    // const seconds = date.getSeconds() / 60 / 60
    const minutes = date.getMinutes() / 60
    // hours += minutes + seconds + millis
    hours += minutes
  };
  return hours / 12 * 360
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