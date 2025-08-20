"use client";

import React, { useState, useEffect, useRef } from "react";

const CustomDropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term (name or hindiName)
  const filteredOptions = options.filter(
    (option) =>
      option?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      option?.hindiName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
  //  onSelect(option); // Pass the entire option object to the parent
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-44 font-sans" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 text-center border border-gray-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedOption ? (
          <span>
            {selectedOption.name} 
            {/* ({selectedOption.hindiName}) */}
          </span>
        ) : (
          <span>Location</span>
        )}
        {/* <span className="absolute right-2 top-1/2 -translate-y-1/2">
          {isOpen ? "▲" : "▼"}
        </span> */}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mb-2">
          {/* Search Input */}
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Options List */}
          <ul className="divide-y divide-gray-100">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option,index) => (
                <li
                  key={option.code+index}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  <span className="block">{option.name}</span>
                  <span className="text-sm text-gray-500">
                    {option.hindiName}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
