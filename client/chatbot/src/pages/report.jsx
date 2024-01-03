import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Report = () => {
  const data = [
    { name: "January", sales: 65 },
    { name: "February", sales: 59 },
    { name: "March", sales: 80 },
    { name: "April", sales: 81 },
    { name: "May", sales: 56 },
  ];
  return (
    <div>
      <h2>Monthly Sales Line Chart</h2>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default Report;
