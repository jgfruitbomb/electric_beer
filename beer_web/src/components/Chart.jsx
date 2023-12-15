import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Chart(props) {
  const [numbers, setNumbers] = useState([{}]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(props.url, {
    onOpen: () => console.log("open"),
    shouldReconnect: (closeEvent) => true,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage.data);
      console.log(props.name);
      setNumbers((prevNumbers) => [
        ...prevNumbers,
        { [props.name]: lastMessage.data },
      ]);
      console.log(numbers);

      if (numbers.length > 24) {
        setNumbers((prevNumbers) => prevNumbers.slice(1));
      }
    }
  }, [lastMessage, numbers.length]);

  const handleClickChangeSocketUrl = useCallback(() => sendMessage("zap"), []);

  return (
    <>
      <h1>The WebSocket is currently {connectionStatus}</h1>
      <button onClick={handleClickChangeSocketUrl}>Send message</button>
      <AreaChart
        width={500}
        height={300}
        data={numbers}
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
          dataKey={props.name}
          stroke="#8884d8"
          activeDot={{ r: 24 }}
          strokeWidth="5"
        />
      </AreaChart>
    </>
  );
}

export default Chart;
