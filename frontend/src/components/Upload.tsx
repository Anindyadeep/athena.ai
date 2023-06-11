/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography, Grid, Button } from "@mui/material";
import Typed from "typed.js";
import { useEffect, useRef, useState } from "react";
import s3 from "../aws-config";
import { useLocation } from "wouter";
import { useAppDispatch } from "../redux/hooks";
import { addToStoryBook } from "../redux/slice/storyBook";
import { addToAudio } from "../redux/slice/audio";
import "./upload.css"
const TypedTitle = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Learning made fun", "Generate Story Book", "Listen to Podcasts", "Take a Quiz"],
      typeSpeed: 100,
      backSpeed: 100,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <div>
      <span ref={el}></span>{" "}
    </div>
  );
};

const UploadApp = () => {
  const dispatch = useAppDispatch()
  const [, setUploading] = useState(false);
  const [, setLocation] = useLocation();
  const handleUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME as string,
        Key: file.name,
        Body: file,
        ContentType: "multipart/form-data",
      };
      s3.upload(params, async (err: any, data: any) => {
        setUploading(false);
        if (err) {
          console.log("Error uploading data: ", err);
          alert("Check your internet connection");
        } else {
          console.log(data.Location)
          await fetch("https://f731-61-246-82-230.ngrok-free.app/generate_story", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: data.Location }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data)
              dispatch(addToAudio(data.audio_metadata[0]))
              const newData = data.image_metadata.map((item: string, index: number) => ({
                image: item,
                content: data.story_response_content.summary_chunks[index]
              }
              ))
              console.log(newData)
              dispatch(addToStoryBook(newData))
              setLocation("/storybook")
            })
            .catch((err) => {
              alert("Something went wrong, please try again later")
            })
        }
      });
    }
  };
  return (
    <div className="div-class">
      <img
        src={require("../assert/Upload.jpg")}
        width="100%"
        style={{ height: "100vh", position: "absolute", zIndex: -1 }}
      />
      <div style={{ position: "absolute", top: "10%", right: "10%" }}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: "400px",
            height: "250px",
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0px 0px 20px 0px rgba(0,0,0,1)",
          }}
        >
          <Grid item xs={3}>
            <Typography
              variant="h4"
              sx={{
                borderBottom: "1px solid grey",
                padding: "5px",
                marginBottom: "20px",
              }}
              color="grey"
            >
              Athena.ai
            </Typography>
            <Typography variant="h6" color="primary">
              <TypedTitle />
            </Typography>

            <Button
              variant="contained"
              component="label"
              sx={{ margin: "30px" }}
            >
              Upload a PDF file
              <input
                type="file"
                onChange={(e) => {
                  handleUpload(e);
                }}
                hidden
              />
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default UploadApp;
