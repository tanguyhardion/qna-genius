# Q&A Genius 🧠

Une application Next.js moderne qui transforme vos articles en quiz interactifs pour améliorer votre apprentissage.

## 🌟 Fonctionnalités

- **Génération automatique de quiz** : Transformez n'importe quel article en 10 questions pertinentes
- **Support d'URL** : Récupération automatique du contenu depuis une URL (avec limitations CORS)
- **Assistant IA interactif** : Obtenez des retours personnalisés sur vos réponses
- **Interface française** : Interface utilisateur entièrement en français
- **Design moderne** : Interface clean et responsive avec SCSS
- **Suivi des tentatives** : Compteur de tentatives par question
- **Résumé complet** : Vue d'ensemble de votre performance

## 🚀 Technologies utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **SCSS** - Styling avancé
- **API LangChain** - Génération de quiz et chat IA

## 📋 API Endpoints

L'application utilise les endpoints suivants :

### Quiz Generation
- **URL** : `https://langchain-serverless.vercel.app/api/quiz`
- **Méthode** : POST
- **Payload** : `{ content: string }`
- **Réponse** : `{ questions: QuizQuestion[] }`

### Chat with AI Tutor
- **URL** : `https://langchain-serverless.vercel.app/api/chat`
- **Méthode** : POST
- **Payload** : `{ question: string, answer: string, context: string, userMessage: string }`
- **Réponse** : `{ message: string }`

## 🛠️ Installation et lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

3. **Ouvrir le navigateur** :
   Accédez à [http://localhost:3000](http://localhost:3000)

## 📖 Comment utiliser

1. **Saisir le contenu** :
   - Collez directement le texte de votre article, ou
   - Fournissez l'URL de l'article pour récupération automatique

2. **Générer le quiz** :
   - Cliquez sur "Générer le quiz"
   - Attendez que l'IA génère 10 questions

3. **Répondre aux questions** :
   - Répondez à chaque question dans la zone de texte
   - Recevez des retours personnalisés de l'assistant IA
   - Passez à la question suivante

4. **Consulter le résumé** :
   - Visualisez vos statistiques globales
   - Consultez toutes les questions et réponses
   - Relisez les retours de l'IA

## 🏗️ Structure du projet

```
src/
├── app/                    # Pages Next.js App Router
├── components/            # Composants React réutilisables
│   ├── Header/           # En-tête de l'application
│   ├── ArticleInput/     # Formulaire de saisie d'article
│   ├── Quiz/             # Interface de quiz
│   ├── QuizSummary/      # Résumé final
│   └── LoadingSpinner/   # Composant de chargement
├── types/                # Définitions TypeScript
└── utils/                # Fonctions utilitaires et API
```

## 🎨 Design et UX

- **Design moderne** : Interface épurée avec des composants arrondis
- **Responsive** : Adapté aux mobiles et desktop
- **Mode sombre** : Support automatique du mode sombre
- **Animations fluides** : Transitions CSS optimisées
- **Feedback visuel** : États de chargement et erreurs clairs

## 🔧 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Linting du code

## 📝 Notes techniques

- L'application utilise le App Router de Next.js 15
- Les styles sont écrits en SCSS pur (pas de framework CSS)
- Gestion d'état locale avec React hooks
- Validation d'entrée côté client
- Gestion d'erreurs robuste

## ⚠️ Limitations

- La récupération d'URL peut ne pas fonctionner avec tous les sites web en raison des restrictions CORS
- L'application dépend de l'API externe LangChain pour la génération de quiz

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.
