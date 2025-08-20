"use client";

import React, { useState, useEffect } from "react";

export default function CityModal({ show, handleClose, selectedCities, setSelectedCities, favoriteCities }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [activeLetter, setActiveLetter] = useState("All");
  const [citiesList, setCitiesList] = useState([]);


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
      // Add main city
      if (stateData.main_city && stateData.main_city.city_name) {
        cities.push({
          name: stateData.main_city.city_name,
          code: stateData.main_city.code,
          letter: stateData.main_city.city_name.charAt(0).toUpperCase(),
          isMainCity: true,
          state: stateData.state_name
        });
      }
      
      // Add other cities
      if (stateData.cities && Array.isArray(stateData.cities)) {
        stateData.cities.forEach(city => {
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
    
    // Sort cities alphabetically
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
    if (selectedCities.includes(cityName)) {
      if (selectedCities.length > 2) {
        setSelectedCities(selectedCities.filter((city) => city !== cityName));
      }
    } else {
      if (selectedCities.length < 2) {
        setSelectedCities([...selectedCities, cityName]);
      } else {
        const cityToReplace = window.confirm(
          `Replace "${selectedCities[0]}" with "${cityName}"? Click OK to replace, Cancel to replace "${selectedCities[1]}".`
        );
        if (cityToReplace) {
          setSelectedCities([cityName, selectedCities[1]]);
        } else {
          setSelectedCities([selectedCities[0], cityName]);
        }
      }
    }
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
            Change City: <span>{selectedCities[0] || "None"}</span>
          </h5>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Alphabet Navigation */}
        <div className="flex flex-wrap justify-center gap-1 p-2 border-b border-gray-100">
          <button
            onClick={() => setActiveLetter("All")}
            className={`px-2 py-1 text-sm font-medium rounded ${
              activeLetter === "All" 
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
              className={`px-2 py-1 text-sm font-medium rounded ${
                activeLetter === letter 
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
              <div key={letter} className="mb-10 flex flex-wrap gap-5">
                <h5 className="w-full text-base font-bold text-gray-900">{letter}</h5>
                {filteredCities
                  .filter(city => city.letter === letter)
                  .map(city => (
                    <label
                      key={`${city.name}-${city.code}`}
                      className={`flex items-center p-2 cursor-pointer ${
                        selectedCities.includes(city.name) ? "bg-gray-100 rounded" : ""
                      }`}
                    >
                      <div className="round flex items-center text-sm">
                        <span className="flex flex-col">
                          <span className="font-medium">{city.name}</span>

                        </span>
                        <input
                          type="checkbox"
                          id={`checkbox-${city.name}-${city.code}`}
                          checked={selectedCities.includes(city.name)}
                          onChange={() => handleCitySelection(city.name)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`checkbox-${city.name}-${city.code}`}
                          className="ml-2 w-4 h-4 border border-gray-300 rounded-full cursor-pointer relative"
                        ></label>
                      </div>
                    </label>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="text-center p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Click to make <span className="font-medium">{selectedCities[0] || "None"}</span> your default city.
          </p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition min-w-[120px]"
              onClick={handleClose}
            >
              Confirm
            </button>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition min-w-[120px]"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}