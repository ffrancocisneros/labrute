import React, { useEffect, useRef, useMemo } from 'react';
import { Box } from '@mui/material';

interface BruteRendererProps {
  identifier: string;
  gender: string;
  skinColor: string;
  hairColor: string;
  clothingColor: string;
  bodyType?: number;
  headType?: number;
  hairType?: number;
  size?: number;
  animation?: 'idle' | 'attack' | 'hit' | 'death';
  showShadow?: boolean;
}

/**
 * BruteRenderer - Renders a brute character using canvas
 * Based on the original game's sprite system
 */
const BruteRenderer: React.FC<BruteRendererProps> = ({
  identifier,
  gender,
  skinColor,
  hairColor,
  clothingColor,
  bodyType = 0,
  headType = 0,
  hairType = 0,
  size = 100,
  animation = 'idle',
  showShadow = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animationRef = useRef<number>();
  
  // Generate deterministic appearance from identifier
  const appearance = useMemo(() => {
    // Use identifier to seed random appearance variations
    const seed = parseInt(identifier.slice(-8) || '0', 16) || 0;
    const random = (n: number) => ((seed * (n + 1) * 9301 + 49297) % 233280) / 233280;
    
    return {
      bodyWidth: 0.8 + random(1) * 0.4,
      headSize: 0.9 + random(2) * 0.3,
      armLength: 0.9 + random(3) * 0.2,
      legLength: 0.9 + random(4) * 0.2,
      eyeSize: random(5) * 0.3 + 0.7,
      eyeDistance: random(6) * 0.2 + 0.4,
    };
  }, [identifier]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.85;
    const scale = size / 100;
    
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Animation frame calculation
      const time = Date.now() / 1000;
      const idleOffset = Math.sin(time * 2) * 2;
      const breathe = Math.sin(time * 1.5) * 1.5;
      
      // Draw shadow
      if (showShadow) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 5, 25 * scale * appearance.bodyWidth, 8 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw legs
      const legY = centerY - 25 * scale;
      const legSpread = 12 * scale;
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 8 * scale;
      ctx.lineCap = 'round';
      
      // Left leg
      ctx.beginPath();
      ctx.moveTo(centerX - legSpread, legY);
      ctx.lineTo(centerX - legSpread - 3, centerY - 5);
      ctx.stroke();
      
      // Right leg
      ctx.beginPath();
      ctx.moveTo(centerX + legSpread, legY);
      ctx.lineTo(centerX + legSpread + 3, centerY - 5);
      ctx.stroke();
      
      // Draw boots
      ctx.fillStyle = '#3d3d3d';
      ctx.beginPath();
      ctx.ellipse(centerX - legSpread - 3, centerY, 8 * scale, 5 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(centerX + legSpread + 3, centerY, 8 * scale, 5 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw body/torso
      const bodyY = centerY - 50 * scale + idleOffset;
      ctx.fillStyle = clothingColor;
      ctx.beginPath();
      ctx.ellipse(centerX, bodyY, 22 * scale * appearance.bodyWidth, 28 * scale + breathe, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Body outline
      ctx.strokeStyle = adjustColor(clothingColor, -30);
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      
      // Draw arms
      const armY = bodyY - 5 * scale;
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 7 * scale;
      
      // Left arm
      const leftArmAngle = animation === 'attack' ? Math.sin(time * 10) * 0.3 : 0.3;
      ctx.beginPath();
      ctx.moveTo(centerX - 20 * scale * appearance.bodyWidth, armY);
      ctx.lineTo(
        centerX - 35 * scale * appearance.armLength - Math.sin(leftArmAngle) * 10,
        armY + 25 * scale + Math.cos(leftArmAngle) * 10
      );
      ctx.stroke();
      
      // Right arm  
      const rightArmAngle = animation === 'attack' ? -0.5 + Math.sin(time * 10) * 0.5 : -0.3;
      ctx.beginPath();
      ctx.moveTo(centerX + 20 * scale * appearance.bodyWidth, armY);
      ctx.lineTo(
        centerX + 35 * scale * appearance.armLength + Math.sin(rightArmAngle) * 10,
        armY + 25 * scale - Math.cos(rightArmAngle) * 10
      );
      ctx.stroke();
      
      // Draw hands
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(
        centerX - 35 * scale * appearance.armLength - Math.sin(leftArmAngle) * 10,
        armY + 25 * scale + Math.cos(leftArmAngle) * 10,
        5 * scale,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(
        centerX + 35 * scale * appearance.armLength + Math.sin(rightArmAngle) * 10,
        armY + 25 * scale - Math.cos(rightArmAngle) * 10,
        5 * scale,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Draw head
      const headY = bodyY - 35 * scale + idleOffset;
      const headRadius = 18 * scale * appearance.headSize;
      
      // Head base
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw hair
      drawHair(ctx, centerX, headY, headRadius, hairColor, hairType, gender);
      
      // Draw face
      drawFace(ctx, centerX, headY, headRadius, appearance, animation, time);
      
      // Continue animation
      frameRef.current++;
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [identifier, gender, skinColor, hairColor, clothingColor, bodyType, headType, hairType, size, animation, showShadow, appearance]);
  
  return (
    <Box
      sx={{
        display: 'inline-block',
        lineHeight: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
        }}
      />
    </Box>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Draw hair based on type and gender
function drawHair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  headRadius: number,
  color: string,
  type: number,
  gender: string
) {
  ctx.fillStyle = color;
  ctx.strokeStyle = adjustColor(color, -30);
  ctx.lineWidth = 1;
  
  switch (type % 5) {
    case 0: // Short spiky
      for (let i = -3; i <= 3; i++) {
        const angle = -Math.PI / 2 + (i * Math.PI / 10);
        const spikeLength = headRadius * (0.3 + Math.abs(i) * 0.1);
        ctx.beginPath();
        ctx.moveTo(
          x + Math.cos(angle) * headRadius * 0.8,
          y + Math.sin(angle) * headRadius * 0.8
        );
        ctx.lineTo(
          x + Math.cos(angle) * (headRadius + spikeLength),
          y + Math.sin(angle) * (headRadius + spikeLength) - 5
        );
        ctx.lineTo(
          x + Math.cos(angle + 0.2) * headRadius * 0.9,
          y + Math.sin(angle + 0.2) * headRadius * 0.9
        );
        ctx.fill();
      }
      break;
      
    case 1: // Mohawk
      ctx.beginPath();
      ctx.moveTo(x - headRadius * 0.3, y - headRadius * 0.5);
      ctx.lineTo(x, y - headRadius * 1.5);
      ctx.lineTo(x + headRadius * 0.3, y - headRadius * 0.5);
      ctx.fill();
      break;
      
    case 2: // Bald (just draw head shape)
      break;
      
    case 3: // Long hair
      ctx.beginPath();
      ctx.ellipse(x, y - headRadius * 0.3, headRadius * 1.2, headRadius * 1.4, 0, Math.PI, 0);
      ctx.fill();
      if (gender === 'female') {
        // Add longer strands
        ctx.beginPath();
        ctx.moveTo(x - headRadius, y);
        ctx.quadraticCurveTo(x - headRadius * 1.2, y + headRadius * 1.5, x - headRadius * 0.5, y + headRadius * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + headRadius, y);
        ctx.quadraticCurveTo(x + headRadius * 1.2, y + headRadius * 1.5, x + headRadius * 0.5, y + headRadius * 2);
        ctx.stroke();
      }
      break;
      
    case 4: // Curly
      for (let i = 0; i < 8; i++) {
        const angle = -Math.PI + (i * Math.PI / 4);
        ctx.beginPath();
        ctx.arc(
          x + Math.cos(angle) * headRadius * 0.9,
          y + Math.sin(angle) * headRadius * 0.9 - headRadius * 0.2,
          headRadius * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      break;
  }
}

// Draw face
function drawFace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  headRadius: number,
  appearance: { eyeSize: number; eyeDistance: number },
  animation: string,
  time: number
) {
  const eyeY = y - headRadius * 0.1;
  const eyeX = headRadius * appearance.eyeDistance;
  const eyeSize = headRadius * 0.15 * appearance.eyeSize;
  
  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x - eyeX, eyeY, eyeSize * 1.2, eyeSize, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + eyeX, eyeY, eyeSize * 1.2, eyeSize, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupils
  const blinkOffset = Math.sin(time * 3) > 0.95 ? eyeSize * 0.8 : 0;
  ctx.fillStyle = '#2d2d2d';
  if (blinkOffset === 0) {
    ctx.beginPath();
    ctx.arc(x - eyeX, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + eyeX, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Mouth
  const mouthY = y + headRadius * 0.35;
  ctx.strokeStyle = '#4a3728';
  ctx.lineWidth = 2;
  
  if (animation === 'attack') {
    // Open mouth (yelling)
    ctx.fillStyle = '#3d2d2d';
    ctx.beginPath();
    ctx.ellipse(x, mouthY, headRadius * 0.2, headRadius * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (animation === 'hit') {
    // Grimace
    ctx.beginPath();
    ctx.moveTo(x - headRadius * 0.2, mouthY);
    ctx.lineTo(x + headRadius * 0.2, mouthY + headRadius * 0.1);
    ctx.stroke();
  } else {
    // Normal smile
    ctx.beginPath();
    ctx.arc(x, mouthY - headRadius * 0.1, headRadius * 0.15, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }
}

export default BruteRenderer;

