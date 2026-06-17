/**
 * Calculate the final rotation for roulette wheel
 */
export const calculateRouletteRotation = (
  selectedIndex: number,
  totalItems: number,
  minSpins: number = 3
): number => {
  const degreesPerItem = 360 / totalItems;
  const targetDegree = selectedIndex * degreesPerItem;
  const extraSpins = minSpins * 360;

  // Add extra spins and target position
  return extraSpins + (360 - targetDegree);
};

/**
 * Get the selected index from rotation angle
 */
export const getSelectedIndexFromRotation = (
  rotation: number,
  totalItems: number
): number => {
  const normalizedRotation = rotation % 360;
  const degreesPerItem = 360 / totalItems;
  const index = Math.floor(normalizedRotation / degreesPerItem);

  return index % totalItems;
};

/**
 * Generate random spin duration
 */
export const getRandomSpinDuration = (min: number = 3000, max: number = 5000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
