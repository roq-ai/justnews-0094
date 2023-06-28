import axios from 'axios';
import queryString from 'query-string';
import { NewsSourceInterface, NewsSourceGetQueryInterface } from 'interfaces/news-source';
import { GetQueryInterface } from '../../interfaces';

export const getNewsSources = async (query?: NewsSourceGetQueryInterface) => {
  const response = await axios.get(`/api/news-sources${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNewsSource = async (newsSource: NewsSourceInterface) => {
  const response = await axios.post('/api/news-sources', newsSource);
  return response.data;
};

export const updateNewsSourceById = async (id: string, newsSource: NewsSourceInterface) => {
  const response = await axios.put(`/api/news-sources/${id}`, newsSource);
  return response.data;
};

export const getNewsSourceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/news-sources/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNewsSourceById = async (id: string) => {
  const response = await axios.delete(`/api/news-sources/${id}`);
  return response.data;
};
