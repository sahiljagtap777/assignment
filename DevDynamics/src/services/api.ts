// src/services/api.ts
import axios from 'axios';
import { APIData } from '../types';

export const fetchData = async (): Promise<APIData> => {
  const response = await axios.get('/data.json');
  return response.data;
};
