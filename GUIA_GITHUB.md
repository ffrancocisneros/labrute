# 🐙 Guía: Crear Repositorio en GitHub y Subir el Proyecto

Esta guía te ayudará a crear un repositorio en GitHub y subir tu proyecto LaBrute paso a paso.

---

## 📋 Paso 1: Verificar que Git esté instalado

Abre PowerShell o Terminal y ejecuta:

```bash
git --version
```

Si ves un número de versión (ej: `git version 2.40.0`), Git está instalado. Si no, descárgalo de [git-scm.com](https://git-scm.com/download/win).

---

## 🔐 Paso 2: Configurar Git (si es la primera vez)

Si es la primera vez que usas Git en esta computadora, configura tu nombre y email:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

**Nota**: Usa el mismo email que usas en GitHub.

---

## 📁 Paso 3: Navegar a tu proyecto

Abre PowerShell o Terminal y ve a la carpeta del proyecto:

```bash
cd d:\bruto
```

---

## 🔍 Paso 4: Verificar el estado de Git

Verifica si ya hay un repositorio Git inicializado:

```bash
git status
```

### Si ves "fatal: not a git repository":
El proyecto no tiene Git inicializado. Continúa con el Paso 5.

### Si ves información sobre archivos:
El proyecto ya tiene Git. Salta al Paso 6.

---

## 🚀 Paso 5: Inicializar Git (si es necesario)

Si el proyecto no tiene Git inicializado:

```bash
git init
```

Esto creará un repositorio Git local en tu carpeta.

---

## 📝 Paso 6: Agregar todos los archivos

Agrega todos los archivos del proyecto al staging area:

```bash
git add .
```

Esto prepara todos los archivos para ser subidos (excepto los que están en `.gitignore`).

---

## 💾 Paso 7: Hacer el primer commit

Crea tu primer commit con todos los archivos:

```bash
git commit -m "Initial commit: LaBrute - Arena fighting game with database support"
```

---

## 🌐 Paso 8: Crear el repositorio en GitHub

### Opción A: Desde la Web (Recomendado)

1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Completa el formulario:
   - **Repository name**: `labrute` (o el nombre que prefieras)
   - **Description**: `LaBrute - Arena fighting game clone with multiplayer support`
   - **Visibility**: 
     - ✅ **Public** - Si quieres que cualquiera pueda verlo
     - 🔒 **Private** - Si solo quieres que tú y colaboradores lo vean
   - ⚠️ **NO marques** ninguna de estas opciones:
     - ❌ "Add a README file"
     - ❌ "Add .gitignore"
     - ❌ "Choose a license"
   
   (Ya tienes estos archivos en tu proyecto)

4. Click en **"Create repository"**

5. GitHub te mostrará una página con instrucciones. **NO sigas esas instrucciones todavía**. Solo copia la URL del repositorio, que se verá así:
   ```
   https://github.com/TU_USUARIO/labrute.git
   ```
   O si usas SSH:
   ```
   git@github.com:TU_USUARIO/labrute.git
   ```

### Opción B: Usando GitHub CLI (si lo tienes instalado)

```bash
gh repo create labrute --public --source=. --remote=origin --push
```

---

## 🔗 Paso 9: Conectar tu repositorio local con GitHub

Conecta tu repositorio local con el remoto en GitHub:

```bash
git remote add origin https://github.com/TU_USUARIO/labrute.git
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.**

Si prefieres usar SSH (y tienes las claves configuradas):

```bash
git remote add origin git@github.com:TU_USUARIO/labrute.git
```

---

## 📤 Paso 10: Subir el código a GitHub

Sube tu código a la rama principal:

```bash
git branch -M main
git push -u origin main
```

### Si te pide autenticación:

**Opción 1: Personal Access Token (Recomendado)**
1. GitHub te pedirá usuario y contraseña
2. Para la contraseña, usa un **Personal Access Token**
3. Crea uno en: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
4. Genera un token con permisos `repo`
5. Usa ese token como contraseña

**Opción 2: GitHub CLI**
Si tienes `gh` instalado:
```bash
gh auth login
```

**Opción 3: Credential Manager**
Windows puede guardar tus credenciales automáticamente.

---

## ✅ Paso 11: Verificar que todo se subió correctamente

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/labrute`
2. Deberías ver todos tus archivos:
   - ✅ `index.php`
   - ✅ `composer.json`
   - ✅ `README.md`
   - ✅ `TUTORIAL_RAILWAY.md`
   - ✅ Todas las carpetas (`config/`, `database/`, `includes/`, etc.)

---

## 🎉 ¡Listo!

Tu proyecto está ahora en GitHub y listo para hacer deploy en Railway.

### Próximos pasos:

1. **Sigue el tutorial de Railway**: Abre `TUTORIAL_RAILWAY.md` y sigue los pasos para deployar
2. **Comparte el repositorio**: Puedes compartir la URL con colaboradores
3. **Haz commits regulares**: Cada vez que hagas cambios:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```

---

## 🔧 Comandos Útiles de Git

### Ver el estado de tus archivos:
```bash
git status
```

### Ver qué archivos cambiaron:
```bash
git diff
```

### Ver el historial de commits:
```bash
git log --oneline
```

### Deshacer cambios no guardados:
```bash
git restore .
```

### Actualizar desde GitHub (si trabajas en varias computadoras):
```bash
git pull
```

---

## ❓ Solución de Problemas

### Error: "remote origin already exists"
Si ya existe un remoto, elimínalo primero:
```bash
git remote remove origin
```
Luego vuelve a agregarlo con el comando del Paso 9.

### Error: "failed to push some refs"
Si hay cambios en GitHub que no tienes localmente:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "authentication failed"
1. Verifica que tu token de acceso sea válido
2. O configura SSH keys en GitHub
3. O usa GitHub CLI: `gh auth login`

### No puedo ver mis archivos en GitHub
1. Verifica que hiciste `git add .`
2. Verifica que hiciste `git commit`
3. Verifica que hiciste `git push`
4. Recarga la página en GitHub

---

## 📚 Recursos Adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [Guía de GitHub](https://docs.github.com)
- [GitHub Desktop](https://desktop.github.com) - Interfaz gráfica (opcional)

---

**¿Necesitas ayuda?** Revisa la sección de "Solución de Problemas" arriba o consulta la documentación de Git/GitHub.

