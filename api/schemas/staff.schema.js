import {
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLList as ListType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import {uniq} from 'lodash';
import { StaffType, StaffStatusEnum, StaffSexEnum } from '../types/StaffType';
import {PermissionType} from '../types/PermissionType';
import * as staffService from '../service/auth.user.service';
import { queryAuth, querySysAuth } from '../service/auth.auth.service';

const querySchema = {
  staffs: {
    type: new ListType(StaffType),
    args: {
      status: { type: StaffStatusEnum },
      departmentId: { type: IntType },
      content: { type: StringType}
    },
    async resolve(parentVal, { status, departmentId, content }) {
      const result = await staffService.search({
        status: status || null,
        depart: departmentId,
        content: content || null
      });
      return result.data;
    }
  },
  staff: {
    type: StaffType,
    args: {
      id: { type: IntType }
    },
    async resolve(parentVal, { id }) {
      const result = await staffService.getById(id);
      return result.data;
    }
  },
  loadUser: {
    type: new ObjectType({
      name: 'loadCurrentUser',
      description: 'user load',
      fields: {
        user: { type: StaffType},
        menuList: { type: new ListType(PermissionType)}
      }
    }),
    resolve(parentVal, args, request) {
      return {
        user: request.user,
        menuList: request.session.menuList || []
      };
    }
  },
  loadPathAuths: {
    type: new ListType(PermissionType),
    args: {
      path: {type: StringType}
    },
    resolve(parentVal, {path}, request) {
      return request.session.pathAuths && request.session.pathAuths[path] || [];
    }
  }
};

const mutationSchema = {
  createStaff: {
    type: StaffType,
    args: {
      realName: { type: StringType },
      sex: { type: StaffSexEnum },
      phone: { type: StringType },
      innerEmail: { type: StringType },
      departmentId: { type: IntType },
      entryDatetime: { type: StringType}
    },
    async resolve(parentVal, args) {
      const result = await staffService.create(args);
      const user = await staffService.getById(result.data.id);
      return user.data;
    }
  },
  updateStaff: {
    type: StaffType,
    args: {
      id: { type: IntType },
      realName: { type: StringType },
      sex: { type: StaffSexEnum },
      phone: { type: StringType },
      innerEmail: { type: StringType },
      departmentId: { type: IntType },
      status: { type: StaffStatusEnum}
    },
    async resolve(parentVal, {id, ...args}) {
      let result = null;
      switch (args.status) {
        case 1:
          await staffService.active(id);
          result = await staffService.getById(id);
          return result.data;
        case 2:
          await staffService.freeze(id);
          result = await staffService.getById(id);
          return result.data;
        case 3:
          await staffService.cancel(id);
          result = await staffService.getById(id);
          return result.data;
        default:
          result = await staffService.update(id, args);
          return result.data;
      }
    }
  },
  modifyPassword: {
    type: StringType,
    args: {
      password: {type: StringType},
      newPassword: {type: StringType},
      rePassword: {type: StringType}
    },
    async resolve(parentVal, { password, newPassword, rePassword }, request) {
      await staffService.modifyPassword(request.user.id, password, newPassword, rePassword);
      return '修改成功';
    }
  },
  login: {
    type: new ObjectType({
      name: 'loginSuccess',
      description: 'user login',
      fields: {
        user: { type: StaffType},
        menuList: { type: new ListType(PermissionType)}
      }
    }),
    args: {
      userNum: {type: StringType},
      password: {type: StringType}
    },
    async resolve(parentVal, {userNum, password}, request) {
      const result = await staffService.login(userNum, password);
      const systemAuth = await queryAuth(result.data.sys.id, result.data.id);
      if (!systemAuth.data) {
        systemAuth.data = [];
      }
      const allAuth = await querySysAuth(result.data.sys.id);
      const getAllparent = (list, id) => {
        const item = list.filter((it) => it.id === id)[0];
        if (id === null || !item) {
          return [];
        }
        let newList = [];
        newList = newList.concat(item);
        newList = newList.concat(getAllparent(list, item.parentId));
        return newList;
      };
      let newMenu = [];
      systemAuth.data.forEach((item) => {
        newMenu = newMenu.concat(getAllparent(allAuth.data, item.id));
      });
      newMenu = uniq(newMenu, 'id').filter((item) => item.type !== 3).sort((m1, m2) => m1.sortNum - m2.sortNum);
      const menuList = newMenu.filter((item) => item.type === 2);
      request.session.menuList = newMenu;
      request.session.pathAuths = menuList.reduce((prev, item) => {
        prev[item.url] = systemAuth.data.filter((auth) => auth.type === 3 && auth.parentId === item.id);
        return prev;
      }, {});
      request.session.operatorAuths = systemAuth.data.filter((item) => item.type === 3);
      request.session.user = result.data;
      await request.session.save();
      request.user = result.data;
      return {
        user: result.data,
        menuList: newMenu
      };
    }
  },
  logout: {
    type: StringType,
    async resolve(parentVal, args, request) {
      delete request.session.user;
      delete request.session.menuList;
      delete request.session.operatorAuths;
      delete request.session.pathAuths;
      return '登出成功';
    }
  },
  resetPassword: {
    type: StringType,
    args: {
      email: {type: StringType}
    },
    async resolve(parentVal, {email}) {
      const result = await staffService.resetPassword(email);
      return result.msg || '密码重置成功';
    }
  },
};

export default {
  querySchema,
  mutationSchema
};
