# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```



## Architecture

Our Habit Tracker application is composed of several React components, each with specific responsibilities. Here's an updated overview of the component hierarchy and their roles:

```
App
└── HabitTracker
    ├── DateNavigation
    ├── AddHabitForm
    └── HabitList
        └── HabitItem (multiple)
```

### Component Responsibilities

1. **App**: The root component that renders the main application structure.
2. **HabitTracker**: Manages the overall state of habits and orchestrates the main functionality.
3. **DateNavigation**: Handles navigation between different dates for habit tracking.
4. **AddHabitForm**: Handles the creation of new habits.
5. **HabitList**: Renders the list of all habits.
6. **HabitItem**: Represents an individual habit, displaying its details and tracking progress.

### Component Relationships

```
+-------------+     +----------------+
|    App      | --> |  HabitTracker  |
+-------------+     +----------------+
                           |
                           |
              +------------+------------+
              |            |            |
   +-------------------+   |    +-----------------+
   |  DateNavigation   |   |    |    HabitList    |
   +-------------------+   |    +-----------------+
                           |            |
                  +----------------+    |
                  |  AddHabitForm  |    |
                  +----------------+    |
                                        |
                                +-----------------+
                                |    HabitItem    |
                                +-----------------+
```

### Key Interactions

1. **HabitTracker** maintains the state of all habits and the current date.
2. **DateNavigation** allows users to change the current date, updating the state in **HabitTracker**.
3. **AddHabitForm** submits new habits to **HabitTracker**.
4. **HabitList** receives the list of habits from **HabitTracker** and renders them.
5. **HabitItem** components are created for each habit in **HabitList**.
6. User interactions with **HabitItem** (e.g., marking as complete) update the state in **HabitTracker**.

This architecture promotes a clear separation of concerns and allows for easy management of habit-related functionality throughout the application.

### State Management

The application uses React's Context API for state management. The `HabitContext` provides the habit data and related functions to all components that need them, eliminating the need for prop drilling.
