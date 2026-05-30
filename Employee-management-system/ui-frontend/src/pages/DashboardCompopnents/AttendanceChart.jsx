import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AttendanceChart = ({ employees }) => {
    
    const data = employees.map(emp => ({
      name: emp.name,
      attendance: parseFloat(
      emp.attendance?.replace("%", "") || 0)
    }));

  return (
    <div className="chart-section">

      <h3>
        Attendance Analytics
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={data}>

          <XAxis dataKey="name"
                 tick={{ fill: "#ffffff" }}
          />

          <YAxis
             tick={{ fill: "#ffffff" }}
          />

          <Tooltip

          formatter={(value) => [`${value}%`,  "attendance"]}

            cursor={{
                fill:"transparent"
            }}
            contentStyle={{
            backgroundColor: "#1e293b",
            border: "none",
            borderRadius: "10px",
            
            }}
            labelStyle={{
                color: "#fff"
            }}
            itemStyle={{
                color: "#fff"
            }}
          />

         

          <Bar dataKey="attendance"
                 fill="#3b82f6"
                activeBar={{fill: "#2f7af4"}}
                radius={[8, 8, 0, 0]}
        
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default AttendanceChart;