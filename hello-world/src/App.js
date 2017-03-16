import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var Bacon = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Bacon component!</h2> 
        <p>This is a simple component!</p>
      </div>
    );
  }
});

var Movie = React.createClass({
  render: function() {
    return(
      <div>
        <h1>{this.props.title}</h1>
        <h2>{this.props.genre}</h2>
      </div>
    );
  }
});

var Comment = React.createClass({
  edit: function() {
    alert('Editing comment');
  },
  remove: function() {
    alert('Remove comment');
  },
  render: function() {
    return(
      <div className="commentContainer">
        <div className="commentText">{this.props.children}</div>
        <button onClick={this.edit} className="button-primary">Edit</button>
        <button onClick={this.remove} className="button-danger">Remove</button>
      </div>
    )
  }
});

var CheckBox = React.createClass({
  getInitialState: function() {
    return {checked: true};
  },
  handleChecked: function() {
    this.setState({checked: !this.state.checked});
  },
  render: function() {
    var msg = (this.state.checked) ? 'checked' : 'unchecked';
    return(
      <div className="commentContainer">
        <input type="checkbox" onChange={this.handleChecked} defaultChecked={this.state.checked} />
        <h3>Checkbox is {msg}</h3>
      </div>
    )
  }
});


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="board">
          <Comment>Hey now</Comment>
          <Comment>Beans</Comment>
          <Comment>Tuna</Comment>
        </div>
        <p className="App-intro">
          <Movie title="Avatar" genre="action" />
          <Bacon />
        </p>
        <CheckBox />
      </div>
    );
  }
}

export default App;
