/**
 * Generate random ladder connections
 */
export const generateLadderConnections = (
  participants: number,
  levels: number
): number[][] => {
  const connections: number[][] = [];

  for (let level = 0; level < levels; level++) {
    const levelConnections: number[] = [];

    // Randomly decide which columns have horizontal connections
    for (let col = 0; col < participants - 1; col++) {
      if (Math.random() > 0.5) {
        levelConnections.push(col);
      }
    }

    connections.push(levelConnections);
  }

  return connections;
};

/**
 * Trace a path through the ladder from start position
 */
export const traceLadderPath = (
  startColumn: number,
  connections: number[][],
  _totalColumns: number
): number => {
  let currentColumn = startColumn;

  for (const levelConnections of connections) {
    // Check if there's a connection to the right
    if (levelConnections.includes(currentColumn)) {
      currentColumn += 1;
    }
    // Check if there's a connection from the left
    else if (currentColumn > 0 && levelConnections.includes(currentColumn - 1)) {
      currentColumn -= 1;
    }
  }

  return currentColumn;
};

/**
 * Generate ladder results mapping participants to destinations
 */
export const generateLadderResults = (
  participants: string[],
  destinations: string[]
): Map<string, string> => {
  const levels = 10; // Default number of ladder levels
  const connections = generateLadderConnections(participants.length, levels);
  const results = new Map<string, string>();

  participants.forEach((participant, index) => {
    const destinationIndex = traceLadderPath(index, connections, participants.length);
    results.set(participant, destinations[destinationIndex]);
  });

  return results;
};
