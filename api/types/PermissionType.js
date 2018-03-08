import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLEnumType as EnumType
} from 'graphql';

const typeEnum = new EnumType({
  name: 'authType',
  values: {
    FOLDER: { value: 1 },
    PAGE: { value: 2 },
    OPERATION: {value: 3}
  }
});

const PermissionType = new ObjectType({
  name: 'permission',
  description: 'permission model',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
    sortNum: { type: IntType },
    parentId: { type: IntType },
    parentName: { type: StringType },
    type: { type: new NonNull(typeEnum) },
    url: { type: StringType },
    authNum: { type: new NonNull(StringType) },
    treePid: {type: IntType},
    checkstatus: {type: IntType}
  }
});

export default {
  typeEnum,
  PermissionType
};
