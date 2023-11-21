import { makeStyles } from '@material-ui/core/styles';
import {deepOrange} from "@material-ui/core/colors";

export default makeStyles((theme) => ({
    layoutWrapper: {
        display: 'flex',
        gap: '200px',
        [theme.breakpoints.down('md')]: {
            gap: '80px',
        },
    },
    userInfoWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        alignItems: 'center',
        marginBottom: '30px'
    },
    userImage: {
        border: '4px solid #673ab7',
        fontSize: '30px!important'
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    userName: {
        fontWeight: '500',
        lineHeight: '28px',
        fontSize: '22px',
        margin: 0,
        textTransform: 'capitalize'
    },
    userEmail: {
        fontWeight: '400',
        lineHeight: '16px',
        fontSize: '14px',
        margin: 0,
        textTransform: 'lowercase'
    },
    sidebarItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    itemText: {
        fontWeight: '500',
        lineHeight: '28px',
        fontSize: '22px',
        margin: 0,
        textTransform: 'capitalize'
    },
    signOut: {
        marginTop: '30px',
        color: theme.palette.getContrastText(deepOrange[700]),
        backgroundColor: deepOrange[700],
    }
}));
