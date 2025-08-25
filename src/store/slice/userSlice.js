import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { getCookie, removeCookie, setCookie } from "@/component/utility/cookie";
import variable from "@/component/utility/variable";
import { LoadingStatus } from "@/utils/apiUtils";
import { getDomain } from "@/component/utility/CommonUtils";

const initialState = {
  user: {},
  bookmarkList: [],
  showLogin: false,
  actionRef: "",
  message: {},
  isLoading: false,
  error: null,
  isAuthenticated: null,
  subscription: {
    native_ads_free: LoadingStatus.LOADING,
    taboola_ads_free: LoadingStatus.LOADING,
    prime_article_access: LoadingStatus.LOADING,
    special_badge: LoadingStatus.LOADING,
    epaper_access: LoadingStatus.LOADING,
  },
};
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      const host = window.location.hostname;
      const domainInfo = getDomain(host);
      // const wait = await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 10000);
      // });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/get-profile`,
        { domain_url: domainInfo.domainId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = response.data.data.profileData;
      const userObject = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        profile_picture: userData.profile_picture,
        member_since: userData.member_since,
        mobile_no: userData.mobile_no,
        user_id: userData.user_id,
        auth_token: token,
        email: userData.email,
        is_new_user: userData.is_new_user,
        registration_with: userData.registration_with,
        is_subscribed: userData.is_subscribed,
        state_id: userData.state_id,
        city_id: userData.city_id,
        state_name: userData.state_name,
        city_name: userData.city_name,
        gender: userData.gender,
        country_id: userData.country_id,
        native_ads_free: LoadingStatus.SHOW,
        taboola_ads_free: LoadingStatus.SHOW,
        prime_article_access: LoadingStatus.HIDE,
        epaper_access: LoadingStatus.HIDE,

        code: 200,
        isSubscribed: false,
      };

      if (userData?.is_subscribed) {
        userObject.native_ads_free =
          userData?.subscriptionData?.features?.find(
            (el) => el?.feature_identifier == "native_ads_free"
          )?.feature_value == "true"
            ? LoadingStatus.HIDE
            : LoadingStatus.SHOW;
        userObject.taboola_ads_free =
          userData?.subscriptionData?.features?.find(
            (el) => el?.feature_identifier == "taboola_ads_visible"
          )?.feature_value == "false"
            ? LoadingStatus.HIDE
            : LoadingStatus.SHOW;
        userObject.prime_article_access =
          userData?.subscriptionData?.features?.find(
            (el) => el?.feature_identifier == "prime_article_access"
          )?.feature_value == "true"
            ? LoadingStatus.SHOW
            : LoadingStatus.HIDE;
        userObject.special_badge =
          userData?.subscriptionData?.features?.find(
            (el) => el?.feature_identifier == "special_badge"
          )?.feature_value == "true"
            ? LoadingStatus.SHOW
            : LoadingStatus.HIDE;
        userData.isSubscribed = true;
        userObject.epaper_access =
          userData?.subscriptionData?.features?.find(
            (el) => el?.feature_identifier == "epaper_access"
          )?.feature_value == "true"
            ? LoadingStatus.SHOW
            : LoadingStatus.HIDE;
        const local = {
          native: userObject.native_ads_free == LoadingStatus.HIDE ? 1 : 0,
          prime: userObject.prime_article_access == LoadingStatus.SHOW ? 1 : 0,
        };
        localStorage.setItem(variable.USER_SUBSCRIPTION, JSON.stringify(local));
        setCookie(variable.USER_SUB_COOKIE, true, 1);
      } else {
        const firstView = localStorage.getItem(variable.FIRST_VIEW);
        if (firstView) {
          userObject.trial = true;
        } else {
          userObject.trial = false;
        }
        removeCookie(variable.USER_SUB_COOKIE);
      }
      // const c = getCookie(variable.USER_SUB_COOKIE);
      // if (!c) {
      //   setCookie(variable.USER_SUB_COOKIE, true, 1);
      // }
      let subscription = {};
      if (userData.isSubscribed) {

        subscription.subscription_name_hi =
          userData?.subscriptionData?.subscription_name_hi;
        subscription.subscription_name =
          userData?.subscriptionData?.subscription_name;
        subscription.currency = userData?.subscriptionData?.currency;
        subscription.sell_price = userData?.subscriptionData?.sell_price;
        subscription.start_date = userData?.subscriptionData?.start_date;
        subscription.id = userData?.subscriptionData?.id;
        subscription.end_date = userData?.subscriptionData?.end_date;
        subscription.duration_type = userData?.subscriptionData?.duration_type;
        subscription.subscription_duration = userData?.subscriptionData;
        subscription.subscription_archive =
          userData?.subscriptionData?.features?.find(
            (el) => el.feature_identifier == "epaper_archive_duration"
          );
        userData?.subscriptionData;
        // subscription={...subscription,...userData.subscriptionData}
      }
      if (userData?.expiredSubscriptionData) {
        userObject.expiredSubscriptionEndDate =
          userData?.expiredSubscriptionData?.end_date;
      }

      setCookie(variable.LOGIN_DETAIL, btoa(JSON.stringify(userObject)), 365);
      const pv = getCookie(variable.PAGE_VIEW);
      if (pv) {
        setCookie(variable.PAGE_VIEW, JSON.stringify({ count_hi: 0 }), 30);
      }
      localStorage.setItem("uid_auth", token);
      userObject.subscription = subscription;
      // userObject.subscriptionData = userData?.subscriptionData;

      return userObject;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const logoutUserProfile = createAsyncThunk(
  "user/logoutUser",
  async (storedToken, { rejectWithValue }) => {
    try {
      removeCookie(variable.LOGIN_DETAIL);
      localStorage.removeItem("uid_auth");
      localStorage.removeItem(variable.USER_SUBSCRIPTION);
      removeCookie(variable.USER_SUB_COOKIE);

      if (storedToken) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/logout`,
          {},
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
      }
      return { code: 200 };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const newsSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.user = { ...action.payload };
    },
    updateUserEmail: (state, action) => {
      state.user.email = action.payload;
    },
    updateUserMobile: (state, action) => {
      state.user.mobile_no = action.payload;
    },
    setUserBookmark: (state, action) => {
      state.bookmarkList = action.payload;
    },

    toggleShowLogin: (state, action) => {
      state.actionRef = action.payload.actionRef || "";
      state.message = action.payload.message || {};
      state.showLogin = !state.showLogin;
    },
    showAds: (state, action) => {
      state.subscription = {
        native_ads_free:
          action?.payload?.native_ads_free == 0
            ? LoadingStatus.SHOW
            : LoadingStatus.HIDE,
        taboola_ads_free:
          action?.payload?.taboola_ads_free == 0
            ? LoadingStatus.SHOW
            : LoadingStatus.HIDE,
        prime_article_access:
          action?.payload?.prime_article_access == 0
            ? LoadingStatus.HIDE
            : LoadingStatus.SHOW,
      };
    },
    nonLoggedIn: (state, action) => {
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.subscription = {
          native_ads_free: action.payload.native_ads_free,
          taboola_ads_free: action.payload.native_ads_free,
          prime_article_access: action.payload.prime_article_access,
          isSubscribed: action.payload.isSubscribed,
          special_badge: action.payload.special_badge,
          epaper_access: action.payload.epaper_access,
        };
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = {};
      })
      .addCase(logoutUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUserProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.user = {};
      })
      .addCase(logoutUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // .addCase(getUserSubscription.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(getUserSubscription.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.subscription = {
    //     loadAds: action?.payload?.native_ads_free,
    //     loadTaboola: action?.payload?.third_party_tabola_ads_free,
    //   };
    // })
    // .addCase(getUserSubscription.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.payload;
    // });
  },
});

export const {
  saveUserData,
  updateUserEmail,
  toggleShowLogin,
  updateUserMobile,
  showAds,
  nonLoggedIn,
} = newsSlice.actions;
export default newsSlice.reducer;
// export const getUserSubscription = createAsyncThunk(
//   "user/userSubscription",
//   async (token, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/get-currently-active`,
//         {
//           domain_url: process.env.NEXT_PUBLIC_PRODUCT_ID,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const userData = response.data.data.subscriptionData;
//       return { code: 200, ...userData };
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
