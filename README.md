# Angular Task Dashboard 📝

A modern, premium task management application built with **Angular 19**. This application features a beautiful, responsive UI, dark/light mode, custom categories, and robust task management capabilities using Angular Signals and LocalStorage for persistence.

## ✨ Features

### 🎨 **Premium User Interface**
- **Modern & Clean Design**: Built with a focus on typography, spacing, and visual hierarchy.
- **Glassmorphism Effects**: Subtle transparency and blurs for a polished feel.
- **Smooth Animations**: Interactive hover states, page transitions, and slide-in effects.
- **Responsive Layout**: Fully functional sidebar and main content area that adapts to mobile and desktop screens.

### 🌗 **Theme System**
- **Dark & Light Mode**: Seamlessly switch between themes with a dedicated toggle button.
- **Persistent Preference**: Your theme choice is saved automatically.

### ✅ **Task Management**
- **Smart System Lists**:
  - `My Day`: Tasks scheduled for today.
  - `Important`: High-priority tasks marked with a star.
  - `Planned`: All tasks with future due dates.
  - `All Tasks`: A master view of everything.
- **Custom Lists**: Create, rename, and delete your own project-specific lists.
- **Detailed Task Control**:
  - Set **Start Dates** and **Due Dates**.
  - Assign **Priority Levels** (High, Medium, Low) with visual badges.
  - Mark tasks as **Important** (Star).
  - Edit task titles inline.
- **Filtering & Search**: Instantly filter tasks by status or search globally across all lists.

### 💾 **Architecture & Persistence**
- **Angular Signals**: Modern state management for high performance and reactivity.
- **LocalStorage**: All data (tasks, categories, theme) is persisted locally - no backend required.
- **Modular Components**: Clean architecture with standalone components (`TodoInput`, `TodoItem`, `Sidebar`).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.13.0 or higher
- **npm**: v8.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-list
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200` in your browser. The application will automatically reload if you change any of the source files.

### building for Production
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

---

## 🛠️ Tech Stack

- **Framework**: [Angular 19](https://angular.io/)
- **State Management**: Angular Signals
- **Styling**: CSS Variables (Custom Properties), Flexbox, CSS Grid
- **Icons**: Inline SVG (Feather Icons style)
- **Data Storage**: Browser LocalStorage

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── confirm-dialog/   # Custom modal for deletions
│   │   ├── sidebar/          # Navigation & category management
│   │   ├── todo-input/       # Task creation with detailed options
│   │   ├── todo-item/        # Individual task card component
│   │   └── todo-list/        # List container logic
│   ├── models/               # TypeScript interfaces (Todo, Category)
│   ├── services/             # Logic for State & Persistence
│   └── app.component.ts      # Main layout shell
├── styles.css                # Global styles, variables & themes
└── main.ts                   # Application entry point
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
