import axios from 'axios';
import { iAgent, iAgentsResponse } from '../models/iAgent';

const AGENT_URL = import.meta.env.VITE_BASE_AGENTSURL;

//API call to handle GET
export const getAgents = async (): Promise<iAgent[]> => {
  try {
    const response = await axios.get<iAgentsResponse>(AGENT_URL);
    console.log("API Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
 