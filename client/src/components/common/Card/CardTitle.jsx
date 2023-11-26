import React from 'react'
import useStyles from "./styles";
import {Typography} from "@material-ui/core";

export default ({ title, count }) => {
    const classes = useStyles();

  return (
      <div className={classes.cardTitle} style={{ justifyContent: count ? 'space-between' : 'center'}}>
          <Typography variant="h4" component="h4">{title}</Typography>
          {count ? <span>Count: {count}</span> : null}
      </div>
  )
}