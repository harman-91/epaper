"use client";

import { getCookie, setCookie } from "@/component/utility/cookie";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import variable from "@/component/utility/variable";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ComscoreScript() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hide = getCookie("hide");
    if (!hide) {
      setOpen(true);
    }
  }, []);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const cs_ucfr = getCookie("hide") ? "1" : "";
  //   const script = document.createElement("script");
  //   script.id = "comscore-script";
  //   script.async = true;
  //   script.text = `
  //     var _comscore = _comscore || [];
  //     _comscore.push({
  //       c1: "2",
  //       c2: "13184768",
  //       cs_ucfr: "${cs_ucfr}",
  //       options: { enableFirstPartyCookie: true }
  //     });
  //     (function() {
  //       var s = document.createElement("script");
  //       s.id = "comscore-beacon";
  //       s.async = true;
  //       s.src = "https://sb.scorecardresearch.com/cs/13184768/beacon.js";
  //       document.body.appendChild(s);
  //     })();
  //   `;
  //   document.body.appendChild(script);

  //   return () => {
  //     const existingScript = document.getElementById("comscore-script");
  //     if (existingScript) existingScript.remove();

  //     const beaconScript = document.getElementById("comscore-beacon");
  //     if (beaconScript) beaconScript.remove();
  //   };
  // }, []);

  function getAgeGroup(birthDateStr) {
    const birthDate = new Date(birthDateStr);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age >= 0 && age <= 0) {
      return "00";
    } else if (age >= 18 && age <= 20) {
      return "06";
    } else if (age >= 21 && age <= 24) {
      return "07";
    } else if (age >= 25 && age <= 34) {
      return "08";
    } else if (age >= 35 && age <= 44) {
      return "09";
    } else if (age >= 45 && age <= 54) {
      return "10";
    } else if (age >= 55 && age <= 64) {
      return "11";
    } else if (age >= 65) {
      return "12";
    } else {
      return "00";
    }
  }

  const callRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let dmpId = localStorage.getItem("DMP_ID");
    if (!dmpId) {
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 100000);
      dmpId = `${timestamp}${randomSuffix}`;
      localStorage.setItem(variable.DMP_ID, dmpId);
    }
    callRef.current = true;
    const cs_ucfr = getCookie("hide") ? "1" : "";
    let isLogedin = "c";
    let userId = dmpId ? dmpId : "*null";
    let fpdm = 0;
    let cs_fpdt = "*null";
    if (getCookie(variable.LOGIN_DETAIL)) {
      const decode = atob(getCookie(variable.LOGIN_DETAIL));
      let val = JSON.parse(decode);
      userId = val?.user_id;
      isLogedin = "li";
      if (val?.date_of_birth) {
        fpdm =
          val.date_of_birth?.split("-").join("") +
          getAgeGroup(val?.date_of_birth);
      }
      if (val.gender) {
        fpdm = `${fpdm}${
          val.gender == "male" ? "1" : val.gender == "female" ? "2" : "0"
        }`;
      }
      fpdm = Number(fpdm) + 19991999999;
      if (val?.gender || val?.date_of_birth) {
        cs_fpdt = "03";
      }
    }
    const existingScript = document.getElementById("comscore-script");
    if (existingScript) {
      self.COMSCORE &&
        COMSCORE.beacon({
          c1: "2",
          c2: "13184768",
          options: {
            enableFirstPartyCookie: true,
            bypassUserConsentRequirementFor1PCookie: true,
          },
        });
      const t = Date.now();
      fetch("/cmscore.txt" + "?" + t)
        .then((res) => res.text())
        .then((data) => console.log(data))
        .catch((err) => console.log("Error loading text file:", err));
    } else {
      const script = document.createElement("script");

      script.id = "comscore-script";
      script.async = true;
      script.innerHTML = `
      var _comscore = _comscore || [];
      _comscore.push({
        c1: "2",
        c2: "13184768",
        cs_ucfr: "${cs_ucfr}",
        cs_fpid: "${userId}",
        cs_fpit: "${isLogedin}",
        cs_fpdm: "${fpdm == 0 ? "*null" : fpdm}",
        cs_fpdt: "${cs_fpdt}",
        options: { enableFirstPartyCookie: true,        bypassUserConsentRequirementFor1PCookie: true}
      });
      (function() {
        var s = document.createElement("script");
        s.id = "comscore-beacon";
        s.async = true;
        s.src = "https://sb.scorecardresearch.com/cs/13184768/beacon.js";
        document.body.appendChild(s);
      })();
    `;

      document.body.appendChild(script);
    }

    return () => {
      // const existingScript = document.getElementById("comscore-script");
      // if (existingScript) existingScript.remove();
      // const beaconScript = document.getElementById("comscore-beacon");
      // if (beaconScript) beaconScript.remove();
    };
  }, [pathname, searchParams]);
  const callSript = () => {
    const existingScript = document.getElementById("comscore-script");
    if (existingScript) existingScript.remove();

    const beaconScript = document.getElementById("comscore-beacon");
    if (beaconScript) beaconScript.remove();

    let dmpId = localStorage.getItem("DMP_ID");
    if (!dmpId) {
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 100000);
      dmpId = `${timestamp}${randomSuffix}`;
      localStorage.setItem("DMP_ID", dmpId);
    }
    callRef.current == true;
    const cs_ucfr = "1";
    let isLogedin = "c";
    let userId = dmpId ? dmpId : "*null";
    let fpdm = 0;
    let cs_fpdt = "*null";
    if (getCookie(variable.LOGIN_DETAIL)) {
      const decode = atob(getCookie(variable.LOGIN_DETAIL));
      let val = JSON.parse(decode);
      userId = val?.user_id;
      isLogedin = "li";
      if (val?.date_of_birth) {
        fpdm =
          val.date_of_birth?.split("-").join("") +
          getAgeGroup(val?.date_of_birth);
      }
      if (val.gender) {
        fpdm = `${fpdm}${
          val.gender == "male" ? "1" : val.gender == "female" ? "2" : "0"
        }`;
      }
      fpdm = Number(fpdm) + 19991999999;
      if (val?.gender || val?.date_of_birth) {
        cs_fpdt = "03";
      }
    }

    const script = document.createElement("script");

    script.id = "comscore-script";
    script.async = true;
    script.innerHTML = `
      var _comscore = _comscore || [];
      _comscore.push({
        c1: "2",
        c2: "13184768",
        cs_ucfr: "${cs_ucfr}",
        cs_fpid: "${userId}",
        cs_fpit: "${isLogedin}",
        cs_fpdm: "${fpdm == 0 ? "*null" : fpdm}",
        cs_fpdt: "${cs_fpdt}",
              options: { enableFirstPartyCookie: true,        bypassUserConsentRequirementFor1PCookie: true
 }
      });
      (function() {
        var s = document.createElement("script");
        s.id = "comscore-beacon";
        s.async = true;
        s.src = "https://sb.scorecardresearch.com/cs/13184768/beacon.js";
        document.body.appendChild(s);
      })();
    `;

    document.body.appendChild(script);
  };

  const handleAccept = () => {
    setCookie("hide", "true", 60 * 24 * 30); // Save for 30 days
    setOpen(false); // Close the popup
    callSript();
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[90%] lg:max-w-sm rounded-lg bg-white p-5 shadow-lg border border-gray-200">
      <div className="text-sm text-gray-700">
        This website uses cookies or similar technologies to enhance your
        browsing experience and provide personalized recommendations. By
        continuing to use our website, you agree to our{" "}
        <Link
          href="/privacy-policy"
          target="_blank"
          className="font-bold text-black underline"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/cookie-policy"
          target="_blank"
          className="font-bold text-black underline"
        >
          Cookie Policy
        </Link>
        .
      </div>
      <div className="mt-4 text-right">
        <button
          onClick={handleAccept}
          className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          OK
        </button>
      </div>
    </div>
  );
}
