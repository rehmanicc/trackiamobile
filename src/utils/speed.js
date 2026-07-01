// Converts speed from knots (provided by Traccar) to km/h
export const toKmh = (speed) => {
  return (Number(speed) || 0) * 1.852;
};