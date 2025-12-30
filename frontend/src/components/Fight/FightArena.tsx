import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, Fade, Grow } from '@mui/material';
import { Replay, Home, PlayArrow, Pause } from '@mui/icons-material';
import { Brute, FightResult } from '../../types';
import { BruteRenderer } from '../Brute';

interface FightArenaProps {
  attacker: Brute;
  defender: Brute;
  result: FightResult;
  onReplay?: () => void;
  onBack?: () => void;
}

const FightArena: React.FC<FightArenaProps> = ({
  attacker,
  defender,
  result,
  onReplay,
  onBack,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [attackerHealth, setAttackerHealth] = useState(result.attackerInitialHealth);
  const [defenderHealth, setDefenderHealth] = useState(result.defenderInitialHealth);
  const [currentMessage, setCurrentMessage] = useState('¡Que comience el combate!');
  const [attackerAnimation, setAttackerAnimation] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [defenderAnimation, setDefenderAnimation] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [showDamage, setShowDamage] = useState<{ side: 'left' | 'right'; amount: number } | null>(null);
  
  // Arena background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrame: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }> = [];
    
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw arena gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height, 0,
        canvas.width / 2, canvas.height, canvas.width
      );
      gradient.addColorStop(0, 'rgba(139, 69, 19, 0.3)');
      gradient.addColorStop(0.5, 'rgba(15, 52, 96, 0.5)');
      gradient.addColorStop(1, 'rgba(26, 26, 46, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw arena floor
      const floorGradient = ctx.createLinearGradient(0, canvas.height * 0.65, 0, canvas.height);
      floorGradient.addColorStop(0, '#4a3728');
      floorGradient.addColorStop(1, '#2d1f15');
      ctx.fillStyle = floorGradient;
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.lineTo(canvas.width, canvas.height * 0.65);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw floor pattern
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const x = (i / 20) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height * 0.7 - (i * 0.25));
        ctx.lineTo(x + 50, canvas.height);
        ctx.stroke();
      }
      
      // Draw particles
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.life -= 1;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 50;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      
      // Draw VS emblem
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height * 0.35);
      
      // Emblem background
      ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();
      
      // VS text
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 28px MedievalSharp, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VS', 0, 0);
      ctx.restore();
      
      // Draw name labels
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 16px Cinzel, serif';
      ctx.textAlign = 'center';
      
      // Attacker name
      ctx.fillText(attacker.name, canvas.width * 0.25, canvas.height * 0.88);
      
      // Defender name
      ctx.fillText(defender.name, canvas.width * 0.75, canvas.height * 0.88);
      
      animationFrame = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [attacker.name, defender.name]);
  
  // Animation state machine
  useEffect(() => {
    if (!isPlaying || currentTurn >= result.log.length) {
      setIsPlaying(false);
      return;
    }
    
    const baseDelay = 1500;
    const delay = baseDelay / speed;
    
    const timer = setTimeout(() => {
      const entry = result.log[currentTurn];
      
      // Determine who is attacking
      const isAttackerAttacking = entry.attackerId === attacker.id;
      
      // Set animations
      if (isAttackerAttacking) {
        setAttackerAnimation('attack');
        setDefenderAnimation(entry.damage > 0 ? 'hit' : 'idle');
        if (entry.damage > 0) {
          setShowDamage({ side: 'right', amount: entry.damage });
        }
      } else {
        setDefenderAnimation('attack');
        setAttackerAnimation(entry.damage > 0 ? 'hit' : 'idle');
        if (entry.damage > 0) {
          setShowDamage({ side: 'left', amount: entry.damage });
        }
      }
      
      // Update health
      setAttackerHealth(entry.attackerHealthAfter);
      setDefenderHealth(entry.defenderHealthAfter);
      setCurrentMessage(entry.message);
      
      // Reset animations after a short delay
      setTimeout(() => {
        setAttackerAnimation('idle');
        setDefenderAnimation('idle');
        setShowDamage(null);
      }, delay * 0.6);
      
      setCurrentTurn(prev => prev + 1);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [currentTurn, isPlaying, result.log, attacker.id, speed]);
  
  const handleReplay = useCallback(() => {
    setCurrentTurn(0);
    setAttackerHealth(result.attackerInitialHealth);
    setDefenderHealth(result.defenderInitialHealth);
    setCurrentMessage('¡Que comience el combate!');
    setAttackerAnimation('idle');
    setDefenderAnimation('idle');
    setIsPlaying(true);
    onReplay?.();
  }, [result.attackerInitialHealth, result.defenderInitialHealth, onReplay]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const cycleSpeed = () => {
    setSpeed(prev => prev >= 4 ? 1 : prev * 2);
  };
  
  const isVictory = result.winnerId === attacker.id;
  const isFightOver = currentTurn >= result.log.length;
  
  return (
    <Box>
      {/* Arena Container */}
      <Paper
        sx={{
          position: 'relative',
          mb: 2,
          overflow: 'hidden',
          borderRadius: 2,
          border: '3px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          width={600}
          height={350}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
        
        {/* Brute Renderers (positioned over canvas) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Attacker */}
          <Box
            sx={{
              transform: `translateX(${attackerAnimation === 'attack' ? 30 : attackerAnimation === 'hit' ? -15 : 0}px)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <BruteRenderer
              identifier={attacker.identifier}
              gender={attacker.gender}
              skinColor={attacker.skinColor}
              hairColor={attacker.hairColor}
              clothingColor={attacker.clothingColor}
              bodyType={attacker.bodyType}
              headType={attacker.headType}
              hairType={attacker.hairType}
              size={120}
              animation={attackerAnimation}
            />
            
            {/* Damage indicator */}
            <Fade in={showDamage?.side === 'left'}>
              <Typography
                sx={{
                  position: 'absolute',
                  top: '20%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#dc3545',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textShadow: '0 0 10px rgba(220, 53, 69, 0.8)',
                }}
              >
                -{showDamage?.amount}
              </Typography>
            </Fade>
          </Box>
          
          {/* Defender */}
          <Box
            sx={{
              transform: `translateX(${defenderAnimation === 'attack' ? -30 : defenderAnimation === 'hit' ? 15 : 0}px) scaleX(-1)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <BruteRenderer
              identifier={defender.identifier}
              gender={defender.gender}
              skinColor={defender.skinColor}
              hairColor={defender.hairColor}
              clothingColor={defender.clothingColor}
              bodyType={defender.bodyType}
              headType={defender.headType}
              hairType={defender.hairType}
              size={120}
              animation={defenderAnimation}
            />
            
            {/* Damage indicator */}
            <Fade in={showDamage?.side === 'right'}>
              <Typography
                sx={{
                  position: 'absolute',
                  top: '20%',
                  right: '50%',
                  transform: 'translateX(50%)',
                  color: '#dc3545',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textShadow: '0 0 10px rgba(220, 53, 69, 0.8)',
                }}
              >
                -{showDamage?.amount}
              </Typography>
            </Fade>
          </Box>
        </Box>
        
        {/* Controls overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={togglePlay}
            sx={{ minWidth: 40, bgcolor: 'rgba(0,0,0,0.5)' }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={cycleSpeed}
            sx={{ minWidth: 40, bgcolor: 'rgba(0,0,0,0.5)' }}
          >
            {speed}x
          </Button>
        </Box>
        
        {/* Turn counter */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'rgba(0,0,0,0.5)',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">
            Turno {Math.min(currentTurn + 1, result.log.length)} / {result.log.length}
          </Typography>
        </Box>
      </Paper>
      
      {/* Health Bars */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {attacker.name}
            </Typography>
            <Typography variant="body2">
              {Math.max(0, attackerHealth)} / {result.attackerInitialHealth}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(Math.max(0, attackerHealth) / result.attackerInitialHealth) * 100}
            sx={{
              height: 24,
              borderRadius: 1,
              bgcolor: 'rgba(220, 53, 69, 0.2)',
              border: '2px solid rgba(220, 53, 69, 0.5)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #dc3545 0%, #ff6b6b 100%)',
                transition: 'transform 0.3s ease-out',
              },
            }}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="error.main" fontWeight={600}>
              {defender.name}
            </Typography>
            <Typography variant="body2">
              {Math.max(0, defenderHealth)} / {result.defenderInitialHealth}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(Math.max(0, defenderHealth) / result.defenderInitialHealth) * 100}
            sx={{
              height: 24,
              borderRadius: 1,
              bgcolor: 'rgba(220, 53, 69, 0.2)',
              border: '2px solid rgba(220, 53, 69, 0.5)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #e74c5e 0%, #a71d2a 100%)',
                transition: 'transform 0.3s ease-out',
              },
            }}
          />
        </Box>
      </Box>
      
      {/* Current Action Message */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          textAlign: 'center',
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          {currentMessage}
        </Typography>
      </Paper>
      
      {/* Result Banner */}
      {isFightOver && (
        <Grow in={isFightOver}>
          <Paper
            sx={{
              p: 4,
              mb: 2,
              textAlign: 'center',
              background: isVictory
                ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)'
                : 'linear-gradient(135deg, rgba(220, 53, 69, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)',
              border: `3px solid ${isVictory ? '#28a745' : '#dc3545'}`,
              boxShadow: `0 0 30px ${isVictory ? 'rgba(40, 167, 69, 0.3)' : 'rgba(220, 53, 69, 0.3)'}`,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"MedievalSharp", cursive',
                color: isVictory ? '#28a745' : '#dc3545',
                mb: 1,
                textShadow: `0 0 20px ${isVictory ? 'rgba(40, 167, 69, 0.5)' : 'rgba(220, 53, 69, 0.5)'}`,
              }}
            >
              {isVictory ? '¡VICTORIA!' : 'DERROTA'}
            </Typography>
            <Typography variant="h6">
              {isVictory ? attacker.name : defender.name} ha ganado el combate
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              +{isVictory ? result.winnerExpGained : result.loserExpGained} XP
            </Typography>
          </Paper>
        </Grow>
      )}
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Replay />}
          onClick={handleReplay}
        >
          Repetir
        </Button>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={onBack}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default FightArena;
