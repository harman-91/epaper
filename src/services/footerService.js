// const { default: axios } = require("axios");

// let BASE_URL = process.env.NEXT_PUBLIC_MODE_WMS_BASE_API;

exports.footerDetail = async () => {
  try {
    return {
      policies: [
        {
          menu_name: "About us",
          alternate_menu_name: null,
          url: "/about-us",
          menu_class: "",
          target: null,
        },
        {
          menu_name: "Advertise with Us",
          alternate_menu_name: null,
          url: "/advertise-withus",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Book Print Ad",
          alternate_menu_name: null,
          url: "https://bookads.jagran.com",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Contact us",
          alternate_menu_name: null,
          url: "/contact-us",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Privacy Policy",
          alternate_menu_name: null,
          url: "/privacy-policy",
          menu_class: "",
          target: null,
        },
        {
          menu_name: "Disclaimer",
          alternate_menu_name: null,
          url: "/terms-conditions",
          menu_class: "",
          target: null,
        },
        {
          menu_name: "This website follows the DNPA’s code of conduct",
          alternate_menu_name: null,
          url: "/dnpa-code-of-ethics-for-digital-news-websites",
          menu_class: "",
          target: null,
        },
        {
          menu_name: "Sitemap",
          alternate_menu_name: null,
          url: "/sitemap",
          menu_class: "",
          target: null,
        },
        {
          menu_name: "Authors",
          alternate_menu_name: "authors",
          url: "/authors",
          menu_class: "",
          target: "_self",
        },
        {
          menu_name:
            "For any feedback or complaint, email to compliant_gro@jagrannewmedia.com",
          alternate_menu_name: null,
          url: "mailto:compliant_gro@jagrannewmedia.com",
          menu_class: "nofollow",
          target: null,
        },
      ],
      others: [
        {
          menu_name: "Jagran Hindi",
          alternate_menu_name: null,
          url: "https://www.jagran.com",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Punjabi Jagran",
          alternate_menu_name: null,
          url: "https://www.punjabijagran.com",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Gujarati Jagran",
          alternate_menu_name: null,
          url: "https://www.gujaratijagran.com",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Nai Dunia",
          alternate_menu_name: null,
          url: "https://www.naidunia.com/",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Inextlive",
          alternate_menu_name: null,
          url: "https://www.inextlive.com/",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Jagran Josh ",
          alternate_menu_name: null,
          url: "https://www.jagranjosh.com/",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Only My Health",
          alternate_menu_name: null,
          url: "https://www.onlymyhealth.com/",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Her Zindagi",
          alternate_menu_name: null,
          url: "https://www.herzindagi.com/",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Vishvas News",
          alternate_menu_name: null,
          url: "https://www.vishvasnews.com/english",
          menu_class: "",
          target: "_blank",
        },
        {
          menu_name: "Jagran TV",
          alternate_menu_name: null,
          url: "https://www.jagrantv.com/",
          menu_class: "",
          target: "_blank",
        },
      ],
    };
    // const response = await axios.get(
    //   `${BASE_URL}api/footer-get-by-product-url/english.jagran.com`
    // );
    // return response.data;
  } catch (error) {
    return null;
  }
};
