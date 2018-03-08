import {
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLList as ListType,
} from 'graphql';

import DepartmentType from '../types/DepartmentType';
import * as deptService from '../service/auth.dept.service';

const querySchema = {
  departments: {
    type: new ListType(DepartmentType),
    async resolve() {
      const result = await deptService.query();
      return result.data;
    }
  },
  department: {
    type: DepartmentType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      const result = await deptService.getById(id);
      return result.data;
    }
  }
};

const mutationSchema = {
  createDepartment: {
    type: DepartmentType,
    args: {
      name: { type: StringType }
    },
    async resolve(parentVal, { name }) {
      const result = await deptService.create({
        name: name
      });
      return result.data;
    }
  },
  deleteDepartment: {
    type: DepartmentType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      const result = await deptService.del(id);
      return result.data;
    }
  },
  editDepartment: {
    type: DepartmentType,
    args: {
      id: { type: IntType },
      name: {type: StringType}
    },
    async resolve(parentVal, { id, name }) {
      const result = await deptService.update(id, {
        name: name
      });
      return result.data;
    }
  }
};

export default {
  querySchema,
  mutationSchema
};
