import Chart from "./components/Chart";

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

function App() {
  return (
    <>
      <Chart url={"ws://192.168.1.183"} name={"3 Guys 1 Tazer"} />
    </>
  );
}

export default App;
