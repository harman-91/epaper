const { default: axios } = require("axios");

let BASE_URL = process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL;

exports.userProfile = async ({ auth_token }) => {
  return await axios
    .post(
      BASE_URL + "api/v1/customer/get-profile",
      { domain_url: `${process.env.NEXT_PUBLIC_PRODUCT_ID}` },
      { headers: { Authorization: "Bearer " + auth_token } }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};
exports.userActiveSubscription = async ({ auth_token, domain }) => {
  try{
    const resp=await axios.post(
      BASE_URL + "api/v1/subscription/get-currently-active",
      { domain_url: domain },
      { headers: { Authorization: "Bearer " + auth_token } }
    );
      if (resp.data.code !== 200) {
        return null;
      }
      return resp?.data?.data?.subscriptionData;
  }
  catch (error) {
    return null
  }

};
exports.userSubscriptionTxn = async ({ auth_token, year, domain }) => {
  try {
    const resp = await axios.post(
      BASE_URL + "api/v1/subscription/get-txn-history",
      { domain_url: domain, year },
      { headers: { Authorization: "Bearer " + auth_token } }
    );
    if (resp.data.code !== 200) {
      return null;
    }
    return resp?.data?.data?.txnHistory;
  } catch (err) {
    return null;
  }
 
};
exports.updateUserProfile = async ({ auth_token, body = {} }) => {
  return await axios
    .post(BASE_URL + "api/v1/customer/update/profile", body, {
      headers: { Authorization: "Bearer " + auth_token },
    })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};
exports.updateUserProfilePicture = async ({ auth_token, body = {} }) => {
  return await axios
    .post(
      process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
        "api/v1/customer/update/profile",
      body,
      {
        headers: {
          Authorization: "Bearer " + auth_token,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};
exports.updateEmail = async ({ auth_token, body = {} }) => {
  return await axios
    .post(
      process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
        "api/v1/customer/update/link-gmail",
      body,
      {
        headers: {
          Authorization: "Bearer " + auth_token,
        },
      }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};
exports.sendOtp = async ({ auth_token, body = {} }) => {
  return await axios
    .post(
      process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
        "api/v1/customer/update/mobile",
      body,
      {
        headers: {
          Authorization: "Bearer " + auth_token,
        },
      }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};
exports.verifyOtp = async ({ auth_token, body = {} }) => {
  return await axios
    .post(
      process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
        "api/v1/customer/update/verify-otp",
      body,
      {
        headers: {
          Authorization: "Bearer " + auth_token,
        },
      }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};
exports.resendUserOtp = async ({ auth_token, body = {} }) => {
  return await axios
    .post(
      process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
        "api/v1/customer/update/resend-otp",
      body,
      {
        headers: {
          Authorization: "Bearer " + auth_token,
        },
      }
    )
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      return null;
    });
};

exports.getUsercategory = async ({ auth_token }) => {
  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/personalization/get-category`,
      { domain_url: process.env.DOMAIN },

      { headers: { Authorization: `Bearer ${auth_token}` } }
    )
    .then((resp) => {
      return resp.data.data.personalizationCategoryData;
    })
    .catch((error) => {
      return [];
    });
};
exports.getcheckPageView = async (li, shortLang) => {
  let pageLimit = {};
  return {};
  try {
    if (
      !li ||
      (li && (!li[shortLang] || Object.keys(li[shortLang]).length == 0))
    ) {
      pageLimit = await axios
        .get(
          process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
            "api/get-reading-limit/" +
            `${process.env.DOMAIN}`
        )
        .then((resp) => {
          return resp.data.data.limitData;
        })
        .catch((err) => {
          return {};
        });
    } else if (li[shortLang]) {
      pageLimit = li[shortLang];
    }
    if (pageLimit?.free_story_limit) {
      pageLimit["showLogin"] = false;
    }

    return pageLimit;
  } catch (err) {
    return {};
  }
};
