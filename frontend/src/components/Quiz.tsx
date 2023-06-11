import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
} from "@mui/material";
import { addToQuiz } from "../redux/slice/quiz";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
const QuizApp = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    fetch("https://f731-61-246-82-230.ngrok-free.app/get_mcq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: (new Date()).toString() })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.chunk_0)
        dispatch(addToQuiz(data.chunk_0))
      }
      ).catch((err) => console.log(err))
  }, [])

  const { quiz: questions }: any = useAppSelector(
    (state: {
      quiz: Array<{
        question: string;
        options: string[];
        answer: string;
      }>;
    }) => state.quiz
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== "") {
      if (selectedOption[0] === questions[currentQuestion].answer[0]) {
        setScore(score + 1);
      }
      setSelectedOption("");

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
    }
  };


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ width: 300, p: 3 }}>
        <CardContent>
          {!quizCompleted ? (
            <div>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  pb: 5,
                  borderBottom: "1px solid grey",
                }}
              >
                {questions[currentQuestion].question}
              </Typography>
              <Typography
                variant="body2"
                sx={{ position: "absolute", top: "16px", right: "16px" }}
              >
                {`Question ${currentQuestion + 1}/${questions.length}`}
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <RadioGroup
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  {questions[currentQuestion].options.map((option: any, index: number) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{ mb: 1, color: "grey" }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                disabled={selectedOption === ""}
                sx={{ position: "absolute", bottom: "20px", right: "20px" }}
              >
                {currentQuestion === questions.length - 1
                  ? "Finish"
                  : "Next Question"}
              </Button>
            </div>
          ) : (
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Quiz Completed!
              </Typography>
              <Typography>
                Your Score: {score}/{questions.length}
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizApp;
