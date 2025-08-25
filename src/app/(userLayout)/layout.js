import Footer from "@/component/global/footer";
import { footerDetail } from "@/services/footerService";
import AnalyticsCommonScript from "@/component/anayltics/analyticsCommon";
import { Suspense } from "react";

import MyAccoutHeader from "@/component/account/MyAccoutHeader";

export const metadata = {
  title: "Jagran",
  description: "",
  keywords: "",
};

export default async function RootLayout({ children }) {

  const footerData = await footerDetail();

  return (
    <>
    <div className="wrapper w-full relative overflow-hidden lg:overflow-visible pt-[80px] lg:pt-[108px]">
      <Suspense>
        <MyAccoutHeader />
      </Suspense>
      <Suspense>
        <AnalyticsCommonScript />
      </Suspense>
      {children}
      <Suspense>
        <Footer FooterDataMenu={footerData} />
      </Suspense>
    </div>
    </>
  );
}
