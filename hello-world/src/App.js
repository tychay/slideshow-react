import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Unsplash, { toJson } from 'unsplash-js';

// Code to extract query string from location
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();
console.log(urlParams);

// Unsplash API and authentication
const unsplash = new Unsplash({
  applicationId: "49ddae58a10706ae5d04b1921eae16c8509bdb63b598f8ade086be2badff0f39",
  secret: "d5b52970d5e1a921b244743ff24302b47de27c9113625a7d9f449a2079381afe",
  callbackUrl: "http://localhost:3000/",
});
if (urlParams.code) {
  unsplash.auth.userAuthentication(urlParams.code)
    .then(toJson)
    .then(json => {
      unsplash.auth.setBearerToken(json.access_token);
    });
} else {
  const unsplash = new Unsplash({
    applicationId: "49ddae58a10706ae5d04b1921eae16c8509bdb63b598f8ade086be2badff0f39",
    secret: "d5b52970d5e1a921b244743ff24302b47de27c9113625a7d9f449a2079381afe",
    //callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
    callbackUrl: "http://localhost:3000/"
  });
  const authenticationUrl = unsplash.auth.getAuthenticationUrl([
    "public",
  ]);
  location.assign(authenticationUrl);
}

// Test API photos list
unsplash.photos.listPhotos(0,10,'latest')
  .then(toJson)
  .then(json => {
    console.log(json);
  });

var Comment = React.createClass({
  getInitialState: function() {
    return {editing: false}
  },
  edit: function() {
    this.setState({editing: true});
  },
  remove: function() {
    this.props.deleteFromBoard(this.props.index);
  },
  save: function() {
    this.props.updateCommentText(this.refs.newText.value, this.props.index);
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
      comments: []
    };
  },
  add: function(text) {
    var arr = this.state.comments;
    arr.push(text);
    this.setState({comments: arr});
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
        <div>
          <button onClick={this.add.bind(null, 'Default text')} className="button-info create">Add New</button>
          <div className="board">
            { this.state.comments.map(this.eachComment) }
          </div>
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
