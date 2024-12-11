import { iAgent } from '../../models/iAgent';

export const getAgents = async (): Promise<iAgent[]> => {
  return Promise.resolve([
    { id: '101', firstname: 'Agent', surname: 'Smith', email: 'mr.anderson@gmail.com', agentimage: 'http' },
    { id: '102', firstname: 'James', surname: 'Bond', email: 'mr.moneypenny@gmail.com', agentimage: 'http2' },
  ]);
};
