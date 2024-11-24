import "../styles/dashboardstats.css";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
}

export const DashboardStats = ({ title, value, icon }: StatsCardProps) => (
  <div
    className="bg-gradient-to-tr from-[#010102] to-[#1e293b] rounded-[5px] p-6 
    border border-gray-700 cursor-pointer transition-all duration-300 
    hover:bg-opacity-90 active:bg-opacity-75 
    lg:hover:shadow-2xl lg:hover:shadow-teal-100/50 
    active:shadow-2xl active:shadow-teal-100/50 
    lg:hover:scale-[1.02] active:scale-[0.98]"
  >
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-gray-400 text-sm mb-2 font">{title}</h2>
        <p
          className="text-white text-2xl font-medium fontValue 
          transition-colors duration-300 
          group-hover:text-cyan-300 
          lg:group-hover:text-cyan-300"
        >
          {value}
        </p>
      </div>
      <div
        className="p-3 bg-[#1e293b] rounded-xl 
        transition-colors duration-300 
        group-hover:bg-[#263548]"
      >
        {icon}
      </div>
    </div>
  </div>
);
