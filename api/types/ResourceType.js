import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLEnumType as EnumType
} from 'graphql';

const typeEnum = new EnumType({
  name: 'resourceType',
  values: {
    FOLDER: { value: 1 },
    OPERATION: {value: 2}
  }
});

const ResourceType = new ObjectType({
  name: 'Resource',
  description: 'resource model',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
    sortNum: { type: IntType },
    parentId: { type: IntType },
    parentName: { type: StringType },
    type: { type: new NonNull(typeEnum) },
    url: { type: StringType },
    resourceNum: { type: new NonNull(StringType) },
    treePid: {type: IntType},
    sysId: {type: IntType},
    checkstatus: {type: IntType}
  }
});

export default {
  typeEnum,
  ResourceType
};
