import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Difference from './pages/Difference';
import Home from './pages/Home';
import Launchpad from './pages/Launchpad';
import { useEffect, useState } from 'react';
import API from './api';

export default function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    API.get('/test-route') // حط هنا الـ Route اللي درتي فـ routes/api.php فـ Laravel
      .then(response => {
        console.log('Data from Laravel:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>الاتصال مع Laravel</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Launchpad />} />
          <Route path="/emballages" element={<Home />} />
          <Route path="/difference" element={<Difference />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
