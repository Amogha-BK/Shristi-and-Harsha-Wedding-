/** Whole seconds remaining until an absolute instant, independent of viewer timezone. */
export function getCountdownParts(target: number, now: number) {
  const totalSeconds = Math.max(0, Math.ceil((target - now) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    complete: totalSeconds === 0,
  };
}
