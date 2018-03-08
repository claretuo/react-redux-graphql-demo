import {deepCopy, arrayToTree, mapIdToitem} from 'utils/common';
import {uniq} from 'lodash';
export const ITEM_LOAD = 'assigns/item/ITEM_LOAD';
export const ITEM_LOAD_SUCCESS = 'assigns/item/ITEM_LOAD_SUCCESS';
export const ITEM_LOAD_FAIL = 'assigns/item/ITEM_LOAD_FAIL';
export const ITEM_DROP_NODE = 'assigns/item/DROP_NODE';
export const UPDATE = 'assigns/item/UPDATE';
export const UPDATE_SUCCESS = 'assigns/item/UPDATE_SUCCESS';
export const UPDATE_FAIL = 'assigns/item/UPDATE_FAIL';
export const SELECT_NODE = 'assigns/item/SELECT_NODE';
export const UN_SELECT_NODE = 'assigns/item/UN_SELECT_NODE';
export const SEARCH = 'assigns/item/SEARCH';
export const SEARCH_SUCCESS = 'assigns/item/SEARCH_SUCCESS';
export const SEARCH_FAIL = 'assigns/item/SEARCH_FAIL';
export const DELETE = 'assigns/item/DELETE';
export const DELETE_SUCCESS = 'assigns/item/DELETE_SUCCESS';
export const DELETE_FAIL = 'assigns/item/DELETE_FAIL';
export const SHOW_UPDATE = 'assigns/item/SHOW_UPDATE';
export const CANCEL_UPDATE = 'assigns/item/CANCEL_UPDATE';
export const RESET = 'assigns/item/RESET';
export const UPDATE_DATA = 'assigns/item/UPDATE_DATA';
export const UPDATE_DATA_SUCCESS = 'assigns/item/UPDATE_DATA_SUCCESS';
export const UPDATE_DATA_FAIL = 'assigns/item/UPDATE_DATA_FAIL';
export const SHOW_UPDATE_ROLE = 'assigns/item/SHOW_UPDATE_ROLE';
export const HIDE_UPDATE_ROLE = 'assigns/item/HIDE_UPDATE_ROLE';
export const SHOW_CREATE = 'assigns/item/SHOW_CREATE';
export const HIDE_CREATE = 'assigns/item/HIDE_CREATE';
export const CREATE_ROLE = 'assigns/item/CREATE_ROLE';
export const CREATE_ROLE_SUCCESS = 'assigns/item/CREATE_ROLE_SUCCESS';
export const CREATE_ROLE_FAIL = 'assigns/item/CREATE_ROLE_FAIL';
export const RESET_MSG = 'assigns/item/RESET_MSG';
export const RESET_ERROR = 'assigns/item/RESET_ERROR';
export const GET_ROLE_PERMISSION = 'assigns/item/GET_ROLE_PERMISSION';
export const GET_ROLE_PERMISSION_SUCCESS = 'assigns/item/GET_ROLE_PERMISSION_SUCCESS';
export const GET_ROLE_PERMISSION_FAIL = 'assigns/item/GET_ROLE_PERMISSION_FAIL';
export const PERMISSION_LOAD = 'assigns/item/PERMISSION_LOAD';
export const PERMISSION_LOAD_SUCCESS = 'assigns/item/PERMISSION_LOAD_SUCCESS';
export const PERMISSION_LOAD_FAIL = 'assigns/item/PERMISSION_LOAD_FAIL';
export const RESOURCE_LOAD = 'assigns/item/RESOURCE_LOAD';
export const RESOURCE_LOAD_SUCCESS = 'assigns/item/RESOURCE_LOAD_SUCCESS';
export const RESOURCE_LOAD_FAIL = 'assigns/item/RESOURCE_LOAD_FAIL';
export const USER_RESOURCE_LOAD = 'assigns/item/USER_RESOURCE_LOAD';
export const USER_RESOURCE_LOAD_SUCCESS = 'assigns/item/USER_RESOURCE_LOAD_SUCCESS';
export const USER_RESOURCE_LOAD_FAIL = 'assigns/item/USER_RESOURCE_LOAD_FAIL';
export const USER_ROLE_LOAD = 'assigns/item/USER_ROLE_LOAD';
export const USER_ROLE_LOAD_SUCCESS = 'assigns/item/USER_ROLE_LOAD_SUCCESS';
export const USER_ROLE_LOAD_FAIL = 'assigns/item/USER_ROLE_LOAD_FAIL';
export const ALL_ROLE_LOAD = 'assigns/item/ALL_ROLE_LOAD';
export const ALL_ROLE_LOAD_SUCCESS = 'assigns/item/ALL_ROLE_LOAD_SUCCESS';
export const ALL_ROLE_LOAD_FAIL = 'assigns/item/ALL_ROLE_LOAD_FAIL';
export const UPDATE_ROLE = 'assigns/item/UPDATE_ROLE';
export const UPDATE_ROLE_SUCCESS = 'assigns/item/UPDATE_ROLE_SUCCESS';
export const UPDATE_ROLE_FAIL = 'assigns/item/UPDATE_ROLE_FAIL';
export const UPDATE_RESOURCE = 'assigns/item/UPDATE_RESOURCE';
export const UPDATE_RESOURCE_SUCCESS = 'assigns/item/UPDATE_RESOURCE_SUCCESS';
export const UPDATE_RESOURCE_FAIL = 'assigns/item/UPDATE_RESOURCE_FAIL';
export const GET_USER = 'assigns/item/GET_USER';
export const GET_USER_SUCCESS = 'assigns/item/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'assigns/item/GET_USER_FAIL';
export const SYSTEM_LOAD = 'assigns/item/SYSTEM_LOAD';
export const SYSTEM_LOAD_SUCCESS = 'assigns/item/SYSTEM_LOAD_SUCCESS';
export const SYSTEM_LOAD_FAIL = 'assigns/item/SYSTEM_LOAD_FAIL';
export const SELECT_SYSTEM = 'assigns/item/SELECT_SYSTEM';
export const CLEAR_DATA = 'assigns/item/CLEAR_DATA';

const initialState = {
  itemLoading: false,
  systemLoading: false,
  treeLoading: false,
  updateModalVisible: false,
  updating: false,
  deleting: false,
  creating: false,
  assigns: [],
  selectItem: null,
  system: null,
  checkAble: false,
  searching: false,
  editRoleShow: false,
  createShow: false,
  selectPermission: [],
  permissions: [],
  resources: [],
  userResource: [],
  userRole: [],
  allRole: [],
  staffs: [],
  pathAuths: [],
  updated: false
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
const findParent = (obj, key, callback) => {
  if (!obj.hasOwnProperty('children')) {
    throw new Error('not found');
  }
  if (obj.children) {
    obj.children.forEach((item) => {
      if (item.id === key) {
        return callback(obj, item);
      }
      if (item.children) {
        return findParent(item, key, callback);
      }
    });
  }
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ITEM_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case ITEM_LOAD_SUCCESS:
      const roles = deepCopy(action.data.rolesWithUser);
      const users = [];
      roles.forEach((item) => {
        if (item.users && item.users.length) {
          const pId = item.id;
          item.users.forEach((user) => {
            const name = user.realName;
            users.push(Object.assign({}, user, {id: `u_${user.id}`, name: name, treePid: pId}));
          });
          delete item.users;
        }
      });
      const result = mapIdToitem(users.concat(roles));
      return {
        ...state,
        itemLoading: false,
        assigns: arrayToTree(result)
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
      let selectId = state.selectItem.id;
      selectId = selectId.split('-');
      selectId = selectId[selectId.length - 1];
      const rolesUpdate = deepCopy(action.data.updateRole);
      const usersUpdate = [];
      rolesUpdate.forEach((item) => {
        if (item.users && item.users.length) {
          const pId = item.id;
          item.users.forEach((user) => {
            const name = user.realName;
            usersUpdate.push(Object.assign({}, user, {id: `u_${user.id}`, name: name, treePid: pId}));
          });
          delete item.users;
        }
      });
      const resultUpdate = usersUpdate.concat(rolesUpdate);
      return {
        ...state,
        updating: false,
        editRoleShow: false,
        assigns: arrayToTree(mapIdToitem(resultUpdate)),
        selectItem: Object.assign({}, state.selectItem, {name: action.data.updateRole.filter((item) => item.id === parseInt(selectId, 10))[0].name}),
        msg: '权限编辑成功'
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
    case DELETE:
      return {
        ...state,
        deleting: true
      };
    case DELETE_SUCCESS:
      const rolesDel = deepCopy(action.data.deleteRole);
      const usersDel = [];
      rolesDel.forEach((item) => {
        if (item.users && item.users.length) {
          const pId = item.id;
          item.users.forEach((user) => {
            const name = user.realName;
            usersDel.push(Object.assign({}, user, {id: `u_${user.id}`, name: name, treePid: pId}));
          });
          delete item.users;
        }
      });
      const thenResult = mapIdToitem(usersDel.concat(rolesDel));
      return {
        ...state,
        deleting: false,
        assigns: arrayToTree(thenResult),
        selectItem: null,
        msg: '成功删除角色'
      };
    case DELETE_FAIL:
      return {
        ...state,
        deleting: false,
        error: action.error.message
      };
    case SEARCH:
      return {
        ...state,
        searching: true
      };
    case SEARCH_SUCCESS:
      if (action.data.staffs && action.data.staffs.length) {
        return {
          ...state,
          searching: false,
          staffs: action.data.staffs
        };
      }
      return {
        ...state,
        searching: false,
        error: `搜索员工失败，未找到该员工`
      };
    case SEARCH_FAIL:
      return {
        ...state,
        searching: false,
        error: action.error.message
      };
    case UPDATE_DATA:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case UPDATE_DATA_SUCCESS:
      return {
        ...state,
        updating: false,
        checkAble: false,
        updated: true,
        msg: '角色编辑成功'
      };
    case UPDATE_DATA_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case SHOW_UPDATE:
      return {
        ...state,
        checkAble: true
      };
    case CANCEL_UPDATE:
      return {
        ...state,
        checkAble: false
      };
    case SHOW_UPDATE_ROLE:
      return {
        ...state,
        editRoleShow: true
      };
    case HIDE_UPDATE_ROLE:
      return {
        ...state,
        editRoleShow: false
      };
    case SHOW_CREATE:
      return {
        ...state,
        createShow: true
      };
    case HIDE_CREATE:
      return {
        ...state,
        createShow: false,
        creating: false
      };
    case CREATE_ROLE:
      return {
        ...state,
        creating: true
      };
    case CREATE_ROLE_SUCCESS:
      const rolesCreate = deepCopy(action.data.createRole);
      const usersCreate = [];
      rolesCreate.forEach((item) => {
        if (item.users && item.users.length) {
          const pId = item.id;
          item.users.forEach((user) => {
            const name = user.realName;
            usersCreate.push(Object.assign({}, user, {id: `u_${user.id}`, name: name, treePid: pId}));
          });
          delete item.users;
        }
      });
      const createResult = mapIdToitem(usersCreate.concat(rolesCreate));
      return {
        ...state,
        creating: false,
        createShow: false,
        assigns: arrayToTree(createResult),
        msg: `成功创建角色`
      };
    case CREATE_ROLE_FAIL:
      return {
        ...state,
        creating: false,
        error: action.error.message
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
    case GET_ROLE_PERMISSION:
      return {
        ...state,
        treeLoading: true
      };
    case GET_ROLE_PERMISSION_SUCCESS:
      const roleAuths = mapIdToitem(action.data.rolePermissions.list);
      return {
        ...state,
        treeLoading: false,
        selectPermission: arrayToTree(roleAuths)
      };
    case GET_ROLE_PERMISSION_FAIL:
      return {
        ...state,
        treeLoading: true,
        error: action.error.message
      };
    case SELECT_SYSTEM:
      const dataList = deepCopy(state.assigns);
      let sItem = null;
      loop(dataList, action.data.id, (item) => {
        sItem = item;
      });
      return {
        ...state,
        selectItem: sItem
      };
    case PERMISSION_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case PERMISSION_LOAD_SUCCESS:
      const allAuths = deepCopy(action.data.permissions);
      const limitAuths = action.data.rolePermissions ? deepCopy(action.data.rolePermissions.list.filter((item) => item.checkstatus)) : [];
      let newAuths = mapIdToitem(action.data.rolePermissions ? allAuths.map((item) => limitAuths.some((it) => it.id === item.id && it.checkstatus === 2) ? item : {...item, disableCheck: true}) : allAuths);
      const allIdList = uniq(limitAuths.reduce((prev, item) => {
        return prev.concat(`${item.id}`);
      }, []));
      const getLastId = (str) => {
        const id = str.split('-');
        return id[id.length - 1];
      };
      newAuths = newAuths.filter((item) => !allIdList.length || allIdList.some((id) => id === getLastId(item.id)) || item.id.length === 1);
      return {
        ...state,
        itemLoading: false,
        permissions: arrayToTree(newAuths)
      };
    case PERMISSION_LOAD_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case RESOURCE_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case RESOURCE_LOAD_SUCCESS:
      let allResource = [{id: '_1', name: '资源管理', treePid: null}].concat(action.data.resources);
      allResource = mapIdToitem(allResource.map((item) => item.id !== '_1' && !item.treePid ? Object.assign(item, {treePid: '_1'}) : item));
      allResource = allResource.map((item) => item.status && item.status === 1 ? Object.assign(item, {disableCheck: true}) : item);
      return {
        ...state,
        itemLoading: false,
        resources: arrayToTree(allResource)
      };
    case RESOURCE_LOAD_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case USER_ROLE_LOAD:
      return {
        ...state,
        treeLoading: true
      };
    case USER_ROLE_LOAD_SUCCESS:
      let userRoles = action.data.userRoles.map((item) => item.id === -1 ? Object.assign(item, {id: '_1'}) : item);
      userRoles = mapIdToitem(userRoles.map((item) => item.id !== '_1' && !item.treePid ? Object.assign(item, {treePid: '_1'}) : item));
      return {
        ...state,
        treeLoading: false,
        userRole: arrayToTree(userRoles)
      };
    case USER_ROLE_LOAD_FAIL:
      return {
        ...state,
        treeLoading: false,
        error: action.error.message
      };
    case USER_RESOURCE_LOAD:
      return {
        ...state,
        treeLoading: true
      };
    case USER_RESOURCE_LOAD_SUCCESS:
      let userResource = action.data.userResources.map((item) => item.id === -1 ? Object.assign(item, {id: '_1'}) : item);
      userResource = mapIdToitem(userResource.map((item) => item.id !== '_1' && !item.treePid ? Object.assign(item, {treePid: '_1'}) : item));
      return {
        ...state,
        treeLoading: false,
        userResource: arrayToTree(userResource)
      };
    case USER_RESOURCE_LOAD_FAIL:
      return {
        ...state,
        treeLoading: false,
        error: action.error.message
      };
    case ALL_ROLE_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case ALL_ROLE_LOAD_SUCCESS:
      let allRoles = action.data.userRoles.map((item) => item.id === -1 ? Object.assign(item, {id: '_1'}) : item);
      allRoles = mapIdToitem(allRoles.map((item) => item.id !== '_1' && !item.treePid ? Object.assign(item, {treePid: '_1'}) : item));
      return {
        ...state,
        itemLoading: false,
        allRole: arrayToTree(allRoles)
      };
    case ALL_ROLE_LOAD_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case UPDATE_ROLE:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case UPDATE_ROLE_SUCCESS:
      const roleUpdate = deepCopy(action.data.updateUserRoles.rolesWithUser);
      const userUpdate = [];
      roleUpdate.forEach((item) => {
        if (item.users && item.users.length) {
          const pId = item.id;
          item.users.forEach((user) => {
            const name = user.realName;
            userUpdate.push(Object.assign({}, user, {id: `u_${user.id}`, name: name, treePid: pId}));
          });
          delete item.users;
        }
      });
      const resultsUpdate = userUpdate.concat(roleUpdate);
      return {
        ...state,
        updating: false,
        assigns: arrayToTree(mapIdToitem(resultsUpdate)),
        checkAble: false,
        updated: true,
        msg: '员工角色更改保存成功！'
      };
    case UPDATE_ROLE_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case UPDATE_RESOURCE:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case UPDATE_RESOURCE_SUCCESS:
      return {
        ...state,
        updating: false,
        checkAble: false,
        updated: true,
        msg: '员工资源保存成功！'
      };
    case UPDATE_RESOURCE_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case GET_USER:
      return {
        ...state,
        itemLoading: true
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        itemLoading: false,
        selectItem: Object.assign({}, action.data.staff, {type: 'staff'})
      };
    case GET_USER_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case SYSTEM_LOAD:
      return {
        ...state,
        systemLoading: true
      };
    case SYSTEM_LOAD_SUCCESS:
      return {
        ...state,
        systemLoading: false,
        system: action.data.system,
        pathAuths: action.data.loadPathAuths
      };
    case SYSTEM_LOAD_FAIL:
      return {
        ...state,
        systemLoading: false,
        error: action.error.message
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
}

// 加载数据
export function loadItem(sysId) {
  return {
    types: [ITEM_LOAD, ITEM_LOAD_SUCCESS, ITEM_LOAD_FAIL],
    graphql: `
      query rolesWithUser {
        rolesWithUser(sysId: ${sysId}){
          id,name,parentId,parentName,sortNum,users{id,realName,userNum,sex},treePid
        }
      }
    `
  };
}

// 加载数据
export function loadResource(sysId) {
  return {
    types: [RESOURCE_LOAD, RESOURCE_LOAD_SUCCESS, RESOURCE_LOAD_FAIL],
    graphql: `
      query resources {
        resources(sysId: ${sysId}){
          id,name,parentId,parentName,sortNum,treePid,checkstatus
        }
      }
    `
  };
}

// 加载数据
export function getUserRole(sysId, userId) {
  return {
    types: [USER_ROLE_LOAD, USER_ROLE_LOAD_SUCCESS, USER_ROLE_LOAD_FAIL],
    graphql: `
      query userRoles {
        userRoles(sysId: ${sysId}, userId: ${userId}){
          id,name,parentId,parentName,sortNum,treePid
        }
      }
    `
  };
}

// 加载数据
export function getUserResource(sysId, id) {
  return {
    types: [USER_RESOURCE_LOAD, USER_RESOURCE_LOAD_SUCCESS, USER_RESOURCE_LOAD_FAIL],
    graphql: `
      query userResources {
        userResources(sysId: ${sysId}, id: ${id}){
          id,name,parentId,parentName,sortNum,treePid,checkstatus
        }
      }
    `
  };
}

// 加载权限列表
export function loadPermission(sysId, roleId) {
  if (roleId) {
    return {
      types: [ PERMISSION_LOAD, PERMISSION_LOAD_SUCCESS, PERMISSION_LOAD_FAIL],
      graphql: `
        query limitPermissions {
          rolePermissions(sysId: ${sysId}, id: ${typeof roleId === 'number' ? roleId : parseInt(roleId.substring(2), 10)}){
            id,list{
              id,name,parentId,parentName,sortNum,treePid,checkstatus
            }
          }
          permissions(sysId: ${sysId}){
            id,name,parentId,parentName,sortNum,treePid,checkstatus
          }
        }
      `
    };
  }
  return {
    types: [ PERMISSION_LOAD, PERMISSION_LOAD_SUCCESS, PERMISSION_LOAD_FAIL],
    graphql: `
      query permissions {
        permissions(sysId: ${sysId}){
          id,name,parentId,parentName,sortNum,treePid,checkstatus
        }
      }
    `
  };
}

// 加载角色列表
export function loadAllRole(sysId) {
  return {
    types: [ ALL_ROLE_LOAD, ALL_ROLE_LOAD_SUCCESS, ALL_ROLE_LOAD_FAIL],
    graphql: `
      query userRoles {
        userRoles(sysId: ${sysId}){
          id,name,parentId,parentName,sortNum,treePid
        }
      }
    `
  };
}

// 切换选中
export function toggleSelect(sysId, assigns, info) { // id重置
  if (info.length) {
    const selectKey = info[0];
    const data = deepCopy(assigns);
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

// 获取角色权限
export function getRoleAuths(sysId, roleId) {
  return {
    types: [GET_ROLE_PERMISSION, GET_ROLE_PERMISSION_SUCCESS, GET_ROLE_PERMISSION_FAIL],
    graphql: `
      query rolePermissions {
        rolePermissions(sysId: ${sysId}, id: ${roleId}){
          id,list{
            id,name,parentId,parentName,sortNum,treePid,checkstatus
          }
        }
      }
    `
  };
}

// 搜索选中用户
export function selectStaff(id) {
  return {
    types: [GET_USER, GET_USER_SUCCESS, GET_USER_FAIL],
    graphql: `
    query staffItem {
      staff (id: ${parseInt(id, 10)}) {
        realName,
        id,
        userNum
      }
    }
    `
  };
}

// 提交数据
export function updateRole(selectItem, values, sysId) {
  let selectId = selectItem.id;
  selectId = selectId.split('-');
  selectId = selectId[selectId.length - 1];
  return ({
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    graphql: `
      mutation updateRole {
        updateRole(id: ${selectId},name: "${values.name}", sysId: ${sysId}){
          id,name,parentId,parentName,sortNum,users{id,realName,userNum,sex},treePid
        }
      }
    `
  });
}

// 搜索用户
export function searchUser() {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    graphql: `
      query staffs {
        staffs{
          id,realName,userNum
        }
      }
    `
  };
}

// 编辑树
export function editTree() {
  return {
    type: SHOW_UPDATE
  };
}

// 重置数据
export function resetTree() {
  return {
    type: CANCEL_UPDATE
  };
}

// 保存
export function saveTree(sysId, selectItem, checkedKeys, halfCheckedKeys) {
  let selectId = selectItem.id.split('-');
  selectId = selectId[selectId.length - 1];
  const checkedAuths = checkedKeys.map((item) => {
    let checkedId = item.split('-');
    checkedId = checkedId[checkedId.length - 1];
    return checkedId;
  });
  const halfCheckedAuths = halfCheckedKeys.map((item) => {
    let checkedId = item.split('-');
    checkedId = checkedId[checkedId.length - 1];
    return checkedId;
  });
  return {
    types: [UPDATE_DATA, UPDATE_DATA_SUCCESS, UPDATE_DATA_FAIL],
    graphql: `
      mutation updateRoleAuths {
        updateRolePermission(sysId: ${sysId}, id: ${selectId}, checkedAuths: [${checkedAuths}], halfCheckedAuths: [${halfCheckedAuths}]){
          id,name,parentId,parentName,sortNum,type,treePid,checkstatus
        }
      }
    `
  };
}

// 保存用户角色
export function updateUserRole(sysId, user, checkedKeys) {
  let selectId = typeof user.id === 'number' ? `${user.id}`.split('-') : user.id.split('-');
  selectId = selectId[selectId.length - 1];
  const list = checkedKeys.filter((item) => item !== '_1').map((item) => {
    let checkedId = item.split('-');
    checkedId = checkedId[checkedId.length - 1];
    return checkedId;
  });
  return {
    types: [UPDATE_ROLE, UPDATE_ROLE_SUCCESS, UPDATE_ROLE_FAIL],
    graphql: `
      mutation updateUserRoles {
        updateUserRoles(
          sysId: ${sysId},
          id: ${!!parseInt(selectId, 10) ? selectId : parseInt(selectId.substring(2), 10)},
          list: [${list}]){
            userRoles {
              id,name,parentId,parentName,sortNum,treePid
            }
            rolesWithUser {
              id,name,parentId,parentName,sortNum,treePid,users{id,realName,userNum,sex}
            }
        }
      }
    `
  };
}

// 保存用户资源
export function updateUserResource(sysId, user, checkedKeys, halfCheckedKeys) {
  let selectId = typeof user.id === 'number' ? `${user.id}`.split('-') : user.id.split('-');
  selectId = selectId[selectId.length - 1];
  const checkedResource = checkedKeys.filter((item) => item !== '_1').map((item) => {
    let checkedId = item.split('-');
    checkedId = checkedId[checkedId.length - 1];
    return checkedId;
  });
  const halfCheckedResource = halfCheckedKeys.filter((item) => item !== '_1').map((item) => {
    let checkedId = item.split('-');
    checkedId = checkedId[checkedId.length - 1];
    return checkedId;
  });
  return {
    types: [UPDATE_RESOURCE, UPDATE_RESOURCE_SUCCESS, UPDATE_RESOURCE_FAIL],
    graphql: `
      mutation updateUserResource {
        updateUserResource(sysId: ${sysId}, id: ${!!parseInt(selectId, 10) ? selectId : parseInt(selectId.substring(2), 10)},
          checkedResource: [${checkedResource}],
          halfCheckedResource: [${halfCheckedResource}]
        ){
          id,name,parentId,parentName,sortNum,type,treePid
        }
      }
    `
  };
}

// 显示角色编辑框
export function editRole() {
  return {
    type: SHOW_UPDATE_ROLE
  };
}

// 隐藏角色编辑框
export function hideEditRole() {
  return {
    type: HIDE_UPDATE_ROLE
  };
}

// 显示创建
export function showCreate() {
  return {
    type: SHOW_CREATE
  };
}

// 隐藏创建
export function hideCreate() {
  return {
    type: HIDE_CREATE
  };
}

// 确定创建创建
export function confirmCreate(sysId, item, value) {
  let selectId = item.id;
  selectId = selectId.split('-');
  selectId = selectId[selectId.length - 1];
  return {
    types: [CREATE_ROLE, CREATE_ROLE_SUCCESS, CREATE_ROLE_FAIL],
    graphql: `
      mutation createRole {
        createRole(sysId: ${parseInt(sysId, 10)}, name: "${value.name}",parentId: ${selectId ? selectId : null}, sortNum: ${item && item.children && item.children.length + 1 || 1}){
          id,name,parentId,parentName,sortNum,treePid,users{id,realName,userNum,sex}
        }
      }
    `
  };
}

// 删除角色
export function deleteRole(role, sysId) {
  let selectId = role.id;
  selectId = selectId.split('-');
  selectId = selectId[selectId.length - 1];
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    graphql: `
    mutation deleteRole {
      deleteRole(id: ${selectId}, sysId: ${sysId}){
        id,name,parentId,parentName,sortNum,treePid,users{id,realName,userNum,sex}
      }
    }
    `
  };
}

// 重置消息
export function resetMsg() {
  return {
    type: RESET_MSG
  };
}

// 重置消息
export function resetError() {
  return {
    type: RESET_ERROR
  };
}

// 加载系统详情
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

export function resetData() {
  return {
    type: CLEAR_DATA
  };
}
