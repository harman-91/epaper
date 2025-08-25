import AnalyticsCommonScript from "@/component/anayltics/analyticsCommon";
// import Footer from "@/component/global/footer";
import Footer from "@/component/Common/Footer";
import Header from "@/component/Common/Header";
import { Suspense } from "react";
import { footerDetail } from "@/services/footerService";
import LoginModal from "@/component/account/loginmodel";



export default function HeaderLayout({ children ,cities, domainInfo}) {
  return (
    <>
      <Header cities={cities} domainInfo={domainInfo} />
      <Suspense>
        <AnalyticsCommonScript />
      </Suspense>
      {children}
      <Suspense>
        <LoginModal />
      </Suspense>
    
    </>
  );
}
