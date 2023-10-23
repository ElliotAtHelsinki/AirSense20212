import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getCacheUser } from "../src/models/Base";
import { isEmpty, uniq, uniqBy } from "../src/utils/opLodash";

const initialState = {
  user: (() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch (e) {
        return {};
      }
    }
  })(),
  settings: {},
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    updateUser(state, { payload }) {
      state.user = payload;
    },
    changeStatus(state, { payload }) {
      state.user.statusACCOUNT = payload;
    },
    updateSetting(state, { payload }) {
      Object.assign(state.settings, payload);
    },
  },
});

export const { updateUser, updateSetting, changeStatus } = appSlice.actions;

const stateApp = (state) => state.app;
const selectUser = createSelector(stateApp, (app) => app.user);
const selectUserManifest = createSelector(stateApp, (state) => {
  if (!isEmpty(state?.user?.Manifests)) {
    return state.user.Manifests.map((manifest) => ({
      id: manifest.id,
      name: manifest.role_name,
      content : manifest.content
    }));
  }
  return [];
});
const selectUserPermissions = createSelector(stateApp, (state) => {
  const permissionList = [];
  if (!isEmpty(state?.user?.Manifests)) {
    state.user.Manifests.forEach((manifest) =>
      permissionList.push(...manifest.Permissions)
    );
    return uniqBy(permissionList, "id");
  }
  return permissionList;
});

export const appSelects = {
  selectUser,
  selectUserPermissions,
  selectUserManifest,
};

export default appSlice.reducer;
