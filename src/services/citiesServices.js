const { default: axios } = require("axios");

let BASE_URL = process.env.NEXT_PUBLIC_DOMAIN_URL;

exports.epaperSearchCities = async ({ domain  }) => {
  try {
    console.error("domain-",`${BASE_URL}${domain}/cities`)
    const response = await axios.get(`${BASE_URL}${domain}/cities`);
    return response?.data?.data;
  } catch (error) {
    console.error("--",error)
    return null;
  }
};
