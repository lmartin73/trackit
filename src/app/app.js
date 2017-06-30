import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {syncHistoryWithStore, routerActions} from 'react-router-redux'
import {Router, hashHistory} from 'react-router'
import * as firebase from 'firebase'
import {FIRconfig} from './config/firebaseConfig' // import firebase config details
import {logoutUser, startListeningToAuth, } from './components/user'

import store from './store/configureStore'


const history = syncHistoryWithStore(hashHistory, store);

const routes = {

  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/dashboard') },
  childRoutes: [
    require('./routes/dashboard').default,
    require('./routes/smartadmin-intel').default,
    require('./routes/widgets').default,
    require('./routes/outlook').default,
    require('./routes/tables').default,
    require('./routes/ui').default,
    require('./routes/graphs').default,
    require('./routes/e-commerce').default,
    require('./routes/misc').default,
    require('./routes/auth').default,
    require('./routes/profile').default,
    require('./routes/app-views').default,
    require('./routes/maps').default,
    require('./routes/calendar').default,
    require('./routes/forms').default,

    // comment unused routes
    // this will speed up builds
  ]
};

//initialize firebase
firebase.initializeApp(FIRconfig.config);


// Activate authentication listener
store.dispatch(startListeningToAuth());


ReactDOM.render((
  <Provider store={store}>
    <Router
      history={history}
      routes={routes}
    />
  </Provider>
), document.getElementById('smartadmin-root'));
