import { useEffect, useState } from "react";
import Answer from "./Answer";
import Button from "./Button";
import InfoMessage from "./InfoMessage";
import ResetButton from "./ResetButton";
import Error from "./Error";

const Game = () => {
  const [difficulty, setDifficulty] = useState("difficulty");
  const [question, setQuestion] = useState("question");
  const [questionNum, setQuestionNum] = useState(0);
  const [answers, setAnswers] = useState([
    "answer1",
    "answer2",
    "answer3",
    "answer4",
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [questionsNum, setQuestionsNum] = useState(10);
  const [data, setData] = useState();
  const [score, setScore] = useState(0);
  const [answerStates, setAnswerStates] = useState({});
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleReset = () => {
    fetchData();
    setQuestionNum(0);
    setScore(0);
    setAnswerStates({});
    setFinished(false);
  };

  const infoMessages = [
    { score: 0, message: "Ouch! Tough one. Try again!" },
    { score: 5, message: "Just getting started. You can do it!" },
    { score: 10, message: "Rough start. Keep practicing!" },
    { score: 15, message: "Not bad. Keep pushing forward!" },
    { score: 20, message: "You're warming up! Keep it up!" },
    { score: 25, message: "Good effort! Starting to get it." },
    { score: 30, message: "Nice improvement! Keep going!" },
    { score: 35, message: "You're getting there! Keep at it!" },
    { score: 40, message: "Good job! Keep striving for more!" },
    { score: 45, message: "You're doing well! Keep pushing!" },
    { score: 50, message: "Nice job! Halfway there!" },
    { score: 55, message: "Great progress! Keep climbing!" },
    { score: 60, message: "You're doing great! Keep it up!" },
    { score: 65, message: "Fantastic work! Keep pushing forward!" },
    { score: 70, message: "Almost there! Keep the momentum!" },
    { score: 75, message: "Great work! Almost at the top!" },
    { score: 80, message: "You're so close! Keep going!" },
    { score: 85, message: "Excellent! Just a bit more!" },
    { score: 90, message: "Amazing! So close to perfect!" },
    { score: 95, message: "Incredible! Nearly a perfect score!" },
    { score: 100, message: "Congratulations! Perfect score!" },
  ];

  const decodeHtmlEntities = (text) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  const shuffleAnswers = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  };

  const handleClick = (answer) => {
    if (!answered) {
      const isCorrect = answer === correctAnswer;
      isCorrect && setScore(score + 1);
      setAnswerStates({
        ...answerStates,
        [answer]: isCorrect ? "bg-[#D4EDDA]" : "bg-[#F8D7DA]",
      });
      setAnswered(true);
    }
  };

  const fetchData = () => {
    fetch(`https://opentdb.com/api.php?amount=${questionsNum}&category=18`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        generateQuestion(data);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };

  const generateQuestion = (data) => {
    const { difficulty, question, correct_answer, incorrect_answers } =
      data.results[questionNum];
    const decodedQuestion = decodeHtmlEntities(question);
    const decodedAnswers = shuffleAnswers([
      decodeHtmlEntities(correct_answer),
      ...incorrect_answers.map((answer) => decodeHtmlEntities(answer)),
    ]);
    setAnswers(decodedAnswers);
    setQuestion(decodedQuestion);
    setDifficulty(difficulty);
    setCorrectAnswer(correct_answer);
    setAnswerStates({});
    setAnswered(false);
  };

  const findClosestMessage = (score) => {
    return infoMessages.reduce((prev, curr) => {
      return Math.abs(curr.score - score) < Math.abs(prev.score - score)
        ? curr
        : prev;
    }, infoMessages[0]);
  };

  const handleNextQuestion = () => {
    if (questionNum + 1 < questionsNum) {
      setQuestionNum(questionNum + 1);
    } else {
      setFinished(true);
      const finalScore = (score / questionsNum) * 100;
      setMessage(findClosestMessage(finalScore));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      generateQuestion(data);
    }
  }, [questionNum]);

  return (
    <>

        {error && <Error/>}

      <main className="bg-white px-5 pt-5 rounded-sm md:w-[768px] w-full">
        {finished ? (
          <div className="flex flex-col items-center gap-5 p-5">
            <InfoMessage infoMessage={message} />
            <ResetButton reset={handleReset} />
          </div>
        ) : (
          <>
            <div className="flex gap-10 border-b items-center justify-between">
              <h1 className="font-bold text-3xl">Computer Quiz</h1>
              <p
                className={`${
                  difficulty === "hard"
                    ? "text-red-700"
                    : difficulty === "medium"
                    ? "text-orange-500"
                    : "text-green-500"
                } text-xl font-bold`}
              >
                {difficulty}
              </p>
            </div>

            <div>
              <p className="my-5 font-bold text-2xl">
                {questionNum + 1}. {question}
              </p>
              <div className="space-y-5">
                {answers.map((answer, i) => {
                  return (
                    <Answer
                      key={i}
                      answer={answer}
                      onClick={handleClick}
                      styleClass={`bg-[#F0F8FF] border border-[#007BFF] rounded-sm p-2 cursor-pointer w-full ${
                        answerStates[answer] || ""
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="border-t w-full justify-between mt-5 py-5 flex items-center">
              <div>
                <span className="font-bold">{questionNum + 1}</span> of{" "}
                <span className="font-bold">{questionsNum}</span> Questions
              </div>
              <Button nextQue={handleNextQuestion} />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Game;
