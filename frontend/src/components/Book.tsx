import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAppSelector } from "../redux/hooks";
import "./Book.css";

const BookApp = () => {
  const { storyBook: bookData } = useAppSelector((state) => state.storyBook);
  console.log(bookData)
  const [currentPage, setCurrentPage] = useState(0);
  const { audio } = useAppSelector((state) => state.audio);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <div
          style={{
            width: "70%",
            margin: "0 auto",
            minWidth: "500px",
            textAlign: "center",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" color="primary">
            My Story Book
          </Typography>
        </div>
        <div
          style={{
            width: "70%",
            margin: "0 auto",
            minWidth: "500px",
            textAlign: "center",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" color="primary">
            Listen to the Story
          </Typography>
          <audio controls>
            <source src={audio} />
          </audio>
        </div>
        <div
          style={{
            margin: "0 auto",
            minWidth: "500px",
            padding: "10px",
            maxWidth: "25%",
          }}
        >
          <Carousel
            showThumbs={false}
            selectedItem={currentPage}
            onChange={setCurrentPage}
            showStatus={false}
          >
            {bookData.map((page: any, index: number) => (
              <div key={index}>
                <Card>
                  <Grid container >
                    <Grid xs={6}>
                      <img width="150px" height="400px" src={page.image} />
                    </Grid>
                    <Grid xs={6}>
                      <CardContent sx={{ height: "400px", overflowY: "scroll", scrollbarColor: "white" }}>
                        <Typography variant="body1">{page.content}</Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default BookApp;
