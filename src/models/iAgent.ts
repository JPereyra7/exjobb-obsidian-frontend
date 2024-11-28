export interface iAgent {
    id: string;
    firstname: string;
    surname: string;
    email: string;
    agentimage: string;
}

export interface AgentsListProps {
    agents: iAgent[];
    handleEditButtonClick: (agent: iAgent) => void;
    deleteAgent: (agentId: string) => void;
  }

  export interface AddAgentDialogProps {
    onClose: () => void;
    onAdd: (newAgent: iAgent) => void;
  }