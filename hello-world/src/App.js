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

var Comment = React.createClass({
  getInitialState: function() {
    return {editing: false}
  },
  edit: function() {
    this.setState({editing: true});
  },
  remove: function() {
    console.log('Remove comment');
  },
  save: function() {
    var val = this.refs.newText.value;
    console.log('New comment: '+val);
    this.setState({editing: false});
  },
  renderNormal: function() {
    return(
      <div className="commentContainer">
        <div className="commentText">{this.props.children}</div>
        <button onClick={this.edit} className="button-primary">Edit</button>
        <button onClick={this.remove} className="button-danger">Remove</button>
      </div>
    )
  },
  renderForm: function() {
    return(
      <div className="commentContainer">
        <textarea ref="newText" defaultValue={this.props.children}></textarea>
        <button onClick={this.save} className="button-success">Save</button>
      </div>
    )
  },
  render: function() {
      if (this.state.editing) {
        return this.renderForm();
      } else {
        return this.renderNormal();
      }
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
      </div>
    );
  }
}

export default App;
