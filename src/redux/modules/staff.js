import moment from 'moment';

export const DEPARTMENT_LOAD = 'staff/DEPARTMENT_LOAD';
export const DEPARTMENT_LOAD_SUCCESS = 'staff/DEPARTMENT_LOAD_SUCCESS';
export const DEPARTMENT_LOAD_FAIL = 'staff/DEPARTMENT_LOAD_FAIL';
export const STAFF_LIST_LOAD = 'staff/STAFF_LIST_LOAD';
export const STAFF_LIST_LOAD_SUCCESS = 'staff/STAFF_LIST_LOAD_SUCCESS';
export const STAFF_LIST_LOAD_FAIL = 'staff/STAFF_LIST_LOAD_FAIL';
export const STAFF_ITEM_LOAD = 'staff/STAFF_ITEM_LOAD';
export const STAFF_ITEM_LOAD_SUCCESS = 'staff/STAFF_ITEM_LOAD_SUCCESS';
export const STAFF_ITEM_LOAD_FAIL = 'staff/STAFF_ITEM_LOAD_FAIL';
export const STAFF_FILTER_LOAD = 'staff/STAFF_FILTER_LOAD';
export const STAFF_FILTER_LOAD_SUCCESS = 'staff/STAFF_FILTER_LOAD_SUCCESS';
export const STAFF_FILTER_LOAD_FAIL = 'staff/STAFF_FILTER_LOAD_FAIL';
export const CREATE_STAFF = 'staff/CREATE_STAFF';
export const CREATE_STAFF_SUCCESS = 'staff/CREATE_STAFF_SUCCESS';
export const CREATE_STAFF_FAIL = 'staff/CREATE_STAFF_FAIL';
export const EDIT_STAFF = 'staff/EDIT_STAFF';
export const EDIT_STAFF_SUCCESS = 'staff/EDIT_STAFF_SUCCESS';
export const EDIT_STAFF_FAIL = 'staff/EDIT_STAFF_FAIL';
export const FREEZE = 'staff/FREEZE';
export const FREEZE_SUCCESS = 'staff/FREEZE_SUCCESS';
export const FREEZE_FAIL = 'staff/FREEZE_FAIL';
export const RESET = 'staff/RESET';
export const RESET_SUCCESS = 'staff/RESET_SUCCESS';
export const RESET_FAIL = 'staff/RESET_FAIL';
export const CANCELLATION = 'staff/CANCELLATION';
export const CANCELLATION_SUCCESS = 'staff/CANCELLATION_SUCCESS';
export const CANCELLATION_FAIL = 'staff/CANCELLATION_FAIL';
export const ENABLE = 'staff/ENABLE';
export const ENABLE_SUCCESS = 'staff/ENABLE_SUCCESS';
export const ENABLE_FAIL = 'staff/ENABLE_FAIL';
export const CREATE_DEPARTMENT = 'staff/CREATE_DEPARTMENT';
export const CREATE_DEPARTMENT_SUCCESS = 'staff/CREATE_DEPARTMENT_SUCCESS';
export const CREATE_DEPARTMENT_FAIL = 'staff/CREATE_DEPARTMENT_FAIL';
export const SHOW_STAFF_CREATE = 'staff/SHOW_STAFF_CREATE';
export const SHOW_DEPARTMENT_CREATE = 'staff/SHOW_DEPARTMENT_CREATE';
export const HIDE_STAFF_CREATE = 'staff/HIDE_STAFF_CREATE';
export const HIDE_DEPARTMENT_CREATE = 'staff/HIDE_DEPARTMENT_CREATE';
export const HIDE_STAFF_EDIT = 'staff/HIDE_STAFF_EDIT';
export const DELETE_DEPARTMENT = 'staff/DELETE_DEPARTMENT';
export const DELETE_DEPARTMENT_SUCCESS = 'staff/DELETE_DEPARTMENT_SUCCESS';
export const DELETE_DEPARTMENT_FAIL = 'staff/DELETE_DEPARTMENT_FAIL';
export const SET_NEW_FILTER = 'staff/SET_NEW_FILTER';
export const RESET_MSG = 'staff/RESET_MSG';
export const RESET_ERR = 'staff/RESET_ERR';
export const SHOW_EDIT_DEPARTMENT = 'staff/SHOW_EDIT_DEPARTMENT';
export const HIDE_EDIT_DEPARTMENT = 'staff/HIDE_EDIT_DEPARTMENT';
export const LOAD_EDIT_DEPARTMENT = 'staff/LOAD_EDIT_DEPARTMENT';
export const LOAD_EDIT_DEPARTMENT_SUCCESS = 'staff/LOAD_EDIT_DEPARTMENT_SUCCESS';
export const LOAD_EDIT_DEPARTMENT_FAIL = 'staff/LOAD_EDIT_DEPARTMENT_FAIL';
export const GET_DEPARTS = 'staff/GET_DEPARTS';
export const GET_DEPARTS_SUCCESS = 'staff/GET_DEPARTS_SUCCESS';
export const GET_DEPARTS_FAIL = 'staff/GET_DEPARTS_FAIL';

const initialState = {
  departmentLoading: false,
  staffListLoading: false,
  creating: false,
  editing: false,
  createDepartmentShow: false,
  createStaffShow: false,
  editStaffShow: null,
  staff: [],
  pathAuths: [],
  department: [],
  filters: {
    status: 'NORMAL',
    departmentId: null
  },
  error: '',
  msg: '',
  itemLoading: false,
  updating: false,
  deleting: false,
  editDepartmentShow: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case DEPARTMENT_LOAD:
      return {
        ...state,
        departmentLoading: true
      };
    case DEPARTMENT_LOAD_SUCCESS:
      return {
        ...state,
        departmentLoading: false,
        department: action.data.departments,
        pathAuths: action.data.loadPathAuths
      };
    case DEPARTMENT_LOAD_FAIL:
      return {
        ...state,
        departmentLoading: false,
        error: action.error.message
      };
    case STAFF_LIST_LOAD:
      return {
        ...state,
        staffListLoading: true
      };
    case STAFF_LIST_LOAD_SUCCESS:
      return {
        ...state,
        staffListLoading: false,
        staff: action.data.staffs
      };
    case STAFF_LIST_LOAD_FAIL:
      return {
        ...state,
        staffListLoading: false,
        error: action.error.message
      };
    case STAFF_FILTER_LOAD:
      return {
        ...state,
        staffListLoading: true
      };
    case STAFF_FILTER_LOAD_SUCCESS:
      return {
        ...state,
        staffListLoading: false,
        staff: action.data.staffs
      };
    case STAFF_FILTER_LOAD_FAIL:
      return {
        ...state,
        staffListLoading: false,
        error: action.error.message
      };
    case CREATE_STAFF:
      return {
        ...state,
        creating: true
      };
    case CREATE_STAFF_SUCCESS:
      return {
        ...state,
        creating: false,
        createStaffShow: false,
        staff: state.filters.status === 'NORMAL' && (!state.filters.departmentId || (state.filters.departmentId === action.data.createStaff.department.id)) ? state.staff.concat(action.data.createStaff) : state.staff,
        msg: `成功创建员工“${action.data.createStaff.realName}”`
      };
    case CREATE_STAFF_FAIL:
      return {
        ...state,
        creating: false,
        error: action.error.message
      };
    case EDIT_STAFF:
      return {
        ...state,
        editing: true
      };
    case EDIT_STAFF_SUCCESS:
      return {
        ...state,
        editing: false,
        editStaffShow: null,
        staff: state.filters.departmentId ? state.staff.map((item) => (item.id === action.data.updateStaff.id ? Object.assign({}, item, action.data.updateStaff) : item)).filter((item) => item.department.id === state.filters.departmentId) : state.staff.map((item) => (item.id === action.data.updateStaff.id ? Object.assign({}, item, action.data.updateStaff) : item)),
        msg: `成功修改员工“${action.data.updateStaff.realName}”信息`
      };
    case EDIT_STAFF_FAIL:
      return {
        ...state,
        editing: false,
        error: action.error.message
      };
    case ENABLE:
      return {
        ...state,
        updating: true
      };
    case ENABLE_SUCCESS:
      return {
        ...state,
        updating: false,
        staff: state.staff.filter((item) => item.id !== action.data.updateStaff.id),
        msg: `成功启用员工“${action.data.updateStaff.realName}”`
      };
    case ENABLE_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case FREEZE:
      return {
        ...state,
        updating: true
      };
    case FREEZE_SUCCESS:
      return {
        ...state,
        updating: false,
        staff: state.staff.filter((item) => item.id !== action.data.updateStaff.id),
        msg: `成功冻结员工“${action.data.updateStaff.realName}”`
      };
    case FREEZE_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case RESET:
      return {
        ...state,
        updating: true
      };
    case RESET_SUCCESS:
      return {
        ...state,
        updating: false,
        msg: `密码重置成功`
      };
    case RESET_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case GET_DEPARTS:
      return {
        ...state,
        itemLoading: true
      };
    case GET_DEPARTS_SUCCESS:
      return {
        ...state,
        itemLoading: false,
        department: action.data.departments
      };
    case GET_DEPARTS_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case CANCELLATION:
      return {
        ...state,
        updating: true
      };
    case CANCELLATION_SUCCESS:
      return {
        ...state,
        updating: false,
        staff: state.staff.filter((item) => item.id !== action.data.updateStaff.id),
        msg: `成功注销员工“${action.data.updateStaff.realName}”`
      };
    case CANCELLATION_FAIL:
      return {
        ...state,
        updating: false,
        error: action.error.message
      };
    case CREATE_DEPARTMENT:
      return {
        ...state,
        creating: true
      };
    case CREATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        creating: false,
        createDepartmentShow: false,
        department: state.department.concat(Object.assign({}, action.data.createDepartment, {userCount: 0})),
        msg: `成功创建部门“${action.data.createDepartment.name}”`
      };
    case CREATE_DEPARTMENT_FAIL:
      return {
        ...state,
        creating: false,
        error: action.error.message
      };
    case SHOW_STAFF_CREATE:
      return {
        ...state,
        createStaffShow: true
      };
    case SHOW_DEPARTMENT_CREATE:
      return {
        ...state,
        createDepartmentShow: true
      };
    case STAFF_ITEM_LOAD:
      return {
        ...state,
        itemLoading: true
      };
    case STAFF_ITEM_LOAD_SUCCESS:
      return {
        ...state,
        itemLoading: false,
        editStaffShow: action.data.staff
      };
    case STAFF_ITEM_LOAD_FAIL:
      return {
        ...state,
        itemLoading: false,
        error: action.error.message
      };
    case HIDE_STAFF_CREATE:
      return {
        ...state,
        createStaffShow: false,
        creating: false
      };
    case HIDE_DEPARTMENT_CREATE:
      return {
        ...state,
        createDepartmentShow: false,
        creating: false
      };
    case HIDE_STAFF_EDIT:
      return {
        ...state,
        editStaffShow: null,
        editing: false
      };
    case DELETE_DEPARTMENT:
      return {
        ...state,
        deleting: true
      };
    case DELETE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        department: state.department.filter((item) => item.id !== action.data.deleteDepartment.id),
        filters: state.filters.departmentId === action.data.deleteDepartment.id ? Object.assign({}, state.filters, {departmentId: 0}) : state.filters,
        deleting: false,
        msg: `成功删除部门“${action.data.deleteDepartment.name}”`
      };
    case DELETE_DEPARTMENT_FAIL:
      return {
        ...state,
        deleting: false,
        error: action.error.message
      };
    case SET_NEW_FILTER:
      const filter = Object.assign({}, state.filters);
      return {
        ...state,
        filters: Object.assign({}, filter, {[action.data.key]: action.data.value})
      };
    case RESET_MSG:
      return {
        ...state,
        msg: ''
      };
    case RESET_ERR:
      return {
        ...state,
        error: ''
      };
    case SHOW_EDIT_DEPARTMENT:
      return {
        ...state,
        editDepartmentShow: action.data.department
      };
    case HIDE_EDIT_DEPARTMENT:
      return {
        ...state,
        editDepartmentShow: null
      };
    case LOAD_EDIT_DEPARTMENT:
      return {
        ...state,
        editing: true
      };
    case LOAD_EDIT_DEPARTMENT_SUCCESS:
      return {
        ...state,
        editing: false,
        department: state.department.map((item) => ( item.id === action.data.editDepartment.id ? Object.assign({}, item, action.data.editDepartment) : item)),
        msg: `成功修改部门“${action.data.editDepartment.name}”`,
        editDepartmentShow: null
      };
    case LOAD_EDIT_DEPARTMENT_FAIL:
      return {
        ...state,
        editing: false,
        error: action.error.message
      };
    default:
      return state;
  }
}

// 获取部门列表
export function getBasicData(path) {
  return {
    types: [DEPARTMENT_LOAD, DEPARTMENT_LOAD_SUCCESS, DEPARTMENT_LOAD_FAIL],
    graphql: `
      query departments {
        loadPathAuths(path: "${path}" ) {
          name, authNum
        }
        departments {
          id, name, userCount
        }
      }
    `
  };
}

// 获取部门列表
export function getDeparts() {
  return {
    types: [GET_DEPARTS, GET_DEPARTS_SUCCESS, GET_DEPARTS_FAIL],
    graphql: `
      query departments {
        departments {
          id, name, userCount
        }
      }
    `
  };
}

// 获取员工列表
export function getStaffList() {
  return {
    types: [ STAFF_LIST_LOAD, STAFF_LIST_LOAD_SUCCESS, STAFF_LIST_LOAD_FAIL ],
    graphql: `
      query list {
        staffs (status: NORMAL, departmentId: null) {
          realName,
          sex,
          id,
          status,
          innerEmail,
          department {
            name,
            id
          }
        }
      }
    `
  };
}

// 筛选
export function changeFilters(filter) {
  return {
    types: [ STAFF_FILTER_LOAD, STAFF_FILTER_LOAD_SUCCESS, STAFF_FILTER_LOAD_FAIL ],
    graphql: `
      query filter {
        staffs(status: ${filter.status}, departmentId: ${filter.departmentId}, content: ${filter.content ? ('"' + filter.content + '"') : null}) {
          realName,
          sex,
          id,
          status,
          innerEmail,
          department {
            id,
            name
          }
        }
      }
    `
  };
}

// 弹出员工创建框
export function showStaffCreate() {
  return {
    type: SHOW_STAFF_CREATE
  };
}

// 弹出部门创建框
export function showDepartmentCreate() {
  return {
    type: SHOW_DEPARTMENT_CREATE
  };
}

// 弹出员工编辑框
export function showStaffEdit(staff) {
  return {
    types: [ STAFF_ITEM_LOAD, STAFF_ITEM_LOAD_SUCCESS, STAFF_ITEM_LOAD_FAIL],
    graphql: `
      query staffItem {
        staff (id: ${staff.id}) {
          realName,
          id,
          status,
          phone,
          userNum,
          sex,
          innerEmail,
          department {
            id,
            name
          }
        }
      }
    `
  };
}

// 关闭创建框
export function hideCreateStaff() {
  return {
    type: HIDE_STAFF_CREATE
  };
}

// 关闭创建框
export function hideCreateDepartment() {
  return {
    type: HIDE_DEPARTMENT_CREATE
  };
}

// 关闭编辑框
export function hideEdit() {
  return {
    type: HIDE_STAFF_EDIT
  };
}

// 创建员工
export function createStaff(values) {
  values.departmentId = parseInt(values.departmentId, 10);
  values.entryDatetime = moment(values.entryDatetime).format('YYYY-MM-DD');
  return {
    types: [ CREATE_STAFF, CREATE_STAFF_SUCCESS, CREATE_STAFF_FAIL],
    graphql: `
      mutation createStaff {
        createStaff (realName: "${values.realName}",sex: ${values.sex}, phone: "${values.phone}", innerEmail: "${values.innerEmail}", departmentId: ${values.departmentId}, entryDatetime: "${values.entryDatetime}") {
          status,
          realName,
          id,
          sex,
          innerEmail,
          department {
            id, name
          }
        }
      }
    `
  };
}

// 创建部门
export function createDepart(values) {
  return {
    types: [ CREATE_DEPARTMENT, CREATE_DEPARTMENT_SUCCESS, CREATE_DEPARTMENT_FAIL],
    graphql: `
      mutation createDepartment {
        createDepartment(name: "${values.name}") {
          name, id
        }
      }
    `
  };
}

// 编辑员工
export function editStaffItem(id, values) {
  values.departmentId = parseInt(values.departmentId, 10);
  delete values.userNum;
  return {
    types: [ EDIT_STAFF, EDIT_STAFF_SUCCESS, EDIT_STAFF_FAIL ],
    graphql: `
      mutation updateStaff {
        updateStaff (id: ${id}, realName: "${values.realName}", departmentId: ${values.departmentId}, innerEmail: "${values.innerEmail}") {
          id,
          realName,
          sex,
          status,
          innerEmail,
          department {
            id,
            name
          }
        }
      }
    `
  };
}

// 冻结员工
export function freezeStaff(item) {
  return {
    types: [ FREEZE, FREEZE_SUCCESS, FREEZE_FAIL ],
    graphql: `
      mutation freezeStaff {
        updateStaff (id: ${item.id}, status: FREEZE) {
          id,
          realName,
          status,
          innerEmail,
          department {
            id,
            name
          }
        }
      }
    `
  };
}

// 重置密码
export function resetPass(item) {
  return {
    types: [ RESET, RESET_SUCCESS, RESET_FAIL ],
    graphql: `
      mutation resetPassword {
        resetPassword (email: "${item.innerEmail}")
      }
    `
  };
}

// 注销员工
export function cancellationStaff(item) {
  return {
    types: [ CANCELLATION, CANCELLATION_SUCCESS, CANCELLATION_FAIL ],
    graphql: `
      mutation cancelStaff {
        updateStaff (id: ${item.id}, status: CANCEL) {
          id,
          realName,
          status,
          department {
            id,
            name
          }
        }
      }
    `
  };
}

// 启用员工
export function enableStaff(item) {
  return {
    types: [ ENABLE, ENABLE_SUCCESS, ENABLE_FAIL ],
    graphql: `
      mutation activeStaff {
        updateStaff (id: ${item.id}, status: NORMAL) {
          id,
          realName,
          status,
          innerEmail,
          department {
            id,
            name
          }
        }
      }
    `
  };
}

// 删除部门
export function deleteDepartment(department) {
  return {
    types: [ DELETE_DEPARTMENT, DELETE_DEPARTMENT_SUCCESS, DELETE_DEPARTMENT_FAIL ],
    graphql: `
      mutation deleteDepartment {
        deleteDepartment (id: ${department.id}) {
          id,
          name
        }
      }
    `
  };
}

// 改变筛选值
export function setNewFilter(which, value) {
  return {
    type: SET_NEW_FILTER,
    data: {
      key: which,
      value: value
    }
  };
}

// 清空消息
export function resetMsg() {
  return {
    type: RESET_MSG
  };
}

// 清空错误
export function resetErr() {
  return {
    type: RESET_ERR
  };
}

// 显示编辑部门弹窗
export function editDepartment(item) {
  return {
    type: SHOW_EDIT_DEPARTMENT,
    data: {
      department: item
    }
  };
}

// 显示编辑部门弹窗
export function hideEditDepartment() {
  return {
    type: HIDE_EDIT_DEPARTMENT
  };
}

// 显示编辑部门弹窗
export function confirmEditDepartment(id, values) {
  return {
    types: [LOAD_EDIT_DEPARTMENT, LOAD_EDIT_DEPARTMENT_SUCCESS, LOAD_EDIT_DEPARTMENT_FAIL],
    graphql: `
      mutation editDepartment {
        editDepartment(id: ${id}, name: "${values.name}") {
          id,
          name
        }
      }
    `
  };
}
