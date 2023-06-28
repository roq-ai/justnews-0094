import { ClientInterface } from 'interfaces/client';
import { NewsCategoryInterface } from 'interfaces/news-category';
import { GetQueryInterface } from 'interfaces';

export interface ClientPreferenceInterface {
  id?: string;
  client_id?: string;
  news_category_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  news_category?: NewsCategoryInterface;
  _count?: {};
}

export interface ClientPreferenceGetQueryInterface extends GetQueryInterface {
  id?: string;
  client_id?: string;
  news_category_id?: string;
}
