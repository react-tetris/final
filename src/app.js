//Node modules
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, browserHistory} from 'react-router';

//Game components
import App from './components/App';
import Admin from './components/Admin';
import Megatron from './components/Megatron';



var routes = (
	<Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/admin" component={Admin} />
    <Route path="/megatron" component={Megatron} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#app'));
