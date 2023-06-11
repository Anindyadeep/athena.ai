import { Route, Switch } from "wouter";
import Upload from "./pages/Upload";
import Book from "./components/Book";
import Quiz from "./components/Quiz";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import QuizIcon from "@mui/icons-material/Quiz";
import CottageIcon from "@mui/icons-material/Cottage";
import ReorderIcon from "@mui/icons-material/Reorder";
import { Typography } from "@mui/material";
import { BLUE } from "./styles/colors";
import { useLocation } from "wouter";
const App = () => {
  const [, setLocation] = useLocation();
  return (
    <div style={{ padding: "0px" }}>
      <Switch>
        <Route path="/upload">
          <Upload />
        </Route>
        <div style={{ height: "100vh", display: "flex", width: "100vw" }}>
          <Sidebar
            style={{
              height: "100vh",
              border: "0px",
              color: "white",
            }}
            width={"170px"}
            backgroundColor={BLUE}
            collapsed={true}
          >
            <Menu
              menuItemStyles={{
                button: ({ level }) => {
                  if (level === 0) {
                    return {
                      "&:hover": {
                        backgroundColor: "DarkBlue",
                      },
                    };
                  }
                },
              }}
            >
              <MenuItem
                icon={<ReorderIcon />}
                onClick={() => {
                  setLocation("/upload");
                }}
              >
                <Typography variant="h6">Salus.ai</Typography>
              </MenuItem>

              <MenuItem
                icon={<CottageIcon />}
                onClick={() => {
                  setLocation("/storyBook");
                }}
              >
                StoryBook
              </MenuItem>
              <MenuItem
                icon={<QuizIcon />}
                onClick={() => {
                  setLocation("/quiz");
                }}
              >
                Quiz
              </MenuItem>
              <MenuItem icon={<UpgradeIcon />}>Export</MenuItem>
            </Menu>
          </Sidebar>
          <main
            style={{
              width: "100%",
              margin: "0px",
            }}
          >
            <Route path="/storyBook">
              <Book />
            </Route>
            <Route path="/quiz">
              <Quiz />
            </Route>
          </main>
        </div>
      </Switch>
    </div>
  );
};

export default App;
