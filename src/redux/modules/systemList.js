export const LIST_LOAD = 'system/LIST_LOAD';
export const LIST_LOAD_SUCCESS = 'system/LIST_LOAD_SUCCESS';
export const LIST_LOAD_FAIL = 'system/LIST_LOAD_FAIL';
export const ITEM_LOAD = 'system/ITEM_LOAD';
export const ITEM_LOAD_SUCCESS = 'system/ITEM_LOAD_SUCCESS';
export const ITEM_LOAD_FAIL = 'system/ITEM_LOAD_FAIL';
export const SHOW_CREATE = 'system/SHOW_CREATE';
export const HIDE_CREATE = 'system/HIDE_CREATE';
export const HIDE_EDIT = 'system/HIDE_EDIT';
export const CREATE_SYSTEM = 'system/CREATE_SYSTEM';
export const CREATE_SYSTEM_SUCCESS = 'system/CREATE_SYSTEM_SUCCESS';
export const CREATE_SYSTEM_FAIL = 'system/CREATE_SYSTEM_FAIL';
export const EDIT_SYSTEM = 'system/EDIT_SYSTEM';
export const EDIT_SYSTEM_SUCCESS = 'system/EDIT_SYSTEM_SUCCESS';
export const EDIT_SYSTEM_FAIL = 'system/EDIT_SYSTEM_FAIL';
export const DELETE_SYSTEM = 'system/DELETE_SYSTEM';
export const DELETE_SYSTEM_SUCCESS = 'system/DELETE_SYSTEM_SUCCESS';
export const DELETE_SYSTEM_FAIL = 'system/DELETE_SYSTEM_FAIL';
export const RESET_MSG = 'system/item/RESET_MSG';
export const RESET_ERROR = 'system/item/RESET_ERROR';

const initialState = {
  system: [],
  pathAuths: [],
  listLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  createShow: false,
  editShow: null,
  itemLoading: false,
  msg: '',
  error: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LIST_LOAD:
      return {
        ...state,
        listLoading: true
      };
    case LIST_LOAD_SUCCESS:
      return {
        ...state,
        listLoading: false,
        system: action.data.systems,
        pathAuths: action.data.loadPathAuths
      };
    case LIST_LOAD_FAIL:
      return {
        ...state,
        listLoading: false,
        error: action.error.message
      };
    case ITEM_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case ITEM_LOAD_SUCCESS:
      return {
        ...state,
        itemLoading: false,
        editShow: action.data.system
      };
    case ITEM_LOAD_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case CREATE_SYSTEM:
      return {
        ...state,
        creating: true
      };
    case CREATE_SYSTEM_SUCCESS:
      return {
        ...state,
        creating: false,
        createShow: false,
        system: state.system.concat(action.data.createSystem),
        msg: `成功创建系统“${action.data.createSystem.name}”`
      };
    case CREATE_SYSTEM_FAIL:
      return {
        ...state,
        creating: false,
        error: action.error.message
      };
    case EDIT_SYSTEM:
      return {
        ...state,
        updating: true
      };
    case EDIT_SYSTEM_SUCCESS:
      return {
        ...state,
        updating: false,
        editShow: null,
        system: state.system.map((item) => (item.id === action.data.updateSystem.id ? Object.assign({}, item, action.data.updateSystem) : item)),
        msg: `成功编辑系统“${action.data.updateSystem.name}”`
      };
    case EDIT_SYSTEM_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case DELETE_SYSTEM:
      return {
        ...state,
        deleting: true
      };
    case DELETE_SYSTEM_SUCCESS:
      return {
        ...state,
        deleting: false,
        msg: `成功删除系统“${state.system.filter((item) => item.id === action.data.deleteSystem)[0].name}”`,
        system: state.system.filter((item) => item.id !== action.data.deleteSystem),
      };
    case DELETE_SYSTEM_FAIL:
      return {
        ...state,
        deleting: false,
        error: action.error.message
      };
    case SHOW_CREATE:
      return {
        ...state,
        createShow: true
      };
    case HIDE_CREATE:
      return {
        ...state,
        createShow: false
      };
    case HIDE_EDIT:
      return {
        ...state,
        updating: false,
        editShow: null
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
    default :
      return state;
  }
}

// 加载系统列表
export function loadList(path) {
  return {
    types: [ LIST_LOAD, LIST_LOAD_SUCCESS, LIST_LOAD_FAIL],
    graphql: `
      query systems {
        loadPathAuths(path: "${path}" ) {
          name, authNum
        }
        systems {
          id,
          name
        }
      }
    `
  };
}

// 弹出创建框
export function showCreate() {
  return {
    type: SHOW_CREATE
  };
}

// 关闭创建框
export function hideCreate() {
  return {
    type: HIDE_CREATE
  };
}

// 弹出编辑框
export function showEdit(item) {
  return {
    types: [ ITEM_LOAD, ITEM_LOAD_SUCCESS, ITEM_LOAD_FAIL ],
    graphql: `
      query system {
        system(id: ${item.id}) {
          id,
          name,
          number,
          url
        }
      }
    `
  };
}

// 关闭编辑框
export function hideEdit() {
  return {
    type: HIDE_EDIT
  };
}

// 创建系统
export function createSystem(values) {
  return {
    types: [CREATE_SYSTEM, CREATE_SYSTEM_SUCCESS, CREATE_SYSTEM_FAIL],
    graphql: `
      mutation createSystem {
        createSystem(name: "${values.name}", number: "${values.number}", url: "${values.url}"){
          id,
          name,
          url,
          number
        }
      }
    `
  };
}

// 编辑系统
export function editSystem(item, values) {
  return {
    types: [EDIT_SYSTEM, EDIT_SYSTEM_SUCCESS, EDIT_SYSTEM_FAIL],
    graphql: `
      mutation updateSystem {
        updateSystem(id: ${item.id}, name: "${values.name}", number: "${values.number}", url: "${values.url}"){
          id,name,number,url
        }
      }
    `
  };
}

// 删除系统
export function deleteSystem(deleteItem) {
  return {
    types: [DELETE_SYSTEM, DELETE_SYSTEM_SUCCESS, DELETE_SYSTEM_FAIL],
    graphql: `
      mutation deleteSystem {
        deleteSystem(id: ${deleteItem.id})
      }
    `
  };
}


// reset msg
export function resetMsg() {
  return {
    type: RESET_MSG
  };
}

// reset error
export function resetError() {
  return {
    type: RESET_ERROR
  };
}
