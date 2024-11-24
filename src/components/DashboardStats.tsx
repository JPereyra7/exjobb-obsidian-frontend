import '../styles/dashboardstats.css'

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
}

export const DashboardStats = ({ title, value, icon }: StatsCardProps) => (
  <div className="bg-gradient-to-tr from-[#010102] to-[#1e293b] rounded-[5px] p-6 border border-gray-700 cursor-pointer">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-gray-400 text-sm mb-2 font">{title}</h2>
        <p className="text-white text-2xl font-medium fontValue hover:text-cyan-300">{value}</p>
      </div>
      <div className="p-3 bg-[#1e293b] rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);