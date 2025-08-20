const { sitetoken } = require("@/utils/apiUtils");
const { default: axios } = require("axios");

let BASE_URL = process.env.NEXT_PUBLIC_MODE_COMMENT_URL;
const payload = {
  headers: { Authorization: "Bearer " + process.env.NEXT_PUBLIC_COMMENT_TOKEN },
};

exports.getBookmarkList = async ({
  user_id,
  type = "article",
  start = 0,
  limit = 20,
  domainInfo
}) => {
  try {

    const domain=sitetoken[domainInfo.domainId]
    const body = {
      type: type,
      productname: domain,
      userid: user_id,
      start: start,
      limit: limit,
    };
    const resp = await axios.post(
      BASE_URL + "bookmarks/user/list",
      body,
      payload
    );
    // console.log("--", BASE_URL + "bookmarks/user/list", body, payload);

    return resp.data.data;
  } catch (err) {
    return [];
  }
};
exports.getBookmarkListById = async ({ user_id, ids = 20 }) => {
  try {
    const body = {
      articleids: ids.join(","),
      productname: process.env.NEXT_PUBLIC_SITE_TOKEN,
      userid: user_id,
    };
    const resp = await axios.post(
      BASE_URL + "bookmarks/user/articleids",
      body,
      payload
    );

    return resp.data.data;
  } catch (err) {
    return [];
  }
};
