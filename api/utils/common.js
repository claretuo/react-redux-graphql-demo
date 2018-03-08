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

// format list for create tree
export function formatList(list) {
  const idObj = list.reduce((prev, item) => {
    prev[item.id] = null;
    return prev;
  }, {});
  return list.map((item) => {
    if (idObj.hasOwnProperty(item.parentId)) {
      const parentNode = list.filter((it) => it.id === item.parentId)[0];
      idObj[item.parentId] = item;
      item.treePid = item.parentId;
      item.parentName = parentNode && parentNode.name || null;
    } else {
      item.treePid = null;
    }
    return item;
  });
}

function distinctUser(item, pid, list) {
  const parent = list.filter((tmp) => tmp.id === pid);
  if (parent.length) {
    item.users = item.users.filter((user) => !parent[0].users.some((user2) => user2.id === user.id));
    distinctUser(item, parent[0].treePid, list);
  }
}

export function formatRolesUsers(list) {
  const dict = list.reduce((preVal, item) => {
    preVal[item.id] = item;
    return preVal;
  }, {});
  const result = list.map((item) => {
    const parent = dict[item.parentId];
    if (parent) {
      item.treePid = item.parentId;
      item.parentName = parent && parent.name || null;
    } else {
      item.treePid = null;
    }
    return item;
  });
  result.forEach((item) => distinctUser(item, item.treePid, result));
  return result;
}
