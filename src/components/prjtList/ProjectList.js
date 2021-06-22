import React from "react";
import { Card, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RoadCons from "../../assets/images/road-cons.jpg";

const useStyles = makeStyles((theme) => ({
  bg_image: {
    backgroundImage: `url(${RoadCons})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    // backgroundPosition: "center",
    height: "100vh",
  },
  title: {
    textAlign: "center",
    fontFamily: "monospace",
    margin: "0px",
    padding: "16px",
  },
  cards_div: {
    display: "flex",
    flexWrap: "wrap",
  },
  card: {
    margin: "20px",
    width: "28%",
    padding: "16px",
  },
  prjtname: {
    fontSize: "2rem !important ",
    fontFamily: "monospace",
  },
  btn: {
    fontFamily: "monospace",
    textTransform: "capitalize",
    float: "right",
    color: "#fff",
    backgroundColor: "#2c97dd",
    "&:hover": {
      backgroundColor: "#2c97dd",
    },
  },
  btn_prgs: {
    fontFamily: "monospace",
    textTransform: "capitalize",
    float: "right",
    color: "#fff",
    backgroundColor: "#17bb51",
    "&:hover": {
      backgroundColor: "#17bb51",
    },
  },
}));
export default function ProjectList() {
  const classes = useStyles();

  return (
    <div className={classes.bg_image}>
      <h1 className={classes.title}>All Projects</h1>
      <div className={classes.cards_div}>
        <Card className={classes.card}>
          <Typography className={classes.prjtname}>Project one</Typography>
          <Button className={classes.btn}>Start</Button>
        </Card>
        <Card className={classes.card}>
          <Typography className={classes.prjtname}>Project two</Typography>
          <Button className={classes.btn}>Start</Button>
        </Card>
        <Card className={classes.card}>
          <Typography className={classes.prjtname}>Project three</Typography>
          <Button className={classes.btn_prgs}>In Progress</Button>
        </Card>
        <Card className={classes.card}>
          <Typography className={classes.prjtname}>Project Four</Typography>
          <Button className={classes.btn}>Start</Button>
        </Card>
      </div>
    </div>
  );
}
