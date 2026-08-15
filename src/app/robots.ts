import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin and booking confirmations must never be indexed.
      disallow: ["/admin", "/admin/", "/api/", "/booking/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
