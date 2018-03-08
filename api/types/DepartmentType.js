import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
} from 'graphql';

const DepartmentType = new ObjectType({
  name: 'department',
  description: 'department model',
  fields: {
    id: { type: IntType},
    name: { type: StringType},
    userCount: {type: IntType}
  }
});

export default DepartmentType;
