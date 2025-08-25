import { getDomain } from "@/component/utility/CommonUtils";
import { epaperSearchCities } from "@/services/citiesServices";
import { convertToCityList } from "@/utils/apiUtils";

export async function getServerSideProps({ res, req }) {
  const host = req?.headers?.host || "localhost";
  const domainInfo = getDomain(host);
  const currentCities = await epaperSearchCities({
    domain: domainInfo.apiDomainValue,
  });
  const cities = convertToCityList(currentCities);
  
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domainInfo.url}/epaper</loc>
    <lastmod>${currentDate}</lastmod>
 
  </url>
  <url>
    <loc>${domainInfo.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.8</priority>
  </url>
  ${currentCities
    ?.map(
      (el) => `<url>
    <loc>${domainInfo.url}/${el.state_name}-all-editions-epaper.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
      ${cities
    ?.map(
      (el) => `<url>
    <loc>${domainInfo.url}/edition-today-${el.city_name}-${el.city_code}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}