export function formatTime(time) {

  const newTime = new Date(time);

  let hours = newTime.getHours();
  let minutes = newTime.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${hours}:${minutes}`
}
