import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

const DepartmentChart = ({ employees }) => {

  const departments = {};

  employees.forEach(emp => {

    departments[emp.department] =
      (departments[emp.department] || 0) + 1;

  });

  const data = Object.keys(departments)
    .map(dep => ({
      name: dep,
      value: departments[dep]
    }));

  return (
    <div className="chart-section">

      <h3>
        Department Distribution
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
          >
            {
              data.map((entry,index)=>(
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                      COLORS.length
                    ]
                  }
                />
              ))
            }

          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default DepartmentChart;