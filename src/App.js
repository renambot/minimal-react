import React from 'react';
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        loaded:0
      }
  }


  render() {
    return (
      <div>
        
        <p>
            Bla bla1
          </p>
          <p>
            Bla bla2
          </p>

      </div>
    );
  }
}

export default App;
