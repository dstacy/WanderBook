import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(({theme}) => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #673ab7 !important',
        padding: '16px',
        boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    },
    cardTitle: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center'
    },
    cardContent: {
        padding: '10px'
    },
}));
