const validateRequiredAnswers = (
  questions,
  answers
) => {
  const errors = [];

  questions.forEach((question) => {
    if (!question.required) {
      return;
    }

    const value = answers[question.id];

    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      errors.push({
        questionId: question.id,
        message: `${question.label} is required`,
      });
    }
  });

  return errors;
};

export default validateRequiredAnswers;