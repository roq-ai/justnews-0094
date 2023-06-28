import axios from 'axios';
import queryString from 'query-string';
import { NewsCategoryInterface, NewsCategoryGetQueryInterface } from 'interfaces/news-category';
import { GetQueryInterface } from '../../interfaces';

export const getNewsCategories = async (query?: NewsCategoryGetQueryInterface) => {
  const response = await axios.get(`/api/news-categories${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNewsCategory = async (newsCategory: NewsCategoryInterface) => {
  const response = await axios.post('/api/news-categories', newsCategory);
  return response.data;
};

export const updateNewsCategoryById = async (id: string, newsCategory: NewsCategoryInterface) => {
  const response = await axios.put(`/api/news-categories/${id}`, newsCategory);
  return response.data;
};

export const getNewsCategoryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/news-categories/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNewsCategoryById = async (id: string) => {
  const response = await axios.delete(`/api/news-categories/${id}`);
  return response.data;
};
