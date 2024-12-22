import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';

const AppRoutes = () => {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/askchefgpt" element={<App />} />
          </Routes>
        </BrowserRouter>
      );
}

export default AppRoutes;