import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLEnumType as EnumType
} from 'graphql';
import DepartmentType from './DepartmentType';

const StaffStatusEnum = new EnumType({
  name: 'staffStatus',
  values: {
    NORMAL: { value: 1 },
    FREEZE: { value: 2 },
    CANCEL: { value: 3 },
  }
});

const StaffSexEnum = new EnumType({
  name: 'staffSex',
  values: {
    MALE: { value: 1 },
    FEMALE: { value: 2 }
  }
});

const StaffType = new ObjectType({
  name: 'staff',
  description: 'staff model',
  fields: {
    id: { type: new NonNull(IntType) },
    realName: { type: new NonNull(StringType) },
    departmentId: { type: IntType },
    department: { type: DepartmentType },
    sex: { type: new NonNull(StaffSexEnum) },
    phone: { type: new NonNull(StringType) },
    innerEmail: { type: new NonNull(StringType) },
    entryDatetime: { type: new NonNull(StringType) },
    userNum: { type: new NonNull(StringType) },
    status: { type: new NonNull(StaffStatusEnum) }
  }
});

export default {
  StaffType,
  StaffStatusEnum,
  StaffSexEnum
};
