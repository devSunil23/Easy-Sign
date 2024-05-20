import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(2),
    },
    header: {
        marginBottom: theme.spacing(2),
    },
    viewer: {
        width: '100%',
        height: 'calc(100vh - 120px)', // Adjust to your preferred height
        maxWidth: 'fit-content',
    },
    controls: {
        margin: theme.spacing(2, 0),
    },
    button: {
        margin: theme.spacing(1),
    },
    dropzone: {
        width: '100%',
        border: '2px dashed #424242',
        padding: theme.spacing(4),
        height: '100px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: 'background.paper',
    },
    dropzoneActive: {
        border: '1px dashed #007bff',
    },
    div1: {
        width: '350px',
        height: '70px',
        padding: '10px',
        border: '1px solid #aaaaaa',
    },
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    rolesContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align roles to the left
    },
    roleField: {
        width: '100%',
        marginBottom: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
    },
    roleNumber: {
        marginRight: theme.spacing(2),
    },
    customTextarea: {
        minWidth: '100%',
        minHeight: 100,
        padding: theme.spacing(1),
        resize: 'none', // To remove the resizing handle
      
        borderRadius: 4,
        transition: 'background-color 0.3s ease', // Transition for smoother color change
      },
      
}));

export default useStyles;