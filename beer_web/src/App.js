import { useEffect, useState, useRef } from "react";
import Chart from "./components/Chart";
import useWebSocket, { ReadyState } from "react-use-websocket";
import styles from "./App.css";

// Micro-controller drink names
// Lord of drink
// Hammer Time
// 3 Guys 1 tazer [Love this one]
// Feel no pain
// Small Jag Off
// White Girl Wasted

// TO-DO
// Read the messages from the sockets and compare them
// Send signal to losing micro controller
// Create a count down timer to start?
// Display who is getting zapped
//<Chart url={"ws://192.168.1.183"} name={"3 Guys 1 Tazer"} />

function App() {
  // esp nicknames
  const esp1Name = "2 Guys 1 tazer";
  const esp2Name = "White Girl Wasted";

  // Websocket urls
  const ws1Url = "ws://192.168.1.40";
  const ws2Url = "ws://192.168.1.41";

  // Data object arrays
  const [esp1, setEsp1] = useState([{}]);
  const [esp2, setEsp2] = useState([{}]);

  // Empty Cup Value
  const esp1Empty = 20;
  const esp2Empty = 17.5;

  // Completed or not
  const [winner, setWinner] = useState("");
  const hasWinnerRef = useRef(false);

  const [start, setStart] = useState(false);

  // Open websocket connection
  const {
    sendMessage: sendMessage1,
    lastMessage: lastMessage1,
    readyState: readyState1,
  } = useWebSocket(ws1Url, {
    onOpen: () => console.log("esp1 open"),
    shouldReconnect: (closeEvent) => true,
  });

  const {
    sendMessage: sendMessage2,
    lastMessage: lastMessage2,
    readyState: readyState2,
  } = useWebSocket(ws2Url, {
    onOpen: () => console.log("esp2 open"),
    shouldReconnect: (closeEvent) => true,
  });

  // Reading data from sockets if over 24 data points remove first one
  useEffect(() => {
    if (winner !== "" || start === false) return;
    if (lastMessage1 !== null) {
      setEsp1((prevNumbers) => [
        ...prevNumbers,
        { [esp1Name]: lastMessage1.data },
      ]);

      if (esp1.length > 24) {
        setEsp1((prev) => prev.slice(1));
      }

      let counter1 = 0;
      esp1.forEach((value) => {
        if (Object.values(value) > esp1Empty) {
          counter1++;
          console.log(`Counter for ${esp1Name} increased: ${counter1}`);
        }
        if (counter1 > 23) {
          setWinner(`${esp1Name}`);
        }
      });
    }
  }, [lastMessage1]);

  useEffect(() => {
    if (winner !== "" || start == false) return;
    if (lastMessage2 !== null) {
      setEsp2((prevNumbers) => [
        ...prevNumbers,
        { [esp2Name]: lastMessage2.data },
      ]);

      if (esp2.length > 24) {
        setEsp2((prev) => prev.slice(1));
      }

      let counter2 = 0;
      esp2.forEach((value) => {
        if (Object.values(value) > esp2Empty) {
          counter2++;
          console.log(`Counter for ${esp2Name} increased: ${counter2}`);
        }
        if (counter2 > 23) {
          setWinner(`${esp2Name}`);
        }
      });
    }
  }, [lastMessage2]);

  useEffect(() => {
    // Check if winner is set and execute the corresponding function
    if (winner !== "" && !hasWinnerRef.current) {
      // You can add additional conditions if needed
      if (winner === esp1Name) {
        handleSendMessage2(); //TODO Change to 2
      } else if (winner === esp2Name) {
        handleSendMessage1();
      }

      // Update the flag to true to prevent further calls
      hasWinnerRef.current = true;
    }
  }, [winner]);

  // Sending Messages to sockets
  const handleSendMessage1 = () => {
    sendMessage1("zap");
    console.log("sending zap command to 1");
  };

  const handleSendMessage2 = () => {
    sendMessage2("zap");
    console.log("sending zap command to 2");
  };

  return (
    <>
      {winner === "" ? (
        <>
          <div className="flex-container">
            <Chart
              numbers={esp1}
              nickname={esp1Name}
              readyState={readyState1}
            />
            <Chart
              numbers={esp2}
              nickname={esp2Name}
              readyState={readyState2}
            />
          </div>
          <button onClick={() => setStart(true)}>Start</button>
        </>
      ) : (
        <>
          <h1>Winner is {winner}</h1>
        </>
      )}
      <button onClick={handleSendMessage1}>Zap1</button>
      <button onClick={handleSendMessage2}>Zap2</button>
    </>
  );
}

export default App;
