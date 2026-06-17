/**
 * Generate a random integer between min (inclusive) and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Pick a random element from an array
 */
export const randomPick = <T>(array: T[]): T => {
  return array[randomInt(0, array.length - 1)];
};

/**
 * Generate random bomb positions for bomb game
 */
export const generateBombPositions = (totalCards: number, bombCount: number): number[] => {
  const positions: number[] = [];
  while (positions.length < bombCount) {
    const pos = randomInt(0, totalCards - 1);
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }
  return positions;
};
