import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormLabel, Tooltip, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import RenameIcon from '../../style/rename.svg';
import EditResend from '../../style/edit_resend.svg'
import DeleteIcon from '../../style/delete.svg';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DraftsIcon from '@mui/icons-material/Drafts';
import TemplatePreviewAndSign from '../../components/TemplatePreviewAndSign';
import { useMessage } from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icons/Icon';
import { deleteTemplate ,getTemplates,getFile} from './Function';
import useStyles from './Style';
import Loading from '../../components/Progress/Loading';
 
const Index = (props) =>{
    const classes = useStyles();
    const [isLoading,setIsLoading] = useState(true);
    const [document, setDocument] = useState('');
    const [rows, setRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [templateId,setTemplateId] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const {showError,showSuccess} =  useMessage()
    const [signDocument] = useState(false);
    const getRowId = (row) => row._id;

    const handleClick = (event,id) => {
        console.log(event);
        console.log('templateId',id)
        setTemplateId(id)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const columns = [
        { field: 'templateName', headerName: 'TITLE', width: 470 ,editable:true},
        {
            field: 'createdAt',
            headerName: 'Date Created',
            width: 150,
        },
        {
            field: 'userName',
            headerName: 'Created By',
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 'auto',
            renderCell: (params) => (
                <div>
                    <Tooltip title="click to see all Options">
                    <Button
                        aria-describedby={id}
                        variant='contained'
                        onClick={(event)=>handleClick(event,params.row._id)}
                    >
                        Options
                    </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const fetchFile = async (fileId) => {
        try {

            const response = await getFile(fileId)
            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type: 'application/pdf',
                });
                const url = URL.createObjectURL(blob);
                setPdfFile(url);
            }
        } catch (e) {
            console.error('Error fetching data:', e);
        }
    };
    
    const handleDeleteTemplate = async()=>{

            if(templateId){
            await deleteTemplate(templateId,handleClose,fetchData,showError,showSuccess)
            }else{
            showError('Error template not deleted!')
            }
    }

    const fetchData = async () => {
        try {
                const response = await  getTemplates();
                if (response.status === 200) {
                    setRows(response.data.data); // Update the rows state with API data
                    setIsLoading(false)
                }
            } catch (e) {
                 console.error('Error fetching data:', e);
                }
    };

    useEffect(() => {
        
        fetchData(); // Fetch data when the component mounts
    }, []);

    const isEmpty = rows.length === 0;
    const handleChange = (event) => {
        setDocument(event.target.value);
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 2 }}>
            {isLoading && <Loading/>}
            {signDocument && (
                <Grid item xs={12} sm={12}>
                    <TemplatePreviewAndSign pdfFile={pdfFile}></TemplatePreviewAndSign>
                </Grid>
            )}
            <Typography variant='h6'>Templates</Typography>
            <br />
            <p style={{ color: '#7d8d98' }}>
                Templates are reusable documents that you send often. Create a
                template once to allow you to send your documents faster.
            </p>
            <br />
            <Grid container spacing={1}>
                <Grid item xs={12} md={2}>
                    <FormControl
                        sx={{ m: 1, minWidth: 150 }}
                        size='small'
                        style={{ marginTop: '16px' }}
                    >
                        <InputLabel id='demo-select-small-label'>
                            Templates
                        </InputLabel>
                        <Select
                            labelId='demo-select-small-label'
                            id='demo-select-small'
                            value={document}
                            label='Documents'
                            onChange={handleChange}
                        >
                            <MenuItem value=''>
                                <em>Templates</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl
                        sx={{ m: 1, minWidth: 150 }}
                        size='small'
                        style={{ marginTop: '16px' }}
                    >
                        <InputLabel id='demo-select-small-label'>
                            Status: All
                        </InputLabel>
                        <Select
                            labelId='demo-select-small-label'
                            id='demo-select-small'
                            value={document}
                            label='Status'
                            onChange={handleChange}
                        >
                            <MenuItem value=''>
                                <em>All</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3} style={{ marginTop: '5px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker />
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} sx={{ marginTop: '25px' }}>
                    <div className={classes.root}>
                        {isEmpty ? (
                            <div>
                                <p
                                    style={{
                                        border: '1px solid #424242',
                                        height: '200px',
                                        'text-align': 'center',
                                        padding: '80px',
                                    }}
                                >
                                    <DraftsIcon /> <br />
                                    No matches found for your current search.{' '}
                                    <br />{' '}
                                    <a href='/templates/new'>
                                        <Tooltip title="Create new template">
                                        <Button
                                            aria-describedby={id}
                                            variant='contained'
                                        >
                                            Create Template
                                        </Button>
                                        </Tooltip>
                                    </a>
                                </p>
                            </div>
                        ) : (
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowId={getRowId}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableSelectionOnClick
                                disableColumnReorder={true}
                                onRowClick={(params) => {
                                    if (params.row.fileId) {
                                        fetchFile(params.row.fileId); // Pass _id to fetchFile
                                    }
                                }}
                            />
                        )}
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            PaperProps={{
                                style: {
                                    width: '15%', // Set the desired width here
                                },
                            }}
                        >
                            <Stack direction='column' spacing={3}>
                                <FormControl id='buttonsID'>
                                    <Link to={`/templates/${templateId}`}>
                                    <IconButton
                                        id='drag1'
                                        aria-label='add'
                                        style={{
                                            border: '1px solid #eee',
                                            'border-radius': '0px',
                                            width: '100%',
                                        }}
                                    >
                                        <FormLabel>
                                            <img
                                                src={EditResend}
                                                alt='React Logo'
                                            />{' '}
                                        </FormLabel>
                                        <FormLabel
                                            style={{ 'padding-left': '10px' }}
                                        >
                                            Edit 
                                        </FormLabel>
                                    </IconButton>
                                    </Link>
                                    <IconButton
                                        id='drag1'
                                        aria-label='add'
                                        style={{
                                            border: '1px solid #eee',
                                            'border-radius': '0px',
                                            width: '100%',
                                        }}
                                    >
                                        <FormLabel>
                                            <img
                                                src={RenameIcon}
                                                alt='React Logo'
                                            />{' '}
                                        </FormLabel>
                                        <FormLabel
                                            style={{ 'padding-left': '10px' }}
                                        >
                                            Rename
                                        </FormLabel>
                                    </IconButton>
                                    <IconButton
                                        id='drag1'
                                        aria-label='add'
                                        style={{
                                            border: '1px solid #eee',
                                            'border-radius': '0px',
                                            width: '100%',
                                        }}
                                    >
                                        <FormLabel>
                                        <Icon
                                                name='/extension/general/archive.png'
                                                sx={{width:'1rem'}}
                                            />
                                        </FormLabel>
                                        <FormLabel
                                            style={{ 'padding-left': '10px' }}
                                        >
                                            Duplicate
                                        </FormLabel>
                                    </IconButton>
                                    <IconButton
                                        id='drag1'
                                        aria-label='add'
                                        style={{
                                            border: '1px solid #eee',
                                            'border-radius': '0px',
                                            width: '100%',
                                        }}
                                    >
                                        <FormLabel>
                                            <Icon
                                                name='folder.png'
                                                sx={{width:'1rem'}}
                                            />
                                        </FormLabel>
                                        <FormLabel
                                            style={{ 'padding-left': '10px' }}
                                        >
                                            Move to
                                        </FormLabel>
                                    </IconButton>
                                    <IconButton
                                        id='drag5'
                                        aria-label='add'
                                        style={{
                                            border: '1px solid #eee',
                                            'border-radius': '0px',
                                            width: '100%',
                                        }}
                                        onClick={handleDeleteTemplate}
                                    >
                                        <img
                                            src={DeleteIcon}
                                            alt='React Logo'
                                        />{' '}
                                        <FormLabel
                                            style={{ 'padding-left': '10px' }}
                                        >
                                            Delete
                                        </FormLabel>
                                    </IconButton>
                                </FormControl>
                            </Stack>
                        </Popover>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );

}

export default Index;