import React from 'react'
import {ImageList, ImageListItem} from "@mui/material";
import {Typography} from "@material-ui/core";
import useStyles from "./styles";

export default ({ images=[]}) => {
    const classes = useStyles();

    if (!images.length) {
        return <Typography variant="p" component="p" className={classes.contentText}>No posts</Typography>
    }
  return (
      <ImageList cols={3} gap={24}>
        {images.map((item) => (
            <ImageListItem key={`${item.name}_${item._id}`}>
              <img
                  srcSet={item.selectedFile}
                  src={item.selectedFile}
                  alt={`${item.name}_${item._id}`}
                  loading="lazy"
              />
            </ImageListItem>
        ))}
      </ImageList>
  )
}