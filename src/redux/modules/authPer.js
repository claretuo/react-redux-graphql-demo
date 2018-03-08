import { deepCopy, arrayToTree, flattenTree, listToString } from 'utils/common';
export const ITEM_LOAD = 'system/item/LOAD';
export const ITEM_LOAD_SUCCESS = 'system/item/LOAD_SUCCESS';
export const ITEM_LOAD_FAIL = 'system/item/LOAD_FAIL';
export const ITEM_DROP_NODE = 'system/item/DROP_NODE';
export const ITEM_UPDATE_DATA = 'system/item/UPDATE_DATA';
export const UPDATE = 'system/item/UPDATE';
export const UPDATE_SUCCESS = 'system/item/UPDATE_SUCCESS';
export const UPDATE_FAIL = 'system/item/UPDATE_FAIL';
export const SELECT_NODE = 'system/item/SELECT_NODE';
export const UN_SELECT_NODE = 'system/item/UN_SELECT_NODE';
export const CREATE = 'system/item/CREATE';
export const CREATE_SUCCESS = 'system/item/CREATE_SUCCESS';
export const CREATE_FAIL = 'system/item/CREATE_FAIL';
export const DELETE = 'system/item/DELETE';
export const DELETE_SUCCESS = 'system/item/DELETE_SUCCESS';
export const DELETE_FAIL = 'system/item/DELETE_FAIL';
export const SHOW_UPDATE = 'system/item/SHOW_UPDATE';
export const CANCEL_UPDATE = 'system/item/CANCEL_UPDATE';
export const RESET = 'system/item/RESET';
export const SHOW_DRAG = 'system/item/SHOW_DRAG';
export const SHOW_CREATE = 'system/item/SHOW_CREATE';
export const HIDE_CREATE = 'system/item/HIDE_CREATE';
export const RESET_MSG = 'system/item/RESET_MSG';
export const RESET_ERROR = 'system/item/RESET_ERROR';
export const SYSTEM_LOAD = 'system/item/SYSTEM_LOAD';
export const SYSTEM_LOAD_SUCCESS = 'system/item/SYSTEM_LOAD_SUCCESS';
export const SYSTEM_LOAD_FAIL = 'system/item/SYSTEM_LOAD_FAIL';
export const CLEAR_DATA = 'system/item/CLEAR_DATA';

const initialState = {
  itemLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  system: [],
  pathAuths: [],
  selectItem: null,
  msg: '',
  error: '',
  draggable: false,
  createShow: false,
  systemItem: null
};
const loop = (data, key, callback) => {
  data.forEach((item, ind, arr) => {
    if (item.id === key) {
      return callback(item, ind, arr);
    }
    if (item.children) {
      return loop(item.children, key, callback);
    }
  });
};

export default function reducer(state = initialState, action = {}) {
  const formatTreeNode = (item) => {
    return Object.assign({}, item, {id: (typeof item.id === 'number' ? `p_${item.id}` : item.id), treePid: ((typeof item.treePid === 'number' ? `p_${item.treePid}` : item.treePid))});
  };
  switch (action.type) {
    case ITEM_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case ITEM_LOAD_SUCCESS:
      return {
        ...state,
        itemLoading: false,
        draggable: false,
        selectItem: null,
        system: arrayToTree(action.data.permissions.map((item) => (formatTreeNode(Object.assign({}, item, {id: `p_${item.id}`})))))
      };
    case ITEM_LOAD_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case UPDATE:
      return {
        ...state,
        updating: true
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        draggable: false,
        system: arrayToTree(action.data.batchUpdatePromission.map((item) => (formatTreeNode(Object.assign({}, item, {id: `p_${item.id}`}))))),
        msg: '成功保存树信息',
      };
    case UPDATE_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case SELECT_NODE:
      return {
        ...state,
        selectItem: action.data.selectItem
      };
    case UN_SELECT_NODE:
      return {
        ...state,
        selectItem: null
      };
    case ITEM_UPDATE_DATA:
      return {
        ...state,
        system: action.data.system,
        selectItem: action.data.selectItem
      };
    case ITEM_DROP_NODE:
      if (state.selectItem && action.data.selectItem && state.selectItem.id === action.data.selectItem.id) {
        return {
          ...state,
          updating: false,
          system: action.data.system,
          selectItem: action.data.selectItem || state.selectItem
        };
      }
      return {
        ...state,
        updating: false,
        system: action.data.system
      };
    case CREATE:
      return {
        ...state,
        creating: true
      };
    case CREATE_SUCCESS:
      const data = deepCopy(state.system);
      loop(data, `p_${action.data.createPermission.treePid}`, (item) => {
        item.children = item.children || [];
        item.children.push(Object.assign({}, action.data.createPermission, {parentName: `${item.name}`, id: `p_${action.data.createPermission.id}`, treePid: `p_${action.data.createPermission.treePid}`}));
      });
      return {
        ...state,
        creating: false,
        createShow: false,
        system: data,
        msg: `权限“${action.data.createPermission.name}”创建成功`
      };
    case CREATE_FAIL:
      return {
        ...state,
        creating: false,
        error: action.error.message
      };
    case DELETE:
      return {
        ...state,
        deleting: true
      };
    case DELETE_SUCCESS:
      const dataChange = deepCopy(state.system);
      loop(dataChange, `p_${action.data.deletePromission}`, (item, ind, arr) => {
        arr.splice(ind, 1);
      });
      return {
        ...state,
        deleting: false,
        system: dataChange,
        msg: `权限删除成功`,
        selectItem: null
      };
    case DELETE_FAIL:
      return {
        ...state,
        deleting: false,
        error: action.error.message
      };
    case SHOW_UPDATE:
      return {
        ...state,
      };
    case CANCEL_UPDATE:
      return {
        ...state,
      };
    case SHOW_DRAG:
      return {
        ...state,
        draggable: true
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
    case RESET:
      return {
        ...state,
        draggable: false,
        system: action.data.system
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
    case SYSTEM_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case SYSTEM_LOAD_SUCCESS:
      return {
        ...state,
        itemLoading: false,
        systemItem: action.data.system,
        pathAuths: action.data.loadPathAuths
      };
    case SYSTEM_LOAD_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
}

// 获取初始数据
export function loadItem(sysId) {
  return {
    types: [ ITEM_LOAD, ITEM_LOAD_SUCCESS, ITEM_LOAD_FAIL],
    graphql: `
      query permissions {
        permissions(sysId: ${sysId}){
          id,name,parentId,type,authNum,url,sortNum,treePid,parentName
        }
      }
    `
  };
}

// 获取系统详情
export function loadSystem(sysId, path) {
  return {
    types: [SYSTEM_LOAD, SYSTEM_LOAD_SUCCESS, SYSTEM_LOAD_FAIL],
    graphql: `
      query systemItem {
        loadPathAuths(path: "${path}" ) {
          name, authNum
        }
        system(id: ${parseInt(sysId, 10)}){
          id, name
        }
      }
    `
  };
}

// 修改树
export function updateSystem(system, changeItem) {
  const data = deepCopy(system);
  loop(data, changeItem.id, (item, ind, arr) => {
    arr[ind] = Object.assign({}, item, changeItem);
  });
  return {
    type: ITEM_UPDATE_DATA,
    data: {
      system: data,
      selectItem: changeItem
    }
  };
}

// 重置树
export function resetSystem(sysId) {
  return loadItem(sysId);
}

// 拖动节点
export function dropTreeNode(system, info, currentUser) {
  const dropKey = info.node.props.eventKey;
  const dragKey = info.dragNode.props.eventKey;
  const dropPos = info.node.props.pos;
  const dragPos = info.dragNode.props.pos;
  const data = deepCopy(system);
  let bool = true;
  const rootReg = /^\d+-\d+$/;
  if (currentUser && currentUser.userNum === 'G-00000000') {
    if (info.dropToGap && rootReg.test(dropPos)) {
      bool = false;
    } else {
      bool = true;
    }
  } else {
    if (rootReg.test(dragPos)) {
      console.log('the root tree node');
      bool = false;
    }
    if (info.dropToGap && rootReg.test(dropPos)) {
      console.log('the root tree node');
      bool = false;
    }
  }
  if (!bool) {
    return {
      type: ITEM_DROP_NODE,
      data: {
        system: system,
        selectItem: null
      }
    };
  }
  let dragObj;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });
  if (info.dropToGap) {
    let ar;
    let ind;
    loop(data, dropKey, (item, index, arr) => {
      ar = arr;
      ind = index;
      dragObj = Object.assign({}, dragObj, {parentId: item.parentId, treePid: item.treePid, parentName: item.parentName});
    });
    ar.splice(ind, 0, dragObj);
  } else {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert 示例添加到尾部，可以是随意位置
      dragObj = Object.assign({}, dragObj, {treePid: item.id, parentId: parseInt(item.id.substring(2), 10), parentName: item.name});
      item.children.push(dragObj);
    });
  }
  return {
    type: ITEM_DROP_NODE,
    data: {
      system: data,
      selectItem: dragObj
    }
  };
}

// 保存数据
export function saveData(sysId, data, notSuper) {
  const inputDataType = {
    id: 'number',
    name: 'string',
    authNum: 'string',
    url: 'string',
    type: 'enum',
    parentId: 'number',
    sortNum: 'number'
  };
  const formatPid = (pid) => {
    if (pid) {
      return !!parseInt(pid, 10) ? parseInt(pid, 10) : parseInt(pid.substring(2), 10);
    }
    return null;
  };
  let inputData = flattenTree(data[0], notSuper).map((item) => ({
    id: !!parseInt(item.id, 10) ? parseInt(item.id, 10) : parseInt(item.id.substring(2), 10),
    name: item.name,
    authNum: item.authNum,
    url: item.url,
    type: item.type,
    parentId: formatPid(item.parentId),
    sortNum: item.sortNum
  }));
  inputData = listToString(inputData, inputDataType);
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    graphql: `
      mutation batchUpdateAuths {
        batchUpdatePromission(sysId: ${sysId}, list: ${inputData}){
          id,name,authNum,url,type,parentId,sortNum,treePid
        }
      }
    `
  };
}

// 切换选中
export function toggleSelect(system, info) {
  if (info.length) {
    const selectKey = info[0];
    const data = deepCopy(system);
    let selectItem = null;
    loop(data, selectKey, (item) => {
      selectItem = item;
    });
    return {
      type: SELECT_NODE,
      data: {
        selectItem: selectItem
      }
    };
  }
  return {
    type: UN_SELECT_NODE
  };
}

// 创建权限
export function createPermission(system, item, permission) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    graphql: `
      mutation createAuth {
        createPermission(sysId: ${parseInt(system.id, 10)}, name: "${permission.name}", authNum: "${permission.authNum}", url: ${permission.url ? '"' + permission.url + '"' : null}, type: ${permission.type}, parentId: ${parseInt(item.id.substring(2), 10)}, sortNum: ${item.children && item.children.length + 1 || 1 }){
          id,name,authNum,url,type,parentId,sortNum,treePid
        }
      }
    `
  };
}

// TODO: 删除权限
export function deletePermission(selectItem) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    graphql: `
    mutation deleteAuth {
      deletePromission(id: ${typeof selectItem.id === 'number' ? selectItem.id : parseInt(selectItem.id.substring(2), 10)})
    }
    `
  };
}

// 编辑树
export function editTree() {
  return {
    type: SHOW_DRAG
  };
}

// 显示创建框
export function showCreate() {
  return {
    type: SHOW_CREATE
  };
}

// 隐藏创建框
export function hideCreate() {
  return {
    type: HIDE_CREATE
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

export function resetAuthData() {
  return {
    type: CLEAR_DATA
  };
}
