import React, { useState ,useEffect} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import '../../style/form.css';
import { useDropzone } from 'react-dropzone';
import { useMessage } from '../../components/Header/Header';
import { getCookie,setCookie } from '../../utilities/cookies';
import TemplatePreviewAndSign from '../../components/TemplatePreviewAndSign';
import axios from 'axios';
import { env } from '../../utilities/function';
import { Divider} from '@mui/material';
import {useParams } from 'react-router-dom'
import { addTemplate, updateTemplate, uploadFile } from './Function';
import useStyles from './Style/formTemplate';

const FormTemplate = (props) => {
    console.log(props)
    const classes = useStyles();
    const [pdfFile, setPdfFile] = useState(null);
    const { showError, showSuccess } = useMessage();
    const [signDocument, setSignDocument] =  useState(false);
    const [fileUploaded, setFileUploaded] =  useState(false);
    const {id} = useParams()
    console.log(id)
    const [templateData, setTemplateData] = useState({
        templateName: '',
        templateMessage: '',
        createApiTemplate: false,
        customSigningOrder: false,
        roles: [''],
        id: '',
        userId: '',
        name: '',
        userName: '',
        size: '',
        mimetype: '',
    });

    const addRoleField = () => {
        setTemplateData({
            ...templateData,
            roles: [...templateData.roles, ''],
        });
    };

    const removeRoleField = (indexToRemove) => {
        const updatedRoles = templateData.roles.filter(
            (_, index) => index !== indexToRemove
        );
        setTemplateData({
            ...templateData,
            roles: updatedRoles,
        });
    };

    const handleFileChange = async (file) => {
        setPdfFile(file);
            try {
                //const accessToken = getCookie('accessToken');
                const formData = new FormData();
                formData.append('files', file);
    
                const response =  await uploadFile(formData);

                if (response.data.success === true) {
                    setTemplateData({
                        ...templateData,
                        id: response.data.files.id,
                        userId:  getCookie('userId'),
                        name: response.data.files.filename,
                        size: response.data.files.size,
                        mimetype: response.data.files.mimetype,
                        userName: getCookie('fullName'),
                    });
                    setFileUploaded(true);
                    showSuccess('File is uploaded successfully!');
                } else {
                    showError('Error uploading file');
                }
            } catch (error) {
                showError('Error uploading file');
            }
      };

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (templateData.customSigningOrder) {
            const rolesCopy = [...templateData.roles];
            const [reorderedItem] = rolesCopy.splice(result.source.index, 1);
            rolesCopy.splice(result.destination.index, 0, reorderedItem);

            setTemplateData({
                ...templateData,
                roles: rolesCopy,
            });
        }
    };

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            handleFileChange(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: '.pdf',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(id){
            const response = await  updateTemplate(templateData)
              if (response.status === 200) {
               setSignDocument(true)
                showSuccess("Submitted successfully!");                
              } else {
                showError("Error while submitting form");
              }
        
        }else{
        try {
            // const response = await fetch(
            //     env('BACKEND_SERVER') + '/template/addTemplate',
            //     {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify(formData),
            //     }
            // );
            
            const response = await addTemplate(templateData)
            if (response.data.status === 200) {
                setCookie('templateId',response.data.data._id)
                setCookie('userId',response.data.data.userId)

                setTemplateData(response.data.data)
                showSuccess('Template is successfully added!');
                setSignDocument(true);
            } else {
                showError('Error submitting the form');
            }
        } catch (error) {
            console.error('Network error:', error);
            showError('Error submitting the form');
        }
    }
    };
  /* eslint-disable */

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = {
                    userId: getCookie('userId'),
                };
                const response = await axios.post(
                    env('BACKEND_SERVER') + '/template/'+id,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: false,
                    }
                );
                if (response.status === 200) {
                    const data = response.data.data;
                    setTemplateData(data) 
                   //api call to load pdf file
                   const accessToken = getCookie('accessToken')
                   const responsePdfFile = await axios.get(env('BACKEND_SERVER')+"/document/file/private/"+data.fileId,
                      {
                       responseType:'arraybuffer',
                       headers:{
                        Authorization:'Bearer '+accessToken,
                       },
                       withCredentials:false
                      });

                     if(responsePdfFile.status===200){
                        const blob = new Blob([responsePdfFile.data], {
                            type: 'application/pdf',
                          });
                          const url = URL.createObjectURL(blob);
                          console.log(url); // Log the PDF URL
                          setPdfFile(url);
                          setFileUploaded(true)
                     }else{
                        showError('failed to load file')
                     }

                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if(id){

            fetchData(); // Fetch data when the component mounts
        }
    }, []);
  /* eslint-enable */

    return (
        <Box sx={{ flexGrow: 1 }}>
            {signDocument && (
                <TemplatePreviewAndSign pdfFile={pdfFile} templateData={templateData}></TemplatePreviewAndSign>
            )}
            <Grid container justifyContent='center' spacing={2} my={2}>
                
                <Grid item xs={12} md={6}>
                    <Grid item xs={12}  marginBottom={'.5rem'}>
                        <Typography variant='h6'  component={'subtitle2'}>
                            {id?"Edit":"Create New"} Template
                        </Typography>
                    </Grid>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} marginBottom={'1.5rem'}>
                            <Grid item xs={12}>
                               
                                <FormControl fullWidth>
                                    <FormLabel>Template Name</FormLabel>
                                    
                                    <TextField
                                        type='text'
                                        placeholder='A template name to identify your template.'
                                        fullWidth
                                        value={templateData.templateName}
                                        onChange={(e) =>
                                            setTemplateData({
                                                ...templateData,
                                                templateName: e.target.value,
                                            })
                                        }
                                    />
                                 
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel>Optional Message</FormLabel>
                                    <TextareaAutosize
                                        placeholder='Add an optional message for all future documents created using this template.'
                                       className={classes.customTextarea}
                                        value={templateData.templateMessage}
                                        onChange={(e) =>
                                            setTemplateData({
                                                ...templateData,
                                                templateMessage: e.target.value,
                                            })
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                className='uiCheckbox-inner uiCheckbox-unChecked'
                                                checked={
                                                    templateData.createApiTemplate
                                                }
                                                onChange={(e) =>
                                                    setTemplateData({
                                                        ...templateData,
                                                        createApiTemplate:
                                                            e.target.checked,
                                                    })
                                                }
                                            />
                                        }
                                        label='Create an API Template'
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                         <Divider />
                        <Grid container spacing={2} marginTop={'1.5rem'}>
                            <Grid item xs={12} marginBottom={'.5rem'}>
                                <Typography variant='h6' component={'subtitle2'}>{id?"Edit":"Create"} Template Roles</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId='roles'>
                                        {(provided) => (
                                            <div ref={provided.innerRef}>
                                                {templateData.roles.map(
                                                    (role, index) => (
                                                        <Draggable
                                                            key={index}
                                                            draggableId={`role-${index}`}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={
                                                                        classes.roleField
                                                                    }
                                                                >
                                                                    {templateData.customSigningOrder && (
                                                                        <div
                                                                            className={
                                                                                classes.roleNumber
                                                                            }
                                                                        >
                                                                            {index +
                                                                                1}
                                                                            .
                                                                        </div>
                                                                    )}
                                                                    <TextField
                                                                        type='text'
                                                                        placeholder='Role'
                                                                        fullWidth
                                                                        value={
                                                                            role
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const updatedRoles =
                                                                                [
                                                                                    ...templateData.roles,
                                                                                ];
                                                                            updatedRoles[
                                                                                index
                                                                            ] =
                                                                                e.target.value;
                                                                            setTemplateData(
                                                                                {
                                                                                    ...templateData,
                                                                                    roles: updatedRoles,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            removeRoleField(
                                                                                index
                                                                            )
                                                                        }
                                                                    >
                                                                        <RemoveCircleOutlineIcon />
                                                                    </IconButton>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant='outlined'
                                    onClick={addRoleField}
                                >
                                    Add Role
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2} marginBottom={'1.5rem'}>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                className='uiCheckbox-inner uiCheckbox-unChecked'
                                                checked={
                                                    templateData.customSigningOrder
                                                }
                                                onChange={(e) =>
                                                    setTemplateData({
                                                        ...templateData,
                                                        customSigningOrder:
                                                            e.target.checked,
                                                    })
                                                }
                                            />
                                        }
                                        label='Custom signing order'
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Divider/>
                        <Grid container spacing={2} marginTop={'1.5rem'}>
                            <Grid item xs={12}>
                                <Grid item xs={12} marginBottom={'.5rem'}>
                                    <Typography variant='h6' component={'subtitle2'}>Upload File</Typography>
                                </Grid>
                                <FormLabel>File Uploader</FormLabel>
                                {!pdfFile && (
                                    <Grid item xs={12} sm={12}>
                                        <div
                                            {...getRootProps({
                                                className: `${
                                                    classes.dropzone
                                                } ${
                                                    isDragActive
                                                        ? classes.dropzoneActive
                                                        : ''
                                                }`,
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            {isDragActive ? (
                                                <p>Drop the PDF file here...</p>
                                            ) : (
                                                <p>
                                                    Drag 'n' drop a PDF file
                                                    here, or click to select one
                                                </p>
                                            )}
                                        </div>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {/* Implement your import file buttons here */}
                                {/* Example: */}
                                {/* <Button variant="outlined">Import Files</Button> */}
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    fullWidth
                                    disabled={!fileUploaded}
                                >
                                    Fill Template
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FormTemplate;
