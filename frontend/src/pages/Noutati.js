import React, { useContext, useEffect, useState } from 'react';

import VerticalCard from '../components/VerticalCard';  // Importăm VerticalCard

const Noutati = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);




  return (
    <div className='container mx-auto px-4 my-4'>
      <h2 className='text-2xl font-bold py-4 '>Noutăți</h2>
      {/* Folosim VerticalCard pentru afișarea produselor */}
      <VerticalCard loading={loading} data={data} />
    </div>
  );
};

export default Noutati;
