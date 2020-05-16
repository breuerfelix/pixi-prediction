function getNow(): () => number {
  if (!performance) {
    console.log('performance not found');
    return Date.now;
  }

  console.log(performance.now());
  return performance.now;
}

export const now = getNow();
export default now;
