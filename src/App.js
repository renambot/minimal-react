import React from 'react';

// Websocket
var socket = new WebSocket("ws://" + location.host + "/ws/app");
socket.addEventListener('open', function (event) {
  console.log('Socket> open', socket.url);
});
socket.addEventListener('message', function (event) {
  console.log('Socket> received', event.data);
});

/**
 * A container class for SAGE3 app
 * handles size and postion and renders the content of the subclass
 * with `this.props.children`
 * 
 * @class SAGE3Base
 * @extends {React.Component}
 */
class SAGE3Base extends React.Component {
  constructor(props) {
    super(props);
    console.log('SAGE3Base constructor props', props)
    this.state = {
      value: "toto"
    }  
  }

  componentDidMount() {
    console.log(`SAGE3Base Mount`);
  }

  componentWillUnmount() {
    console.log(`SAGE3Base Unmount`);
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(`SAGE3Base DidUpdate`);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Default true, but might be usefull to block update
    return true;
  }
  
  render() {
    // console.log('SAGE3Base render props', this.props)
    let top  = this.props.position[1];
    let left = this.props.position[0];
    let w = this.props.size[0];
    let h = this.props.size[1];
    return (
      // Container
      <div style={{
        position: "absolute", border: "1px", borderStyle: "solid", borderColor: "red",
        top: top, left: left, width: w, height: h,
        background:"white"}}>

        {/* top menubar */}
        <div style={{border: "1px", borderStyle: "solid", borderColor: "blue", background:"lightblue",
        position: "relative", top: "-30px", left: "0px", width: w, height: "25px"}}>
            Title bar - {this.props.name}
        </div>
          
          {/* Place for the app content from the sub-class */}
          {this.props.children}

        {/* below status bar */}
        <div style={{border: "1px", borderStyle: "solid", borderColor: "green", background:"lightgreen",
        position: "absolute", bottom: "-30px", left: "-1px", width: w, height: "25px"}}>
            Status bar
        </div>

      </div>
    );
  }
}

/**
 * An example of subclass with a button and a counter
 * 
 * @class SAGE3App
 * @extends {SAGE3Base}
 */
class SAGE3App extends SAGE3Base {
  constructor(props) {
    console.log('SAGE3App constructor props', props)
    super(props);
    // Add to state instead of overwritting
    this.state.count = 0;
  }

  componentDidMount() {
    console.log(`SAGE3App Mount ${this.props.name}, ready ? ${socket.readyState}`);
    // If socket open, send data
    if (socket.readyState == 1) {
      socket.send(JSON.stringify({app: this.props.name, click: this.state}));
    }
  }

  componentWillUnmount() {
    console.log(`SAGE3App Unmount ${this.props.name} `);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (socket.readyState == 1) {
      socket.send(JSON.stringify({app: this.props.name, click: this.state}));
    }
  }

  render() {
    return (
      // do not forget to combine the props and children
      <SAGE3Base {...this.props}>
        <p>App: {this.props.name}</p>
        <p>You clicked {this.props.name}: {this.state.count} times</p>
        <button onClick={() => this.setState({count: this.state.count + 1})}>
          Click me
        </button>
      </SAGE3Base>
    );
  }
}

/**
 * An example of baseclass for an image
 * 
 * @class SAGE3Image
 * @extends {SAGE3Base}
 */
class SAGE3Image extends SAGE3Base {
  constructor(props) {
    console.log('SAGE3Image constructor props', props)
    super(props);
    // Add to state instead of overwritting
    this.state.src = "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png";
  }

  componentDidMount() {
    console.log(`SAGE3Image Mount ${this.props.name}`);
  }

  componentWillUnmount() {
    console.log(`SAGE3Image Unmount ${this.props.name} `);
  }

  render() {
    return (
      // do not forget to combine the props and children
      <SAGE3Base {...this.props}>
        <p>App: {this.props.name}</p>
        <img src={this.state.src} 
            width={this.props.size[0]}
            height="200px"
            style={{objectFit: "cover"}}
        />
      </SAGE3Base>
    );
  }
}
/**
 * Creates instances of a given class
 * 
 * @param {any} props 
 * @returns 
 */
function createInstance(props) {
  if (props.type == "SAGE3App") {
    return React.createElement(SAGE3App, props);
  } else if (props.type == "SAGE3Image") {
    return React.createElement(SAGE3Image, props);
  }
}

/**
 * The big canvas
 * 
 * @class Container
 * @extends {React.Component}
 */
class Container extends React.Component {
  constructor(props) {
    console.log('Container Props', props.children);
    super(props);
    this.state = {
      date: new Date(),
      apps: [
        {key:1, name:"win1", type: "SAGE3App", position:[30,50],  size:[300,300] },
        {key:2, name:"win2", type: "SAGE3Image", position:[350,150],  size:[300,300] },
      ]
    }
  }

  componentDidMount() {
    console.log('Container Mount', this.props);
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    console.log('Container Unmount')
    clearInterval(this.timerID);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(`Container DidUpdate`);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  createApp() {
    let newkey = this.state.apps.length + 1;
    let someprops = {
      type: "SAGE3Image",
      key: newkey,
      name: "win" + newkey,
      position: [500*Math.random(),500*Math.random()],
      size: [300, 300]
    };
    this.setState({apps: [...this.state.apps, someprops]});
  }

  render() {
    return (
      <>
        {/* Canvas */}
        <div id="container" style={{
            position: "absolute", top: "1px", left: "1px",
            width: "800px", height: "600px", overflow: "hidden",
            background:"lightgray"}}>
          
          {/* Some apps */}
          {/*           
          <Sage3App   key=1 name="win1" position={[30,50]}  size={[300,300]} />
          <Sage3Image key=2 name="win2" position={[350,150]} size={[300,300]}/>
          */}

          {/* Create all the apps */}
          {this.state.apps.map((app) => createInstance(app))}

        </div>

        {/* some decoration */}
        <p style={{
            position: "absolute", bottom: 0, left: "1px",}}>
              SAGE3 time {this.state.date.toLocaleTimeString()}
        </p>

        <button style={{position: "absolute", bottom: "15px", left: "200px",}}
            onClick={() => this.createApp()}>
          New App
        </button>

      </>
    );
  }
}

export default Container;
