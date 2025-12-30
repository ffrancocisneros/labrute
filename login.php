<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/view.class.php';

// Redirect if already logged in
Auth::redirectIfLoggedIn('/dashboard.php');

$error = '';
$success = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Por favor completa todos los campos.';
    } else {
        $result = Auth::login($username, $password);
        if ($result['success']) {
            header('Location: /dashboard.php');
            exit;
        } else {
            $error = $result['message'];
        }
    }
}

// Check for registration success message
if (isset($_GET['registered'])) {
    $success = '¡Registro exitoso! Ahora puedes iniciar sesión.';
}

echo View::header('Iniciar Sesión', false);
?>

<div class="auth-page">
    <div class="card auth-card">
        <div class="card-header">
            <h1 class="card-title">⚔️ Iniciar Sesión</h1>
            <p>Entra a la arena y demuestra tu valor</p>
        </div>
        
        <?php echo View::flashMessage($error, 'error'); ?>
        <?php echo View::flashMessage($success, 'success'); ?>
        
        <form method="POST" action="/login.php">
            <div class="form-group">
                <label class="form-label" for="username">Nombre de Usuario</label>
                <input type="text" 
                       id="username" 
                       name="username" 
                       class="form-control" 
                       placeholder="Tu nombre de guerrero"
                       value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
                       required
                       autofocus>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="password">Contraseña</label>
                <input type="password" 
                       id="password" 
                       name="password" 
                       class="form-control" 
                       placeholder="Tu contraseña secreta"
                       required>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
                🔑 Entrar a la Arena
            </button>
        </form>
        
        <p style="text-align: center; margin-top: 1.5rem; color: var(--color-text-muted);">
            ¿No tienes cuenta? 
            <a href="/register.php" style="color: var(--color-gold);">¡Regístrate aquí!</a>
        </p>
    </div>
</div>

<?php echo View::footer(); ?>

