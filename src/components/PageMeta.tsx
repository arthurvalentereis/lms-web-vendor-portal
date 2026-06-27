import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description: string;
  noIndex?: boolean;
  path?: string;
  siteName?: string;
}

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string
) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export function PageMeta({
  title,
  description,
  noIndex = false,
  path,
  siteName = "Letmesee",
}: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    const origin = window.location.origin;
    const canonicalPath = path ?? `${window.location.pathname}${window.location.search}`;
    const canonicalUrl = `${origin}${canonicalPath}`;

    upsertLink("canonical", canonicalUrl);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", siteName);
    upsertMeta("property", "og:locale", document.documentElement.lang || "pt-BR");
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
  }, [title, description, noIndex, path, siteName]);

  return null;
}
