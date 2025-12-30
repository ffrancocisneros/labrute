<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/brute.class.php';
require_once __DIR__ . '/fight.class.php';
require_once __DIR__ . '/view.class.php';

// Require authentication
Auth::requireAuth();

$user = Auth::getCurrentUser();
$error = '';

// Get brute ID from URL
$bruteId = $_GET['id'] ?? null;

if (!$bruteId) {
    header('Location: /dashboard.php');
    exit;
}

$brute = Brute::loadById((int) $bruteId);

if (!$brute) {
    header('Location: /dashboard.php');
    exit;
}

// Check if this is the user's brute
$isOwner = $brute->UserId === Auth::getUserId();

// Get recent fights
$recentFights = Fight::getRecentFights($brute->Id, 10);

$viewInstance = new View();

echo View::header($brute->Name, true, $user['username']);
?>

<h1 class="page-title">📜 Perfil de <?= htmlspecialchars($brute->Name) ?></h1>

<!-- Brute Stats -->
<?= $viewInstance->bruteStats($brute) ?>

<!-- Record -->
<section class="card" style="margin-top: 2rem;">
    <h3>📊 Registro de Batalla</h3>
    <div style="display: flex; gap: 2rem; justify-content: center; margin: 1rem 0; font-size: 1.2rem;">
        <div style="text-align: center;">
            <div style="font-size: 2rem; color: var(--color-success);"><?= $brute->Wins ?></div>
            <div style="color: var(--color-text-muted);">Victorias</div>
        </div>
        <div style="text-align: center;">
            <div style="font-size: 2rem; color: var(--color-blood-light);"><?= $brute->Losses ?></div>
            <div style="color: var(--color-text-muted);">Derrotas</div>
        </div>
        <div style="text-align: center;">
            <?php 
            $total = $brute->Wins + $brute->Losses;
            $winRate = $total > 0 ? round(($brute->Wins / $total) * 100) : 0;
            ?>
            <div style="font-size: 2rem; color: var(--color-gold);"><?= $winRate ?>%</div>
            <div style="color: var(--color-text-muted);">Win Rate</div>
        </div>
    </div>
</section>

<!-- Actions -->
<?php if ($isOwner): ?>
<section style="margin-top: 2rem; text-align: center;">
    <a href="/fight.php?brute_id=<?= $brute->Id ?>" class="btn btn-fight" style="font-size: 1.1rem; padding: 1rem 2rem;">
        ⚔️ ¡Ir a Pelear!
    </a>
    <a href="/dashboard.php" class="btn btn-secondary" style="margin-left: 1rem;">
        🏠 Volver
    </a>
</section>
<?php endif; ?>

<!-- Recent Fights -->
<?php if (!empty($recentFights)): ?>
<section class="card" style="margin-top: 2rem;">
    <h3>🗡️ Peleas Recientes</h3>
    <table style="width: 100%; margin-top: 1rem;">
        <thead>
            <tr style="text-align: left; border-bottom: 1px solid var(--color-bg-light);">
                <th style="padding: 0.5rem;">Oponente</th>
                <th style="padding: 0.5rem;">Resultado</th>
                <th style="padding: 0.5rem;">Golpes</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($recentFights as $fight): 
                $isWinner = $fight['winner_id'] == $brute->Id;
                $opponentName = $fight['brute1_id'] == $brute->Id ? $fight['brute2_name'] : $fight['brute1_name'];
            ?>
            <tr style="border-bottom: 1px solid var(--color-bg-dark);">
                <td style="padding: 0.5rem;"><?= htmlspecialchars($opponentName ?? 'Desconocido') ?></td>
                <td style="padding: 0.5rem;">
                    <?php if ($isWinner): ?>
                        <span style="color: var(--color-success);">🏆 Victoria</span>
                    <?php else: ?>
                        <span style="color: var(--color-blood-light);">💀 Derrota</span>
                    <?php endif; ?>
                </td>
                <td style="padding: 0.5rem; color: var(--color-text-muted);">
                    <?= $fight['duration_hits'] ?? '-' ?>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</section>
<?php endif; ?>

<?php echo View::footer(); ?>

