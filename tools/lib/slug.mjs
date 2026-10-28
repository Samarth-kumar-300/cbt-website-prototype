export const ROUTES = ['/', '/therapy-centres', '/schools', '/parents', '/resources', '/about', '/contact-us'];

export function routeToSlug(route) {
  const s = route.replace(/^\/+|\/+$/g, '');
  return s === '' ? 'home' : s.replace(/\//g, '-');
}

export function slugToComponentName(slug) {
  return slug.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('') + 'Page';
}
