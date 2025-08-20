"use client";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

function SeoCommonScript() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const gtmScript = document.createElement("script");
    gtmScript.type = "text/javascript";
    gtmScript.innerHTML = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5CTQK3');    
        `;
    document.head.appendChild(gtmScript);

    const gtmNoscriptIframe = document.createElement("iframe");
    gtmNoscriptIframe.src =
      "https://www.googletagmanager.com/ns.html?id=GTM-5CTQK3";
    gtmNoscriptIframe.height = "0";
    gtmNoscriptIframe.width = "0";
    gtmNoscriptIframe.style.display = "none";
    gtmNoscriptIframe.style.visibility = "hidden";
    document.body.appendChild(gtmNoscriptIframe);

    return () => {
      if (gtmNoscriptIframe && gtmNoscriptIframe.parentNode) {
        gtmNoscriptIframe.parentNode.removeChild(gtmNoscriptIframe);
      }

      if (gtmScript && gtmScript.parentNode) {
        gtmScript.parentNode.removeChild(gtmScript);
      }
    };
  }, [pathname, searchParams, router.asPath]);

  return (
    <>
      <Script
        id="referrer-handler-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                  var referer = document.referrer; 
                  var r_uri = location.pathname + location.search; 
                  if (referer.indexOf('google') > 0 || referer.indexOf('bing') > 0) { 
                     history.pushState(null, null, r_uri); 
                     window.addEventListener('popstate', function (event) {  
                        window.location.assign('https://www.thedailyjagran.com/?itm_source=backbutton');
                     });
                  }
               `,
        }}
      />
    </>
  );
}

export default SeoCommonScript;
