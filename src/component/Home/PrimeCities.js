"use client";

import React from "react";
import { GoShareAndroid } from "react-icons/go";
import { genrateurl } from "../utility/CommonUtils";
import GlobalLink from "../global/GlobalLink";

export default function PrimeCities({ currentCities,cities }) {
  // Flatten all cities from currentCities prop


  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">प्रमुख शहर</h2>
        </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {cities.map((city, index) => {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.toLocaleString("en-US", { month: "short" });
            const day = String(today.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;

            const citySlug = city.city_name.replace(/\s+/g, "-");
            const cityCode = city.city_code ?? 1; // fallback if code missing

            const url = genrateurl({ date: formattedDate, cityCode, citySlug });
              return (
                <GlobalLink href={url} key={city.city_code  || index}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow px-3 md:px-5 py-2 md:py-4 relative border">
                    <div className="flex items-center justify-between pb-2">
                        <span className="text-md md:text-lg font-semibold text-gray-900 capitalize">{city.city_name}</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                            <GoShareAndroid />
                        </button>
                    </div>                
                    <div className="relative border rounded-lg p-1 overflow-hidden">
                      <img
                        src="/images/city-edition-news.webp"
                        alt={`दैनिक जागरण ${city.city_name}`}
                        className="w-full h-45 object-cover"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                      </button>
                        <div className="absolute bottom-0 left-0 text-white text-sm rounded w-full">
                        <div className="mt-2 bg-black/60 text-white text-sm px-3 py-1 rounded-bl rounded-br">
                            {formattedDate}
                        </div>
                        </div>                  
                    </div>
                  </div>
                </GlobalLink>
              );
            })}
          </div>
      </div>
    </section>
  );
}
