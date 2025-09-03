import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Routes that handle their own scrolling
    const selfScrollingRoutes = [
      '/', // Home page
      /^\/page\/\d+$/, // All pagination routes
      '/products', // If you have a products route
      '/listings', // If you have a listings route
    ];

    // Check if current route handles its own scrolling
    const handlesSelfScrolling = selfScrollingRoutes.some(route => {
      if (typeof route === 'string') {
        return pathname === route;
      } else {
        return route.test(pathname);
      }
    });

    // Only scroll to top if route doesn't handle its own scrolling
    if (!handlesSelfScrolling) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}
