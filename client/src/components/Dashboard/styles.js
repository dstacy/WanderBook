import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    pageWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        gap: '50px 100px',
        gridAutoFlow: 'row',
        gridTemplateAreas: `"card-1 card-3 card-3" "card-2 card-3 card-3" ". . ."`,
        width: '100%',
        [theme.breakpoints.down('md')]: {
            gap: '20px 60px',
            display: 'flex',
            flexDirection: 'column'
        },
    },
    contentText: {
        margin: '16px 0',
        fontWeight: '500',
        fontSize: '16px',
        color: '#000'
    }
}));
