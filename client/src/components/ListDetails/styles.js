import { makeStyles } from '@material-ui/core/styles';
import { deepPurple, deepOrange } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',

  },
  addAndSortGroup: {
    display: 'flex !important',
    justifyContent: 'space-between !important',
  },
  headerStyle: {
    backgroundColor: deepPurple[700],
  },
  headerTextStyle: {
    color: theme.palette.getContrastText(deepPurple[700]),
    fontSize: '24px',
  },
  listRowText: {
    fontSize: '20px',
  },
  card: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  imageSection: {
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
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
  TableHead: {
    background: deepPurple[700],
    fontFamily: 'inherit',
  },
  evenRow: {
    background: '#fff',
  },
  oddRow: {
    background: '#f0f0f0',
  },
  buttonClose: {
    position: 'absolute',
    top: 225,
    right: 100,
    zIndex: 1,
    color: theme.palette.getContrastText(deepPurple[700]),
    backgroundColor: deepPurple[700],
  },
  buttonDeleteAll: {
    color: theme.palette.getContrastText(deepOrange[700]),
    backgroundColor: deepOrange[700],
  }
}));