import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import UsersStore from './store';
import { Router} from 'react-router';
import routes from './routes';
import browserHistory from './core/History';
process.perpage=10;

render(
  <Provider store={UsersStore}>
     <Router history={browserHistory} routes={routes}  />
  </Provider>,
  document.getElementById('dashboard')
);
