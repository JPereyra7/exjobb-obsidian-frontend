import { AgentsListProps } from '../models/iAgent';

const AgentsList = ({
  agents,
  handleEditButtonClick,
  deleteAgent,
}: AgentsListProps) => {
  return (
    <div className="rounded-[5px] border border-gray-700">
      <h1 className="text-lg font-semibold text-white bg-gradient-to-tr from-[#010102] to-[#1e293b] px-6 py-6 border-b border-gray-800 activeFont">
        Agents
      </h1>
      <div className="overflow-x-auto overflow-y-scroll h-[calc(100vh-30rem)] no-scrollbar">
        <table className="min-w-full bg-gradient-to-tr from-[#010102] to-[#1e293b] table-fixed">
          <thead className="border-b-2 border-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                Image
              </th>
              <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                Surname
              </th>
              <th className="px-6 py-3 text-left text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-64">
                Email
              </th>
              <th className="px-6 py-3 text-right text-[0.85em] text-gray-400 font-semibold tracking-wider activeFont w-40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td className="px-4 py-2 whitespace-nowrap w-20">
                  <img
                    src={agent.agentimage}
                    alt={`${agent.firstname} ${agent.surname}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-normal w-64">
                  <span className="text-sm md:text-base text-gray-100 font-semibold activeFont">
                    {agent.firstname}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-normal w-64">
                  <span className="text-sm md:text-base text-gray-100 font-semibold activeFont">
                    {agent.surname}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-normal w-64">
                  <span className="text-sm md:text-base text-gray-100 font-semibold activeFont">
                    {agent.email}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-40 text-right">
                  <div className="flex flex-row items-center justify-end">
                    <button
                      onClick={() => handleEditButtonClick(agent)}
                      className="bg-teal-600 text-white px-3 py-1 rounded mr-2 hover:bg-teal-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsList;
