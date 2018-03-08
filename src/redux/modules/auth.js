export const LOAD = 'auth/LOAD';
export const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
export const LOAD_FAIL = 'auth/LOAD_FAIL';
export const LOGIN = 'auth/LOGIN';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'auth/LOGIN_FAIL';
export const LOGOUT = 'auth/LOGOUT';
export const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'auth/LOGOUT_FAIL';
export const SHOW_FORGOT = 'auth/SHOW_FORGOT';
export const HIDE_FORGOT = 'auth/HIDE_FORGOT';
export const SEND_EMAIL = 'auth/SEND_EMAIL';
export const SEND_EMAIL_SUCCESS = 'auth/SEND_EMAIL_SUCCESS';
export const SEND_EMAIL_FAIL = 'auth/SEND_EMAIL_FAIL';
export const RESET = 'auth/RESET';
export const RESET_SUCCESS = 'auth/RESET_SUCCESS';
export const RESET_FAIL = 'auth/RESET_FAIL';
export const SHOW_RESET = 'auth/SHOW_RESET';
export const HIDE_RESET = 'auth/HIDE_RESET';
export const RESET_MSG = 'auth/RESET_MSG';
export const RESET_ERROR = 'auth/RESET_ERROR';
export const RESOURCE_LOAD = 'auth/RESOURCE_LOAD';
export const RESOURCE_LOAD_SUCCESS = 'auth/RESOURCE_LOAD_SUCCESS';
export const RESOURCE_LOAD_FAIL = 'auth/RESOURCE_LOAD_FAIL';

const initialState = {
  loaded: false,
  signedUp: false,
  sending: false,
  user: null,
  menuList: [],
  forgotShow: false,
  logining: false,
  signupFields: {
    email: '',
    name: '',
    pass: '',
    rePass: ''
  },
  msg: '',
  error: '',
  reseting: false,
  resetShow: false,
  userResource: [],
  currentSys: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.data.loadUser.user,
        menuList: action.data.loadUser.menuList
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error.message
      };
    case LOGIN:
      return {
        ...state,
        logining: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        logining: false,
        user: action.data.login.user,
        menuList: action.data.login.menuList,
        msg: '登录成功'
      };
    case LOGIN_FAIL:
      return {
        ...state,
        logining: false,
        user: null,
        error: action.error.message
      };
    case RESET:
      return {
        ...state,
        reseting: true
      };
    case RESET_SUCCESS:
      return {
        ...state,
        reseting: false,
        resetShow: false,
        msg: `密码修改成功`
      };
    case RESET_FAIL:
      return {
        ...state,
        reseting: false,
        error: action.error.message
      };
    case RESOURCE_LOAD:
      return {
        ...state
      };
    case RESOURCE_LOAD_SUCCESS:
      return {
        ...state,
        userResource: action.data.sysResources,
        currentSys: action.data.system
      };
    case RESOURCE_LOAD_FAIL:
      return {
        ...state,
        error: action.error.message
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
        menuList: []
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error.message
      };
    case SEND_EMAIL:
      return {
        ...state,
        sending: true
      };
    case SEND_EMAIL_SUCCESS:
      return {
        ...state,
        sending: false,
        forgotShow: false,
        msg: action.data.resetPassword || '邮件发送成功'
      };
    case SEND_EMAIL_FAIL:
      return {
        ...state,
        sending: false,
        error: action.error.message
      };
    case SHOW_FORGOT:
      return {
        ...state,
        forgotShow: true
      };
    case HIDE_FORGOT:
      return {
        ...state,
        forgotShow: false
      };
    case SHOW_RESET:
      return {
        ...state,
        resetShow: true
      };
    case HIDE_RESET:
      return {
        ...state,
        resetShow: false
      };
    case RESET_MSG:
      return {
        ...state,
        msg: ''
      };
    case RESET_ERROR:
      return {
        ...state,
        error: ''
      };
    default:
      return state;
  }
}


export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    graphql: `
      query currentUser {
        loadUser{
          user {
            id,realName,userNum,phone,status,innerEmail,department{
              name
            }
          }
          menuList {
            url,name,id,parentId,type
          }
        }
      }
    `
  };
}

export function login(userNum, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    graphql: `
      mutation login {
        login(userNum: "${userNum}",password: "${password}"){
          user {
            id,realName,userNum,phone,status,innerEmail,department{
              name
            }
          }
          menuList {
            url,name,id,parentId,type
          }
        }
      }
    `
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    graphql: `
      mutation logout {
        logout
      }
    `
  };
}

export function forgotPass() {
  return {
    type: SHOW_FORGOT
  };
}

// 隐藏弹出框
export function hideForgot() {
  return {
    type: HIDE_FORGOT
  };
}

// 发送邮件
export function sendEmail(values) {
  return {
    types: [SEND_EMAIL, SEND_EMAIL_SUCCESS, SEND_EMAIL_FAIL],
    graphql: `
      mutation resetPassword {
        resetPassword(email: "${values.email}")
      }
    `
  };
}

// 显示重置密码框
export function showReset() {
  return {
    type: SHOW_RESET
  };
}

// 隐藏重置密码框
export function hideReset() {
  return {
    type: HIDE_RESET
  };
}

// 确认重置密码
export function confirmReset(user, values) {
  return {
    types: [RESET, RESET_SUCCESS, RESET_FAIL],
    graphql: `
      mutation modifyPassword {
        modifyPassword(password: "${values.currentPass}", newPassword: "${values.password}", rePassword: "${values.confirmpassword}")
      }
    `
  };
}

// 清空消息
export function resetMsg() {
  return {
    type: RESET_MSG
  };
}

// 清空错误
export function resetError() {
  return {
    type: RESET_ERROR
  };
}

// 获取用户资源
export function loadResource(sysId) {
  return {
    types: [ RESOURCE_LOAD, RESOURCE_LOAD_SUCCESS, RESOURCE_LOAD_FAIL],
    graphql: `
      query sysResources {
        system(id: ${sysId}) {
          id,name,number
        }
        sysResources{
          id,name,parentId,parentName,type,resourceNum,url,sortNum,treePid,sysId
        }
      }
    `
  };
}
