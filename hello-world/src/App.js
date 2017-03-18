import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//require('bootstrap'); // not needed as shouldn't use Bootstrap javascript

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
var auto_advance_timer;
// When mocking uncomment the line below and comment out the next part following
// Timeout needs to be global
//const unsplash = {};
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
  const authenticationUrl = unsplash.auth.getAuthenticationUrl([
    "public",
  ]);
  location.assign(authenticationUrl);
}
/* */

var Slideshow = React.createClass({
  getInitialState: function() {
    var images = [];
    return {
      images: images,
      page: this.init_page,
      init_page: 0, //const like this should be moved to properties or statics?
      per_page: 12,
      timer: null,
    };
  },
  componentDidMount: function() {
    //console.log('componentDidMount');
    // queue in initial API call
    this._getImages(this.state.init_page, false);
    // 10 second timer before auto-page
    this.startAutoAdvanceTimer();
  },
  _getImages: function(page_num, shouldClearTimer) {
    // Clear any existing timeout, so it doesn't page immediately after paging
    if (shouldClearTimer) {
      window.clearTimeout(auto_advance_timer);
      //console.log('clearTimer: ' + Math.floor(Date.now() / 1000));
    }

    // Uncomment to mock unsplash API for when I'm rate limited
    /*
    var unsplashdata = [];
    for (var i=0; i<this.state.per_page; ++i) {
      var unsplash_id = page_num*this.state.per_page + i;
      unsplashdata.push({
        id: unsplash_id,
        urls: {
          thumb: 'https://unsplash.it/300/300?image='+unsplash_id
        },
      });
    }
    this.setState({
      images: unsplashdata,
      page:   page_num
    });
    this.startAutoAdvanceTimer();
    return;
    */
    //https://unsplash.com/documentation#list-photos
    return unsplash.photos.listPhotos(page_num * this.state.per_page, this.state.per_page, 'latest')
      .then(toJson)
      .then(json => {
        //console.log(json); //[].urls.thumb
        this.setState({
          images: json,
          page:   page_num
        });
        this.startAutoAdvanceTimer();
      });
  },
  showImage: function(imageObj, i) {
    //console.log(imageObj.id);
    return(
      <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" key={"thumb-"+i}>
        <ReactCSSTransitionGroup
            transitionName="thumb"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
          <img className="img-thumbnail" src={imageObj.urls.thumb} alt={imageObj.id} key={imageObj.id} />
        </ReactCSSTransitionGroup>
      </div>
    );
  },
  doPrev: function() {
    this._getImages(--this.state.page, true);
  },
  doNext: function() {
    this._getImages(++this.state.page, true);
  },
  autoAdvance: function() {
    //console.log('autoadvance: ' + Math.floor(Date.now() / 1000));
    this._getImages(++this.state.page, false);
  },
  startAutoAdvanceTimer: function() {
    if (auto_advance_timer) {
      window.clearTimeout(auto_advance_timer);
    }
    //console.log('startTimer: ' + Math.floor(Date.now() / 1000));
    var self = this;
    auto_advance_timer = window.setTimeout(function(){self.autoAdvance();}, 10000);
  },
  showPrevButton: function() {
    return ( this.state.page === 0 ) 
      ? (<button type="button" className="btn btn-default btn-lg" disabled>&laquo; Previous</button>)
      : (<button type="button" onClick={this.doPrev} className="btn btn-default btn-lg">&laquo; Previous</button>);
  },
  render: function() {
    return (
      <div>
        <div className="row">
          { this.state.images.map(this.showImage) }
        </div>
        <div className="btn-group" role="group" aria-label="pagination">
          { this.showPrevButton() }
          <button type="button" onClick={this.doNext} className="btn btn-default btn-lg">Next &raquo;</button>
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
          <h2>React Unsplash Slideshow</h2>
        </div>
        <Slideshow />
      </div>
    );
  }
}

export default App;
