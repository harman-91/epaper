const { default: axios } = require("axios");

let BASE_URL = process.env.NEXT_PUBLIC_DOMAIN_URL;
const payload = { headers: { Authorization: process.env.API_TOKEN } };

exports.epaperDetail = async ({ type, date,ename }) => {
  try {
    const url=  `${BASE_URL}${type}/?page=1&limit=100&ename=${ename}&edate=${date}`
    const response = await axios.get(
     url
    );
    return response?.data?.data;
  } catch (error) {
    return null;
  }
};
