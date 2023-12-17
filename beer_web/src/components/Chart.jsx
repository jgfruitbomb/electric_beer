import {
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
    <>
      <h1>The WebSocket is currently {connectionStatus}</h1>
      <AreaChart
        width={500}
        height={300}
        data={props.numbers}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis type="number" domain={[0, 255]} />
        <Tooltip />
        <Legend />
        <Area
          connectNulls
          type="monotone"
          dataKey={props.nickname}
          stroke="#8884d8"
          activeDot={{ r: 24 }}
          strokeWidth="5"
        />
      </AreaChart>
    </>
  );
}

export default Chart;
