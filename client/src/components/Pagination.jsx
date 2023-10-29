/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';

import useStyles from './styles';

const Paginate = ({ page, action, selector, uniqueKey }) => {
  const { numberOfPages } = useSelector(selector);
  const dispatch = useDispatch();

  const classes = useStyles();

  useEffect(() => {
    if (page) {
      dispatch(action(page, uniqueKey)); // Dispatch the provided action with the unique key.
    }
  }, [dispatch, page, action, uniqueKey]);

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={numberOfPages}
      page={Number(page) || 1}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`/${uniqueKey}?page=${item.page}`} />
      )}
    />
  );
};

export default Paginate;