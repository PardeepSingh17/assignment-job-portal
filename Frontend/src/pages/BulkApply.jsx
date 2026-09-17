import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";
import QuestionRenderer from "../components/QuestionRenderer";
import validateRequiredAnswers from "../Utils/validateRequiredAnswers";

function BulkApply() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const jobIds =
    searchParams.get("jobs")?.split(",") || [];

  useEffect(() => {
    const fetchSelectedJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const responses = await Promise.all(
          jobIds.map((jobId) =>
            api.get(`/jobs/${jobId}`)
          )
        );

        const selectedJobs = responses.map(
          (response) => response.data.data
        );

        setJobs(selectedJobs);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch selected jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobIds.length === 0) {
      setError("No jobs selected");
      setLoading(false);
      return;
    }

    fetchSelectedJobs();
  }, []);

  const handleAnswerChange = (
    jobId,
    questionId,
    value
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [jobId]: {
        ...previousAnswers[jobId],
        [questionId]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Frontend required-field validation
    for (const job of jobs) {
      const jobAnswers = answers[job.id] || {};

      const requiredErrors =
        validateRequiredAnswers(
          job.questions,
          jobAnswers
        );

      if (requiredErrors.length > 0) {
        setError(
          `${job.title}: ${requiredErrors[0].message}`
        );

        return;
      }
    }

    try {
      setSubmitting(true);

      const applications = jobs.map((job) => {
        const jobAnswers = answers[job.id] || {};

        const formattedAnswers = Object.entries(
          jobAnswers
        ).map(([questionId, value]) => ({
          questionId,
          value,
        }));

        return {
          jobId: job.id,
          answers: formattedAnswers,
        };
      });

      const response = await api.post(
        "/applications/bulk",
        {
          applicantId: "6aabd9fb63967c27d92d051f",
          applications,
        }
      );

      setSuccess(response.data.message);
    } catch (error) {
      console.error(error);

      const backendErrors =
        error.response?.data?.errors;

      if (backendErrors?.length > 0) {
        const errorMessages = backendErrors
          .map((item) => {
            if (item.details?.length > 0) {
              return `${item.jobId}: ${item.details[0].message}`;
            }

            return `${item.jobId}: ${item.message}`;
          })
          .join(" | ");

        setError(errorMessages);
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to submit applications"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading selected jobs...</p>;
  }

  if (error && jobs.length === 0) {
    return (
      <div>
        <div className="error-message">
          <p>{error}</p>
        </div>

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

      <h1>Apply to All Selected Jobs</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <h2>Applications Submitted! 🎉</h2>

          <p>{success}</p>

          <button
            onClick={() => navigate("/applications")}
          >
            View My Applications
          </button>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          {jobs.map((job) => (
            <div
              className="form-section"
              key={job.id}
            >
              <h2>{job.title}</h2>

              <h3>{job.company}</h3>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>{job.description}</p>

              <h3>Application Questions</h3>

              {job.questions.map((question) => (
                <div
                  className="question"
                  key={question.id}
                >
                  <QuestionRenderer
                    question={question}
                    value={
                      answers[job.id]?.[
                        question.id
                      ]
                    }
                    onChange={(
                      questionId,
                      value
                    ) =>
                      handleAnswerChange(
                        job.id,
                        questionId,
                        value
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit All Applications"}
          </button>
        </form>
      )}
    </div>
  );
}

export default BulkApply;