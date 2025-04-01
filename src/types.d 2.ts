// Declaration file for module types

declare module 'framer-motion' {
  export interface MotionProps {
    initial?: any;
    animate?: any;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const motion: {
    div: React.ForwardRefExoticComponent<MotionProps>;
    tr: React.ForwardRefExoticComponent<MotionProps>;
    [key: string]: React.ForwardRefExoticComponent<MotionProps>;
  };
  
  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    [key: string]: any;
  }>;
  
  export function useMotionValue<T>(initial: T): {
    get: () => T;
    set: (v: T) => void;
    [key: string]: any;
  };
  
  export function useTransform<T>(
    value: { get: () => number },
    input: number[],
    output: T[],
    options?: { clamp?: boolean }
  ): { get: () => T; [key: string]: any };
}

declare module 'lucide-react' {
  import React from 'react';
  
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    className?: string;
  }
  
  export const Search: React.FC<IconProps>;
  export const Filter: React.FC<IconProps>;
  export const Bell: React.FC<IconProps>;
  export const FileText: React.FC<IconProps>;
  export const ArrowUpRight: React.FC<IconProps>;
  export const DollarSign: React.FC<IconProps>;
  export const Clock: React.FC<IconProps>;
  export const CheckCircle: React.FC<IconProps>;
  export const XCircle: React.FC<IconProps>;
  export const X: React.FC<IconProps>;
  export const Download: React.FC<IconProps>;
  export const Calendar: React.FC<IconProps>;
  export const ArrowUpDown: React.FC<IconProps>;
  export const ChevronLeft: React.FC<IconProps>;
  export const ChevronRight: React.FC<IconProps>;
  export const BarChart3: React.FC<IconProps>;
  export const Check: React.FC<IconProps>;
  export const AlertTriangle: React.FC<IconProps>;
  export const Info: React.FC<IconProps>;
  
  // Additional icons
  export const TrendingUp: React.FC<IconProps>;
  export const Globe: React.FC<IconProps>;
  export const Building2: React.FC<IconProps>;
  export const Book: React.FC<IconProps>;
  export const Video: React.FC<IconProps>;
  export const Award: React.FC<IconProps>;
  export const Sparkles: React.FC<IconProps>;
  export const Trophy: React.FC<IconProps>;
  export const Users: React.FC<IconProps>;
  export const Layers: React.FC<IconProps>;
  export const BarChart: React.FC<IconProps>;
  export const Activity: React.FC<IconProps>;
  export const BarChart2: React.FC<IconProps>;
  export const RefreshCw: React.FC<IconProps>;
  export const Settings: React.FC<IconProps>;
  export const RotateCw: React.FC<IconProps>;
}

// Fix for JSX element types
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

export interface Tender {
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

export interface TenderFilters {
  status?: string | null;
  department?: string | null;
  searchTerm?: string;
  minValue?: number | null;
  maxValue?: number | null;
  category?: string | null;
  location?: string | null;
  search?: string;
}

export interface SyncStatus {
  status: 'idle' | 'syncing' | 'completed' | 'failed';
  message: string;
  timestamp?: string;
}

export interface TenderStats {
  counts: {
    total: number;
    open: number;
    closingSoon: number;
    closed: number;
  };
  values: {
    total: number;
    average: number;
  };
  departments: Array<{
    name: string;
    count: number;
  }>;
  categories: Array<{
    name: string;
    count: number;
  }>;
}

export interface LiveIndicatorProps {
  isConnected: boolean;
  lastUpdated: Date | null;
} 