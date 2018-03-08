import { deepCopy, arrayToTree, flattenTree, listToString } from 'utils/common';
export const ITEM_LOAD = 'resource/resource/LOAD';
export const ITEM_LOAD_SUCCESS = 'resource/resource/LOAD_SUCCESS';
export const ITEM_LOAD_FAIL = 'resource/resource/LOAD_FAIL';
export const ITEM_DROP_NODE = 'resource/resource/DROP_NODE';
export const ITEM_UPDATE_DATA = 'resource/resource/UPDATE_DATA';
export const UPDATE = 'resource/resource/UPDATE';
export const UPDATE_SUCCESS = 'resource/resource/UPDATE_SUCCESS';
export const UPDATE_FAIL = 'resource/resource/UPDATE_FAIL';
export const SELECT_NODE = 'resource/resource/SELECT_NODE';
export const UN_SELECT_NODE = 'resource/resource/UN_SELECT_NODE';
export const CREATE = 'resource/resource/CREATE';
export const CREATE_SUCCESS = 'resource/resource/CREATE_SUCCESS';
export const CREATE_FAIL = 'resource/resource/CREATE_FAIL';
export const DELETE = 'resource/resource/DELETE';
export const DELETE_SUCCESS = 'resource/resource/DELETE_SUCCESS';
export const DELETE_FAIL = 'resource/resource/DELETE_FAIL';
export const SHOW_UPDATE = 'resource/resource/SHOW_UPDATE';
export const CANCEL_UPDATE = 'resource/resource/CANCEL_UPDATE';
export const RESET = 'resource/resource/RESET';
export const SHOW_DRAG = 'resource/resource/SHOW_DRAG';
export const RESET_MSG = 'resource/resource/RESET_MSG';
export const RESET_ERROR = 'resource/resource/RESET_ERROR';
export const CLEAR_DATA = 'resource/resource/CLEAR_DATA';

const initialState = {
  itemLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  resource: [],
  selectResource: null,
  msg: '',
  error: '',
  draggable: false
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
        selectResource: null,
        resource: arrayToTree(action.data.resources.map((item) => (formatTreeNode(Object.assign({}, item, {id: `p_${item.id}`})))))
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
        resource: arrayToTree(action.data.batchUpdateResource.map((item) => (formatTreeNode(Object.assign({}, item, {id: `p_${item.id}`}))))),
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
        selectResource: action.data.selectResource
      };
    case UN_SELECT_NODE:
      return {
        ...state,
        selectResource: null
      };
    case ITEM_UPDATE_DATA:
      return {
        ...state,
        resource: action.data.resource,
        selectResource: action.data.selectResource
      };
    case ITEM_DROP_NODE:
      if (state.selectResource && action.data.selectResource && state.selectResource.id === action.data.selectResource.id) {
        return {
          ...state,
          updating: false,
          resource: action.data.resource,
          selectResource: action.data.selectResource || state.selectResource
        };
      }
      return {
        ...state,
        updating: false,
        resource: action.data.resource
      };
    case CREATE:
      return {
        ...state,
        creating: true
      };
    case CREATE_SUCCESS:
      const createTree = deepCopy(state.resource);
      loop(createTree, `p_${action.data.createResource.treePid}`, (item, ind, arr) => {
        item.children = item.children || [];
        item.children.push(Object.assign({}, action.data.createResource, {parentName: `${item.name}`, id: `p_${action.data.createResource.id}`, treePid: `p_${action.data.createResource.treePid}`}));
        arr[ind] = Object.assign({}, item);
      });
      return {
        ...state,
        creating: false,
        createShow: false,
        resource: createTree,
        msg: `权限“${action.data.createResource.name}”创建成功`
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
      const dataChange = deepCopy(state.resource);
      loop(dataChange, `p_${action.data.deleteResource}`, (item, ind, arr) => {
        arr.splice(ind, 1);
      });
      return {
        ...state,
        deleting: false,
        resource: dataChange,
        msg: `权限删除成功`,
        selectResource: null
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
    case RESET:
      return {
        ...state,
        draggable: false,
        resource: action.data.resource
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
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
}

// 获取初始数据
export function loadResource(sysId) {
  return {
    types: [ ITEM_LOAD, ITEM_LOAD_SUCCESS, ITEM_LOAD_FAIL],
    graphql: `
      query resources {
        resources(sysId: ${sysId}){
          id,name,parentId,parentName,type,resourceNum,url,sortNum,treePid
        }
      }
    `
  };
}

// 修改树
export function updateResource(resource, changeItem) {
  const data = deepCopy(resource);
  loop(data, changeItem.id, (item, ind, arr) => {
    arr[ind] = Object.assign({}, item, changeItem);
  });
  return {
    type: ITEM_UPDATE_DATA,
    data: {
      resource: data,
      selectResource: changeItem
    }
  };
}

// 重置树
export function resetResource(sysId) {
  return loadResource(sysId);
}

// 拖动节点
export function dropResourceTreeNode(resource, info, currentUser) {
  const dropKey = info.node.props.eventKey;
  const dragKey = info.dragNode.props.eventKey;
  const dropPos = info.node.props.pos;
  const dragPos = info.dragNode.props.pos;
  const data = deepCopy(resource);
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
        resource: resource,
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
      resource: data,
      selectItem: dragObj
    }
  };
}

// 保存数据
export function saveResourceData(sysId, data, notSuper) {
  const inputDataType = {
    id: 'number',
    name: 'string',
    resourceNum: 'string',
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
    resourceNum: item.resourceNum,
    url: item.url,
    type: item.type,
    parentId: formatPid(item.parentId),
    sortNum: item.sortNum
  }));
  inputData = listToString(inputData, inputDataType);
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    graphql: `
      mutation batchUpdateResource {
        batchUpdateResource(sysId: ${sysId}, list: ${inputData}){
          id,name,resourceNum,url,type,parentId,sortNum,treePid
        }
      }
    `
  };
}

// 切换选中
export function toggleResourceSelect(resource, info) {
  if (info.length) {
    const selectKey = info[0];
    const data = deepCopy(resource);
    let selectResource = null;
    loop(data, selectKey, (item) => {
      selectResource = item;
    });
    return {
      type: SELECT_NODE,
      data: {
        selectResource: selectResource
      }
    };
  }
  return {
    type: UN_SELECT_NODE
  };
}

// 创建权限
export function createResource(resource, item, permission) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    graphql: `
      mutation createResource {
        createResource(sysId: ${parseInt(resource.id, 10)}, name: "${permission.name}", resourceNum: "${permission.resourceNum}", url: ${permission.url ? '"' + permission.url + '"' : null}, type: ${permission.type}, parentId: ${item.id === 'p_-1' ? null : parseInt(item.id.substring(2), 10)}, sortNum: ${item.children && item.children.length + 1 || 1 }){
          id,name,resourceNum,url,type,parentId,sortNum,parentName,treePid
        }
      }
    `
  };
}

// TODO: 删除权限
export function deleteResource(selectResource) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    graphql: `
    mutation deleteResource {
      deleteResource(id: ${typeof selectResource.id === 'number' ? selectResource.id : parseInt(selectResource.id.substring(2), 10)})
    }
    `
  };
}

// 编辑树
export function editResourceTree() {
  return {
    type: SHOW_DRAG
  };
}

// reset msg
export function resetResourceMsg() {
  return {
    type: RESET_MSG
  };
}

// reset error
export function resetResourceError() {
  return {
    type: RESET_ERROR
  };
}

export function resetResourceData() {
  return {
    type: CLEAR_DATA
  };
}
