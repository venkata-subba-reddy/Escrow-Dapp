import { withStyles, Typography } from "@material-ui/core";
import React from "react";
import StarRatingComponent from "react-star-rating-component";

const styles = (theme) => ({
  title: {
    textAlign: "center",
  },
  stars: {
    display: "flex !important",
    justifyContent: "center",
    direction: "rtl",
    fontSize: "40px",
    marginTop: "10%",
  },
});
class Feedback extends React.Component {
  constructor() {
    super();

    this.state = {
      rating: 0,
    };
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  render() {
    const { rating } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <h1 className={classes.title}>Customer Reviews</h1>
        <Typography className={classes.title}>
          Customer Reviews means alot to us
        </Typography>
        
        <StarRatingComponent
          name="rate1"
          starCount={10}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
          className={classes.stars}
        />
        <br />
        <Typography className={classes.title}>Thank you!</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Feedback);
