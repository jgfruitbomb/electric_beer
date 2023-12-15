import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

function Chart(props) {
  const [numbers, setNumbers] = useState([]);

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
      setNumbers((prevNumbers) => [...prevNumbers, lastMessage.data]);

      if (numbers.length > 9) {
        setNumbers((prevNumbers) => prevNumbers.slice(1));
      }
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(() => sendMessage("zap"), []);

  return (
    <>
      <h1>The WebSocket is currently {connectionStatus}</h1>
      <button onClick={handleClickChangeSocketUrl}>Send message</button>
      <ul>
        Count:{" "}
        {numbers.map((number) => (
          <li>{number}</li>
        ))}
      </ul>
    </>
  );
}

export default Chart;
