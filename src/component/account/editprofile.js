"use client";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import UpdateMobile from "./updateMobile";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginBtn from "./googleLogin";
import { useDispatch } from "react-redux";

import Image from "next/legacy/image";
import {
  updateUserProfile,
  updateUserProfilePicture,
} from "@/services/userService";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Field, Label, Switch } from "@headlessui/react";
import MobileVerifyModal from "./verifyMobile";
import { useAppSelector } from "@/store/reduxHooks";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { saveUserData } from "@/store/slice/userSlice";
import variable from "@/component/utility/variable";
import { setCookie } from "@/component/utility/cookie";

function EditProfile(props) {
  const [profile, setProfile] = useState(props.profileData);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [updateMobile, setUpdateMobile] = useState(false);
  const [error, setError] = useState("");
  const [errorObj, setErrorObj] = useState({});
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userDetail = useAppSelector((state) => state.userData.user);
  const searchParams = new useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  let logout = false;
  ///        "http://stg-hf-api.jnm.digital/api/v1/customer/upload/profile-picture",

  const uploadProfile = async (file) => {
    try {
      let bodyFormData = new FormData();
      bodyFormData.append("profile_picture", file);
      const data = await updateUserProfilePicture({
        auth_token: props.auth,
        bodyFormData,
      });

      if (data.code == 200) {
        setProfile((prev) => {
          return {
            ...prev,
            profile_picture: data?.data?.profileData?.profile_picture,
          };
        });
      }
    } catch (err) {
      setError("Something Went Wrong");
    }
  };

  const onChangeHandler = (e) => {

    if (e.target.name == "mobile_no" && e.target.value.length >= 11) {
      return;
    }
    if (e.target.name == "profile_picture") {
      uploadProfile(e.target.files[0]);

      return;
    }
    if (e.target.name == "radio-group") {
      setProfile((prev) => {
        return { ...prev, gender: e.target.value };
      });
      return;
    }
    if (e.target.name == "country") {
      getStateList(e.target.value);
      setProfile((prev) => {
        return {
          ...prev,
          country_id: e.target.value,
          state_id: "",
          city_id: "",
        };
      });

      return;
    }
    if (e.target.name == "state") {
      getCityList(e.target.value);
      setProfile((prev) => {
        return { ...prev, state_id: e.target.value, city_id: "" };
      });

      return;
    }
    if (e.target.name == "city") {
      setProfile((prev) => {
        return { ...prev, city_id: e.target.value };
      });

      return;
    }
    if (
      (e.target.name == "first_name" || e.target.name == "last_name") &&
     !isNaN(parseInt(e.target.value.slice(-1))) 
    ) {
      return;
    }

    setProfile((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  function containsNumber(value) {
    return /\d/.test(value);
  }
  const updateProfileHandler = async () => {
    try {
      let body = {
        date_of_birth: profile.date_of_birth,
        // email: profile.email,
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        gender: profile.gender,
      };
      if (profile.country_id) {
        body["country_id"] = String(profile.country_id);
      }
      if (profile.city_id) {
        body["city_id"] = String(profile.city_id);
      }
      if (profile.state_id) {
        body["state_id"] = String(profile.state_id);
      }
      if (body.email && !body.mobile_no) delete body.mobile_no;
      if (!body.email && body.mobile_no) delete body.email;
      const data = await updateUserProfile({ auth_token: props.auth, body });

      if (data.code == 200) {
        window.location.href = "/manage-profile";
      } else if (data.code == 412) {
        const result = data.data.errors.reduce((acc, obj) => {
          for (const key in obj) {
            acc[key] = obj[key];
          }
          return acc;
        }, {});
        setErrorObj(result);
      } else {
        setError(data.message ? data.message : "Something Went Wrong");
      }
    } catch (err) {
      setError("Something Went Wrong");
    }
  };
  const options = {
    year: "numeric",
    month: "long",
  };
  const onUpdateEmail = () => {
    setErrorObj({ ...errorObj, email: null });

    window.location.reload();
  };

  const closeModal = () => {
    window.location.reload();
    setUpdateMobile(false);
  };
  const onUpdateEmailError = (msg) => {
    setErrorObj({ ...errorObj, email: msg });
  };
  const getCountryList = async () => {
    try {
      const { data: country } = await axios(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/get-country`
      );
      if (country.code == 200) {
        setCountry(country?.data?.countryData || []);
      }
    } catch (err) {}
  };
  const getStateList = async (id) => {
    try {
      const { data: state } = await axios(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/get-state/${id}`
      );
      if (state.code == 200) {
        setState(state?.data?.stateData || []);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getCityList = async (id) => {
    try {
      const { data: state } = await axios(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/get-city/${profile.country_id}/${id}`
      );
      if (state.code == 200) {
        setCity(state?.data?.cityData || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCountryList();
    const token = searchParams.get("token");
    if (token) {
      if (window.location.href !== pathname + "?login=true") {
        const decode = atob(token);
        let val = JSON.parse(decode);
        const obj = {
          first_name: val?.userData?.first_name,
          last_name: val.userData.last_name,
          profile_picture: val.userData.profile_picture,
          mobile_no: val?.userData?.mobile_no,
          user_id: val?.userData?.user_id,
          auth_token: val?.userData?.auth_token,
          email: val?.userData?.email,
          is_new_user: val?.userData?.is_new_user,
          registration_with: val?.userData?.registration_with,
        };

        dispatch(saveUserData(obj));
        setCookie(variable.LOGIN_DETAIL, btoa(JSON.stringify(obj)), 365);
        // router.push(pathname + "?login=true", undefined, { shallow: true });

      }
    }
    if (profile.country_name) {
      getStateList(profile.country_id);
    }
    if (profile.state_name) {
      getCityList(profile.state_id);
    }
  }, []);

  const onClose = () => {
    setUpdateMobile(false);
  };

  const [isMaleEnabled, setIsMaleEnabled] = useState(false);
  const [isFemaleEnabled, setIsFemaleEnabled] = useState(false);
  const handleToggle = (genderValue) => {
    setProfile((prev) => {
      return { ...prev, gender: prev.gender != genderValue ? genderValue : "" };
    });
  };
  const handleFemaleToggle = () => {
    setIsMaleEnabled(false);
    setIsFemaleEnabled(true);
  };
  const handleVerify = (number) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   mobile: number,
    // }));
    window.location.reload();

    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative isolate bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative pb-14 pt-24 px-7 sm:pt-32 lg:static  lg:py-48">
            <div className="mx-auto w-full lg:mx-0">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                >
                  <defs>
                    {" "}
                    <pattern
                      x="100%"
                      y={-1}
                      id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                      width={200}
                      height={200}
                      patternUnits="userSpaceOnUse"
                    >
                      {" "}
                      <path d="M130 200V.5M.5 .5H200" fill="none" />{" "}
                    </pattern>{" "}
                  </defs>
                  <rect
                    fill="white"
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                  />
                  <svg
                    x="100%"
                    y={-1}
                    className="overflow-visible fill-gray-50"
                  >
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect
                    fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                  />
                </svg>
              </div>
              <div className="flex justify-between pr-10 mb-12">
                <div className="xl:col-span-2">
                  <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {props?.profileData?.first_name}{" "}
                    {props?.profileData?.last_name}
                  </h2>
                  {props?.profileData?.member_since && (
                    <small className="text-xs/6 text-gray-500">
                      Joined since{" "}
                      {new Date(
                        props?.profileData?.member_since
                      ).toLocaleDateString("en-Us", options)}
                    </small>
                  )}
                  <dl className="mt-10 space-y-4 text-base/7 text-gray-600">
                    <div className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">Telephone</span>
                        <PhoneIcon
                          aria-hidden="true"
                          className="h-7 w-6 text-gray-400"
                        />
                      </dt>
                      <dd>
                        {profile.is_mobile_verified ? (
                          <>
                            {/* 
                        <input
                          type="number"
                          maxlength="10"
                          name="mobile_no"
                          value={profile.mobile_no}
                          onChange={onChangeHandler}
                          disabled={profile.is_mobile_verified}
                        />
                      */}
                            <div className="font-lg">{profile.mobile_no}</div>
                          </>
                        ) : (
                          <button
                            onClick={handleOpenModal}
                            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            + Add your mobile number
                          </button>
                        )}
                      </dd>
                    </div>
                    <div className="flex gap-x-4">
                      <dt className="flex items-center">
                        <span className="sr-only">Email</span>
                        <EnvelopeIcon
                          aria-hidden="true"
                          className="h-7 w-6 text-gray-400"
                        />
                      </dt>
                      <dd className="relative">
                        {profile.email ? (
                          <div className="text-sm">{profile.email}</div>
                        ) : (
                          <GoogleOAuthProvider clientId="247545486737-0f0plg20qounrs8k1qjbkdp0bd57trrb.apps.googleusercontent.com">
                            <GoogleLoginBtn
                              onSuccess={onUpdateEmail}
                              onError={onUpdateEmailError}
                              auth={props.auth}
                              size="large"
                            />
                          </GoogleOAuthProvider>
                        )}
                        {errorObj.email && (
                          <div className="text-xs text-red-800 rounded-full bg-red-50 border border-red-100 inline-flex px-4 py-1 absolute top-6">
                            {errorObj.email}
                          </div>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                <figure
                  className="relative hidden h-48 w-48 mt-2 overflow-hidden rounded-full xl:block"
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                >
                  <input
                    onChange={onChangeHandler}
                    multiple={false}
                    ref={fileInputRef}
                    type="file"
                    hidden
                    name="profile_picture"
                  />
                  <button className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <Image
                      src={"/account/edit.svg"}
                      height={18}
                      width={18}
                      alt="edit"
                      className="size-10"
                    />
                  </button>
                  {profile.profile_picture ? (
                    <Image
                      src={profile.profile_picture}
                      layout="fill"
                      alt="user"
                      className="size-10"
                    />
                  ) : (
                    <Image
                      src="/account/dummy-user.png"
                      layout="fill"
                      alt="user"
                      className="size-10"
                    />
                  )}
                </figure>
              </div>
            </div>
          </div>
          <div className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="first-name"
                    className="block text-xs font-semibold text-gray-900 uppercase truncate"
                  >
                    First Name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name}
                      onChange={onChangeHandler}
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3.5 py-2.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600"
                    />
                    {errorObj.first_name && (
                      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                        {errorObj.first_name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-0">
                  <label
                    htmlFor="last-name"
                    className="block text-xs font-semibold text-gray-900 uppercase truncate"
                  >
                    Last Name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name}
                      onChange={onChangeHandler}
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3.5 py-2.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600"
                    />
                    {errorObj.last_name && (
                      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                        {errorObj.last_name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2" >
                  <label
                    htmlFor="birthday"
                    className="block text-xs font-semibold text-gray-900 uppercase truncate"
                  >
                    Birthday
                  </label>
                  <div className="mt-2.5"   >
                    <input
                      type="date"
                      id="birthday"
                      name="date_of_birth"
                      value={profile.date_of_birth || ""}
                      onChange={onChangeHandler}
                     
                      max={new Date().toISOString().split("T")[0]}
                      className="block w-full rounded-md bg-white px-3.5 py-2.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600"
                    />
                    {errorObj.date_of_birth && (
                      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                        {errorObj.date_of_birth}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="gender"
                    className="block text-xs font-semibold text-gray-900 uppercase truncate"
                  >
                    Gender
                  </label>
                  <div className="mt-2.5 flex items-center gap-x-4 flex-wrap">
                    <Field className="flex items-center">
                      <Switch
                        checked={profile.gender === "male"}
                        onChange={() => handleToggle("male")}
                        className="group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 data-[checked]:bg-red-600"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4"
                        />
                      </Switch>
                      <Label as="span" className="ml-3 text-sm">
                        <span className="text-xs uppercase font-semibold text-gray-900">
                          Male
                        </span>
                      </Label>
                    </Field>
                    <Field className="flex items-center">
                      <Switch
                        checked={profile.gender === "female"}
                        onChange={() => handleToggle("female")}
                        className="group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 data-[checked]:bg-red-600"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4"
                        />
                      </Switch>
                      <Label as="span" className="ml-3 text-sm">
                        <span className="text-xs uppercase font-semibold text-gray-900">
                          Female
                        </span>
                      </Label>
                    </Field>
                    {errorObj.gender && (
                      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 w-full">
                        {errorObj.gender}
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                  <div className="min-w-0">
                    <label
                      htmlFor="country"
                      className="block text-xs font-semibold text-gray-900 uppercase truncate"
                    >
                      Country / Region
                    </label>
                    <div className="mt-2.5">
                      <select
                        name="country"
                        onChange={onChangeHandler}
                        value={profile.country_id}
                        className="block w-full rounded-md bg-white px-3.5 py-2.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600"
                      >
                        <option value="" title="">
                          Select a country
                        </option>
                        {country.map((el) => (
                          <option key={el.id} value={el.id} title={el.name}>
                            {el.name}
                          </option>
                        ))}
                      </select>
                      {errorObj.country_id && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                          {errorObj.country_id}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label
                      htmlFor="state"
                      className="block text-xs font-semibold text-gray-900 uppercase truncate"
                    >
                      State
                    </label>
                    <div className="mt-2.5">
                      <select
                        name="state"
                        onChange={onChangeHandler}
                        value={profile.state_id}
                        className="block w-full rounded-md bg-white px-3.5 py-2.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600"
                      >
                        <option value="" title="">
                          Select a State
                        </option>
                        {state.map((el) => (
                          <option key={el.id} value={el.id} title={el.name}>
                            {el.name}
                          </option>
                        ))}
                      </select>
                      {errorObj.state_id && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                          {errorObj.state_id}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label
                      htmlFor="city"
                      className="block text-xs font-semibold text-gray-900 uppercase truncate"
                    >
                      City
                    </label>
                    <div className="mt-2.5">
                      <select
                        name="city"
                        onChange={onChangeHandler}
                        value={profile.city_id}
                        className="block w-full rounded-md bg-white px-3.5 py-2.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600"
                      >
                        <option value="" title="">
                          Select a city
                        </option>
                        {city.map((el) => (
                          <option key={el.id} value={el.id} title={el.name}>
                            {el.name}
                          </option>
                        ))}
                      </select>
                      {errorObj.city_id && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                          {errorObj.city_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={updateProfileHandler}
                  className="rounded-md bg-red-600 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Save Information
                </button>
              </div>
              <div
                className="rounded-lg bg-red-50/80 w-4/5 mx-auto p-5 cursor-pointer mt-[50px] mb-8 sm:w-full sm:p-4"
                onClick={() => (window.location.href = "/profile-deletion")}
              >
                <div className="text-lg font-semibold mb-0">
                  <div className="flex justify-between text-red-500 text-sm items-center group">
                    Delete Your Account
                    <span className="w-2 h-2 border-t-2 border-r-2 border-red-400 rotate-45 mt-1 group-hover:border-black"></span>
                  </div>
                </div>
                <div className="mt-0">
                  <p className="text-xs text-gray-400">
                    Delete all information associated with this account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileVerifyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onVerify={handleVerify}
        token={props?.auth}
      />
      <div id="mobile-root"></div>
    </>
  );
}

export default EditProfile;
