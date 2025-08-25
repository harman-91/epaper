"use client";

import React, { useState, useEffect } from "react";
import { sendPersonalizedCategory, getPersonalizedCategory } from '@/services/personalizeCategoryService';
import { useSelector } from "react-redux";
import { genrateurl } from "@/component/utility/CommonUtils";

export default function CityModal({ show, handleClose, selectedCities, setSelectedCities, favoriteCities, editingCityIndex }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [activeLetter, setActiveLetter] = useState("All");
  const [citiesList, setCitiesList] = useState([]);
  const [tempSelectedCities, setTempSelectedCities] = useState(selectedCities);
  const userDetail = useSelector((state) => state.userData.user);
  const isLoggedIn = useSelector((state) => state.userData.showLogin);

  // Initialize tempSelectedCities when modal opens or selectedCities changes
  useEffect(() => {
    if (show) {
      setTempSelectedCities(selectedCities);
    }
  }, [show, selectedCities]);

  // Transform favoriteCities prop to cities list when it changes
  useEffect(() => {
    if (favoriteCities && Array.isArray(favoriteCities)) {
      const transformedCities = transformApiDataToCitiesList(favoriteCities);
      setCitiesList(transformedCities);
    }
  }, [favoriteCities]);

  // Transform favoriteCities prop data to cities list with letters
  const transformApiDataToCitiesList = (apiData) => {
    const cities = [];

    apiData.forEach(stateData => {
      if (stateData.regions && Array.isArray(stateData.regions)) {
        stateData.regions.forEach(region => {
          if (region.cities && Array.isArray(region.cities)) {
            region.cities.forEach(city => {
              cities.push({
                name: city.city_name,
                code: city.code,
                letter: city.city_name.charAt(0).toUpperCase(),
                isMainCity: false,
                state: stateData.state_name
              });
            });
          }
        });
      }
    });

    return cities.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Filter cities based on search term and active letter
  useEffect(() => {
    let filtered = citiesList.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeLetter !== "All") {
      filtered = filtered.filter(city => city.letter === activeLetter);
    }

    setFilteredCities(filtered);
  }, [searchTerm, activeLetter, citiesList]);

  const handleCitySelection = (cityName) => {
    // Check if the city is already selected
    if (tempSelectedCities.includes(cityName)) {
      // Unselect the city (remove it from tempSelectedCities)
      setTempSelectedCities(tempSelectedCities.filter((city) => city !== cityName));
    } else {
      // If in editing mode, replace the city at editingCityIndex
      if (editingCityIndex !== null) {
        const newTempSelectedCities = [...tempSelectedCities];
        newTempSelectedCities[editingCityIndex] = cityName;
        setTempSelectedCities(newTempSelectedCities.filter(city => city)); // Remove any null/empty entries
      } else {
        // Normal selection logic (max 2 cities)
        if (tempSelectedCities.length < 2) {
          setTempSelectedCities([...tempSelectedCities, cityName]);
        } else {
          const cityToReplace = window.confirm(
            `Replace "${tempSelectedCities[0]}" with "${cityName}"? Click OK to replace, Cancel to replace "${tempSelectedCities[1]}".`
          );
          if (cityToReplace) {
            setTempSelectedCities([cityName, tempSelectedCities[1]]);
          } else {
            setTempSelectedCities([tempSelectedCities[0], cityName]);
          }
        }
      }
    }
  };

  // Handle Confirm button click
  const handleConfirm = async () => {
    try {
      // Get city codes for the selected cities
      const selectedCityCodes = tempSelectedCities
        .map(cityName => {
          const city = citiesList.find(c => c.name === cityName);
          return city ? city.code : null;
        })
        .filter(code => code !== null);

      await sendPersonalizedCategory({
        domain_url: "epaper.naidunia.com",
        ids: selectedCityCodes,
        token: userDetail.auth_token
      });

      const personalizedData = await getPersonalizedCategory({
        domain_url: "epaper.naidunia.com",
        token: userDetail.auth_token
      });

      // City codes from API
      const cityCodesFromApi = personalizedData?.data?.epaperPersonalizationData?.map(item => item.selected_id) || selectedCityCodes;

      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      cityCodesFromApi.forEach(code => {
        const city = citiesList.find(c => c.code == code);
        const citySlug = city?.name.toLowerCase().replace(/\s+/g, '-') || 'default-city';

        const generatedUrl = genrateurl({
          date: currentDate,
          cityCode: code,
          citySlug: citySlug,
        });
      });

      // Update parent state with selected cities
      setSelectedCities(tempSelectedCities);
      handleClose();
    } catch (error) {
      handleClose();
    }
  };

  const handleCancel = () => {
    setTempSelectedCities(selectedCities); // Reset temp state
    handleClose();
  };

  // Get unique letters from cities list
  const getAvailableLetters = () => {
    const letters = [...new Set(citiesList.map(city => city.letter))];
    return letters.sort();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-lg animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h5 className="text-lg font-semibold text-gray-800">
            {editingCityIndex !== null
              ? `Change City: ${tempSelectedCities[editingCityIndex] || "None"}`
              : `Select Cities (Max 2)`}
          </h5>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ border: '#aaa solid 1px' }}
          />
        </div>

        {/* Alphabet Navigation */}
        <div className="flex flex-wrap justify-center gap-1 p-2 border-b border-gray-100">
          <button
            onClick={() => setActiveLetter("All")}
            className={`px-1 py-1 text-sm font-medium rounded ${activeLetter === "All"
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
          >
            All
          </button>
          {getAvailableLetters().map((letter) => (
            <button
              key={letter}
              onClick={() => setActiveLetter(letter)}
              className={`px-1 py-1 text-sm font-medium rounded ${activeLetter === letter
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* City List */}
        <div className="max-h-96 overflow-y-auto p-4">
          {!favoriteCities || favoriteCities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No cities data available</p>
            </div>
          ) : filteredCities.length === 0 ? (
            <p className="text-gray-600 text-center">No cities found</p>
          ) : (
            [...new Set(filteredCities.map(city => city.letter))].sort().map(letter => (
              <div key={letter} className="mb-2 flex flex-wrap">
                <h5 className="w-full text-base font-bold text-gray-900">{letter}</h5>
                {filteredCities
                  .filter(city => city.letter === letter)
                  .map(city => (
                    <div
                      key={`${city.name}-${city.code}`}
                      className={`flex items-center p-2 cursor-pointer rounded ${tempSelectedCities.includes(city.name) ? "bg-blue-100" : "hover:bg-gray-100"}`}
                      onClick={() => handleCitySelection(city.name)}
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${city.name}-${city.code}`}
                        checked={tempSelectedCities.includes(city.name)}
                        onChange={() => handleCitySelection(city.name)}
                        className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="font-medium">{city.name}</span>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="text-center p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            {editingCityIndex !== null
              ? `Select: ${tempSelectedCities[editingCityIndex] || "None"} to replace`
              : `Selected: ${tempSelectedCities.join(", ") || "None"}`}
          </p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition min-w-[120px]"
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition min-w-[120px]"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}