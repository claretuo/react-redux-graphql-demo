import {formatList} from 'utils/common';
import {
  // GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjType,
  GraphQLList as ListType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import {typeEnum, PermissionType} from '../types/PermissionType';
import * as authService from '../service/auth.auth.service';

const querySchema = {
  permissions: {
    type: new ListType(PermissionType),
    args: {
      sysId: {type: IntType}
    },
    async resolve(parentVal, {sysId}, request) {
      const result = await authService.queryAuth(sysId, request.user.id);
      if (!result.data) {
        result.data = [];
      }
      return formatList(result.data);
    }
  },
  permissionItem: {
    type: PermissionType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      const result = await authService.getById(id);
      return result.data;
    }
  },
  rolePermissions: {
    type: new ObjectType({
      name: 'rolePermissions',
      description: 'item permissions',
      fields: {
        id: {type: IntType},
        list: {type: new ListType(PermissionType)}
      }
    }),
    args: {
      sysId: {type: IntType},
      id: {type: IntType}
    },
    async resolve(parentVal, {id}) {
      const result = await authService.queryRoleAuth(id);
      if (!result.data) {
        result.data = [];
      }
      return {
        id: id,
        list: formatList(result.data)
      };
    }
  }
};

const mutationSchema = {
  createPermission: {
    type: PermissionType,
    args: {
      name: {type: StringType},
      authNum: {type: StringType},
      url: {type: StringType},
      type: {type: typeEnum},
      sortNum: {type: IntType},
      sysId: {type: IntType},
      parentId: {type: IntType}
    },
    async resolve(parentVal, {...args}, request) {
      if (args.parentId === -1) {
        args.parentId = null;
      }
      const result = await authService.createAuth(args, request.user.id);
      return Object.assign({}, result.data, {treePid: `${result.data.parentId || null}`});
    }
  },
  /**
  * 权限编辑  批量上传
  **/
  batchUpdatePromission: {
    type: new ListType(PermissionType),
    args: {
      sysId: {type: IntType},
      list: {type: new ListType(new InputObjType({
        name: 'per',
        description: 'per model',
        fields: {
          id: { type: new NonNull(IntType) },
          name: { type: new NonNull(StringType) },
          sortNum: { type: IntType },
          parentId: { type: IntType },
          type: { type: new NonNull(typeEnum) },
          url: { type: StringType},
          authNum: { type: StringType}
        }
      }))}
    },
    async resolve(parentVal, {sysId, list}, request) {
      await authService.batchUpdateAuth(sysId, list, request.user.id);
      return formatList(list);
    }
  },
  deletePromission: {
    type: IntType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      await authService.delAuth(id);
      return id;
    }
  },
  updateRolePermission: {
    type: new ListType(PermissionType),
    args: {
      sysId: {type: IntType},
      id: {type: IntType},
      checkedAuths: {type: new ListType(IntType)},
      halfCheckedAuths: {type: new ListType(IntType)}
    },
    async resolve(parentVal, {sysId, id, checkedAuths, halfCheckedAuths}) {
      await authService.updateRoleAuth(id, checkedAuths, halfCheckedAuths);
      const result = await authService.queryRoleAuth(id);
      if (!result.data) {
        result.data = [];
      }
      const systemNode = {
        id: -1,
        name: '权限管理',
        authNum: `sys_${sysId}`,
        type: 1,
        sortNum: 0,
        parentId: null,
        parentName: null
      };
      return [systemNode].concat(formatList(result.data.filter((item) => (item.checkstatus === 2))));
    }
  }
};

export default {
  querySchema,
  mutationSchema
};
