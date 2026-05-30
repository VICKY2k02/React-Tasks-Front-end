import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const ActivityChart = ({ employees }) => {

  const data = employees.map((emp,index)=>({
    name: index + 1,
    value:
      emp.status === "Active"
        ? 1
        : 0
  }));

  return (
    <div className="chart-section">

      <h3>
        Employee Activity
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart data={data}>

          <XAxis dataKey="name"/>

          <YAxis/>

          <Tooltip/>

          <Line
            type="monotone"
            dataKey="value"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default ActivityChart;