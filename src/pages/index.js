import HeroBanner from "@/component/Home/HeroBanner";
import PrimeCities from "@/component/Home/PrimeCities";
import { getHomeMeta } from "@/component/meta/homeMeta";
import {
  genratestateurl,
  genrateurl,
  getDomain,
  withHeaderProps,
} from "@/component/utility/CommonUtils";
import { epaperSearchCities } from "@/services/citiesServices";
import { convertToCityList } from "@/utils/apiUtils";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Listing = ({ currentCities, cities, domainInfo }) => {
  const userDetail = useSelector((state) => state.userData.user);
  return (
    <main>
      <HeroBanner
        cities={currentCities}
        userDetail={userDetail}
        domainInfo={domainInfo}
      />
      <PrimeCities currentCities={currentCities} cities={cities} />
    </main>
  );
};

export const getServerSideProps = withHeaderProps("CommonLayout")(
  async (context) => {
    const host = context?.req?.headers?.host || "localhost";
    const domainInfo = getDomain(host);
    const currentCities = null
    const cities = convertToCityList(currentCities);
    const homeMeta = getHomeMeta(domainInfo.domainId);
    const metadata = {
      title: homeMeta.title || "",
      description: homeMeta.desc || "",
      keywords: homeMeta.keywords || "",
      alternates: { canonical: homeMeta.canonical },
    };
    return {
      props: {
        currentCities,
        cities,
        domainInfo,
        metadata,
      },
    };
  }
);
export default Listing;
