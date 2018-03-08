import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth, loadResource } from 'redux/modules/auth';
import {
    App,
    Home,
    NotFound,
    Staff,
    System,
    AssignPermission,
    LogManagement,
    Signin
  } from 'containers';
const { List, Item } = System;
const AssignList = AssignPermission.List;
const AssignItem = AssignPermission.Item;
export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
       // oops, not logged in, so can't be here!
        replace('/signin');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };
  const requireResource = (nextState, replace, cb) => {
    const sysId = nextState.params.id;
    if (!sysId) {
      replace('/');
    }
    function checkResource() {
      const { auth: { userResource, currentSys } } = store.getState();
      if (!userResource.some((item) => item.resourceNum === currentSys.number)) {
        replace('/');
      }
      cb();
    }
    store.dispatch(loadResource(sysId)).then(checkResource);
  };
  return (
    <Route path="/" name="App" breadcrumbName="权限系统" component={App}>
      { /* Home (main) route */ }
      { /*
        <Route path="">
        <IndexRoute component={NonPropertyView} />
        */
      }
      <Route onEnter={requireLogin}>
        <IndexRoute name="Home" component={Home}/>
        <Route name="staff" path="staff" breadcrumbName="员工管理" component={Staff} />
        <Route name="system" path="system" breadcrumbName="系统权限管理" component={List} />
        <Route name="systemItem" path="system/:id" breadcrumbName="系统权限管理" component={Item} onEnter={requireResource}/>
        <Route name="assign" path="assign" breadcrumbName="权限分配" component={AssignList} />
        <Route name="assignItem" path="assign/:id" breadcrumbName="权限分配" component={AssignItem} onEnter={requireResource} />
        <Route name="log" path="log" breadcrumbName="日志管理" component={LogManagement} />
      </Route>
      <Route name="signin" path="signin" breadcrumbName="登录" component={Signin} />
      { /* </Route> */ }
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
