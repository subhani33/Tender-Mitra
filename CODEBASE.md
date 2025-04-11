# Tender-Mitra Codebase Documentation

This document provides detailed information about the Tender-Mitra codebase structure, key files, and usage guidelines.

## Core Components

### UI Components

| Component | File | Purpose |
|-----------|------|---------|
| **ErrorBoundary** | `src/components/ErrorBoundary.tsx` | Catches JavaScript errors in child components, displays fallback UI, and logs details. Essential for preventing app crashes. |
| **LiveIndicator** | `src/components/LiveIndicator.tsx` | Shows connection status with "LIVE" or "DISCONNECTED" states and last update time. |
| **FamousTenders** | `src/components/FamousTenders.tsx` | Interactive 3D visualization of notable government tenders using Three.js. |
| **GovtLogo** | `src/components/GovtLogo.tsx` | Official Government of India emblem with animation options. |
| **GovtWebsites** | `src/components/GovtWebsites.tsx` | Collection of government tender and procurement websites with descriptions. |
| **GuidelinesLibrary** | `src/components/GuidelinesLibrary.tsx` | Digital library of tender guidelines and documentation. |
| **Hero3D** | `src/components/Hero3D.tsx` | 3D interactive hero section for the landing page. |
| **RegulatoryRequirements** | `src/components/RegulatoryRequirements.tsx` | Interactive list of regulatory requirements for tenders. |
| **TenderFAQ** | `src/components/TenderFAQ.tsx` | Frequently asked questions about the tender process. |
| **TenderStories** | `src/components/TenderStories.tsx` | Success and failure stories for tender applications. |
| **Todo** | `src/components/Todo.tsx` | Task management system for tracking tender application tasks. |
| **ContactInfo** | `src/components/common/ContactInfo.tsx` | Reusable contact information display component. |
| **IndiaStatesTenderList** | `src/components/common/IndiaStatesTenderList.tsx` | State-wise browsable tender listings. |
| **TaskManagerGuide** | `src/components/tasks/TaskManagerGuide.tsx` | Help documentation for the task manager feature. |

### Application Structure

| File | Purpose |
|------|---------|
| **App.tsx** | Main application component with routing and global state. |
| **main.tsx** | Entry point that renders the React app and registers service worker. |
| **index.css** | Global styles including Tailwind CSS imports and custom CSS. |
| **vite.config.ts** | Vite configuration including dev server, build options, and optimizations. |

## Key Interfaces and Types

The application uses TypeScript extensively. Key interfaces include:

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
2. Define proper TypeScript interfaces for props
3. Follow React best practices with functional components
4. Use Tailwind CSS for styling to maintain consistency
5. Import and use the component where needed

### Best Practices

1. **Error Handling**: Wrap components with `ErrorBoundary` to prevent cascading failures
2. **Performance**: Use React.memo for components that render often but rarely change
3. **Styling**: Use Tailwind utilities first, then custom CSS only when necessary
4. **State Management**: Use React hooks for local state, context for shared state
5. **Typing**: Always define proper TypeScript interfaces for props and state

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

The application is configured for easy deployment to various platforms:

1. **Static Hosting**: Build with `npm run build` and deploy the `dist` folder
2. **Render**: Use the included `render.yaml` for automatic deployment configuration
3. **Custom Server**: Deploy backend separately and configure frontend to connect to it

## Common Issues and Solutions

### "Module not found" errors
Check import paths and ensure the file exists. The project uses relative imports.

### Styling inconsistencies
Make sure to use the theme colors defined in `tailwind.config.js` for consistency.

### API connectivity issues
Check the `.env` file for proper API URL configuration.

### Performance issues
Look for unnecessary re-renders using React DevTools profiler. 