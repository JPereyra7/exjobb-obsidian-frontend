import { getAgents } from '../services/agentsService';

jest.mock('../services/agentsService.ts');

describe('getAgents', () => {
  test('should return a list of mock agents', async () => {
    const agents = await getAgents();
    expect(agents).toBeDefined();
    expect(Array.isArray(agents)).toBe(true);
    expect(agents).toHaveLength(2);

    const firstAgent = agents[0];
    expect(firstAgent.firstname).toBe('Agent');
    expect(firstAgent.surname).toBe('Smith');
    expect(firstAgent.email).toBe('mr.anderson@gmail.com');
    expect(firstAgent.agentimage).toBe('http');
    
    const secondAgent = agents[1];
    expect(secondAgent.firstname).toBe('James');
    expect(secondAgent.surname).toBe('Bond');
    expect(secondAgent.email).toBe('mr.moneypenny@gmail.com');
    expect(secondAgent.agentimage).toBe('http2')
});
});
