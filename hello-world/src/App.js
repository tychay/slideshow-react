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

var Board = React.createClass({
  getInitialState: function() {
    return {
      comments: [
        'I like bacon',
        'Want to get ice cream?',
        'OK, we have enough comments now'
      ]
    };
  },
  removeComment: function(i) {
    console.log('Removing comment: '+i);
    var arr = this.state.comments;
    arr.splice(i,1);
    this.setState({comments: arr});
  },
  updateComment: function(newText, i) {
    console.log('Updating comment: '+i);
    var arr = this.state.comments;
    arr[i] = newText;
    this.setState({comments: arr});
  },
  eachComment: function(text, i) {
    return(
      <Comment key={i} index={i} updateCommentText={this.updateComment} deleteFromBoard={this.removeComment}>
        {text}
      </Comment>
    );
  },

  render: function() {
    return (
        <div className="board">
          { this.state.comments.map(this.eachComment) }
        </div>
    );
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
        <Board />
      </div>
    );
  }
}

export default App;
