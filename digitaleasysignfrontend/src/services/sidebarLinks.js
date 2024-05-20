import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DraftsIcon from '@mui/icons-material/Drafts';
import BlockIcon from '@mui/icons-material/Block';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const fileManager = [
    {
        name: 'Completed',
        icon: <AddCircleOutlineIcon fontSize='small' color='success' />,
        to: '/documents/completed',
    },
    {
        name: 'Awaiting Signature',
        icon: <VisibilityIcon fontSize='small' color='warning'/>,
        to: '/documents/awaiting',
    },
    {
        name: 'Voided',
        icon: <BlockIcon fontSize='small' color='error' />,
        to: '/documents/voided',
    },
    {
        name: 'Draft',
        icon: <DraftsIcon fontSize='small' />,
        to: '/documents/draft',
    },
    {
        name: 'Received',
        icon: <CallReceivedIcon fontSize='small' color='secondary' />,
        to: '/documents/received',
    },
    {
        name: 'Trash',
        icon: <DeleteOutlinedIcon fontSize='small' color='error'/>,
        to: '/documents/trash',
    },
];

const sharedFile = [
    {
        name: 'Create Template',
        icon: <AddCircleOutlineIcon fontSize='small' />,
        to: '/templates/new',
    },
    {
        name: 'Manage Template',
        icon: <ManageHistoryIcon fontSize='small' />,
        to: '/templates/manage',
    },
];

const team = [
    {
        name: 'Sign',
        icon: <EditNoteIcon />,
        to: '/',
    },
    {
        name: 'Overview',
        icon: <AccessTimeIcon fontSize='small' />,
        to: '/overview',
    },
];

export { fileManager, sharedFile, team };
