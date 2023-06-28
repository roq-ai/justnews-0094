import { NewsSourceInterface } from 'interfaces/news-source';
import { NewsCategoryInterface } from 'interfaces/news-category';
import { GetQueryInterface } from 'interfaces';

export interface NewsCardInterface {
  id?: string;
  summary: string;
  photo?: string;
  link: string;
  news_source_id?: string;
  news_category_id?: string;
  created_at?: any;
  updated_at?: any;

  news_source?: NewsSourceInterface;
  news_category?: NewsCategoryInterface;
  _count?: {};
}

export interface NewsCardGetQueryInterface extends GetQueryInterface {
  id?: string;
  summary?: string;
  photo?: string;
  link?: string;
  news_source_id?: string;
  news_category_id?: string;
}
