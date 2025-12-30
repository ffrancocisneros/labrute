# 🚀 Comandos para Subir a GitHub

Tu proyecto ya está conectado a GitLab. Aquí tienes los comandos para crear un repositorio en GitHub.

## ⚠️ IMPORTANTE: Primero crea el repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en **"+"** → **"New repository"**
3. Nombre: `labrute` (o el que prefieras)
4. Descripción: `LaBrute - Arena fighting game`
5. **NO marques** "Add README", "Add .gitignore", ni "Choose a license"
6. Click en **"Create repository"**
7. **Copia la URL** que GitHub te muestra (ej: `https://github.com/TU_USUARIO/labrute.git`)

---

## Opción 1: Agregar GitHub como remoto adicional (Recomendado)

Mantendrás GitLab y agregarás GitHub. Útil si quieres tener el código en ambos.

```powershell
# Agregar todos los archivos nuevos y cambios
git add .

# Hacer commit de todos los cambios
git commit -m "Add database support, authentication, and Railway deployment configuration"

# Agregar GitHub como remoto (reemplaza con tu URL)
git remote add github https://github.com/TU_USUARIO/labrute.git

# Subir a GitHub
git push -u github master
```

**Reemplaza `TU_USUARIO` con tu usuario de GitHub.**

---

## Opción 2: Cambiar el remoto principal a GitHub

Si solo quieres usar GitHub y no GitLab:

```powershell
# Agregar todos los archivos nuevos y cambios
git add .

# Hacer commit de todos los cambios
git commit -m "Add database support, authentication, and Railway deployment configuration"

# Eliminar el remoto de GitLab
git remote remove origin

# Agregar GitHub como nuevo origin (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/labrute.git

# Subir a GitHub
git push -u origin master
```

---

## Opción 3: Usar GitHub CLI (si lo tienes instalado)

```powershell
# Agregar todos los archivos nuevos y cambios
git add .

# Hacer commit de todos los cambios
git commit -m "Add database support, authentication, and Railway deployment configuration"

# Crear repositorio y subir (todo en uno)
gh repo create labrute --public --source=. --remote=github --push
```

---

## 🔐 Si te pide autenticación

GitHub ya no acepta contraseñas. Necesitas un **Personal Access Token**:

1. Ve a: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en **"Generate new token (classic)"**
3. Dale un nombre (ej: "LaBrute Project")
4. Selecciona el scope **`repo`** (todos los permisos de repositorio)
5. Click en **"Generate token"**
6. **Copia el token** (solo lo verás una vez)
7. Cuando Git te pida la contraseña, **pega el token** en lugar de tu contraseña

---

## ✅ Verificar que funcionó

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/labrute`
2. Deberías ver todos tus archivos, incluyendo:
   - ✅ `TUTORIAL_RAILWAY.md`
   - ✅ `railway.json`
   - ✅ `composer.json`
   - ✅ Todos los archivos nuevos

---

## 📝 Para futuros cambios

Cada vez que hagas cambios y quieras subirlos a GitHub:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push github master    # Si usaste Opción 1
# O
git push origin master    # Si usaste Opción 2
```

---

**¿Necesitas ayuda?** Consulta `GUIA_GITHUB.md` para una guía más detallada.

