import axios from 'axios';
import queryString from 'query-string';
import { ClientPreferenceInterface, ClientPreferenceGetQueryInterface } from 'interfaces/client-preference';
import { GetQueryInterface } from '../../interfaces';

export const getClientPreferences = async (query?: ClientPreferenceGetQueryInterface) => {
  const response = await axios.get(`/api/client-preferences${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createClientPreference = async (clientPreference: ClientPreferenceInterface) => {
  const response = await axios.post('/api/client-preferences', clientPreference);
  return response.data;
};

export const updateClientPreferenceById = async (id: string, clientPreference: ClientPreferenceInterface) => {
  const response = await axios.put(`/api/client-preferences/${id}`, clientPreference);
  return response.data;
};

export const getClientPreferenceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/client-preferences/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteClientPreferenceById = async (id: string) => {
  const response = await axios.delete(`/api/client-preferences/${id}`);
  return response.data;
};
