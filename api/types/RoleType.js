import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from 'graphql';

import {StaffType} from './StaffType';
const RoleType = new ObjectType({
  name: 'role',
  description: 'role model',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
    sortNum: { type: IntType },
    parentId: { type: IntType },
    parentName: { type: StringType },
    users: {type: new ListType(StaffType)},
    treePid: {type: IntType}
  }
});

export default RoleType;
