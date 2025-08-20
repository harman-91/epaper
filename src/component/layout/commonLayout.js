import AnalyticsCommonScript from "@/component/anayltics/analyticsCommon";
// import Footer from "@/component/global/footer";
import Footer from "@/component/Common/Footer";
import Header from "@/component/Common/Header";
import { Suspense } from "react";
import { footerDetail } from "@/services/footerService";
import LoginModal from "@/component/account/loginmodel";



export default function CommonLayout({ children ,cities}) {
  return (
    <>
      <Header cities={cities} />
      <Suspense>
        <AnalyticsCommonScript />
      </Suspense>
      {children}
      <Suspense>
        <LoginModal />
      </Suspense>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
