import { NewsCardInterface } from 'interfaces/news-card';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface NewsSourceInterface {
  id?: string;
  source_name: string;
  editor_id?: string;
  created_at?: any;
  updated_at?: any;
  news_card?: NewsCardInterface[];
  user?: UserInterface;
  _count?: {
    news_card?: number;
  };
}

export interface NewsSourceGetQueryInterface extends GetQueryInterface {
  id?: string;
  source_name?: string;
  editor_id?: string;
}
