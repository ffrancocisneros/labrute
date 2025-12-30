<?php

class View {
    
    /**
     * Render HTML header
     */
    public static function header(string $title = 'LaBrute', bool $isLoggedIn = false, ?string $username = null): string {
        $nav = $isLoggedIn ? self::navLoggedIn($username) : self::navGuest();
        
        return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title} - LaBrute</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Uncial+Antiqua&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/public/css/style.css">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <a href="/" class="logo">
                <span class="logo-icon">⚔️</span>
                <span class="logo-text">LaBrute</span>
            </a>
            {$nav}
        </div>
    </header>
    <main class="main-content">
        <div class="container">
HTML;
    }
    
    /**
     * Render HTML footer
     */
    public static function footer(): string {
        return <<<HTML
        </div>
    </main>
    <footer class="main-footer">
        <div class="container">
            <p>&copy; 2024 LaBrute - Un clon de código abierto bajo licencia AGPL-3.0</p>
            <p>Basado en el trabajo de <a href="https://gitlab.com/eternaltwin/labrute/labrute" target="_blank">Eternaltwin</a></p>
        </div>
    </footer>
    <script src="/public/js/app.js"></script>
</body>
</html>
HTML;
    }
    
    /**
     * Navigation for logged in users
     */
    private static function navLoggedIn(?string $username): string {
        $username = htmlspecialchars($username ?? 'Usuario');
        return <<<HTML
        <nav class="main-nav">
            <a href="/dashboard.php" class="nav-link">🏠 Mi Arena</a>
            <a href="/fight.php" class="nav-link">⚔️ Pelear</a>
            <span class="nav-user">👤 {$username}</span>
            <a href="/logout.php" class="nav-link logout">🚪 Salir</a>
        </nav>
HTML;
    }
    
    /**
     * Navigation for guests
     */
    private static function navGuest(): string {
        return <<<HTML
        <nav class="main-nav">
            <a href="/login.php" class="nav-link">🔑 Entrar</a>
            <a href="/register.php" class="nav-link btn-primary">✨ Registrarse</a>
        </nav>
HTML;
    }
    
    /**
     * Display flash message
     */
    public static function flashMessage(?string $message, string $type = 'info'): string {
        if (!$message) return '';
        $message = htmlspecialchars($message);
        return <<<HTML
        <div class="flash-message flash-{$type}">
            {$message}
        </div>
HTML;
    }
    
    /**
     * Display a brute card
     */
    public static function bruteCard(object $brute, bool $showActions = true): string {
        $name = htmlspecialchars($brute->Name);
        $level = $brute->Level ?? $brute->getLevel();
        $winRate = ($brute->Wins + $brute->Losses) > 0 
            ? round(($brute->Wins / ($brute->Wins + $brute->Losses)) * 100) 
            : 0;
        
        $actions = '';
        if ($showActions && isset($brute->Id)) {
            $actions = <<<HTML
            <div class="brute-actions">
                <a href="/fight.php?brute_id={$brute->Id}" class="btn btn-fight">⚔️ Pelear</a>
                <a href="/brute.php?id={$brute->Id}" class="btn btn-view">👁️ Ver</a>
            </div>
HTML;
        }
        
        return <<<HTML
        <div class="brute-card">
            <div class="brute-avatar">🤺</div>
            <h3 class="brute-name">{$name}</h3>
            <div class="brute-level">Nivel {$level}</div>
            <div class="brute-stats-mini">
                <span class="stat" title="Salud">❤️ {$brute->Health}</span>
                <span class="stat" title="Fuerza">💪 {$brute->Strength}</span>
                <span class="stat" title="Agilidad">🏃 {$brute->Agility}</span>
                <span class="stat" title="Velocidad">⚡ {$brute->Speed}</span>
            </div>
            <div class="brute-record">
                <span class="wins">🏆 {$brute->Wins}</span>
                <span class="losses">💀 {$brute->Losses}</span>
                <span class="winrate">{$winRate}%</span>
            </div>
            {$actions}
        </div>
HTML;
    }
    
    /**
     * Display full brute stats
     */
    public function bruteStats($Brute): string {
        $name = htmlspecialchars($Brute->Name);
        $level = $Brute->Level ?? $Brute->getLevel();
        
        // Skills display
        $skillsHtml = '';
        $skillLabels = [
            'Armor' => ['🛡️', 'Armadura'],
            'ToughenedSkin' => ['🦎', 'Piel Dura'],
            'FirstStrike' => ['⚡', 'Primer Golpe'],
            'Immortality' => ['♾️', 'Inmortalidad'],
            'Resistant' => ['🧱', 'Resistente'],
            'Vitality' => ['💚', 'Vitalidad']
        ];
        
        foreach ($skillLabels as $prop => $info) {
            if (isset($Brute->Skills->$prop) && $Brute->Skills->$prop) {
                $skillsHtml .= "<span class='skill-badge'>{$info[0]} {$info[1]}</span>";
            }
        }
        
        if (!$skillsHtml) {
            $skillsHtml = '<span class="no-skills">Sin habilidades</span>';
        }
        
        return <<<HTML
        <div class="brute-stats-full">
            <div class="brute-header">
                <div class="brute-avatar-large">🤺</div>
                <div class="brute-info">
                    <h2 class="brute-name">{$name}</h2>
                    <div class="brute-level-badge">Nivel {$level}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-group main-stats">
                    <h4>Estadísticas Principales</h4>
                    <div class="stat-row">
                        <span class="stat-label">❤️ Salud</span>
                        <span class="stat-value">{$Brute->Health}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">💪 Fuerza</span>
                        <span class="stat-value">{$Brute->Strength}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">🏃 Agilidad</span>
                        <span class="stat-value">{$Brute->Agility}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">⚡ Velocidad</span>
                        <span class="stat-value">{$Brute->Speed}</span>
                    </div>
                </div>
                
                <div class="stat-group hidden-stats">
                    <h4>Estadísticas Ocultas</h4>
                    <div class="stat-row">
                        <span class="stat-label">🔋 Resistencia</span>
                        <span class="stat-value">{$Brute->Endurance}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">🚀 Iniciativa</span>
                        <span class="stat-value">{$Brute->Initiative}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">🛡️ Armadura</span>
                        <span class="stat-value">{$Brute->Armor}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">🛑 Daño Máx/Golpe</span>
                        <span class="stat-value">{$Brute->MaxReceivableDamages}</span>
                    </div>
                </div>
            </div>
            
            <div class="skills-section">
                <h4>Habilidades</h4>
                <div class="skills-list">
                    {$skillsHtml}
                </div>
            </div>
        </div>
HTML;
    }
    
    /**
     * Display opponent selection
     */
    public static function opponentList(array $opponents, int $myBruteId): string {
        if (empty($opponents)) {
            return '<p class="no-opponents">No hay oponentes disponibles en tu nivel. ¡Vuelve más tarde!</p>';
        }
        
        $html = '<div class="opponents-grid">';
        foreach ($opponents as $opponent) {
            $name = htmlspecialchars($opponent->Name);
            $level = $opponent->Level ?? $opponent->getLevel();
            $html .= <<<HTML
            <div class="opponent-card">
                <div class="opponent-avatar">🤺</div>
                <h4>{$name}</h4>
                <div class="opponent-level">Nivel {$level}</div>
                <div class="opponent-stats">
                    <span>❤️ {$opponent->Health}</span>
                    <span>💪 {$opponent->Strength}</span>
                </div>
                <form action="/fight.php" method="POST">
                    <input type="hidden" name="my_brute_id" value="{$myBruteId}">
                    <input type="hidden" name="opponent_id" value="{$opponent->Id}">
                    <button type="submit" class="btn btn-fight">⚔️ ¡Pelear!</button>
                </form>
            </div>
HTML;
        }
        $html .= '</div>';
        return $html;
    }
}
