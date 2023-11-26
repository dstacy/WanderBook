import React from 'react'
import useStyles from "./styles";
import { Card } from '@mui/material';

export default ({ gridArea, children }) => {
  const classes = useStyles();

  return (
      <Card className={classes.card} style={{ gridArea }} variant="outlined">
        {children}
      </Card>
  )
}