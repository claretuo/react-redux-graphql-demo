import glob from 'glob';
import path from 'path';
import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType
} from 'graphql';

const files = glob.sync('api/schemas/**/*.schema.js');
const queryFields = {};
const mutationFields = {};
files.forEach((item) => {
  const { querySchema, mutationSchema } = require(path.resolve(item));
  if (querySchema) {
    Object.assign(queryFields, querySchema);
  }
  if (mutationSchema) {
    Object.assign(mutationFields, mutationSchema);
  }
});

const schema = new Schema({
  query: new ObjectType({
    name: 'RootQueryType',
    description: 'query list or item',
    fields: queryFields
  }),
  mutation: new ObjectType({
    name: 'RootMutationType',
    description: 'set list or item',
    fields: mutationFields
  })
});
export default schema;
