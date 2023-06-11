import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAppSelector } from "../redux/hooks";

const BookApp = () => {
  const { storyBook: bookData } = useAppSelector((state) => state.storyBook);
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
          }}
        >
          <audio controls>
            <source src={audio} />
          </audio>
        </div>
        <div
          style={{
            width: "70%",
            margin: "0 auto",
            minWidth: "500px",
            border: "1px solid grey",
            borderRadius: "20px",
            padding: "10px",
          }}
        >
          <Carousel
            showThumbs={false}
            selectedItem={currentPage}
            onChange={setCurrentPage}
            showStatus={false}
            showIndicators={false}
          >
            {bookData.map((page: any, index: number) => (
              <div key={index}>
                <Card>
                  <Grid container>
                    <Grid xs={5}>
                      <CardMedia
                        component="img"
                        image={page.image}
                        sx={{
                          objectFit: "cover",
                          borderRadius: "20px",
                        }}
                      />
                    </Grid>
                    <Grid>
                      <CardContent
                        sx={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
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
