import {
  GraphQLInt as IntType,
  GraphQLString as StringType,
  // GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from 'graphql';

import SystemType from '../types/SystemType';
import * as systemService from '../service/auth.sys.service';
const querySchema = {
  systems: {
    type: new ListType(SystemType),
    async resolve(parentVal, {}, request) {
      const result = await systemService.query(request.user.id);
      return result.data;
    }
  },
  system: {
    type: SystemType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      const result = await systemService.getById(id);
      return result.data;
    }
  }
};

const mutationSchema = {
  createSystem: {
    type: SystemType,
    args: {
      name: { type: StringType },
      number: { type: StringType},
      url: {type: StringType}
    },
    async resolve(parentVal, { name, number, url }) {
      const result = await systemService.create({name: name, number: number, url: url});
      return result.data;
    }
  },
  updateSystem: {
    type: SystemType,
    args: {
      id: { type: IntType },
      name: { type: StringType },
      number: { type: StringType },
      url: {type: StringType}
    },
    async resolve(parentVal, {id, ...args}) {
      const result = await systemService.update(id, args);
      return result.data;
    }
  },
  deleteSystem: {
    type: IntType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      await systemService.del(id);
      return id;
    }
  }
};

export default {
  querySchema,
  mutationSchema
};
