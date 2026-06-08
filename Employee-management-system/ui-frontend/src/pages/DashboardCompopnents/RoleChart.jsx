// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";

// const COLORS = [
//   "#10b981",
//   "#2563eb"
// ];

// const RoleChart = () => {

//   const data = [
//     {
//       name: "Admin",
//       value: 2
//     },
//     {
//       name: "User",
//       value: 2
//     }
//   ];

//   return (
//     <div className="chart-section">

//       <h3>
//         Employee Count By Role
//       </h3>

//       <ResponsiveContainer
//         width="100%"
//         height={300}
//       >
//         <PieChart>

//           <Pie
//             data={data}
//             dataKey="value"
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={100}
//             paddingAngle={0}
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={index}
//                 fill={
//                   COLORS[
//                     index % COLORS.length
//                   ]
//                 }
//               />
//             ))}
//           </Pie>

//           <Tooltip />
//           <Legend />

//         </PieChart>
//       </ResponsiveContainer>

//     </div>
//   );
// };

// export default RoleChart;
import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getRoleStats }
from "../../services/EmployeeService";

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

    const stats =
      await getRoleStats();

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
            innerRadius={60}
            outerRadius={100}
          >

            {data.map(
              (entry,index)=>(
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                      COLORS.length
                    ]
                  }
                />
              )
            )}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
};

export default RoleChart;