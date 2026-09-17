import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${id}`);

        setJob(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <p>Loading job...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={() => navigate("/")}>
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/")}>
        ← Back to Jobs
      </button>

      <h1>{job.title}</h1>

      <h2>{job.company}</h2>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>{job.description}</p>

      <h2>Application Questions</h2>

      {job.questions.map((question) => (
        <div key={question.id}>
          <p>
            <strong>{question.label}</strong>
          </p>

          <p>Type: {question.type}</p>

          {question.required && <p>Required</p>}
        </div>
      ))}

      <button
        onClick={() => navigate(`/jobs/${job.id}/apply`)}
      >
        Apply
      </button>
    </div>
  );
}

export default JobDetails;