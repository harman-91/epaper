import {  createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: true,
  showLogin: false,
  showSideBar: false,
  showSearch: false,
  showComment:false,
  showModal: '',
  showUserBar:false
};

export const newsSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {
    setDeviceType: (state, action) => {
      state.isMobile = action.payload;
    },
    toggleLogin: (state, action) => {
      state.showLogin = !state.showLogin;
    },
    toggleSideBar: (state, action) => {
      state.showSideBar = !state.showSideBar;
    },
    toggleSearch: (state, action) => {
      state.showSearch = !state.showSearch;
    },
    toggleComment: (state, action) => {
      state.showComment = !state.showComment;
    },
    toggleModal: (state, action) => {
      state.showModal = action.payload || "";
    },
    toggleUserBar: (state, action) => {
      state.showUserBar = !state.showUserBar;
    },
  },
});

export const {
  setDeviceType,
  toggleLogin,
  toggleSideBar,
  toggleSearch,
  toggleModal,
  toggleComment,
  toggleUserBar,
} = newsSlice.actions;
export default newsSlice.reducer;
