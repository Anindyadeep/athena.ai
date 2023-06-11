import { useState } from "react";
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
import { useAppSelector } from "../redux/hooks";
const QuizApp = () => {
  const { quiz: questions }: any = useAppSelector(
    (state: {
      quiz: Array<{
        content: string;
        options: Array<{
          id: number;
          content: string;
        }>;
        answer: number;
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
      if (parseInt(selectedOption) === questions[currentQuestion].answer) {
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
                {questions[currentQuestion].content}
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
                  {questions[currentQuestion].options.map((option: any) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id.toString()}
                      control={<Radio />}
                      label={option.content}
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
