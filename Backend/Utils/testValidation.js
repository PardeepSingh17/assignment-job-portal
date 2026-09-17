const validateAnswers = require("./validateAnswer");

const questions = [
  {
    id: "q1",
    label: "Do you have a driver's license?",
    type: "boolean",
    required: true,
  },
];

const answers = [
  {
    questionId: "q1",
    value: "Yes",
  },
];

const result = validateAnswers(questions, answers);

console.log(result);