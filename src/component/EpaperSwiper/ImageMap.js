// app/components/ImageMap.js
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './ImageMap.css'; // Optional: For styling

const ImageMap = () => {
  const router = useRouter();

  // Define map data as a variable
  const mapAreas = [
    {
      id: '1751',
      shape: 'rect',
      coords: '0.01786093056,244.9281024,72.585216,335.637504',
      href: '#',
      className: 'borderimage',
      showPopParams: ['162', '1751', '4', '2025-02-04', 1, 6],
      borderItParams: {
        mouseover: ['black', '1751', 5.31528, 7.2838, 0.000387607, 1.5752, '2025-02-04', 162, 1, 6],
        mouseout: ['white', '1751', 5.31528, 7.2838, 0.000387607, 1.5752, '2025-02-04', 162, 1, 6],
      },
    },
    {
      id: '1753',
      shape: 'rect',
      coords: '-0.837241344,-0.00943368192,585.1008,943.621632',
      href: '#',
      className: 'borderimage',
      showPopParams: ['162', '1753', '4', '2025-02-04', 1, 6],
      borderItParams: {
        mouseover: ['black', '1753', -0.000204724, 20.4779, -0.0181693, 12.6975, '2025-02-04', 162, 1, 6],
        mouseout: ['white', '1753', -0.000204724, 20.4779, -0.0181693, 12.6975, '2025-02-04', 162, 1, 6],
      },
    },
  ];

  // Placeholder for show_pop function
  const showPop = (param1, id, param3, date, param5, param6) => {
    // Example: Navigate or show a modal
    router.push(`/details/${id}?date=${date}`); // Replace with actual popup logic
    return false;
  };

  // Placeholder for borderit function
  const borderIt = (element, color, id, ...args) => {
    element.style.cursor = 'pointer';
    // Use a library like ImageMapster for visible highlights
  };

  // Attach global functions to window
  useEffect(() => {
    window.show_pop = showPop;
    window.borderit = borderIt;
  }, []);

  // Check for negative coordinates
  useEffect(() => {
    mapAreas.forEach((area) => {
      const coords = area.coords.split(',').map(Number);
      if (coords.some((coord) => coord < 0)) {
        console.warn(`Negative coordinates detected in area ID ${area.id}: ${area.coords}`);
      }
    });
  }, []);

  return (
    <div>
      <img
        src="/image.jpg" // Place image in public folder
        alt="Interactive image map"
        useMap="#Map"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <map name="Map">
        {mapAreas.map((area) => (
          <area
            key={area.id}
            id={area.id}
            shape={area.shape}
            coords={area.coords}
            href={area.href}
            className={area.className}
            onClick={() => showPop(...area.showPopParams)}
            onMouseOver={(e) => borderIt(e.target, ...area.borderItParams.mouseover)}
            onMouseOut={(e) => borderIt(e.target, ...area.borderItParams.mouseout)}
            alt={`Area ${area.id}`}
          />
        ))}
      </map>
    </div>
  );
};

export default ImageMap;