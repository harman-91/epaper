import AnalyticsCommonScript from "@/component/anayltics/analyticsCommon";
// import Footer from "@/component/global/footer";
import Footer from "@/component/Common/Footer";
import Header from "@/component/Common/Header";
import { Suspense } from "react";
import { footerDetail } from "@/services/footerService";
import LoginModal from "@/component/account/loginmodel";

export const metadata = {
  title: "Jagran",
  description: "",
  keywords: "",
};

export default async function RootLayout({ children }) {
  const footerData = await footerDetail();

  return (
    <>
      <Header />
      <Suspense>
        <AnalyticsCommonScript />
      </Suspense>
      {children}
      <Suspense>
        <LoginModal />

      </Suspense>
      <Suspense>
        <Footer FooterDataMenu={footerData} />
      </Suspense>
    </>
  );
}
