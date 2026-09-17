import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import BulkApply from "./pages/BulkApply";
import Applications from "./pages/Application";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Jobs />} />

          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />

          <Route
            path="/jobs/:id/apply"
            element={<Apply />}
          />

          <Route
            path="/bulk-apply"
            element={<BulkApply />}
          />

          <Route
            path="/applications"
            element={<Applications />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;