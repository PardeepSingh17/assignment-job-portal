const validateAnswers = (questions, submittedAnswers) => {
  const errors = [];

  const questionIds = submittedAnswers.map(
    (answer) => answer.questionId
  );

  const duplicateQuestionIds = questionIds.filter(
    (id, index) => questionIds.indexOf(id) !== index
  );

  if (duplicateQuestionIds.length > 0) {
    errors.push({
      message: "Duplicate question IDs are not allowed",
    });
  }

    // Convert submitted answers into a Map for quick lookup
    const answerMap = new Map(
      submittedAnswers.map((answer) => [
        answer.questionId,
        answer.value,
      ])
    );

  // Check each question defined by the job
  for (const question of questions) {
    const hasAnswer = answerMap.has(question.id);
    const value = answerMap.get(question.id);

    // Required question validation
    if (question.required && !hasAnswer) {
      errors.push({
        questionId: question.id,
        message: `${question.label} is required`,
      });

      continue;
    }

    // Optional question with no answer
    if (!hasAnswer) {
      continue;
    }

    // Empty values for required questions
    if (
      question.required &&
      (value === null ||
        value === undefined ||
        value === "")
    ) {
      errors.push({
        questionId: question.id,
        message: `${question.label} is required`,
      });

      continue;
    }

    // Type validation
    switch (question.type) {
      case "text":
      case "textarea":
        if (typeof value !== "string") {
          errors.push({
            questionId: question.id,
            message: `${question.label} must be text`,
          });
        }
        break;

      case "number":
        if (
          typeof value !== "number" ||
          Number.isNaN(value)
        ) {
          errors.push({
            questionId: question.id,
            message: `${question.label} must be a number`,
          });
        }
        break;

      case "dropdown":
        if (
          typeof value !== "string" ||
          !question.options.includes(value)
        ) {
          errors.push({
            questionId: question.id,
            message: `${question.label} has an invalid option`,
          });
        }
        break;

      case "checkbox":
        if (!Array.isArray(value)) {
          errors.push({
            questionId: question.id,
            message: `${question.label} must contain an array of options`,
          });

          break;
        }

        const invalidOptions = value.filter(
          (option) => !question.options.includes(option)
        );

        if (invalidOptions.length > 0) {
          errors.push({
            questionId: question.id,
            message: `${question.label} contains invalid options`,
          });
        }

        break;

      case "boolean":
        if (typeof value !== "boolean") {
          errors.push({
            questionId: question.id,
            message: `${question.label} must be true or false`,
          });
        }
        break;

      default:
        errors.push({
          questionId: question.id,
          message: `Unsupported question type: ${question.type}`,
        });
    }
  }

  // Check for answers belonging to questions
  // that don't exist in the job's questionnaire
  const validQuestionIds = new Set(
    questions.map((question) => question.id)
  );

  for (const answer of submittedAnswers) {
    if (!validQuestionIds.has(answer.questionId)) {
      errors.push({
        questionId: answer.questionId,
        message: "Question does not belong to this job",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = validateAnswers;