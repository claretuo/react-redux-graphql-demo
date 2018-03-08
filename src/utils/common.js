import { isArray, uniq } from 'lodash';

export const strToRGB = (str) => {
  let hash = 0;
  for (let ind = 0; ind < str.length; ind++) {
    hash = str.charCodeAt(ind) + ((hash << 5) - hash);
  }
  const char = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return '00000'.substring(0, 6 - char.length) + char;
};

export function isEmptyObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return !1;
    }
  }
  return !0;
}

// 对象深拷贝
export const deepCopy = (obj) => {
  if (obj instanceof Array) {
    const arr = [];
    obj.forEach((item) => {
      arr.push(deepCopy(item));
    });
    return arr;
  } else if (obj instanceof Object) {
    const objCopy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = deepCopy(obj[key]);
      }
    }
    return objCopy;
  }
  return obj;
};

// array to tree
const createTree = (array, rootNodes, customID) => {
  const tree = [];
  for (const rootNode in rootNodes) {
    if (rootNodes.hasOwnProperty(rootNode)) {
      const node = rootNodes[rootNode];
      const childNode = array[node[customID]];
      if (!node && !rootNodes.hasOwnProperty(rootNode)) {
        continue;
      }
      if (childNode) {
        node.children = createTree(array, childNode, customID);
      }
      tree.push(node);
    }
  }
  return tree;
};

const groupByParents = (array, options) => {
  return array.reduce((prev, item) => {
    const parentID = item[options.parentProperty] || options.rootID;
    if (parentID && prev.hasOwnProperty(parentID)) {
      delete item[parentID];
      prev[parentID].push(item);
      return prev;
    }
    prev[parentID] = [item];
    return prev;
  }, {});
};

export function arrayToTree(data, option) {
  const options = Object.assign({
    parentProperty: 'treePid',
    customID: 'id',
    rootID: '0'
  }, option);

  if (!isArray(data)) {
    console.log(data);
    throw new TypeError('Expected an object but got an invalid argument');
  }
  const grouped = groupByParents(data, options);
  return createTree(grouped, grouped[options.rootID], options.customID);
}

export function handleTreeSortNum(list) {
  const sortNums = list.reduce((preVal, item) => {
    preVal.push(item.sortNum);
    return preVal;
  }, []).sort();
  return list.map((item, idx) => {
    item.sortNum = sortNums[idx];
    return item;
  });
}

export function handleTreePid(list, notSuper) {
  return list.map((item) => {
    if (item.treePid) {
      item.parentId = item.treePid;
    } else {
      item.parentId = notSuper ? item.parentId : null;
    }
    return item;
  });
}

const flatten = (node, notSuper) => {
  node.children = node.children || [];
  if (!Array.isArray(node.children)) {
    throw new Error('flattenTree(...): Value of children property must be an Array.');
  }

  if (!(node.hasOwnProperty('id'))) {
    throw new Error('flattenTree(...): Object must have `id` property.');
  }
  let result = [];
  if (node.children && node.children.length) {
    for (let ind = 0; ind < node.children.length; ind++) {
      node.children[ind].treePid = (node.id !== -1 ? node.id : null);
      if (notSuper) {
        node.children[ind].parentId = (node.id !== -1 ? node.id : node.children[ind].parentId);
      } else {
        node.children[ind].parentId = (node.id !== -1 ? node.id : null);
      }
      node.children[ind].parentName = node.name;
      node.children[ind].sortNum = ind + 1;
      result = result.concat(flatten(node.children[ind], notSuper));
    }
  }
  delete node.children;
  return result.concat(node);
};

export function flattenTree(tree, notSuper) {
  if (tree === null || typeof(tree) === 'undefined') {
    return [];
  }
  if (!(tree instanceof Object)) {
    throw new Error('flattenTree(...): Argument must be an object.');
  }
  const node = deepCopy(tree);
  if (node.children && node.children.length) {
    node.children = handleTreeSortNum(node.children);
  }
  return handleTreePid(flatten(node, notSuper), notSuper).filter((item) => item.id !== -1);
}

// list to String
export function listToString(list, inputDataType) {
  if (!isArray(list)) {
    throw new Error('传入值不是数组');
  }
  let result = '[';
  result += list.reduce((pre, item) => {
    let tmp = Object.keys(item).reduce((preStr, cur) => {
      if (item[cur]) {
        return preStr + `${cur}: ${ inputDataType[cur] === 'string' ? '"' + item[cur] + '"' : item[cur] },`;
      }
      return preStr;
    }, '');
    tmp = '{' + tmp.substring(0, tmp.length - 1) + '},';
    return pre + tmp;
  }, '');
  result = result.substring(0, result.length - 1) + ']';
  return result;
}

// 校验权限
export function isValidated(user, userSource, source) {
  return user.userNum === 'G-00000000' || userSource === source;
}

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

function updateParentHalfChecked(node, selected, halfChecked, list) {
  let newHalf = [];
  if (node.parentId && (selected.some((id) => id === node.id) || halfChecked.some((id) => id === node.id)) && !selected.some((id) => id === node.parentId) && !halfChecked.some((id) => id === node.parentId)) {
    newHalf = halfChecked.concat(node.parentId).concat(updateParentHalfChecked(list.filter((item) => item.id === node.parentId)[0], selected, newHalf, list));
  }
  return newHalf;
}

// 全选找半选
export function getHalfSelected(selected, tree) {
  const data = flattenTree(tree[0]);
  const newSelect = selected.map((id) => parseInt(id, 10));
  let result = [];
  data.forEach((item) => {
    result = result.concat(updateParentHalfChecked(item, newSelect, result, data));
  });
  return uniq(result, true);
}

export function mapIdToitem(list) {
  if (!list.length) {
    return [];
  }
  const newList = [];
  const formatList = list.map((item) => Object.assign(item, {id: `${item.id}`, treePid: item.treePid ? `${item.treePid}` : null}) );
  const pIds = formatList.filter((item) => !item.treePid).map((item) => item.id);
  newList.push(formatList.filter((item) => !item.treePid)[0]);
  if (!pIds.length) {
    throw new Error('数据解析错误');
  }
  while (pIds.length) {
    const pid = pIds.shift();
    let newPid = pid.split('-');
    newPid = newPid[newPid.length - 1];
    const newItems = formatList.filter((item) => item.treePid === newPid);
    for (let key = 0; key < newItems.length; key++) {
      const item = newItems[key];
      if (item) {
        newList.push(Object.assign({}, item, {id: `${pid}-${item.id}`, treePid: `${pid}`}));
        pIds.push(`${pid}-${item.id}`);
      }
    }
  }
  return newList;
}
