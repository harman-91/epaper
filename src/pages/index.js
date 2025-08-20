
import HeroBanner from "@/component/Home/HeroBanner";
import PrimeCities from "@/component/Home/PrimeCities";
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

const Listing = ({ currentCities, cities }) => {
    const userDetail = useSelector((state) => state.userData.user);

  return (
    <main>
      <HeroBanner cities={currentCities} userDetail={userDetail} />
      <PrimeCities currentCities={currentCities} cities={cities} />
    </main>
  );
};

export const getServerSideProps = withHeaderProps("CommonLayout")(
  async (context) => {
    const host = context?.req?.headers?.host || "localhost";
    const domainInfo = getDomain(host);
    const currentCities = await epaperSearchCities({
      domain: domainInfo.apiDomainValue,
    });
          const cities = convertToCityList(currentCities);

    return {
      props: {
        currentCities,cities,
      },
    };
  }
);
export default Listing;
