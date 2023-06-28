import axios from 'axios';
import queryString from 'query-string';
import { NewsCardInterface, NewsCardGetQueryInterface } from 'interfaces/news-card';
import { GetQueryInterface } from '../../interfaces';

export const getNewsCards = async (query?: NewsCardGetQueryInterface) => {
  const response = await axios.get(`/api/news-cards${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNewsCard = async (newsCard: NewsCardInterface) => {
  const response = await axios.post('/api/news-cards', newsCard);
  return response.data;
};

export const updateNewsCardById = async (id: string, newsCard: NewsCardInterface) => {
  const response = await axios.put(`/api/news-cards/${id}`, newsCard);
  return response.data;
};

export const getNewsCardById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/news-cards/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNewsCardById = async (id: string) => {
  const response = await axios.delete(`/api/news-cards/${id}`);
  return response.data;
};
