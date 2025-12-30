<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/view.class.php';

// Check if user is logged in
$isLoggedIn = Auth::isLoggedIn();
$user = $isLoggedIn ? Auth::getCurrentUser() : null;

echo View::header('Inicio', $isLoggedIn, $user['username'] ?? null);
?>

<div style="text-align: center; padding: 3rem 0;">
    <!-- Hero Section -->
    <div style="font-size: 6rem; margin-bottom: 1rem;">⚔️</div>
    <h1 style="font-size: 3rem; font-family: var(--font-display); margin-bottom: 0.5rem;">LaBrute</h1>
    <p style="font-size: 1.3rem; color: var(--color-gold); margin-bottom: 2rem;">Arena de Gladiadores</p>
    
    <p style="max-width: 600px; margin: 0 auto 2rem; color: var(--color-text-muted); font-size: 1.1rem;">
        Crea tu guerrero, entrénalo y enfréntate a otros jugadores en épicas batallas por la gloria.
        ¡Demuestra que eres el mejor gladiador de la arena!
    </p>
    
    <?php if (!$isLoggedIn): ?>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/register.php" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
                ✨ Comenzar Ahora
            </a>
            <a href="/login.php" class="btn btn-secondary" style="font-size: 1.1rem; padding: 1rem 2rem;">
                🔑 Ya tengo cuenta
            </a>
        </div>
    <?php else: ?>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/dashboard.php" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
                🏟️ Ir a Mi Arena
            </a>
            <a href="/fight.php" class="btn btn-fight" style="font-size: 1.1rem; padding: 1rem 2rem;">
                ⚔️ ¡Pelear!
            </a>
        </div>
    <?php endif; ?>
</div>

<!-- Features Section -->
<section style="margin-top: 4rem;">
    <h2 style="text-align: center; margin-bottom: 2rem;">🎮 Cómo Jugar</h2>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
        <div class="card" style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🤺</div>
            <h3>1. Crea tu Brute</h3>
            <p style="color: var(--color-text-muted);">
                Dale un nombre épico a tu guerrero y elige sus habilidades iniciales.
            </p>
        </div>
        
        <div class="card" style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚔️</div>
            <h3>2. Pelea</h3>
            <p style="color: var(--color-text-muted);">
                Enfréntate a otros brutes en combates automáticos llenos de acción.
            </p>
        </div>
        
        <div class="card" style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
            <h3>3. Sube de Nivel</h3>
            <p style="color: var(--color-text-muted);">
                Gana experiencia, mejora tus estadísticas y desbloquea nuevas habilidades.
            </p>
        </div>
        
        <div class="card" style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
            <h3>4. Domina la Arena</h3>
            <p style="color: var(--color-text-muted);">
                Sé el mejor gladiador y presume tu récord de victorias.
            </p>
        </div>
    </div>
</section>

<!-- Stats/Info Section -->
<section class="card" style="margin-top: 4rem; text-align: center;">
    <h3>🛡️ Habilidades Disponibles</h3>
    <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">
        Elige sabiamente las habilidades de tu brute
    </p>
    
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
        <span class="skill-badge">🛡️ Armadura</span>
        <span class="skill-badge">⚡ Primer Golpe</span>
        <span class="skill-badge">♾️ Inmortalidad</span>
        <span class="skill-badge">🧱 Resistente</span>
        <span class="skill-badge">🦎 Piel Dura</span>
        <span class="skill-badge">💚 Vitalidad</span>
    </div>
</section>

<?php echo View::footer(); ?>
