import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import JobCard from "../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs", {
        params: {
          search,
          location,
        },
      });

      setJobs(response.data.data);

      // Clear previous selections when the job list changes
      setSelectedJobs([]);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchJobs();
  };

  const handleJobSelect = (jobId) => {
    setSelectedJobs((previousSelected) => {
      if (previousSelected.includes(jobId)) {
        return previousSelected.filter(
          (id) => id !== jobId
        );
      }

      return [...previousSelected, jobId];
    });
  };

  return (
    <div>
      <h1 className="page-title">
        Find Your Next Opportunity
      </h1>

      <form
        className="search-form"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      {selectedJobs.length > 0 && (
        <button
          className="bulk-button"
          onClick={() =>
            navigate(
              `/bulk-apply?jobs=${selectedJobs.join(",")}`
            )
          }
        >
          Apply to All ({selectedJobs.length})
        </button>
      )}

      {loading && <p>Loading jobs...</p>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        jobs.length === 0 && (
          <p>No jobs found.</p>
        )}

      {!loading &&
        !error &&
        jobs.length > 0 && (
          <div className="job-list">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                selected={selectedJobs.includes(job.id)}
                onSelect={handleJobSelect}
                onView={(jobId) =>
                  navigate(`/jobs/${jobId}`)
                }
              />
            ))}
          </div>
        )}
    </div>
  );
}

export default Jobs;