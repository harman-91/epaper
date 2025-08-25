import variable from "@/component/utility/variable";
const { default: axios } = require("axios");
// const { userProfile } = require("./userService");

let BASE_URL = process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL;

exports.sendPersonalizedCategory = async ({ domain_url, ids, token }) => {
    try {
        const response = await axios.post(
            `${BASE_URL}api/v1/epaper/save-personalization`,
            {
                domain_url: domain_url,
                ids: ids
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
     
        return null;
    }
};

exports.getPersonalizedCategory = async ({ domain_url,token }) => {
    try {
        const response = await axios.post(`${BASE_URL}api/v1/epaper/get-personalization`, {
            domain_url: domain_url,
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        

        return response?.data;
    } catch (error) {
        
        return null;
    }
}