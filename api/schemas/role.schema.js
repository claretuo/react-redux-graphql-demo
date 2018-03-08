import {formatList, formatRolesUsers} from 'utils/common';
import {
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLList as ListType,
  GraphQLObjectType as ObjectType,
  // GraphQLNonNull as NonNull,
} from 'graphql';
import RoleType from '../types/RoleType';
import * as roleService from '../service/auth.role.service';

const querySchema = {
  rolesWithUser: {
    type: new ListType(RoleType),
    args: {
      sysId: {type: IntType}
    },
    resolve: async (parentVal, {sysId}, request) => {
      const result = await roleService.getBySystemWithUsers(sysId, request.user.id);
      if (!result.data) {
        result.data = [];
      }
      return formatRolesUsers(result.data);
    }
  },
  userRoles: {
    type: new ListType(RoleType),
    args: {
      sysId: {type: IntType},
      userId: {type: IntType}
    },
    async resolve(parentVal, {sysId, userId }, request) {
      const result = await roleService.getByUser(sysId, userId || request.user.id);
      if (!result.data) {
        result.data = [];
      }
      const systemNode = {
        id: -1,
        name: '角色管理',
        sortNum: 0,
        parentId: null,
        parentName: null,
        treePid: null,
        users: []
      };
      return [systemNode].concat(formatList(result.data));
    }
  },
};
const mutationSchema = {
  createRole: {
    type: new ListType(RoleType),
    args: {
      name: {type: StringType},
      parentId: {type: IntType},
      sortNum: {type: IntType},
      sysId: {type: IntType}
    },
    async resolve(parentVal, {...args}, request) {
      if (args.parentId === -1) {
        args.parentId = null;
      }
      await roleService.create(args, request.user.id);
      const result = await roleService.getBySystemWithUsers(args.sysId, request.user.id);
      if (!result.data) {
        result.data = [];
      }
      return formatRolesUsers(result.data);
    }
  },
  updateRole: {
    type: new ListType(RoleType),
    args: {
      id: {type: IntType},
      name: {type: StringType},
      sysId: {type: IntType}
    },
    async resolve(parentVal, {id, name, sysId}, request) {
      await roleService.update(id, name);
      const result = await roleService.getBySystemWithUsers(sysId, request.user.id);
      if (!result.data) {
        result.data = [];
      }
      return formatRolesUsers(result.data);
    }
  },
  deleteRole: {
    type: new ListType(RoleType),
    args: {
      id: { type: IntType },
      sysId: {type: IntType}
    },
    async resolve(parentVal, { id, sysId }, request) {
      await roleService.del(id);
      const result = await roleService.getBySystemWithUsers(sysId, request.user.id);
      if (!result.data) {
        result.data = [];
      }
      return formatRolesUsers(result.data);
    }
  },
  updateUserRoles: {
    type: new ObjectType({
      name: 'updateUserRole',
      description: 'user role',
      fields: {
        userRoles: {type: new ListType(RoleType)},
        rolesWithUser: {type: new ListType(RoleType)}
      }
    }),
    args: {
      sysId: {type: IntType},
      id: {type: IntType},
      list: {type: new ListType(IntType)}
    },
    async resolve(parentVal, {sysId, id, list}, request) {
      await roleService.updateUserRoles(sysId, id, list);
      const result = await roleService.getByUser(sysId, id);
      if (!result.data) {
        result.data = [];
      }
      const systemNode = {
        id: -1,
        name: '角色管理',
        sortNum: 0,
        parentId: null,
        parentName: null,
        treePid: null
      };
      const rolesWithUser = await roleService.getBySystemWithUsers(sysId, request.user.id);
      if (!rolesWithUser.data) {
        rolesWithUser.data = [];
      }
      return {
        userRoles: [systemNode].concat(formatList(result.data)),
        rolesWithUser: formatRolesUsers(rolesWithUser.data.filter((item) => !item.checkstatus || item.checkstatus === 2))
      };
    }
  },
};

export default {
  querySchema,
  mutationSchema
};
