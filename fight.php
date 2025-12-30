<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/brute.class.php';
require_once __DIR__ . '/fight.class.php';
require_once __DIR__ . '/view.class.php';

// Require authentication
Auth::requireAuth();

$user = Auth::getCurrentUser();
$error = '';
$fightResult = null;
$myBrute = null;
$opponents = [];

// Check if user has any brutes
$myBrutes = Brute::loadByUserId(Auth::getUserId());
if (empty($myBrutes)) {
    header('Location: /dashboard.php');
    exit;
}

// Get the selected brute or default to first one
$bruteId = $_GET['brute_id'] ?? $_POST['my_brute_id'] ?? $myBrutes[0]->Id;
$myBrute = Brute::loadById((int) $bruteId);

// Verify ownership
if (!$myBrute || $myBrute->UserId !== Auth::getUserId()) {
    $myBrute = $myBrutes[0];
}

// Handle fight
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['opponent_id'])) {
    $opponentId = (int) $_POST['opponent_id'];
    $opponent = Brute::loadById($opponentId);
    
    if (!$opponent) {
        $error = 'Oponente no encontrado.';
    } elseif ($opponent->UserId === Auth::getUserId()) {
        $error = 'No puedes pelear contra tu propio brute.';
    } else {
        try {
            $fight = new Fight($myBrute, $opponent);
            $fightResult = $fight->doFight();
            
            // Reload brutes to get updated stats
            $myBrute = Brute::loadById($myBrute->Id);
        } catch (Exception $e) {
            $error = 'Error durante la pelea: ' . $e->getMessage();
        }
    }
}

// Get opponents if no fight result
if (!$fightResult) {
    $opponents = $myBrute->getOpponents(6);
}

echo View::header('Pelear', true, $user['username']);
?>

<h1 class="page-title">⚔️ Arena de Combate</h1>

<?php echo View::flashMessage($error, 'error'); ?>

<?php if ($fightResult): ?>
    <!-- Fight Result -->
    <section class="card" style="margin-bottom: 2rem;">
        <h2 style="text-align: center; margin-bottom: 1rem;">
            <?php if ($fightResult['winner']['id'] === $myBrute->Id): ?>
                🏆 ¡Victoria!
            <?php else: ?>
                💀 Derrota
            <?php endif; ?>
        </h2>
        
        <div style="display: flex; justify-content: center; align-items: center; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
            <div style="text-align: center;">
                <div style="font-size: 4rem;">🤺</div>
                <strong><?= htmlspecialchars($fightResult['winner']['name']) ?></strong>
                <div style="color: var(--color-gold);">Ganador (+<?= $fightResult['winner_exp_gained'] ?> XP)</div>
            </div>
            <div style="font-size: 2rem;">VS</div>
            <div style="text-align: center;">
                <div style="font-size: 4rem; opacity: 0.5;">🤺</div>
                <strong><?= htmlspecialchars($fightResult['loser']['name']) ?></strong>
                <div style="color: var(--color-text-muted);">(+<?= $fightResult['loser_exp_gained'] ?> XP)</div>
            </div>
        </div>
        
        <details>
            <summary style="cursor: pointer; color: var(--color-gold); margin-bottom: 1rem;">
                📜 Ver registro de combate (<?= $fightResult['duration_hits'] ?> golpes)
            </summary>
            <div class="fight-log">
                <?php foreach ($fightResult['log'] as $entry): ?>
                    <div class="fight-hit <?= $entry['is_knockout'] ? 'knockout' : '' ?>">
                        <span class="hit-number">#<?= $entry['hit'] ?></span>
                        <strong><?= htmlspecialchars($entry['attacker']) ?></strong>
                        ataca a 
                        <strong><?= htmlspecialchars($entry['defender']) ?></strong>
                        con 
                        <?php if (file_exists(__DIR__ . "/resources/img/{$entry['weapon']}.png")): ?>
                            <img src="/resources/img/<?= htmlspecialchars($entry['weapon']) ?>.png" 
                                 alt="<?= htmlspecialchars($entry['weapon_name']) ?>" 
                                 class="weapon-icon">
                        <?php endif; ?>
                        <em><?= htmlspecialchars($entry['weapon_name']) ?></em>
                        <span class="damage">-<?= $entry['damage'] ?> HP</span>
                        <span class="remaining">(<?= $entry['defender_health_remaining'] ?> HP restantes)</span>
                    </div>
                <?php endforeach; ?>
            </div>
        </details>
        
        <div style="text-align: center; margin-top: 1rem;">
            <a href="/fight.php?brute_id=<?= $myBrute->Id ?>" class="btn btn-primary">⚔️ Otra Pelea</a>
            <a href="/dashboard.php" class="btn btn-secondary">🏠 Volver al Arena</a>
        </div>
    </section>

<?php else: ?>
    
    <!-- Select your brute -->
    <?php if (count($myBrutes) > 1): ?>
    <section class="card" style="margin-bottom: 2rem;">
        <h3>🤺 Selecciona tu Brute</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
            <?php foreach ($myBrutes as $brute): ?>
                <a href="/fight.php?brute_id=<?= $brute->Id ?>" 
                   class="btn <?= $brute->Id === $myBrute->Id ? 'btn-primary' : 'btn-secondary' ?>">
                    <?= htmlspecialchars($brute->Name) ?> (Nv. <?= $brute->Level ?>)
                </a>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endif; ?>
    
    <!-- Your fighter -->
    <section class="card" style="margin-bottom: 2rem;">
        <h3>Tu Guerrero</h3>
        <div style="display: flex; align-items: center; gap: 2rem; margin-top: 1rem;">
            <div style="font-size: 4rem;">🤺</div>
            <div>
                <h4><?= htmlspecialchars($myBrute->Name) ?></h4>
                <div>Nivel <?= $myBrute->Level ?></div>
                <div style="color: var(--color-text-muted);">
                    ❤️ <?= $myBrute->Health ?> |
                    💪 <?= $myBrute->Strength ?> |
                    🏃 <?= $myBrute->Agility ?> |
                    ⚡ <?= $myBrute->Speed ?>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Opponents -->
    <section>
        <h2>🎯 Elige tu Oponente</h2>
        <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">
            Oponentes cerca de tu nivel (<?= max(1, $myBrute->Level - 2) ?> - <?= $myBrute->Level + 2 ?>)
        </p>
        
        <?= View::opponentList($opponents, $myBrute->Id) ?>
        
        <?php if (empty($opponents)): ?>
            <p style="text-align: center; color: var(--color-text-muted); margin-top: 2rem;">
                No hay suficientes oponentes. ¡Invita a tus amigos a unirse!
            </p>
        <?php endif; ?>
    </section>
    
<?php endif; ?>

<?php echo View::footer(); ?>

