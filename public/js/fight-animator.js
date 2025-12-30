/**
 * LaBrute Fight Animator
 * Sistema de animación de peleas basado en el juego original
 */

class FightAnimator {
    constructor(canvasId, fightData) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.fightData = fightData;
        this.currentFrame = 0;
        this.isPlaying = false;
        this.animationSpeed = 100; // ms entre frames
        this.brute1 = null;
        this.brute2 = null;
        this.sprites = {};
        this.effects = [];
        
        // Arena dimensions
        this.arenaWidth = 500;
        this.arenaHeight = 300;
        this.canvas.width = this.arenaWidth;
        this.canvas.height = this.arenaHeight;
        
        this.init();
    }
    
    async init() {
        // Load sprites
        await this.loadSprites();
        
        // Initialize brutes
        this.brute1 = {
            name: this.fightData.brute1_name,
            health: this.fightData.brute1_initial_health,
            maxHealth: this.fightData.brute1_initial_health,
            x: 100,
            y: 200,
            facing: 'right',
            sprite: null
        };
        
        this.brute2 = {
            name: this.fightData.brute2_name,
            health: this.fightData.brute2_initial_health,
            maxHealth: this.fightData.brute2_initial_health,
            x: 400,
            y: 200,
            facing: 'left',
            sprite: null
        };
        
        // Draw initial state
        this.draw();
    }
    
    async loadSprites() {
        // Load brute sprites (simplified - will use placeholder for now)
        // In full implementation, would load from original-game/swf-exported/perso/sprites
        // For now, create placeholder sprites
        this.sprites.brute = this.createBruteSprite();
        this.sprites.blood = this.createEffectSprite('#8b2020');
        this.sprites.impact = this.createEffectSprite('#d4a855');
    }
    
    createBruteSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        // Draw brute body (simplified - will use actual sprites later)
        // Head
        ctx.fillStyle = '#d4a855';
        ctx.beginPath();
        ctx.arc(30, 15, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillStyle = '#8b2020';
        ctx.fillRect(20, 25, 20, 30);
        
        // Arms
        ctx.fillRect(15, 27, 8, 20);
        ctx.fillRect(37, 27, 8, 20);
        
        // Legs
        ctx.fillRect(22, 55, 8, 20);
        ctx.fillRect(30, 55, 8, 20);
        
        // Outline
        ctx.strokeStyle = '#1a1410';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        return canvas;
    }
    
    createEffectSprite(color) {
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 30;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(15, 15, 12, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }
    
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                // Fallback to placeholder
                const placeholder = document.createElement('canvas');
                placeholder.width = 50;
                placeholder.height = 50;
                const ctx = placeholder.getContext('2d');
                ctx.fillStyle = '#8b2020';
                ctx.fillRect(0, 0, 50, 50);
                resolve(placeholder);
            };
            img.src = src;
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.arenaWidth, this.arenaHeight);
        
        // Draw arena background
        this.drawArena();
        
        // Draw brutes
        this.drawBrute(this.brute1);
        this.drawBrute(this.brute2);
        
        // Draw health bars
        this.drawHealthBar(this.brute1, 50, 20);
        this.drawHealthBar(this.brute2, 350, 20);
        
        // Draw effects
        this.drawEffects();
        
        // Draw names
        this.drawNames();
    }
    
    drawArena() {
        // Arena ground
        this.ctx.fillStyle = '#4a3a2a';
        this.ctx.fillRect(0, 250, this.arenaWidth, 50);
        
        // Arena background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.arenaHeight);
        gradient.addColorStop(0, '#2a1f15');
        gradient.addColorStop(1, '#1a1410');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.arenaWidth, 250);
        
        // Arena border
        this.ctx.strokeStyle = '#d4a855';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(10, 10, this.arenaWidth - 20, this.arenaHeight - 20);
    }
    
    drawBrute(brute) {
        // Draw brute sprite (placeholder for now)
        this.ctx.save();
        this.ctx.translate(brute.x, brute.y);
        
        if (brute.facing === 'left') {
            this.ctx.scale(-1, 1);
        }
        
        // Draw brute body (simplified - will use actual sprites later)
        this.ctx.fillStyle = '#8b2020';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw brute outline
        this.ctx.strokeStyle = '#d4a855';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawHealthBar(brute, x, y) {
        const barWidth = 150;
        const barHeight = 15;
        const healthPercent = brute.health / brute.maxHealth;
        
        // Background
        this.ctx.fillStyle = '#3d332a';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        // Health
        this.ctx.fillStyle = healthPercent > 0.5 ? '#4a9040' : healthPercent > 0.25 ? '#d4a855' : '#904040';
        this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // Border
        this.ctx.strokeStyle = '#d4a855';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Text
        this.ctx.fillStyle = '#e8e0d5';
        this.ctx.font = '12px Georgia';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${brute.health}/${brute.maxHealth}`, x + barWidth / 2, y + 12);
    }
    
    drawNames() {
        this.ctx.fillStyle = '#d4a855';
        this.ctx.font = 'bold 14px Georgia';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.brute1.name, this.brute1.x, this.brute1.y - 30);
        this.ctx.fillText(this.brute2.name, this.brute2.x, this.brute2.y - 30);
    }
    
    drawEffects() {
        // Draw combat effects (blood, impacts, etc.)
        this.effects.forEach(effect => {
            this.ctx.save();
            this.ctx.globalAlpha = effect.opacity;
            this.ctx.translate(effect.x, effect.y);
            this.ctx.rotate(effect.rotation);
            this.ctx.drawImage(effect.sprite, -effect.width / 2, -effect.height / 2, effect.width, effect.height);
            this.ctx.restore();
        });
    }
    
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentFrame = 0;
        this.animate();
    }
    
    animate() {
        if (!this.isPlaying || this.currentFrame >= this.fightData.log.length) {
            this.isPlaying = false;
            this.onComplete();
            return;
        }
        
        const logEntry = this.fightData.log[this.currentFrame];
        this.processFrame(logEntry);
        this.draw();
        
        this.currentFrame++;
        setTimeout(() => this.animate(), this.animationSpeed);
    }
    
    processFrame(logEntry) {
        // Update brute positions and health
        if (logEntry.attacker === this.brute1.name) {
            this.brute1.x += 10; // Attack animation
            this.brute2.health = logEntry.defender_health_remaining;
            
            // Add impact effect
            this.addEffect('impact', this.brute2.x, this.brute2.y);
            
            setTimeout(() => {
                this.brute1.x -= 10; // Return to position
            }, 50);
        } else {
            this.brute2.x -= 10; // Attack animation
            this.brute1.health = logEntry.defender_health_remaining;
            
            // Add impact effect
            this.addEffect('impact', this.brute1.x, this.brute1.y);
            
            setTimeout(() => {
                this.brute2.x += 10; // Return to position
            }, 50);
        }
        
        // Add blood effect if significant damage
        if (logEntry.damage > 5) {
            const target = logEntry.defender === this.brute1.name ? this.brute1 : this.brute2;
            this.addEffect('blood', target.x, target.y);
        }
        
        // Update effects
        this.effects = this.effects.filter(effect => {
            effect.opacity -= 0.05;
            effect.rotation += 0.1;
            return effect.opacity > 0;
        });
    }
    
    addEffect(type, x, y) {
        const effect = {
            type: type,
            x: x,
            y: y,
            sprite: this.sprites[type] || null,
            width: 30,
            height: 30,
            opacity: 1,
            rotation: Math.random() * Math.PI * 2
        };
        this.effects.push(effect);
    }
    
    onComplete() {
        // Show winner message
        const winner = this.brute1.health > 0 ? this.brute1 : this.brute2;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.arenaWidth, this.arenaHeight);
        
        this.ctx.fillStyle = '#d4a855';
        this.ctx.font = 'bold 24px Georgia';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${winner.name} GANA!`, this.arenaWidth / 2, this.arenaHeight / 2);
    }
    
    pause() {
        this.isPlaying = false;
    }
    
    reset() {
        this.currentFrame = 0;
        this.isPlaying = false;
        this.effects = [];
        this.init();
    }
    
    setSpeed(speed) {
        this.animationSpeed = speed;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FightAnimator;
}

