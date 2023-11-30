import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',
    marginTop: '50px', 
  },
  card: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  detailsGroup: {
    display: 'flex !important',
    justifyContent: 'space-between !important',
  },
  detail: {
    borderRadius: '8px',
    width: '125px !important',
    height: '125px !important',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    textAlign: 'center',
    paddingTop: '10px',
    },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  likes: {
    display: 'flex !important',
    justifyContent: 'flex-start !important',
  },
  imageSection: {
    marginLeft: '20px',
    position: 'relative',
    maxWidth: '600px', 
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      maxWidth: '100%', // For smaller screens, allow full width
    },
  },
  recommendedPosts: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
  },
  commentsOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentsInnerContainer: {
    height: '200px',
    overflowY: 'auto',
    marginRight: '30px',
  },
  buttonClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    color: theme.palette.getContrastText(deepPurple[700]),
    backgroundColor: deepPurple[700],
  },
  clickableImage: {
    cursor: 'pointer',
  },
  recPostsTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    textWrap: 'wrap',
    paddingLeft: '30px',
    paddingRight: '30px',
    minHeight: '75px',
    textAlign: 'center',
  },
  recPostsImg: {
    textAlign: 'center',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    borderRadius: '50%',
    position: 'relative',
    maxWidth: '600px', 
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      maxWidth: '100%', // For smaller screens, allow full width
    },
  },
  description: {
    minHeight: '125px',
  },
  icons: {
    color: deepPurple[700],
  },
  thumbs: {
    color: deepPurple[700],
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '95vw',
    maxHeight: '95vh', 
  },
  modalImage: {
    width: 'auto',
    height: 'auto',
    maxWidth: '95vw',
    maxHeight: '95vh', 
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: 'black',
    backgroundColor: '#f0f0f0'
  }
}));