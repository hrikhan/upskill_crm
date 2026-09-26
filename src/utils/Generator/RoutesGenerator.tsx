import { JSX, lazy, Suspense, ComponentType } from "react";
import { RouteObject } from "react-router-dom";

// Type for lazy-loaded component
export type LazyComponent = () => Promise<{ default: ComponentType<any> }>;

// Updated RouteItem to support both direct elements and lazy imports
export type RouteItem = {
  path?: string;
  index?: boolean;
  element?: JSX.Element;
  component?: LazyComponent;
  children?: any[];
  // Optional: Custom loading fallback
  fallback?: JSX.Element;
  name?: string;
  label?: string;
  icon?: any;
};

type RouteGroup =
  | {
      group?: string;
      items?: any[];
    }
  | RouteItem;

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

// Helper to create lazy-loaded element with Suspense
const createLazyElement = (
  lazyComponent: LazyComponent,
  fallback?: JSX.Element
): JSX.Element => {
  const LazyComponent = lazy(lazyComponent);
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent />
    </Suspense>
  );
};

const normalizeRoutes = (routes: any[]): RouteObject[] => {
  return routes.flatMap((route) => {
    // If route has `group` and `items`, unpack items
    if ("items" in route && Array.isArray(route.items)) {
      return normalizeRoutes(route.items);
    }

    // Determine the element: use lazy component if provided, otherwise use direct element
    const element = route.component
      ? createLazyElement(route.component, route.fallback)
      : route.element;

    const normalized: RouteObject = {
      element,
      path: route.path,
      index: route.index ? true : undefined,
    };

    if (route.children && route.children.length > 0) {
      normalized.children = normalizeRoutes(route.children);
    }

    return [normalized];
  });
};

export const routesGenerator = (input: RouteGroup[]): RouteObject[] => {
  return normalizeRoutes(input);
};
