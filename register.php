<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/view.class.php';

// Redirect if already logged in
Auth::redirectIfLoggedIn('/dashboard.php');

$error = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    $email = $_POST['email'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Por favor completa el nombre de usuario y contraseña.';
    } elseif ($password !== $confirmPassword) {
        $error = 'Las contraseñas no coinciden.';
    } else {
        $result = Auth::register($username, $password, $email ?: null);
        if ($result['success']) {
            header('Location: /login.php?registered=1');
            exit;
        } else {
            $error = $result['message'];
        }
    }
}

echo View::header('Registro', false);
?>

<div class="auth-page">
    <div class="card auth-card">
        <div class="card-header">
            <h1 class="card-title">✨ Únete a la Arena</h1>
            <p>Crea tu cuenta y forja tu leyenda</p>
        </div>
        
        <?php echo View::flashMessage($error, 'error'); ?>
        
        <form method="POST" action="/register.php">
            <div class="form-group">
                <label class="form-label" for="username">Nombre de Usuario *</label>
                <input type="text" 
                       id="username" 
                       name="username" 
                       class="form-control" 
                       placeholder="Elige un nombre único"
                       value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
                       pattern="[a-zA-Z0-9_]+"
                       minlength="3"
                       maxlength="50"
                       required
                       autofocus>
                <small style="color: var(--color-text-muted);">Solo letras, números y guiones bajos (3-50 caracteres)</small>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="email">Email (opcional)</label>
                <input type="email" 
                       id="email" 
                       name="email" 
                       class="form-control" 
                       placeholder="tu@email.com"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
            </div>
            
            <div class="form-group">
                <label class="form-label" for="password">Contraseña *</label>
                <input type="password" 
                       id="password" 
                       name="password" 
                       class="form-control" 
                       placeholder="Mínimo 6 caracteres"
                       minlength="6"
                       required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="confirm_password">Confirmar Contraseña *</label>
                <input type="password" 
                       id="confirm_password" 
                       name="confirm_password" 
                       class="form-control" 
                       placeholder="Repite tu contraseña"
                       minlength="6"
                       required>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
                ⚔️ Crear Cuenta
            </button>
        </form>
        
        <p style="text-align: center; margin-top: 1.5rem; color: var(--color-text-muted);">
            ¿Ya tienes cuenta? 
            <a href="/login.php" style="color: var(--color-gold);">¡Inicia sesión!</a>
        </p>
    </div>
</div>

<?php echo View::footer(); ?>

