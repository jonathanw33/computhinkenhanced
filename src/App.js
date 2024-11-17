import { Route, Routes } from 'react-router-dom';
import ErrorPage from './components/Pages/ErrorPage';
// import Home from './components/Pages/Home';
import Home from './components/Pages/Home';
import Layout from './components/Layout';
import Material from './components/Pages/Material'; // Import your Tes component
import Maze from './components/Pages/Maze';  // Import the Maze page component
import Quiz from './components/Pages/QuizComponent';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Layout headerVariant="cs-site_header_full_width" />}
        >
          <Route index element={<Home />} />
          
          
          <Route path="/material" element={<Material />} />
          <Route path="/maze" element={<Maze />} />
          <Route path="/quiz" element={<Quiz />} />

          <Route path="/coming-soon" element={<ErrorPage />} />
        </Route>



        {/* 404 route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
