/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography, Grid, Button } from "@mui/material";
import Typed from "typed.js";
import { useEffect, useRef, useState } from "react";
import s3 from "../aws-config";
import { useLocation } from "wouter";

const TypedTitle = () => {
  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Learning  made fun", "Generate StoryBook", ""],
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
      s3.upload(params, function (err: any, data: any) {
        setUploading(false);
        if (err) {
          console.log("Error uploading data: ", err);
          alert("Check your internet connection");
        } else {
          setLocation("/storybook");
        }
      });
    }
  };
  return (
    <div>
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
              Athena.AI
            </Typography>
            <Typography variant="h6" color="primary">
              <TypedTitle />
            </Typography>

            <Button
              variant="contained"
              component="label"
              sx={{ margin: "30px" }}
            >
              Upload File PDF
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
