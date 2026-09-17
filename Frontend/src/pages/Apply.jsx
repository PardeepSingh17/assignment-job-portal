import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import QuestionRenderer from "../components/QuestionRenderer";
import validateRequiredAnswers from "../Utils/validateRequiredAnswers";

function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${id}`);

        setJob(response.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch job"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Frontend required-field validation
    const requiredErrors = validateRequiredAnswers(
      job.questions,
      answers
    );

    if (requiredErrors.length > 0) {
      setError(requiredErrors[0].message);
      return;
    }

    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(
        answers
      ).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      const response = await api.post(
        `/jobs/${id}/apply`,
        {
          applicantId: "6aabd9fb63967c27d92d051f",
          answers: formattedAnswers,
        }
      );

      setSuccess(response.data.message);
    } catch (error) {
      console.error(error);

      const backendErrors =
        error.response?.data?.errors;

      if (backendErrors?.length > 0) {
        setError(backendErrors[0].message);
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to submit application"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading application form...</p>;
  }

  if (error && !job) {
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

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(`/jobs/${id}`)}>
        ← Back to Job
      </button>

      <h1>Apply for {job.title}</h1>

      <p>{job.company}</p>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <h2>Application Submitted! 🎉</h2>

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
          {job.questions.map((question) => (
            <div
              className="question"
              key={question.id}
            >
              <QuestionRenderer
                question={question}
                value={answers[question.id]}
                onChange={handleAnswerChange}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Apply;