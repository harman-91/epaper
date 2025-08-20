"use client";

import React from "react";
import FavoriteCities from "./FavoriteCities";
import SubscriptionEndedTop from "../EpaperSwiper/Epaper/SubscriptionEndedTop";

export default function HeroBanner({cities,userDetail}) {

  return (
    <>
        <SubscriptionEndedTop userDetail={userDetail} />
    <section className="relative pt-10">
      <div className="absolute top-0 left-0 z-[-1]">
        <img src="/images/shadowBlue.png" alt="" className="opacity-50" />
      </div>
      <div className="absolute top-0 right-0 z-[-1]">
        <img src="/images/orangeShadow.png" alt="" className="opacity-50" />
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <div className="lg:w-1/2 flex justify-center relative z-10">
            <div>
              <div className="hidden lg:block text-center lg:text-left">
                <h2 className="text-5xl font-semibold text-gray-900 -ml-12">माध्यम नया -</h2>
                <h1 className="text-9xl font-black text-red-600 font-khand leading-tight my-2">
                  भरोसा
                </h1>
                <h2 className="text-5xl font-semibold text-gray-900 translate-x-[-15%]">
                  वही
                </h2>
              </div>
              <div className="lg:hidden text-center">
                <h1 className="text-4xl font-bold text-gray-900 font-khand">
                  माध्यम नया भरोसा वही
                </h1>
                <h3 className="text-2xl font-medium text-gray-900 text-center mb-4">
                  अपना पसंदीदा शहर चुनें
                </h3>                
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">

            <FavoriteCities favoriteCities={cities} />
          </div>
        </div>
      </div>
    </section>        
    </>
  );
}