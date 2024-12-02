// src/components/ContactPage.js

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 44.4452018979508, // Coordonatele locației fictive (București)
  lng: 26.093730048846545,
};

const ContactPage = () => {
  const [selected, setSelected] = useState(false); // Control pentru afișarea InfoWindow

  // Definirea iconiței marker-ului după ce se încarcă Google Maps
  const markerIcon = {
    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // URL iconiță marker roșu
    scaledSize: { width: 40, height: 40 }, // Dimensiunea iconiței
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Despre noi și unde ne puteți găsi</h1>

      {/* Container pentru conținut: Flexbox cu două coloane */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full max-w-8xl">
        
        {/* Informații de contact - coloana stângă */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 mb-8 md:mb-0 md:mr-8">
          <h2 className="text-2xl font-bold mb-4">Bookish Boutique</h2>
          <p className="mb-2">
            <strong>Adresă:</strong> Strada Fictivă nr. 10, București, România
          </p>
          <p className="mb-2">
            <strong>Telefon:</strong> +40 123 456 789
          </p>
          <p className="mb-2">
            <strong>Email:</strong> contact@bookishboutique.ro
          </p>
          <p className="mb-2">
            <strong>Program:</strong> Luni - Vineri: 09:00 - 18:00
          </p>

          {/* Informații suplimentare */}
          <h3 className="text-xl font-semibold mt-6 mb-2">Despre noi</h3>
          <p className="mb-4 text-justify">
            Bookish Boutique este o librărie online dedicată iubitorilor de cărți. De la cele mai recente bestseller-uri la literatură clasică, oferim o gamă largă de titluri pentru toate gusturile. Misiunea noastră este să aducem bucuria lecturii mai aproape de fiecare cititor.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Livrare și returnări</h3>
          <p className="mb-4 text-justify">
            Oferim livrare gratuită pentru toate comenzile de peste 150 RON. Comenzile sunt procesate și livrate în termen de 2-5 zile lucrătoare. Dacă nu sunteți mulțumit de achiziția dvs., puteți returna orice articol în termen de 30 de zile pentru o rambursare completă.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Politica de confidențialitate</h3>
          <p className="mb-4 text-justify">
            La Bookish Boutique, respectăm confidențialitatea clienților noștri. Informațiile dvs. personale vor fi folosite doar pentru a procesa comenzile și pentru a vă oferi o experiență mai bună. Nu vom împărtăși niciodată datele dvs. cu terți fără consimțământul dvs.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Echipa noastră</h3>
          <p className="mb-4 text-justify">
            Echipa noastră este formată din pasionați de lectură care își doresc să împărtășească dragostea pentru cărți cu lumea. Suntem aici să vă ajutăm să găsiți cartea perfectă și să vă oferim recomandări personalizate.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Cum să ajungi la noi</h3>
          <p className="mb-4 text-justify">
            Ne aflăm în inima Bucureștiului, ușor accesibili cu transportul public sau cu mașina. Stația de metrou Piața Unirii este la doar câteva minute de mers pe jos. Puteți folosi harta de mai jos pentru a vedea locația noastră exactă.
          </p>
        </div>

        {/* Harta Google Maps - coloana dreaptă */}
        <div className="w-full md:w-1/2">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
            >
              {/* Marker stilizat pentru locație */}
              <Marker
                position={center}
                icon={markerIcon} // Setare iconiță personalizată
                onClick={() => setSelected(!selected)} // Afișează InfoWindow la clic
              />
              {selected && (
                <InfoWindow
                  position={center}
                  onCloseClick={() => setSelected(false)} // Închide InfoWindow
                >
                  <div className="w-64 p-2">
                    <h4 className="font-bold text-lg">Bookish Boutique</h4>
                    <p className="text-sm mt-1">Ne găsești aici!</p>
                    <p className="text-sm mt-1">Strada Fictivă nr. 10, București, România</p>
                    <p className="text-sm mt-1">Telefon: +40 123 456 789</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
