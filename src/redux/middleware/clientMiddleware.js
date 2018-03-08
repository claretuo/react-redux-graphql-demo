import fetch from '../../helpers/fetch';
import {LOGOUT_SUCCESS} from '../modules/auth';

export default function clientMiddleware(req) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { graphql, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!graphql) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      const header = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };

      if (__SERVER__ && req.get('cookie')) {
        header.cookie = req.get('cookie');
      }

      const actionPromise = fetch(`/graphql`, {
        method: 'post',
        headers: header,
        body: JSON.stringify({ query: graphql }),
        credentials: 'include',
      }).then(resp => {
        if (resp.status === 401) {
          next({...rest, type: LOGOUT_SUCCESS});
        }
        if (resp.status === 403) {
          throw new Error('没有操作权限');
        }
        if (resp.status !== 200) {
          throw new Error(resp.statusText);
        }
        return resp.json();
      }).then(({ data, errors }) => {
        if (errors && errors.length) {
          throw new Error(errors[0].message);
        } else {
          next({...rest, data: { ...data }, type: SUCCESS});
        }
      }).catch(err => {
        next({...rest, error: err, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
