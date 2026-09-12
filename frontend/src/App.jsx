import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Difference from './pages/Difference';
import Home from './pages/Home';
import Launchpad from './pages/Launchpad';

export default function App() {
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
