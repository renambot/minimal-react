import React, { useState, useEffect }  from 'react';
import ReactDOM from "react-dom";


// Websocket
var socket = new WebSocket("ws://" + location.host + "/ws/app");
socket.addEventListener('open', function (event) {
  console.log('Socket> open', socket.url);
  // socket.send(42);  
});
socket.addEventListener('message', function (event) {
  console.log('Socket> received', event.data);
});


/* Component as a class */
class Welcome extends React.Component {
  render() {
    return <h1>Hello {this.props.name}</h1>;
  }

}

/* Component as a function */
function WelcomeAsFunction(props) {
  return <h1>Hello, function {props.name}</h1>;
}

/* Component as a function  with state and effect */
function Button(props) {
  // Create a value 'count', a function to modify it
  // Initial value is 0
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {

    // If socket open, send data
    if (socket.readyState == 1) {
      socket.send(JSON.stringify({app: props.name, click: count}));
    }
  }, [count]); // only run when count is updated

  return (
    <div>
      <p>You clicked {props.name}: {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    console.log('Props', props);

    super(props);
    this.state = {
      date: new Date()
    }
  }

  componentDidMount() {
    console.log('Mount');
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    console.log('Unmount')
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <Welcome name="Bob"/>
        <WelcomeAsFunction name="Judy"/>
        <p> Some text {this.state.date.toLocaleTimeString()}</p>
        <p> App prop: {this.props.value} </p>
        <Button name="button1"/>
        <Button name="button2"/>
      </div>
    );
  }
}

export default App;
