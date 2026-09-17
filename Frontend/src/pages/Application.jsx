import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applicantId = "6aabd9fb63967c27d92d051f";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/applications", {
          params: {
            applicantId,
          },
        });

        setApplications(response.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [applicantId]);

  if (loading) {
    return <p>Loading applications...</p>;
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

  return (
    <div>
      <button onClick={() => navigate("/")}>
        ← Back to Jobs
      </button>

      <h1>My Applications</h1>

      {applications.length === 0 && (
        <p>You haven't applied to any jobs yet.</p>
      )}

      {applications.map((application) => (
        <div
          className="application-card"
          key={application._id}
        >
          <hr />

          <h2>{application.job.title}</h2>

          <h3>{application.job.company}</h3>

          <p>
            <strong>Location:</strong>{" "}
            {application.job.location}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span className="status">
              {application.status}
            </span>
          </p>

          <p>
            <strong>Applied:</strong>{" "}
            {new Date(
              application.createdAt
            ).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Applications;