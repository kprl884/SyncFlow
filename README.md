# 🚀 SyncFlow - Project Management Tool

SyncFlow is a comprehensive project management tool designed for modern teams. Manage your projects effectively with Kanban board, sprint management, reporting, and notes system.

## ✨ Features

### 🎯 **Kanban Board**
- Drag-and-drop task management
- Customizable columns (To Do, In Progress, Done)
- Task details and descriptions
- Blocker management
- Member assignment and management
- Standup check-ins

### 📊 **Sprint Management**
- Sprint planning and tracking
- Velocity analysis
- Sprint retrospectives
- Task-sprint linking

### 📈 **Reporting System**
- Sprint performance metrics
- Team productivity analysis
- Burndown charts
- Trend analysis

### 📝 **Notes System**
- Note organization by categories
- Tagging system
- Task and sprint linking
- Search and filtering
- Visibility control (public/private)

### 🤖 **AI Assistant**
- Gemini AI integration
- Project suggestions
- Automatic task summaries
- Smart sprint planning

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Authentication)
- **AI**: Google Gemini AI
- **Build Tool**: Vite
- **Package Manager**: npm

## 📋 Requirements

- Node.js 18+
- npm 9+
- Firebase account
- Google Gemini AI API key

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/syncflow.git
cd syncflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set up Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Copy config information from project settings

### 5. Get Gemini AI API key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env.local` file

### 6. Start the application
```bash
npm run dev
```

The application will run at `http://localhost:5173`.

## 🔑 API Keys and Security

### ⚠️ **IMPORTANT**: Get Your Own API Keys

This project uses Firebase and Gemini AI services. These services may be **paid** and you need to use your own API keys.

**Why you should use your own keys:**
- Security: API keys are personal information
- Cost control: You can track your own usage
- Limits: You won't exceed personal quotas

**Files that should be kept secret:**
- `.env.local`
- `src/lib/firebase.ts`
- `src/lib/gemini.ts`
- Firebase config files

## 💰 Cost Information

### Firebase
- **Firestore**: First 1GB free, then $0.18/GB
- **Authentication**: Free (up to 10,000 users)
- **Hosting**: Free (1GB storage, 10GB transfer)

### Gemini AI
- **Gemini Pro**: $0.0025/1K characters (input), $0.01/1K characters (output)
- **Gemini Flash**: $0.00075/1K characters (input), $0.003/1K characters (output)

**Estimated monthly cost (small team):**
- Firebase: $0-5
- Gemini AI: $1-10
- **Total**: $1-15/month

## 📁 Project Structure

```
syncflow/
├── components/          # UI components
│   ├── kanban/         # Kanban board components
│   └── ui/             # General UI components
├── data/               # Mock data and test data
├── pages/              # Page components
├── src/
│   ├── context/        # React contexts
│   └── lib/            # External service integrations
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Code check with ESLint
```

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Functional components
- Hooks usage
- Responsive design

## 🚧 Completed Work

### ✅ Completed Features
- [x] Project structure and routing
- [x] Firebase integration
- [x] User authentication
- [x] Workspace management
- [x] Kanban board system
- [x] Sprint management
- [x] Task management
- [x] Member management
- [x] Blocker system
- [x] Standup check-ins
- [x] Reporting system
- [x] Notes system
- [x] AI assistant integration
- [x] Responsive design
- [x] Dark mode support

### 🔄 Ongoing Development
- [ ] Real-time collaboration
- [ ] File upload system
- [ ] Notification system
- [ ] Email integration
- [ ] Mobile application

### 📋 Future Features
- [ ] Gantt charts
- [ ] Time tracking
- [ ] Budget management
- [ ] Risk management
- [ ] Documentation system
- [ ] API integrations
- [ ] Webhook support
- [ ] Export/Import features

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/syncflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/syncflow/discussions)
- **Email**: support@syncflow.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) team
- [Firebase](https://firebase.google.com/) team
- [Google AI](https://ai.google.dev/) team
- [Tailwind CSS](https://tailwindcss.com/) team
- [Lucide](https://lucide.dev/) team

---

**⭐ Don't forget to star this project if you like it!**
