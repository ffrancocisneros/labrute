<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/brute.class.php';
require_once __DIR__ . '/view.class.php';

// Require authentication
Auth::requireAuth();

$user = Auth::getCurrentUser();
$error = '';
$success = '';

// Handle brute creation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_brute') {
    $bruteName = $_POST['brute_name'] ?? '';
    $selectedSkills = $_POST['skills'] ?? [];
    
    try {
        // Limit skills to max 3 for new brutes
        $selectedSkills = array_slice($selectedSkills, 0, 3);
        
        $brute = Brute::create(Auth::getUserId(), $bruteName, $selectedSkills);
        $success = "¡{$brute->Name} ha sido creado! ¡Prepárate para la batalla!";
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

// Load user's brutes
$brutes = Brute::loadByUserId(Auth::getUserId());

// Get available skills for brute creation
$skillsClass = new Skills();
$availableSkills = $skillsClass->AvailableSkills;

echo View::header('Mi Arena', true, $user['username']);
?>

<h1 class="page-title">🏟️ Mi Arena</h1>

<?php echo View::flashMessage($error, 'error'); ?>
<?php echo View::flashMessage($success, 'success'); ?>

<!-- Create New Brute Section -->
<section class="create-brute-section">
    <h2>⚔️ Crear Nuevo Brute</h2>
    <form method="POST" action="/dashboard.php">
        <input type="hidden" name="action" value="create_brute">
        
        <div class="form-group">
            <label class="form-label" for="brute_name">Nombre del Brute</label>
            <input type="text" 
                   id="brute_name" 
                   name="brute_name" 
                   class="form-control" 
                   placeholder="Dale un nombre épico a tu guerrero"
                   minlength="2"
                   maxlength="50"
                   required
                   style="max-width: 400px;">
        </div>
        
        <div class="form-group">
            <label class="form-label">Habilidades Iniciales (máximo 3)</label>
            <div class="skills-checkboxes">
                <?php
                $skillLabels = [
                    'armor' => ['🛡️', 'Armadura', '+5 armadura'],
                    'firstStrike' => ['⚡', 'Primer Golpe', '+200 iniciativa'],
                    'immortality' => ['♾️', 'Inmortalidad', '+250% resistencia'],
                    'resistant' => ['🧱', 'Resistente', 'Máx 20% daño/golpe'],
                    'toughenedSkin' => ['🦎', 'Piel Dura', '+2 armadura'],
                    'vitality' => ['💚', 'Vitalidad', '+50% resistencia'],
                ];
                foreach ($availableSkills as $skill):
                    $info = $skillLabels[$skill] ?? ['❓', ucfirst($skill), ''];
                ?>
                <label class="skill-checkbox" title="<?= htmlspecialchars($info[2]) ?>">
                    <input type="checkbox" name="skills[]" value="<?= htmlspecialchars($skill) ?>">
                    <span><?= $info[0] ?> <?= $info[1] ?></span>
                </label>
                <?php endforeach; ?>
            </div>
        </div>
        
        <button type="submit" class="btn btn-primary">
            ✨ Crear Brute
        </button>
    </form>
</section>

<!-- My Brutes Section -->
<section>
    <div class="section-header">
        <h2>🤺 Mis Brutes</h2>
    </div>
    
    <?php if (empty($brutes)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">🏜️</div>
            <h3>No tienes brutes todavía</h3>
            <p>¡Crea tu primer guerrero arriba y comienza a luchar!</p>
        </div>
    <?php else: ?>
        <div class="brutes-grid">
            <?php foreach ($brutes as $brute): ?>
                <?= View::bruteCard($brute) ?>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>

<?php echo View::footer(); ?>

