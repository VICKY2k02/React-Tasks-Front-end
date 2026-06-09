import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getRoleStats } from "../../services/EmployeeService";

const COLORS = [
  "#10b981",
  "#2563eb"
];

const RoleChart = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    loadRoleStats();
  }, []);

const loadRoleStats = async () => {

  try {

    const stats = await getRoleStats();

    console.log("ROLE STATS:", stats);

    setData([
      {
        name: "Admin",
        value: stats.admin
      },
      {
        name: "User",
        value: stats.user
      }
    ]);

  } catch (error) {

    console.log(error);

  }
};

  return (

    <div className="chart-section">

      <h3>
        Employee Count By Role
      </h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            innerRadius={50}
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
};

export default RoleChart;