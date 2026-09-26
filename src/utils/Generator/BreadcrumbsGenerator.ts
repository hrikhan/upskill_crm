/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/breadcrumbUtils.ts

export interface RouteBreadcrumbData {
  name: string;
  icon?: React.ReactNode;
  targetPath?: string; // Resolved clickable target path (e.g. redirect target or first child)
  isClickable?: boolean;
}

export const flattenRoutes = (routes: any[], base = "") => {
  const map: Record<string, RouteBreadcrumbData> = {};

  const processEntry = (entry: any, currentBase: string) => {
    // If it's a top-level route definition with children (like { path: "/admin", children: [...] })
    if (entry.children && Array.isArray(entry.children)) {
      const entryBase = entry.path 
        ? (entry.path.startsWith("/") ? entry.path : `${currentBase}/${entry.path}`).replace(/\/+/g, "/")
        : currentBase;

      entry.children.forEach((child: any) => processEntry(child, entryBase));
      return;
    }

    // Group with items (like { group: "Main Menu", items: [...] })
    if (entry.items && Array.isArray(entry.items)) {
      entry.items.forEach((item: any) => {
        const fullPath = `${currentBase}/${item.path}`.replace(/\/+/g, "/");
        
        // Find if this item has children or redirects
        const targetPath = resolveFirstChildPath(item, fullPath);
        map[fullPath] = {
          name: item.name || item.label,
          icon: item.icon,
          targetPath: targetPath || fullPath,
          isClickable: !!(item.element && !item.children?.length) || !!targetPath,
        };

        if (item.children) {
          flattenNested(item.children, fullPath, map);
        }
      });
      return;
    }

    // Single item
    if (entry.path) {
      const fullPath = `${currentBase}/${entry.path}`.replace(/\/+/g, "/");
      const targetPath = resolveFirstChildPath(entry, fullPath);

      map[fullPath] = {
        name: entry.name || entry.label,
        icon: entry.icon,
        targetPath: targetPath || fullPath,
        isClickable: !!(entry.element && !entry.children?.length) || !!targetPath,
      };

      if (entry.children) {
        flattenNested(entry.children, fullPath, map);
      }
    }
  };

  routes.forEach((route) => processEntry(route, base));

  return map;
};

// Helper: resolves the actual navigable destination of a parent item (e.g. its index redirect or first child)
const resolveFirstChildPath = (item: any, currentPath: string): string | undefined => {
  if (!item.children || !Array.isArray(item.children) || item.children.length === 0) {
    return undefined;
  }

  // Look for index route or first child with path
  for (const child of item.children) {
    if (child.path && child.path !== "") {
      return `${currentPath}/${child.path}`.replace(/\/+/g, "/");
    }
  }

  return undefined;
};

const flattenNested = (
  children: any[],
  parentPath: string,
  map: Record<string, RouteBreadcrumbData>
) => {
  children.forEach((child) => {
    if (!child.path) return;
    const fullPath = `${parentPath}/${child.path}`.replace(/\/+/g, "/");
    const targetPath = resolveFirstChildPath(child, fullPath);

    map[fullPath] = {
      name: child.name || child.label,
      icon: child.icon,
      targetPath: targetPath || fullPath,
      isClickable: true,
    };

    if (child.children) {
      flattenNested(child.children, fullPath, map);
    }
  });
};
