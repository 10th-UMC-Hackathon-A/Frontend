import React, { useEffect, useRef } from 'react';

interface LadderCanvasProps {
  participants: string[];
  destinations: string[];
  showResult?: boolean;
  className?: string;
}

export const LadderCanvas: React.FC<LadderCanvasProps> = ({
  participants,
  destinations,
  showResult = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw ladder logic here
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: Implement ladder drawing
  }, [participants, destinations, showResult]);

  return (
    <div className={`ladder-canvas-container ${className}`}>
      <div className="ladder-participants">
        {participants.map((name, idx) => (
          <div key={idx} className="ladder-participant">
            {name}
          </div>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className="ladder-canvas"
        width={800}
        height={600}
      />
      <div className="ladder-destinations">
        {destinations.map((dest, idx) => (
          <div key={idx} className="ladder-destination">
            {dest}
          </div>
        ))}
      </div>
    </div>
  );
};
