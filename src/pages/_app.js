import { Archivo, DM_Serif_Text, Merriweather } from "next/font/google";
import "../styles/globals.css";
import Head from "next/head";
import Providers from "@/store/provider";

import React, { Fragment, useEffect, useState } from "react";
import CommonLayout from "@/component/layout/commonLayout";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import HeaderLayout from "@/component/layout/headerLayout";
import { epaperSearchCities } from "@/services/citiesServices";
import { convertToCityList } from "@/utils/apiUtils";

// Font configurations
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-archivo",
});

function MyApp({ Component, pageProps }) {
  const [city, setCity] = useState(null);
  const router = useRouter();
  const getcity = async () => {
    const currentCities = await epaperSearchCities({
      domain: domainInfo.apiDomainValue,
    });
    setCity(currentCities);
  };
  useEffect(async () => {
    getcity();
  }, []);
  const {
    metadata = {},
    cities = [],
    // headerData = null,
    pageType,
    domainInfo,
  } = pageProps;

  let Layout = Fragment;
  if (pageType === "CommonLayout") {
    Layout = CommonLayout;
  } else if (pageType === "HeaderLayout") {
    Layout = HeaderLayout;
  }
  const citi = convertToCityList(city);

  return (
    <Providers>
      <Head>
        {metadata?.title && <title>{metadata?.title}</title>}
        {metadata?.description && (
          <meta name="description" content={metadata?.description} />
        )}
        {metadata?.keywords && (
          <meta name="keywords" content={metadata?.keywords} />
        )}
        {metadata?.alternates?.canonical && (
          <link rel="canonical" href={metadata?.alternates.canonical} />
        )}
        {metadata?.openGraph?.title && (
          <meta property="og:title" content={metadata?.openGraph.title} />
        )}
        {metadata?.openGraph?.description && (
          <meta
            property="og:description"
            content={metadata?.openGraph.description}
          />
        )}
        {metadata?.openGraph?.url && (
          <meta property="og:url" content={metadata?.openGraph.url} />
        )}
        {metadata?.openGraph?.images?.[0]?.url && (
          <meta
            property="og:image"
            content={metadata?.openGraph.images[0].url}
          />
        )}
        {metadata?.twitter?.card && (
          <meta name="twitter:card" content={metadata?.twitter.card} />
        )}
        {metadata?.twitter?.title && (
          <meta name="twitter:title" content={metadata?.twitter.title} />
        )}
        {metadata?.twitter?.description && (
          <meta
            name="twitter:description"
            content={metadata?.twitter.description}
          />
        )}
        {metadata?.twitter?.images?.[0]?.url && (
          <meta
            name="twitter:image"
            content={metadata?.twitter?.images[0]?.url}
          />
        )}
        {metadata?.twitter?.url && (
          <meta name="twitter:url" content={metadata?.twitter.url} />
        )}

        <meta name="robots" content="max-image-preview:large" />
      </Head>

      <div className={`${archivo.variable} `}>
        <Layout cities={cities} domainInfo={domainInfo}>
          <Component {...pageProps} currentCities={city} cities={citi} />
        </Layout>
      </div>
    </Providers>
  );
}

export default MyApp;
