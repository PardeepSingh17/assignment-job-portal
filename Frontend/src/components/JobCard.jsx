function JobCard({
  job,
  onView,
  selected,
  onSelect,
}) {
  return (
    <div className="job-card">
      <label>
        <input
          className="job-card-checkbox"
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(job.id)}
        />

        Select for Apply to All
      </label>

      <h2>{job.title}</h2>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>{job.description}</p>

      <div className="job-actions">
        <button onClick={() => onView(job.id)}>
          View Job
        </button>
      </div>
    </div>
  );
}

export default JobCard;