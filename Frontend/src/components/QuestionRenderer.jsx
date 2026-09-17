function QuestionRenderer({ question, value, onChange }) {
  const handleChange = (newValue) => {
    onChange(question.id, newValue);
  };

  switch (question.type) {
    case "text":
      return (
        <div>
          <label>
            {question.label}
            {question.required && " *"}
          </label>

          <input
            type="text"
            value={value || ""}
            onChange={(event) =>
              handleChange(event.target.value)
            }
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label>
            {question.label}
            {question.required && " *"}
          </label>

          <textarea
            value={value || ""}
            onChange={(event) =>
              handleChange(event.target.value)
            }
          />
        </div>
      );

    case "number":
      return (
        <div>
          <label>
            {question.label}
            {question.required && " *"}
          </label>

          <input
            type="number"
            value={value ?? ""}
            onChange={(event) => {
              const inputValue = event.target.value;

              handleChange(
                inputValue === ""
                  ? ""
                  : Number(inputValue)
              );
            }}
          />
        </div>
      );

    case "dropdown":
      return (
        <div>
          <label>
            {question.label}
            {question.required && " *"}
          </label>

          <select
            value={value || ""}
            onChange={(event) =>
              handleChange(event.target.value)
            }
          >
            <option value="">Select an option</option>

            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
      return (
        <div>
          <p>
            {question.label}
            {question.required && " *"}
          </p>

          {question.options?.map((option) => {
            const selectedOptions = value || [];

            return (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      handleChange([
                        ...selectedOptions,
                        option,
                      ]);
                    } else {
                      handleChange(
                        selectedOptions.filter(
                          (item) => item !== option
                        )
                      );
                    }
                  }}
                />

                {option}
              </label>
            );
          })}
        </div>
      );

    case "boolean":
      return (
        <div>
          <p>
            {question.label}
            {question.required && " *"}
          </p>

          <label>
            <input
              type="radio"
              name={question.id}
              checked={value === true}
              onChange={() => handleChange(true)}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name={question.id}
              checked={value === false}
              onChange={() => handleChange(false)}
            />
            No
          </label>
        </div>
      );

    default:
      return (
        <p>
          Unsupported question type: {question.type}
        </p>
      );
  }
}

export default QuestionRenderer;