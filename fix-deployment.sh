#!/bin/bash

echo "🔧 Correction du projet Honor Wallet..."

# ===== ÉTAPE 1: Installer Firebase =====
echo ""
echo "📦 Installation de Firebase et Zustand..."
npm install firebase zustand

# ===== ÉTAPE 2: Supprimer .env.local de Git (URGENT!) =====
echo ""
echo "🔒 Suppression de .env.local du repository Git..."

# Supprimer .env.local de Git (mais le garder localement)
git rm --cached .env.local 2>/dev/null || true
git rm --cached .env 2>/dev/null || true

# Mettre à jour .gitignore
echo ""
echo "📝 Mise à jour de .gitignore..."
cat >> .gitignore << 'GITIGNORE_END'

# Environment variables (NE JAMAIS COMMITER)
.env
.env.local
.env.*.local
.env.production
.env.development

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
GITIGNORE_END

# ===== ÉTAPE 3: Créer un .env.example =====
echo ""
echo "📄 Création de .env.example (template)..."
cat > .env.example << 'ENV_EXAMPLE'
# Firebase Configuration
# Obtenez ces valeurs depuis: https://console.firebase.google.com
# Project Settings > General > Your apps > Web app

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
ENV_EXAMPLE

# ===== ÉTAPE 4: Vérifier package.json =====
echo ""
echo "📋 Vérification de package.json..."

# Sauvegarder l'ancien package.json
cp package.json package.json.backup

# Créer le nouveau package.json
cat > package.json << 'PACKAGE_JSON'
{
  "name": "honor-wallet",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.7.1",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
PACKAGE_JSON

# ===== ÉTAPE 5: Réinstaller les dépendances =====
echo ""
echo "🔄 Réinstallation des dépendances..."
rm -rf node_modules package-lock.json
npm install

# ===== ÉTAPE 6: Tester le build localement =====
echo ""
echo "🏗️  Test du build local..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build local réussi!"
else
    echo ""
    echo "❌ Erreur de build. Vérifiez les erreurs ci-dessus."
    exit 1
fi

# ===== ÉTAPE 7: Commiter les changements =====
echo ""
echo "💾 Commit des changements..."
git add .
git commit -m "fix: Install Firebase, remove .env.local from git, update dependencies

- Add firebase and zustand to dependencies
- Remove .env.local from version control (security)
- Add .env.example as template
- Update .gitignore to prevent future commits of secrets
- Fix build configuration"

echo ""
echo "✅ Script terminé!"
echo ""
echo "⚠️  ACTIONS REQUISES:"
echo ""
echo "1. 🔑 RÉGÉNÉRER VOS CLÉS FIREBASE (car elles sont publiques maintenant):"
echo "   - Allez sur https://console.firebase.google.com"
echo "   - Sélectionnez votre projet"
echo "   - Project Settings > General"
echo "   - Supprimez l'ancienne app web"
echo "   - Créez une nouvelle app web"
echo "   - Copiez les nouvelles credentials dans .env.local"
echo ""
echo "2. 📝 Vérifiez que .env.local contient vos NOUVELLES clés"
echo ""
echo "3. 🚀 Pushez vers GitHub:"
echo "   git push origin main"
echo ""
echo "4. ⚙️  Configurez les variables d'environnement sur Vercel:"
echo "   - Allez sur https://vercel.com/dashboard"
echo "   - Sélectionnez votre projet"
echo "   - Settings > Environment Variables"
echo "   - Ajoutez chaque VITE_* de votre .env.local"
echo ""
echo "5. 🔄 Redéployez sur Vercel (automatique après le push)"