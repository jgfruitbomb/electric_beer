import { useEffect, useState, useRef } from "react";
import Chart from "./components/Chart";
import useWebSocket, { ReadyState } from "react-use-websocket";
import styles from "./App.css";
import audio from "./music/chinese_beer.mp3";

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
  const esp1Empty = 19.8;
  const esp2Empty = 17.5;
  const esp1Full = 6;
  const esp2Full = 6;

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

  const chartData = (espFull, espEmpty, espName) => {
    if (winner !== "" || start === false) return;
    let lastMessage;
    if (espName === esp1Name) {
      lastMessage = lastMessage1;
    } else {
      lastMessage = lastMessage2;
    }

    if (lastMessage !== null) {
      let percentage =
        100 - ((espFull - lastMessage.data) / (espFull - espEmpty)) * 100;
      if (percentage < 0) percentage = 0;
      console.log(
        `${espName} percentage: ${percentage} value: ${lastMessage.data}`
      );

      let counter = 0;
      if (espName === esp1Name) {
        setEsp1((prevNumbers) => [...prevNumbers, { [espName]: percentage }]);

        if (esp1.length > 24) {
          setEsp1((prev) => prev.slice(1));
        }
        esp1.forEach((value) => {
          if (Object.values(value) <= 5) {
            //Allowing for 5% margin of error
            counter++;
          }
        });
      } else {
        setEsp2((prevNumbers) => [...prevNumbers, { [espName]: percentage }]);

        if (esp2.length > 24) {
          setEsp2((prev) => prev.slice(1));
        }
        esp2.forEach((value) => {
          if (Object.values(value) <= 5) {
            //Allowing for 5 margin of error
            counter++;
          }
        });
      }

      console.log(`Counter for ${espName} value: ${counter}`);
      if (counter > 23) {
        setWinner(`${espName}`);
      }
    }
  };
  // Reading data from sockets if over 24 data points remove first one
  useEffect(() => {
    chartData(esp1Full, esp1Empty, esp1Name);
  }, [lastMessage1]);

  useEffect(() => {
    chartData(esp2Full, esp2Empty, esp2Name);
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

  const onHandleStart = () => {
    setStart(true);
    new Audio(audio).play();
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
          <button className="start-button" onClick={onHandleStart}>
            Start
          </button>
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
