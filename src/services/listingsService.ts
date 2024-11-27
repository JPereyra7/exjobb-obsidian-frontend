import axios from 'axios';
import { iListings, iListingsResponse } from '../models/iListings';


const BASE_URL = import.meta.env.VITE_BASE_URL;

//API call to handle GET
export const getListings = async (): Promise<iListings[]> => {
  try {
    const response = await axios.get<iListingsResponse>(BASE_URL);
    console.log("API Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
 