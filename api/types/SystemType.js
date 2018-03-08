import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
const SystemType = new ObjectType({
  name: 'system',
  description: 'system model',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
    number: { type: new NonNull(StringType) },
    url: {type: new NonNull(StringType)}
  }
});

export default SystemType;
