import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider, Button, Modal } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory, Link } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
import useStyles from './styles';
import { Close } from '@material-ui/icons';

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getPost(id));
    
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ tags: post?.tags.join(',') }));
    }
  }, [post]);
  
  if (!post) return null;

  const openPost = (_id) => history.push(`/posts/${_id}`);

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id).slice(0, 5);
  const waterfrontDisplay = post.waterfront ? post.waterfront : 'N/A';

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  
  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">
            {post.tags.map((tag, index) => (
            <Link
              key={`${tag}_${index}`}
              to={`/tags/${tag}`}
              style={{ textDecoration: 'none', color: '#3f51b5' }}
            >
              {`#${tag} `}
            </Link>
            ))}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">
            Created by:
            <Link to={`/creators/${post.name}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` ${post.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Typography variant="body1"><strong>Private: </strong>{post.isPrivate ? 'Yes' : 'No'}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>State: </strong>{post.state || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Site: </strong>{post.site || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Pros: </strong>{post.pros || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Cons: </strong>{post.cons || 'N/A'}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Electric Hookup: </strong>{post.amps || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Water Hookup: </strong>{post.water || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Sewer Hookup: </strong>{post.sewer || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Pets Allowed: </strong>{post.pets || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Waterfront: </strong>{waterfrontDisplay}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
        <div>
        <Button className={classes.buttonClose}
            component={Link}
            to="/posts"
            variant="contained"
            style={{ marginBottom: 20, marginRight: 0 }}
          >
            Close Post
          </Button>
          </div>
          <img className={`${classes.media} ${classes.clickableImage}`} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title}
          onClick={handleOpenModal}
          />
        </div>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className={classes.modal}>
          <img
            className={classes.modalImage}
            src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}
            alt={post.title}
          />
        <Button
            className={classes.closeButton}
            onClick={handleCloseModal}
            startIcon={<Close />}
          >
            Close
          </Button>
        </div>
      </Modal>
      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(_id)} key={_id}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                <Typography gutterBottom variant="subtitle1">Likes: {likes ? likes.length : 0}</Typography>
                <img src={selectedFile} width="200px" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default Post;
