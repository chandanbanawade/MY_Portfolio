import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getSessionTypes } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sessions = await getSessionTypes();
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site.url}/book`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...sessions.map((s) => ({
      url: `${site.url}/book?session=${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
