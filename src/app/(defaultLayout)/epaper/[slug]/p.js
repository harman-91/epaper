import React from "react";
import DetailComponent from "@/component/detail/detailComponent";
import { epaperDetail } from "@/services/detailService";
import { notFound } from "next/navigation";
import { getDomain } from "@/component/utility/CommonUtils";
import { epaperSearchCities } from "@/services/citiesServices";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const domainInfo = getDomain(host);
  const domain = domainInfo.domain;
  const { slug } = await params;
  if (!slug || !Array.isArray(slug) || slug.length === 0) {
    return {};
  }

  const slugParts = slug[0].split("-");
  if (slugParts.length < 8 || !slug[0].endsWith(".html")) {
    return {};
  }

  const monthAbbrToNumber = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const year = slugParts[0];
  const monthAbbr = slugParts[1].toLowerCase();
  const day = slugParts[2];
  const currentCity = slugParts[4];
  const monthNumber = monthAbbrToNumber[monthAbbr];
  const formattedDate = monthNumber
    ? `${day} ${monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1)} ${year}`
    : `${day}-${monthAbbr}-${year}`;
  const formattedCity =
    currentCity.charAt(0).toUpperCase() + currentCity.slice(1);

  return {
    title: `${formattedCity} Epaper ${formattedDate}: ${domainInfo.name} ${formattedCity} Newspaper Edition Online in ${domainInfo.language}`,
    description: `${domainInfo.name} ${formattedCity} Newspaper ${formattedDate}: Read ${formattedCity} Edition Epaper of ${formattedDate} Here. Get latest news & coverage from ${formattedCity} and Across India Here`,
    keywords: `${formattedCity} Newspaper ${formattedDate}, ${domainInfo.name} ${formattedCity} Edition ${formattedDate}, ${domainInfo.name} ${formattedCity} ${domainInfo.language} News Paper`,
  };
}
export default async function Epaper({ params }) {
     const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const domainInfo = getDomain(host);
  const { slug } = await params;
  const slugParts = slug.split("-");
  if (slugParts.length < 8 || !slug.endsWith(".html")) {
    notFound();
  }

  const monthAbbrToNumber = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const year = slugParts[0];
  const monthAbbr = slugParts[1].toLowerCase();
  const day = slugParts[2];
  const eid = slugParts[3];
  const currentCity = slugParts[4];
  const pageno = parseInt(slugParts[slugParts.length - 1].replace(".html", ""));

  // month to number
  const monthNumber = monthAbbrToNumber[monthAbbr];
  if (!monthNumber) {
    notFound();
  }
  const currentDate = `${year}-${monthNumber}-${day}`;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(currentDate) || isNaN(pageno) || pageno < 1) {
    notFound();
  }

  // Fetch data using the parsed parameters
  const data = await epaperDetail({
    type: "naidunia",
    date: currentDate, // Already in YYYY-MM-DD format
    ename: currentCity,
    pageno
  });
  const currentCities = await epaperSearchCities({domain: 'naidunia'});
  if (!data) {
    notFound();
  }

  return (
    <DetailComponent
      data={data}
      currentDate={currentDate}
      eid={eid}
      currentCity={currentCity}
      pageno={pageno}
      slug={slug}
      currentCities={currentCities}
      domainInfo={domainInfo}
      
    />
  );
}
