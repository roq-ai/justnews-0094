import { ClientPreferenceInterface } from 'interfaces/client-preference';
import { NewsCardInterface } from 'interfaces/news-card';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface NewsCategoryInterface {
  id?: string;
  category_name: string;
  editor_id?: string;
  created_at?: any;
  updated_at?: any;
  client_preference?: ClientPreferenceInterface[];
  news_card?: NewsCardInterface[];
  user?: UserInterface;
  _count?: {
    client_preference?: number;
    news_card?: number;
  };
}

export interface NewsCategoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  category_name?: string;
  editor_id?: string;
}
