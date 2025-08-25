import CommonDatePicker from "@/component/commonDatePicker";
import CustomDatePicker from "@/component/DatePicker";
import {
  dateBefore,
  genratestateurl,
  genrateurl,
  getDomain,
  withHeaderProps,
} from "@/component/utility/CommonUtils";
import { epaperSearchCities } from "@/services/citiesServices";
import { epaperDetail } from "@/services/detailService";
import { convertToCityList } from "@/utils/apiUtils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { useSelector } from "react-redux";

const Listing = ({
  cities,
  type,
  value,
  data,
  selectedDate,
  currentCities,
}) => {
  const [selectedEdition, setSelectedEdition] = useState(value);
  const [region, setRegion] = useState(value);
  const [city, setCity] = useState();
  const [date, setDate] = useState();
  let selected;
  if (type == "city") {
    selected = cities.find((el) => el?.city_code == value);
  }
  if (type == "state") {
    selected = cities.find((el) => el?.state_name == value);
  }
  const userDetail = useSelector((state) => state.userData.user);
  const onDateChange = (value) => {
    setDate(value);
  };
  const uniqueRegions = Array.from(
    new Set(
      cities.filter((el) => el.state_name === value).map((el) => el.region_name)
    )
  );
  useEffect(() => {
    if (type == "city") {
      setCity(value);
    }
  }, []);
  const viewDetail = () => {
    const today = date ? new Date(date) : new Date();
    const year = today.getFullYear();
    const month = today.toLocaleString("en-US", { month: "short" });
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const find = cities.find((el) => el.city_code == city);

    const citySlug = find.city_name.replace(/\s+/g, "-");
    const cityCode = find.city_code ?? 1;

    const url = genrateurl({ date: formattedDate, cityCode, citySlug });
    window.location.href = url;
  };
  const viewStateListing = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.toLocaleString("en-US", { month: "short" });
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const find = cities.find((el) => el.city_code == city);
    const citySlug = find.city_name.replace(/\s+/g, "-");
    const cityCode = find.city_code ?? 1;

    const url = genratestateurl({ date: "today", cityCode, citySlug });
    window.location.href = url;
  };
  return (
    <div className="min-h-screen">
      <div className="absolute top-0 left-0 z-[-1]">
        <img src="/images/shadowBlue.png" alt="" className="opacity-50" />
      </div>
      <div className="absolute top-0 right-0 z-[-1]">
        <img src="/images/orangeShadow.png" alt="" className="opacity-50" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Newspaper Display */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Decorative blob background */}
              <div className="absolute inset-0 -z-10 top-10">
                <img
                  src="/images/featuredprev-bg.png"
                  alt=""
                  className="opacity-50 w-full h-full object-contain"
                />
              </div>

              {/* Main newspaper container */}
              <div className="relative z-10 p-8">
                <div className="flex justify-center">
                  <Image
                    src={data?.image ? data.image : "/images/featuredimg.png"}
                    alt="दैनिक जागरण"
                    className="w-[400px] h-[600px] shadow-xl rounded-lg"
                    height={200}
                    width={500}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Date */}
            <div className="mt-16 lg:mt-20">
              {type == "city" && (
                <h1 className="text-2xl font-bold text-gray-900 mb-3 capitalize">
                  {selected?.city_name} Epaper
                </h1>
              )}
              {type == "state" && (
                <h1 className="text-2xl font-bold text-gray-900 mb-3 capitalize">
                  {selected?.state_name} Epaper
                </h1>
              )}
              {type == "city" && (
                <div className="flex items-center text-gray-600 mb-6">
                  {/* <span className="text-sm">Monday, 17 July 2025</span> */}

                  <CommonDatePicker
                    onDateChange={onDateChange}
                    displayFormat="dddd, DD MMMM YYYY"
                    defaultDate={selectedDate.formatted}
                    MAX_DATE={new Date()}
                    MIN_DATE={dateBefore(
                      userDetail?.subscription?.subscription_archive
                        ?.feature_value_type,
                      userDetail?.subscription?.subscription_archive?.feature_value
                    )}
                  />
                  <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                    <GoShareAndroid />
                  </button>
                </div>
              )}
            </div>
            {type == "city" && (
              <div className="relative w-[60%]">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full capitalize p-3 pr-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 mt-3"
                  // disabled={!region}
                >
                  <option value="" className="capitalize">
                    Select a city
                  </option>
                  {region &&
                    cities
                      .filter((el) => el.region_name === selected?.region_name)
                      .map((el) => (
                        <option
                          key={el.city_code}
                          value={el.city_code}
                          className="capitalize"
                        >
                          {el.city_name}
                        </option>
                      ))}
                </select>

                <button
                  onClick={() => viewDetail()}
                  className="w-full bg-black text-white mt-6 py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  View
                </button>
              </div>
            )}
            {/* Edition Selector */}
            {type == "state" && (
              <div className="relative w-[60%]">
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setCity(""); // Reset city when region changes
                  }}
                  className="w-full capitalize p-3 pr-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                >
                  <option value="" className="capitalize">
                    Select a region
                  </option>
                  {uniqueRegions.map((regionName) => (
                    <option
                      key={regionName}
                      value={regionName}
                      className="capitalize"
                    >
                      {regionName} editions
                    </option>
                  ))}
                </select>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full capitalize p-3 pr-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 mt-3"
                  disabled={!region}
                >
                  <option value="" className="capitalize">
                    Select a city
                  </option>
                  {region &&
                    cities
                      .filter(
                        (el) =>
                          el.state_name === value && el.region_name === region
                      )
                      .map((el) => (
                        <option
                          key={el.city_code}
                          value={el.city_code}
                          className="capitalize"
                        >
                          {el.city_name}
                        </option>
                      ))}
                </select>
                <button
                  onClick={viewStateListing}
                  className="w-full bg-black text-white mt-6 py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Other Editions Section */}
        <div className="mt-4 pt-12 border-t-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Other Editions of Rajasthan
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cities
              ?.filter((el) => {
                if (
                  type == "state" &&
                  el?.state_name?.toLowerCase() === value?.toLowerCase()
                ) {
                  return true;
                } else if (
                  type == "city" &&
                  selected?.region_code == el?.region_code
                ) {
                  return true;
                } else {
                  return false;
                }
              })
              .map((edition) => (
                <div
                  key={edition.city_code}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow px-5 py-4 relative border"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {edition.city_name}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <GoShareAndroid />
                    </button>
                  </div>
                  <div className="relative border rounded-lg p-1 overflow-hidden">
                    <img
                      src="/images/city-edition-news.webp"
                      alt={`दैनिक जागरण ${edition.location}`}
                      className="w-full h-45 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"></button>
                    <div className="absolute bottom-0 left-0 text-white text-sm rounded w-full">
                      <div className="mt-2 bg-black/60 text-white text-sm px-3 py-1 rounded-bl rounded-br">
                        {edition.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withHeaderProps("CommonLayout")(
  async (context) => {
    try {
      const { slug } = context.params;
      const host = context?.req?.headers?.host || "localhost";
      const domainInfo = getDomain(host);
      const currentCities = await epaperSearchCities({
        domain: domainInfo.apiDomainValue,
      });
      const cities = convertToCityList(currentCities);
      let type;
      let value;
      let selectedDate = {};
      const data = {};
      let city = {};
      if (slug.endsWith("-all-editions-epaper.html")) {
        type = "state";
        value = slug.split("-")?.[0]?.toLowerCase();
        city = cities.find((el) => el.state_name?.toLowerCase() === value);
        if (!city) {
          return {
            notFound: true,
          };
        }
        const date = new Date();
        const currentDate = `${date.getFullYear()}-${date
          .getMonth()
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

        const detail = await epaperDetail({
          type: domainInfo.apiDomainValue,
          date: currentDate,
          ename: city.city_name,
        });
        data["image"] = detail?.[0]?.page_image || "";
      } else if (slug.startsWith("edition-today-")) {
        type = "city";
        let arr = slug.replace(".html", "").split("-");

        value = arr[arr.length - 1];
        city = cities.find((el) => el.city_code == value);
        if (!city) {
          return {
            notFound: true,
          };
        }
        const date = new Date();
        const currentDate = `${date.getFullYear()}-${date
          .getMonth()
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        selectedDate = { formatted: currentDate };
        const detail = await epaperDetail({
          type: domainInfo.apiDomainValue,
          date: currentDate,
          ename: city.city_name_en,
        });
        data["image"] = detail?.[0]?.page_image || "";
      } else if (slug.startsWith("edition-")) {
        type = "city";
        let slugParts = slug.replace(".html", "").split("-");
        value = slugParts[slugParts.length - 2];

        city = cities.find((el) => el.city_code == value);
        if (!city) {
          return {
            notFound: true,
          };
        }
        const year = slugParts[1];
        const monthNumber = slugParts[2];
        const day = slugParts[3];

        if (!monthNumber) {
          return { notFound: true };
        }
        const currentDate = `${year}-${monthNumber}-${day}`;
        selectedDate = { formatted: currentDate };
        const detail = await epaperDetail({
          type: domainInfo.apiDomainValue,
          date: currentDate,
          ename: city.city_name_en,
        });
        data["image"] = detail?.[0]?.page_image || "";
      }
      const title = `${city.city_name_en} Epaper: Read Indore News Today at ${domainInfo.name} Daily Indore NewsPaper Online
`;
      const description = `NaiDunia Indore ePaper covers latest Hindi News from Indore region. Read Today Indore News Online at One of the Most trusted Daily Hindi newspaper of MP and Chhattisgarh`;
      const keywords = `Indore newspaper, Indore epaper, NaiDunia Indore epaper, naidunia Indore edition, nai dunia
`;
      const canonicalUrl = `${domainInfo.url}/epaper/${slug}`;
      const metadata = {
        title: title || "",
        description: description || "",
        keywords: keywords || "",
        alternates: { canonical: canonicalUrl },
      };
      return {
        props: {
          cities: cities || [],
          type,
          value,
          data,
          currentCities,
          selectedDate,
          metadata,
        },
      };
    } catch (error) {
      return {
        props: {
          cities: [],
          type: "",
          value: "",
        },
      };
    }
  }
);
export default Listing;
