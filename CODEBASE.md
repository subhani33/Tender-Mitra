# Tender-Mitra Codebase Documentation

This document provides a friendly guide to understanding the Tender-Mitra codebase structure, key files, and usage guidelines. Think of it as your map to navigate and extend this project.

## Core Components

### UI Components

| Component | File | Purpose |
|-----------|------|---------|
| ErrorBoundary | `src/components/ErrorBoundary.tsx` | Acts as a safety net by catching JavaScript errors in child components. It displays a user-friendly fallback UI instead of crashing the entire app, while logging error details to help with debugging. |
| LiveIndicator | `src/components/LiveIndicator.tsx` | Provides real-time feedback on connection status using "LIVE" or "DISCONNECTED" indicators with the time of last update. |
| FamousTenders | `src/components/FamousTenders.tsx` | Creates an eye-catching 3D visualization of notable government tenders, allowing users to explore them in an interactive way using Three.js. |
| GovtLogo | `src/components/GovtLogo.tsx` | Renders the official Government of India emblem with optional animation effects for a more dynamic presentation. |
| GovtWebsites | `src/components/GovtWebsites.tsx` | Showcases a curated collection of government tender and procurement websites with helpful descriptions to guide users to official resources. |
| GuidelinesLibrary | `src/components/GuidelinesLibrary.tsx` | Organizes tender guidelines and documentation in an accessible digital library format for easy reference. |
| Hero3D | `src/components/Hero3D.tsx` | Powers the visually striking 3D interactive hero section that welcomes users on the landing page. |
| RegulatoryRequirements | `src/components/RegulatoryRequirements.tsx` | Presents regulatory requirements for tenders in an interactive, easy-to-understand format. |
| TenderFAQ | `src/components/TenderFAQ.tsx` | Answers common questions about the tender process in an expandable Q&A format. |
| TenderStories | `src/components/TenderStories.tsx` | Shares real-world success and failure stories to help users learn from others' experiences with tender applications. |
| Todo | `src/components/Todo.tsx` | Provides a task management system to help users track and organize their tender application tasks. |
| ContactInfo | `src/components/common/ContactInfo.tsx` | A reusable component that consistently displays contact information across the application. |
| IndiaStatesTenderList | `src/components/common/IndiaStatesTenderList.tsx` | Lets users browse tender listings by state, making it easier to find local opportunities. |
| TaskManagerGuide | `src/components/tasks/TaskManagerGuide.tsx` | Offers friendly help documentation for users new to the task manager feature. |

### Application Structure

| File | Purpose |
|------|---------|
| App.tsx | `src/App.tsx` | The central component that handles routing and maintains global state, serving as the backbone of the application. |
| main.tsx | `src/main.tsx` | The application's entry point that renders the React app and handles service worker registration for offline capabilities. |
| index.css | `src/index.css` | Contains global styles including Tailwind CSS imports and custom styling that give the app its distinctive look. |
| vite.config.ts | `vite.config.ts` | Configuration settings for the Vite build tool, including development server settings, build options, and performance optimizations. |

## Key Interfaces and Types

The application uses TypeScript to ensure type safety. Here are the key interfaces you'll encounter:

```typescript
// Task management
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  category?: string;
}

// Tender information
interface FamousTender {
  id: string;
  title: string;
  state: string;
  value: number;
  dueDate: string;
  description: string;
  department: string;
  category: string;
}

// Status tracking
interface LiveIndicatorProps {
  isConnected: boolean;
  lastUpdated: Date | null;
}

// Complete tender information
interface Tender {
  _id: string;
  referenceNumber: string;
  title: string;
  department: string;
  value: number;
  deadline: string;
  status: 'Open' | 'Closed' | 'Under Review' | 'Awarded' | 'Cancelled' | 'Closing Soon';
  description: string;
  location: string;
  category: string;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  publishedDate?: string;
  openingDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Development Guidelines

### Adding New Components

1. Create a new TypeScript file in the appropriate directory under `src/components/`
2. Define clear TypeScript interfaces for your props to ensure type safety
3. Use functional components with hooks for a modern React approach
4. Style with Tailwind CSS to maintain visual consistency across the app
5. Import and use your component where needed in the application

### Best Practices

1. Error Handling: Wrap your components with ErrorBoundary to contain failures and provide a better user experience when things go wrong
2. Performance: Consider using React.memo for components that render frequently but don't change often to avoid unnecessary re-renders
3. Styling: Reach for Tailwind utilities first, and only create custom CSS when you need something truly unique
4. State Management: Keep state as local as possible using React hooks, and use context for sharing data that many components need
5. Typing: Invest time in creating proper TypeScript interfaces for your props and state—they'll save you from bugs down the road

### Example: Adding a New Feature

```typescript
// src/components/NewFeature.tsx
import React, { useState } from 'react';

interface NewFeatureProps {
  title: string;
  description: string;
  onAction: () => void;
}

export const NewFeature: React.FC<NewFeatureProps> = ({ 
  title,
  description,
  onAction
}) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <p className="mt-2 text-white/80">{description}</p>
      <button 
        className="mt-4 px-4 py-2 bg-primary text-secondary rounded hover:bg-primary/80 transition-colors"
        onClick={() => {
          setIsActive(!isActive);
          onAction();
        }}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
};
```

## Deployment

The application is ready to be deployed to various platforms with minimal configuration:

1. Static Hosting: Run `npm run build` and upload the `dist` folder to any static hosting service like Netlify, Vercel, or GitHub Pages
2. Render: Take advantage of the included `render.yaml` file for a streamlined deployment process
3. Custom Server: For more control, deploy the backend separately and configure the frontend to connect to your custom API

## Common Issues and Solutions

### "Module not found" errors
Don't worry! This usually means there's a typo in an import path. Double-check the file path and make sure the file exists where you're looking for it.

### Styling inconsistencies
If things look a bit off, ensure you're using the theme colors defined in `tailwind.config.js`. This helps maintain a consistent look across the entire application.

### API connectivity issues
If you're having trouble connecting to the API, check your `.env` file to make sure the API URL is configured correctly.

### Performance problems
If the app feels sluggish, use React DevTools profiler to identify components that are re-rendering unnecessarily. You might need to add memoization or optimize state updates. 