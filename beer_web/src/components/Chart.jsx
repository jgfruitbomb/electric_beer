import { AreaChart, Area, YAxis, CartesianGrid, Tooltip } from "recharts";
import styles from "./Chart.css";

function Chart(props) {
  let connectionStatus;

  switch (props.readyState) {
    case 0:
      connectionStatus = "CONNECTING";
      break;
    case 1:
      connectionStatus = "OPEN";
      break;
    case 2:
      connectionStatus = "CLOSING";
      break;
    case 3:
      connectionStatus = "CLOSED";
      break;
  }

  return (
    <div className="flex-object">
      <h1>{props.nickname}</h1>
      <p>{connectionStatus}</p>
      <AreaChart
        width={600}
        height={700}
        data={props.numbers}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis type="number" domain={[2, 19.7]} />
        <Tooltip />
        <Area
          connectNulls
          type="monotone"
          dataKey={props.nickname}
          stroke="#8884d8"
          activeDot={{ r: 24 }}
          strokeWidth="5"
        />
      </AreaChart>
    </div>
  );
}

export default Chart;
