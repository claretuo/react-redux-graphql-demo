import moment from 'moment';

export const LIST_LOAD = 'logs/LIST_LOAD';
export const LIST_LOAD_SUCCESS = 'logs/LIST_LOAD_SUCCESS';
export const LIST_LOAD_FAIL = 'logs/LIST_LOAD_FAIL';
export const LOAD_COLUMES = 'logs/LOAD_COLUMES';
export const LOAD_COLUMES_SUCCESS = 'logs/LOAD_COLUMES_SUCCESS';
export const LOAD_COLUMES_FAIL = 'logs/LOAD_COLUMES_FAIL';
export const SEARCH = 'logs/SEARCH';
export const SEARCH_SUCCESS = 'logs/SEARCH_SUCCESS';
export const SEARCH_FAIL = 'logs/SEARCH_FAIL';
export const RESET_ERROR = 'logs/RESET_ERROR';

const initialState = {
  logs: [],
  columes: [],
  listLoading: false,
  columesLoading: false,
  searching: false,
  error: '',
  total: 0,
  current: 1
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
        logs: action.data.logs.data,
        total: action.data.logs.count
      };
    case LIST_LOAD_FAIL:
      return {
        ...state,
        listLoading: false,
        error: action.error.message
      };
    case LOAD_COLUMES:
      return {
        ...state,
        columesLoading: true
      };
    case LOAD_COLUMES_SUCCESS:
      return {
        ...state,
        columesLoading: false,
        columes: action.data.columes
      };
    case LOAD_COLUMES_FAIL:
      return {
        ...state,
        columesLoading: false,
        error: action.error.message
      };
    case SEARCH:
      return {
        ...state,
        searching: true
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        searching: false,
        logs: action.data.logs.data,
        total: action.data.logs.count,
        current: action.data.logs.current
      };
    case SEARCH_FAIL:
      return {
        ...state,
        searching: false,
        error: action.error.message
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


// 加载表头
export function loadColumes() {
  return {
    type: LOAD_COLUMES_SUCCESS,
    data: {
      columes: [
        {
          title: '操作者',
          dataIndex: 'userName',
        },
        {
          title: '系统名称',
          dataIndex: 'sysName',
        },
        {
          title: '部门名称',
          dataIndex: 'deptName',
        },
        {
          title: '时间',
          dataIndex: 'createTime',
        },
        {
          title: 'ip地址',
          dataIndex: 'ipAddr',
        },
        {
          title: '操作记录',
          dataIndex: 'opType',
        },
        {
          title: '方法',
          dataIndex: 'reqMethod',
        },
        {
          title: '路径',
          dataIndex: 'reqUrl'
        },
        {
          title: '结果',
          dataIndex: 'status'
        },
      ]
    }
  };
}

// 加载数据
export function loadList() {
  return {
    types: [LIST_LOAD, LIST_LOAD_SUCCESS, LIST_LOAD_FAIL],
    graphql: `
    query logs {
      logs(
        pageNum: 1,
        pageSize: 10
      ){
        count,
        data {
          reqUrl,userName,reqMethod,createTime,sysName,deptName,status,opType,ipAddr
        }
      }
    }
    `
  };
}

export function search(filters) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    graphql: `
    query logs {
      logs(userName: ${filters.name ? '"' + filters.name + '"' : '""'},
        startTimeStr: "${filters.start ? moment(filters.start).format('YYYY-MM-DD') : ''}",
        endTimeStr: "${filters.end ? moment(filters.end).format('YYYY-MM-DD') : ''}",
        pageNum: 1,
        pageSize: 10
      ){
        count,
        data {
          reqUrl,userName,reqMethod,createTime,sysName,deptName,status,opType,ipAddr
        },
        current
      }
    }
    `
  };
}

export function changePage(filters) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    graphql: `
    query logs {
      logs(userName: ${filters.name ? '"' + filters.name + '"' : '""'},
        startTimeStr: "${filters.start ? moment(filters.start).format('YYYY-MM-DD') : ''}",
        endTimeStr: "${filters.end ? moment(filters.end).format('YYYY-MM-DD') : ''}",
        pageNum: ${filters.pageNum || 1},
        pageSize: ${filters.pageSize || 10}
      ){
        count,
        data {
          reqUrl,userName,reqMethod,createTime,sysName,deptName,status,opType,ipAddr
        },
        current
      }
    }
    `
  };
}

export function resetError() {
  return {
    type: RESET_ERROR
  };
}
