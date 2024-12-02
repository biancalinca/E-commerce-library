import React, { useEffect, useState } from 'react';
import SummaryApi from './../common/index';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Importă toate elementele necesare pentru grafice

const AdminStatistics = () => {
  const [stats, setStats] = useState({
    topProducts: [],
    topCategories: [],
    ordersByDate: [],
    conversionRate: 0,
    orderStatusCount: {},
    topBooksByCategory: {},
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(SummaryApi.statisticsAdmin.url, {
        method: SummaryApi.statisticsAdmin.method,
        credentials: 'include',
      });
      const dataResponse = await response.json();
      console.log("Răspuns API:", dataResponse);  // Log pentru debugging

      if (dataResponse.success) {
        setStats(dataResponse.data); // Setează datele statistice în stare
      } else {
        console.error('Error fetching statistics:', dataResponse.message);
      }
    } catch (err) {
      console.error('Eroare la apelul API:', err);
    }
  };

  // Configurarea datelor pentru grafice
  const topProductsData = {
    labels: stats.topProducts.map(product => product.name),
    datasets: [{
      label: 'Număr de vânzări',
      data: stats.topProducts.map(product => product.quantitySold),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      borderRadius: 8, // Colțuri rotunjite
    }],
  };

  const topCategoriesData = {
    labels: stats.topCategories.map(category => category.category),
    datasets: [{
      label: 'Vânzări totale (Lei)',
      data: stats.topCategories.map(category => category.totalSales),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  // Sortăm datele ordersByDate de la vechi la nou
  const sortedOrdersByDate = [...stats.ordersByDate].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Date pentru graficul de "Comenzi în Timp"
  const ordersOverTimeData = {
    labels: sortedOrdersByDate.map(order => order.date),
    datasets: [{
      label: 'Total Vânzări (Lei)',
      data: sortedOrdersByDate.map(order => order.totalSales.toFixed(2)),
      backgroundColor: '#36A2EB',
      borderWidth: 2,
      borderColor: '#36A2EB',
      tension: 0.3, // Linii netede pentru graficul de linie
    }, {
      label: 'Total Comenzi',
      data: sortedOrdersByDate.map(order => order.totalOrders),
      backgroundColor: '#FF6384',
      borderWidth: 2,
      borderColor: '#FF6384',
      tension: 0.3,
    }],
  };

  const orderStatusData = {
    labels: Object.keys(stats.orderStatusCount),
    datasets: [{
      label: 'Status comenzi',
      data: Object.values(stats.orderStatusCount),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const conversionRateData = {
    labels: ['Utilizatori ce au plasat comenzi', 'Utilizatori ce NU au plasat comenzi'],
    datasets: [{
      data: [(stats.conversionRate * 100).toFixed(2), (100 - (stats.conversionRate * 100)).toFixed(2)],
      backgroundColor: ['#4BC0C0', '#FF9F40'],
      hoverBackgroundColor: ['#4BC0C0', '#FF9F40'],
      borderWidth: 2,
    }],
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">Statistici Comenzi</h2>

      {/* Container pentru Top Produse Vândute */}
      <div className="flex mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="w-1/2 pr-4">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Top Cărți Vândute</h3>
          <ul className="space-y-2">
            {stats.topProducts.slice(0, 5).map((product, index) => (
              <li key={index} className="text-lg text-gray-600 font-semibold">
                <span className=" mr-2">{index + 1}.</span>{product.name || "Produs necunoscut"} - {product.quantitySold} vândute
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <Bar data={topProductsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Container pentru Categoriile Cele Mai Populare */}
      <div className="flex mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="w-1/2 pr-4">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Categoriile Cele Mai Populare</h3>
          <ul className="space-y-2">
            {stats.topCategories.slice(0, 5).map((category, index) => (
              <li key={index} className="text-lg capitalize text-gray-600 font-semibold">
                <span className=" mr-2">{index + 1}.</span>{category.category || "Categorie necunoscută"} - {category.totalSales.toFixed(2)} Lei
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <Bar data={topCategoriesData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Container pentru Statistici Comenzi pe Bază de Timp */}
      <div className="flex mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="w-1/2 pr-4">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Statistici Comenzi pe Bază de Timp</h3>
          <ul className="space-y-2">
            {sortedOrdersByDate.map((order, index) => (
              <li key={index} className="text-lg text-gray-600">
                {order.date}: {order.totalOrders} comenzi, {order.totalSales.toFixed(2)} Lei
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <Line data={ordersOverTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Container pentru Rata de Conversie */}
      <div className="flex mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="w-1/2 pr-4">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Rata de Achiziție a utilizatorilor</h3>
          <p className="text-3xl font-bold mb-2 leading text-green-600 mt-10 ml-9 ">{(stats.conversionRate * 100).toFixed(2)}%</p>
        </div>
        <div className="w-1/2">
          <Pie data={conversionRateData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Container pentru Distribuția Statusului Comenzilor */}
      {/* <div className="flex mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="w-1/2 pr-4">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Distribuția Statusului Comenzilor</h3>
          <ul className="space-y-2">
            {Object.entries(stats.orderStatusCount).map(([status, count]) => (
              <li key={status} className="text-lg capitalize text-gray-600">
                {status}: {count} comenzi
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <Doughnut data={orderStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div> */}

      {/* Container pentru Top 3 Cărți din Fiecare Categorie */}
      <div className="mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Top 3 Cărți din Fiecare Categorie</h3>
        {stats.topBooksByCategory && Object.keys(stats.topBooksByCategory).length > 0 ? (
          Object.entries(stats.topBooksByCategory).map(([category, books], index) => {
            const data = {
              labels: books.map(book => book.name),
              datasets: [{
                label: `Top 3 Cărți din ${category}`,
                data: books.map(book => book.quantitySold),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderRadius: 8,
              }]
            };

            return (
              <div key={index} className="flex mb-4">
                <div className="w-1/2 pr-4">
                  <h4 className="text-2xl font-semibold capitalize text-gray-700">{category}</h4>
                  <ul className="space-y-2">
                    {books.map((book, i) => (
                      <li key={i} className="text-xl text-gray-600 mt-2">
                        <span className=" mr-2">{i + 1}.</span>{book.name} - {book.quantitySold} vândute
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-1/2">
                  <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-lg text-gray-600">Nu există cărți vândute înregistrate pe categorii.</p>
        )}
      </div>
    </div>
  );
};

export default AdminStatistics;
