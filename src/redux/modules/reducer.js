import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import auth from './auth';
import systemList from './systemList';
import authPer from './authPer';
import resource from './resource';
import staff from './staff';
import role from './role';
import logs from './logs';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  staff,
  systemList,
  authPer,
  role,
  logs,
  resource
});
