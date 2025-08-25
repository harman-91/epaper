import React from "react";
import DetailComponent from "@/component/detail/detailComponent";
import { epaperDetail } from "@/services/detailService";
import { epaperSearchCities } from "@/services/citiesServices";
import { getDomain, withHeaderProps } from "@/component/utility/CommonUtils";
import Head from "next/head";
import dynamic from "next/dynamic";
// import DetailComponentPDF from "@/component/detail/detailComponetpdf";
const DetailComponentPDF = dynamic(
  () => import("@/component/detail/detailComponetpdf"),
  {
    ssr: false,
  }
);
export const getServerSideProps = withHeaderProps("HeaderLayout")(
  async (context) => {
    const { req, res, params } = context;
    const { slug } = params;

    const host = context?.req?.headers?.host || "localhost";
    const domainInfo = getDomain(host);

    const slugParts = slug.split("-");

    // if (slugParts.length < 8 || !slug[0].endsWith(".html")) {
    //   return { notFound: true };
    // }

    if (!slug.endsWith(".html")) {
      return { notFound: true };
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
    const pageno = parseInt(
      slugParts[slugParts.length - 1].replace(".html", "")
    );
    const monthNumber = monthAbbrToNumber[monthAbbr];
    if (!monthNumber) {
      return { notFound: true };
    }
    const currentDate = `${year}-${monthNumber}-${day}`;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(currentDate) || isNaN(pageno) || pageno < 1) {
      return { notFound: true };
    }
    const [data, currentCities] = await Promise.all([
      epaperDetail({
        type: domainInfo.apiDomainValue,
        date: currentDate,
        ename: currentCity,
        pageno,
      }),
      epaperSearchCities({ domain: domainInfo.apiDomainValue }),
    ]);

    if (!data) {
      return { notFound: true };
    }
    const formattedDate = monthNumber
      ? `${day} ${
          monthAbbr.charAt(0).toUpperCase() + monthAbbr.slice(1)
        } ${year}`
      : `${day}-${monthAbbr}-${year}`;
    const formattedCity =
      currentCity.charAt(0).toUpperCase() + currentCity.slice(1);
    const title = `${formattedCity} Epaper ${formattedDate}: ${domainInfo.name} ${formattedCity} Newspaper Edition Online in ${domainInfo.language}`;
    const description = `${domainInfo.name} ${formattedCity} Newspaper ${formattedDate}: Read ${formattedCity} Edition Epaper of ${formattedDate} Here. Get latest news & coverage from ${formattedCity} and Across India Here`;
    const keywords = `${formattedCity} Newspaper ${formattedDate}, ${domainInfo.name} ${formattedCity} Edition ${formattedDate}, ${domainInfo.name} ${formattedCity} ${domainInfo.language} News Paper`;
    const canonicalUrl = `${domainInfo.url}/epaper/${slug}`;
    const metadata = {
      title: title || "",
      description: description || "",
      keywords: keywords || "",
      alternates: { canonical: canonicalUrl },
    };
    if (data.length < pageno) {
      return {
        redirect: {
          permanent: false,
          destination: `/epaper/${year}-${slugParts[1]}-${day}-${eid}-${currentCity}-edition-${currentCity}-1.html`,
        },
      };
    }

    return {
      props: {
        data,
        currentDate,
        eid,
        currentCity,
        pageno,
        slug: slug,
        currentCities,
        domainInfo,
        metadata,
      },
    };
  }
);

export default function EpaperPage({
  data,
  currentDate,
  eid,
  currentCity,
  pageno,
  slug,
  currentCities,
  domainInfo,
}) {
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

  return (
    <>
      <DetailComponentPDF
        data={data}
        currentDate={currentDate}
        eid={eid}
        currentCity={currentCity}
        pageno={pageno}
        slug={slug}
        currentCities={currentCities}
        domainInfo={domainInfo}
      />
    </>
  );
}
