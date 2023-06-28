const mapping: Record<string, string> = {
  clients: 'client',
  'client-preferences': 'client_preference',
  'news-cards': 'news_card',
  'news-categories': 'news_category',
  'news-sources': 'news_source',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
