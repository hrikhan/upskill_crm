/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/breadcrumbUtils.ts
export const flattenRoutes = (routes: any[], base = "") => {
  let map: Record<string, { name: string; icon?: React.ReactNode }> = {};

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
        map[fullPath] = { name: item.name || item.label, icon: item.icon };

        if (item.children) {
          const nested = flattenNested(item.children, fullPath);
          map = { ...map, ...nested };
        }
      });
      return;
    }

    // Single item
    if (entry.path) {
      const fullPath = `${currentBase}/${entry.path}`.replace(/\/+/g, "/");
      map[fullPath] = { name: entry.name || entry.label, icon: entry.icon };
      if (entry.children) {
        const nested = flattenNested(entry.children, fullPath);
        map = { ...map, ...nested };
      }
    }
  };

  routes.forEach((route) => processEntry(route, base));

  return map;
};

const flattenNested = (children: any[], parentPath: string) => {
  let map: Record<string, { name: string; icon?: React.ReactNode }> = {};
  children.forEach((child) => {
    const fullPath = `${parentPath}/${child.path}`.replace(/\/+/g, "/");
    map[fullPath] = { name: child.name || child.label, icon: child.icon };
    if (child.children) {
      map = { ...map, ...flattenNested(child.children, fullPath) };
    }
  });
  return map;
};
