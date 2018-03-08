import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const LogType = new ObjectType({
  name: 'log',
  description: 'permission model',
  fields: {
    deptName: { type: StringType },
    createTime: { type: StringType },
    sysName: { type: StringType },
    reqMethod: { type: StringType },
    opType: { type: StringType },
    userName: { type: StringType },
    ipAddr: {type: StringType},
    reqUrl: {type: StringType},
    status: {type: StringType}
  }
});

export default LogType;
