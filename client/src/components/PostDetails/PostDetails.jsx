import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider, Button, Modal } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory, Link } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
import useStyles from './styles';
import { Close } from '@material-ui/icons';
import { Container } from '@mui/material';

/* START OF NEW MATERIAL UI IMPORTS */
import Grid from '@material-ui/core/Grid'
import ExploreIcon from '@mui/icons-material/Explore';
import NumbersIcon from '@mui/icons-material/Numbers';
import WavesIcon from '@mui/icons-material/Waves';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
/* END OF NEW MATERIAL UI IMPORTS */


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
          <Container className={classes.detailsGroup}>
            <Container className={classes.detail}>
              <ExploreIcon fontSize="large" className={classes.icons} /><Typography variant="body1"><strong>State: </strong><br />{post.state}</Typography>
            </Container>
            <Container className={classes.detail}>
              <NumbersIcon fontSize="large" className={classes.icons} /><Typography variant="body1"><strong>Site: </strong><br />{post.site}</Typography>
            </Container>
            <Container className={classes.detail}>
              <ElectricalServicesIcon fontSize="large" className={classes.icons} /><Typography variant="body1"><strong>Electric Hookup: </strong><br />{post.amps}</Typography>
            </Container>
            <Container className={classes.detail}>
              <WaterDropIcon fontSize="large" className={classes.icons} /><Typography variant="body1"><strong>Water Hookup: </strong><br />{post.water}</Typography>
            </Container>
            <Container className={classes.detail}>
              <DeleteIcon fontSize="large" className={classes.icons} /><Typography variant="body1"><strong>Sewer Hookup: </strong><br />{post.sewer}</Typography>
            </Container>
            <Container className={classes.detail}>
              <PetsIcon fontSize="large" className={classes.icons} /><Typography variant="body1"><strong>Pets Allowed: </strong><br />{post.pets}</Typography>
            </Container>
            <Container className={classes.detail}>
              <WavesIcon fontSize="large" className={classes.icons} /><Typography variant="body1"><strong>Waterfront: </strong><br />{waterfrontDisplay}</Typography>
            </Container>
          </Container>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
        <div>
        <Button className={classes.buttonClose}
            variant="contained"
            style={{ marginBottom: 20, marginRight: 0 }}
            startIcon={<Close />}
            onClick={() => history.goBack()}
          >
            Close Post
          </Button>
          
          </div>
          <img
            style={{ marginTop: '100px'}}
            className={`${classes.media} ${classes.clickableImage}`} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title}
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
         





          <Grid container>
                <div className={classes.recommendedPosts}>
                  {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
                    <Grid item
                      style={{cursor: 'pointer' }}
                      onClick={() => openPost(_id)}
                      key={_id}
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      >
                      <Container style={{ textAlign: 'center'}}>
                        <Typography className={classes.recPostsTitle} style={{ fontSize: '26px'}} gutterBottom variant="h6">{title}</Typography>
                        <Typography style={{ fontSize: '20px', textDecoration: 'none', color: '#3f51b5' }} gutterBottom variant="subtitle2">{name}</Typography>

                        <Container className={classes.description}>
                          <Typography gutterBottom variant="subtitle2">{message}</Typography>
                          <Container className={classes.likes}>
                            <ThumbUpIcon className={classes.thumbs} style={{ paddingRight: '4px'}} fontSize='small' /><Typography style={{ fontSize: '15px'}} gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                          </Container>
                        </Container>
                      
                      <img className={classes.recPostsImg} src={selectedFile} width="250px" height="250px"/>
                      </Container>
                    </Grid>  
                  ))}
                </div>
              </Grid>









        </div>
      )}
              
              

    </Paper>
  );
};

export default Post;
