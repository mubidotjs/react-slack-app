import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import { createStore, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './store/reducers/user';
import channelReducer from './store/reducers/channel';
import reportWebVitals from './reportWebVitals';


import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import firebase from './firebase';
import Spinner from './spinner/spinner';
import { setUser, clearUser } from './store/actions/user';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer
})

const store = createStore(rootReducer, composeEnhancers())

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push('/');
      } else {
        this.props.history.push('/login');
        this.props.clearUser();
      }
    })
  }
  render() {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading,
})

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
