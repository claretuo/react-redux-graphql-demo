import {
  GraphQLString as StringType,
  GraphQLList as ListType,
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  // GraphQLNonNull as NonNull,
} from 'graphql';

import LogType from '../types/LogType';
import path from 'path';
import caller from 'grpc-caller';
import { services as serviceConfig } from '../config';
const logStub = caller(`${serviceConfig.logs.host}:${serviceConfig.logs.port}`, path.resolve(__dirname, '../proto/log.proto'), 'LogService');

const querySchema = {
  logs: {
    type: new ObjectType({
      name: 'logs',
      description: 'logs list',
      fields: {
        count: {type: IntType},
        data: {type: new ListType(LogType)},
        current: {type: IntType}
      }
    }),
    args: {
      userName: {type: StringType},
      startTimeStr: {type: StringType},
      endTimeStr: {type: StringType},
      pageNum: {type: IntType},
      pageSize: {type: IntType}
    },
    async resolve(parentVal, {...args}, request) {
      const filterObj = {
        beginDate: args.startTimeStr,
        endDate: args.endTimeStr,
        pageIndex: args.pageNum,
        pageSize: args.pageSize,
        log: {
          userName: args.userName,
          sysId: request.user.sys.id
        }
      };
      const result = await logStub.fetchAll(filterObj);
      return {current: args.pageNum, data: result.data, count: result.total};
    }
  }
};

export default {
  querySchema
};
