import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import globalSlice from './slice/globalSlice';


const rootReducer = combineReducers({
	userData: userSlice,
	globalData: globalSlice,

});

export default rootReducer;