import { MetadataRoute } from 'next';
import keywords from '@/data/keywords.json';

export default function sitemap(): MetadataRoute.Sitemap {
  // 基础 URL
  const baseUrl = 'https://stopsaas.com';

  // 生成100个详情页的站点地图条目
  const keywordEntries = keywords.map((keyword) => ({
    url: `${baseUrl}/${keyword.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 核心页面 - 高优先级
  const corePages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.95, // 聚合页高优先级
    },
  ];

  // 合并所有条目：核心页面 -> 聚合页 -> 100个详情页
  return [...corePages, ...keywordEntries];
}
