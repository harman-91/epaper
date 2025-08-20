'use client';

import React, { useState } from 'react';
import styles from '../../../styles/CitySelection.module.css';

export default function CitySelection({ showCitySelection, setShowCitySelection }) {
  const [activeCity, setActiveCity] = useState(null);

  const cities = [
    {
      name: "Delhi",
      editions: ["Delhi", "Delhi City", "South Delhi City", "West Delhi City", "East Delhi City", "North Delhi City"]
    },
    {
      name: "Mumbai",
      editions: ["Mumbai", "Mumbai City", "Powai Mumbai City", "South Mumbai City", "West Mumbai City"]
    },
    {
      name: "Chandigarh",
      editions: ["Chandigarh", "Chandigarh City", "Chandigarh Live"]
    },
    {
      name: "Lucknow",
      editions: ["Lucknow", "Lucknow City"]
    }
  ];

  const toggleAccordion = (city) => {
    setActiveCity(activeCity === city ? null : city);
  };

  return (
    <>
      {/* Overlay to close on click */}
      {showCitySelection && (
        <div className={styles.overlay} onClick={() => setShowCitySelection(false)}></div>
      )}

      {/* City Selection Modal */}
      <div className={`${styles.city} ${showCitySelection ? styles.show : ''}`}>
        <button className={styles.closeBtn} onClick={() => setShowCitySelection(false)}>×</button>
        <div className={styles.cityHeader}>
          <h4>Select City</h4>
        </div>

        <div className={styles.cityContent}>
          {cities.map((city, index) => (
            <div key={index} className={styles.accordionItem}>
              <button
                className={`${styles.accordionButton} ${activeCity === city.name ? styles.active : ''}`}
                onClick={() => toggleAccordion(city.name)}
              >
                {city.name}
              </button>

              {activeCity === city.name && (
                <div className={styles.accordionBody}>
                  <ul>
                    {city.editions.map((edition, idx) => (
                      <li key={idx}>
                        <label>
                          <input type="radio" name="city" value={edition} />
                          {edition}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}



// import React from 'react';
// import Styles from '../../../styles/CityModal.module.css'
// export default function CitySelection({ showCitySelection, setShowCitySelection }) {
//   if (!showCitySelection) return null;

//   return (
//     <>
//       {/* Overlay */}
//       <div className={Styles.overlay} onClick={() => setShowCitySelection(false)}></div>

//       {/* City Selection Box */}
//       <div className={Styles.city} id="cityBox">
//         <div className={Styles.cityHeader}>
//           <h3>CITY</h3>
//         </div>
//         <div className={Styles.cityContent}>
//           <div className={Styles.accordion} id="editionAccordion">
            
//             {/* Delhi */}
//             <div className={Styles.accordionItem}>
//               <h2 className={`${Styles.accordionHeader} ${Styles.active}`} id="heading0">
//                 <button type="button" data-bs-toggle="collapse" data-bs-target="#collapse0" aria-controls="collapse0" editionid="1" aria-expanded="false" className={Styles.accordionButton}>Delhi</button>
//               </h2>
//               <div className={`${Styles.accordionCollapse} ${Styles.collapse} ${Styles.show}`} id="collapse0">
//                 <div className={Styles.accordionBody}>
//                   <ul>
//                     <li><label><input type="radio" name="city" value="Delhi" />Delhi</label></li>
//                     <li><label><input type="radio" name="city" value="Delhi City" />Delhi City</label></li>
//                     <li><label><input type="radio" name="city" value="South Delhi City" />South Delhi City</label></li>
//                     <li><label><input type="radio" name="city" value="West Delhi City" />West Delhi City</label></li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Mumbai */}
//             <div className={Styles.accordionItem}>
//               <h2 className={`${Styles.accordionHeader}`} id="heading1">
//                 <button type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-controls="collapse1" className={`${Styles.accordionButton} ${Styles.collapsed}`} aria-expanded="true">Mumbai</button>
//               </h2>
//               <div className={`${Styles.accordionCollapse} ${Styles.collapse}`} id="collapse1">
//                 <div className={`${Styles.accordionBody}`}>
//                   <ul>
//                     <li><label><input type="radio" name="city" value="Mumbai" />Mumbai</label></li>
//                     <li><label><input type="radio" name="city" value="Mumbai City" />Mumbai City</label></li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Chandigarh */}
//             <div className={Styles.accordionItem}>
//               <h2 className={`${Styles.accordionHeader}`} id="heading2">
//                 <button type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-controls="collapse2" className={`${Styles.accordionButton} ${Styles.collapsed}`} aria-expanded="true">Chandigarh</button>
//               </h2>
//               <div className={`${Styles.accordionCollapse} ${Styles.collapse}`} id="collapse2">
//                 <div className={`${Styles.accordionBody}`}>
//                   <ul>
//                     <li><label><input type="radio" name="city" value="Chandigarh" />Chandigarh</label></li>
//                     <li><label><input type="radio" name="city" value="Chandigarh City" />Chandigarh City</label></li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Lucknow */}
//             <div className={`${Styles.accordionItem}`}>
//               <h2 className={`${Styles.accordionHeader}`} id="heading3">
//                 <button type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-controls="collapse3" className={`${Styles.accordionButton} ${Styles.collapsed}`} aria-expanded="true">Lucknow</button>
//               </h2>
//               <div className={`${Styles.accordionCollapse} ${Styles.collapse}`} id="collapse3">
//                 <div className={`${Styles.accordionBody}`}>
//                   <ul>
//                     <li><label><input type="radio" name="city" value="Lucknow" />Lucknow</label></li>
//                     <li><label><input type="radio" name="city" value="Lucknow City" />Lucknow City</label></li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
