const rawSiteUrl =
  (typeof import.meta !== "undefined" &&
  typeof import.meta.env !== "undefined" &&
  import.meta.env.VITE_SITE_URL?.trim()) ||
  "https://yujiazhang.co.uk";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
export const SITE_NAME = "Yujia Zhang";

export function pagePath(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isPagePath =
    normalizedPath !== "/" &&
    !normalizedPath.endsWith("/") &&
    !/\/[^/?#]+\.[^/?#]+(?:[?#].*)?$/.test(normalizedPath);
  return `${normalizedPath}${isPagePath ? "/" : ""}`;
}

export function absoluteUrl(path: string) {
  const normalizedPath = pagePath(path);
  return /^https?:\/\//i.test(normalizedPath)
    ? normalizedPath
    : `${SITE_URL}${normalizedPath}`;
}

export function storyOgImagePath(deskId: string, storySlug: string) {
  return `/og/${deskId}/${storySlug}.png`;
}
