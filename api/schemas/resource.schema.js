import {formatList} from 'utils/common';
import {
  // GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjType,
  GraphQLList as ListType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import {typeEnum, ResourceType} from '../types/ResourceType';
import * as authService from '../service/auth.auth.service';

const querySchema = {
  resources: {
    type: new ListType(ResourceType),
    args: {
      sysId: {type: IntType}
    },
    async resolve(parentVal, {sysId}, request) {
      const result = await authService.queryUserResource(sysId, request.user.id);
      if (!result.data) {
        result.data = [];
      }
      return formatList(result.data);
    }
  },
  resource: {
    type: ResourceType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      const result = await authService.getById(id);
      return result.data;
    }
  },
  userResources: {
    type: new ListType(ResourceType),
    args: {
      sysId: {type: IntType},
      id: {type: IntType}
    },
    async resolve(parentVal, {sysId, id}) {
      const result = await authService.queryUserResource(sysId, id);
      if (!result.data) {
        result.data = [];
      }
      const systemNode = {
        id: -1,
        name: '资源管理',
        resourceNum: `sys_${sysId}`,
        type: 1,
        sortNum: 0,
        parentId: null,
        parentName: null
      };
      return [systemNode].concat(formatList(result.data.filter((item) => (item.checkstatus === 2))));
    }
  },
  sysResources: {
    type: new ListType(ResourceType),
    async resolve(parentVal, {}, request) {
      const result = await authService.queryUserResource(request.user.sys.id, request.user.id);
      if (!result.data) {
        result.data = [];
      }
      return formatList(result.data);
    }
  }
};

const mutationSchema = {
  createResource: {
    type: ResourceType,
    args: {
      name: {type: StringType},
      resourceNum: {type: StringType},
      url: {type: StringType},
      type: {type: typeEnum},
      parentId: {type: IntType},
      sortNum: {type: IntType},
      sysId: {type: IntType}
    },
    async resolve(parentVal, {...args}, request) {
      if (args.parentId === -1) {
        args.parentId = null;
      }
      const result = await authService.createResource(args, request.user.id);
      return Object.assign({}, result.data, {treePid: `${result.data.parentId || null}`});
    }
  },
  /**
  * 权限编辑  批量上传
  **/
  batchUpdateResource: {
    type: new ListType(ResourceType),
    args: {
      sysId: {type: IntType},
      list: {type: new ListType(new InputObjType({
        name: 'res',
        description: 're model',
        fields: {
          id: { type: new NonNull(IntType) },
          name: { type: new NonNull(StringType) },
          sortNum: { type: IntType },
          parentId: { type: IntType },
          type: { type: new NonNull(typeEnum) },
          url: { type: StringType},
          resourceNum: { type: new NonNull(StringType) }
        }
      }))}
    },
    async resolve(parentVal, {sysId, list}, request) {
      await authService.batchUpdateResource(sysId, list, request.user.id);
      return formatList(list);
    }
  },
  deleteResource: {
    type: IntType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      await authService.delResource(id);
      return id;
    }
  },
  updateUserResource: {
    type: new ListType(ResourceType),
    args: {
      sysId: {type: IntType},
      id: {type: IntType},
      checkedResource: {type: new ListType(IntType)},
      halfCheckedResource: {type: new ListType(IntType)}
    },
    async resolve(parentVal, {sysId, id, checkedResource, halfCheckedResource}) {
      await authService.updateUserResource(sysId, id, checkedResource, halfCheckedResource);
      const result = await authService.queryUserResource(sysId, id);
      if (!result.data) {
        result.data = [];
      }
      const systemNode = {
        id: -1,
        name: '资源管理',
        resourceNum: `sys_${sysId}`,
        type: 1,
        sortNum: 0,
        parentId: null,
        parentName: null
      };
      return [systemNode].concat(formatList(result.data.filter((item) => item.checkstatus === 2)));
    }
  }
};

export default {
  querySchema,
  mutationSchema
};
