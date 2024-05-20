import React,{useState,useEffect,useRef} from 'react';
import {Popover ,Box,Paper,Grid,Typography,FormControl,
        Select,MenuItem,Divider,Stack,TextField,InputLabel, Tooltip} from '@mui/material';
import makeStyles  from '@mui/styles/makeStyles';
import styled from '@emotion/styled';
import { getCookie } from '../../../utilities/cookies';
import { Button, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import { env } from '../../../utilities/function';
import Icon from '../../../components/Icons/Icon';
import { useMessage } from '../../../components/Header/Header';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from '../../../hooks/Authorize';
import { useNavigate } from 'react-router-dom';

const CustomPaper = styled(Paper)(({ theme }) => ({
    width:'90%',
    background:'none',
    paddingLeft:'5%',
    textAlign: 'start',
    
  }));
  

  const useStyles = makeStyles((theme) => ({
    paperStyle: {
        
        border: '1px dashed #212121', // Dashed border
        borderRadius: 4,
        padding: theme.spacing(2),
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

const BulkSend = (props) => {
    const classes = useStyles();
    const [templates,setTemplates] = useState([]);
    const [isSelectColumn,setIsSelectColumn] = useState(true)
    const [rows,setRows] = useState(null)
    const [open,setOpen] = useState(false)
    const [rowId,setRowId] = useState(null)
    const [bulkSendData,setBulkSendData] = useState(
      {
        selectedTemplate:null,
        csvFile:null,
        documentTitle:'',
        optionalMessage:''
      }
    )
    const fileInputRef = useRef(null)
    const {showError,showSuccess} = useMessage();
    const user = useUser()
    const navigate = useNavigate();
    const getRowId = (row) => row.id;
     
    const handleSelectChange = (event) => {
    setBulkSendData({...bulkSendData,selectedTemplate:event.target.value})         
    };
    const handleRoleAssignChange = (event)=>{
      //setRows([filterRow,{...rowData,role:event.target.value}])
      setRows((previousRows)=>{
        return previousRows.map((row)=>{
          if(row.id===rowId){
            console.log(row.id,rowId)
            return {
              ...row,
              role:event.target.value
            }
          }
          return row
        })
      })
      setOpen(false)
    }
    const handleDocumentTitleChange = (event)=>{
      setBulkSendData({...bulkSendData,documentTitle:event.target.value})
    }
    const handleOptionalMessageChange = (event)=>{
      setBulkSendData({...bulkSendData,optionalMessage:event.target.value})
    }
  
    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger the file input when the button is clicked
      };

    const handleFileChange = (event)=>{
       console.log(event.target.files[0].name)
       const file = event.target.files[0]
       if(file){
        setBulkSendData({...bulkSendData,csvFile:file})
        const reader = new FileReader()
        reader.onload = (e)=>{
            const content = e.target.result;
            parseCSV(content);
        }
        reader.readAsText(file);
        showSuccess("CSV File is loaded successfully!")
        setIsSelectColumn(false)
         
       }else{
        showError('CSV file load Error!')
       }
       
    }
    const parseCSV = (csvContent)=>{
        const rows = csvContent.split('\n').map(row=>row.trim().split(','));
         const rowsData = []
         rows.forEach(row => {
            if(row[0].length>0){
                rowsData.push({id:row[1],name:row[0],email:row[1],role:bulkSendData.selectedTemplate?bulkSendData.selectedTemplate.roles[0]:'',status:'pending'})
            }
         });
        console.log(rows)
        console.log(rowsData)
        setRows(rowsData)
    }
    const handleClick = (event,id)=>{
      console.log(id)
      setRowId(id)
      setOpen(true)
    }
    const handleClose = ()=>{
      setOpen(false);
    }
    const handleRequestForSign = async()=>{
//        console.log(selectedTemplate)
          setIsSelectColumn(true)
        try {
            if(bulkSendData.selectedTemplate){
              const {
                fileId,userId,fileName,size,
                userName,mimetype,
                viewers,placeholders,selectedAction} = bulkSendData.selectedTemplate;
               
            const data = {
                id: fileId,
                userId: userId,
                name: fileName,
                userName: userName,
                size: size,
                mimetype: mimetype,
                viewers: viewers,
                selectedAction: selectedAction,
                status:'Awaiting'
              };
              for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const filterPlaceholders = placeholders.filter(item=>item.signerName===row.role)
               // console.log(filterPlaceholders)
                const newPlaceholder = filterPlaceholders.map((item)=>{
                    return {
                      ...item,
                      signerName:row.name,
                      signerEmail:row.email
                    }
                })
              // console.log(newPlaceholder) 
               const newSigningOrder = {name:row.name,email:row.email,status:"pending"}
               data.placeholders = newPlaceholder;
               data.signingOrder = newSigningOrder;

             //  console.log(data)
               if(data.placeholders.length>0){

                 const responseAddDocument = await axios.post(
                   env("BACKEND_SERVER") + "/document/addDocument",
                   data,
                   {
                     headers: {
                       "Content-Type": "application/json",
                     },
                     withCredentials: false,
                   }
                 );
                 if(responseAddDocument.data.status===200){

                     const documentData = responseAddDocument.data.data;

                             let data = {
                                 userEmail: user.email,
                                 documentTitle: bulkSendData.documentTitle,
                                 optionalMessage: bulkSendData.optionalMessage,
                                 documentDetails: documentData,
                               };
                            
                                          await axios.post(
                                           env("BACKEND_SERVER") + "/document/sendMail",
                                           data,
                                           {
                                             headers: {
                                               "Content-Type": "application/json",
                                             },
                                             withCredentials: false,
                                           }
                                         );
                            // if(responseSendMail.status===200){
                            //   console.log("responceSendMail",responseSendMail)
                            // }
                          }
                          
                        }
                      }
                   navigate("/documents/awaiting")
        }else{
            showError("Please Select a template! or not then go first create.")
        }

        } catch (error) {
            
        }
        setIsSelectColumn(false)
    }
     
    const columns = [
        
        { field: 'name', headerName: 'Name', width: 140 },
        { field: 'email', headerName: 'Email', width: 140,renderCell:params=>
         
        <Typography>{params.row.email}</Typography>
          },
        { field: 'role', headerName: 'Role', width: 200 ,renderCell:params=>
        <div>
                    <Button
                      //  aria-describedby={id}
                        variant='outlined'
                       onClick={(event)=>handleClick(event,params.row.id)}
                    >
                    { params.row.role?params.row.role:"Assign Role"}
                    </Button>
                </div>
         },
      ];
      
      const fetchData = async () => {
        try {
            let data = {
                userId: getCookie('userId'),
            };
            const response = await axios.post(
                env('BACKEND_SERVER') + '/template/getTemplates',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: false,
                }
            );
            if (response.status === 200) {
                setTemplates(response.data.data); // Update the templates state with API data
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData(); // Fetch data when the component mounts
    }, []);

    return (
         <CustomPaper elevation={0}  >
            <Grid item sx={{marginBottom:'3rem'}}>
                <Box  sx={{marginY:'1rem'}} >
                     <Typography variant='h6' component={'body2'}>Get Your Template Signed by Many</Typography>
                </Box>
                <Box >
                    <Typography variant='body1' component={'subtitle2'}>Choose the template you like to sign.</Typography>
                </Box> 
                <Box  >
                    <Box  sx={{marginBottom:'.5rem'}}>
                         <Typography sx={{color:'gray'}} 
                                     variant='body2' 
                                     component={'body2'}
                                     >
                                    Template must have only one signer with preparer.
                        </Typography>
                    </Box>
                    <Box >
                    <FormControl   fullWidth>
                            <InputLabel shrink={false} 
                                        id="template-select-label">
                                {bulkSendData.selectedTemplate?'':'Choose a template'}
                             </InputLabel>
                             <Tooltip title="select template">
                            <Select
                            labelId="template-select-label"
                            id="template-select"
                            value={bulkSendData.selectedTemplate?.templateName}
                            onChange={handleSelectChange}
                            >
                            {templates.length===0 && <MenuItem value="">Choose a template</MenuItem>}
                             {templates.map((template) => (
                                <MenuItem key={template.id} value={template}>
                                {template.templateName}
                                </MenuItem>
                            ))} 
                            </Select>
                            </Tooltip>
                    </FormControl>
                    </Box> 
                </Box>
            </Grid>
                <Divider/>
            <Grid item sx={{marginY:'3rem'}}>
                    <Box  >
                        <Typography variant='h6' component={'body2'}>Upload CSV</Typography>
                    </Box>
                    <Box sx={{marginY:'.5rem'}}>
                        <Typography sx={{color:'gray'}} 
                                     variant='body2' 
                                     component={'body2'}>
                            Send a signature request to a group of people all at once. Just upload a CSV file with name and email address.
                        </Typography>
                    </Box>
                    <Box sx={{marginY:'.3rem'}}>
                        <Typography>File Uploader</Typography>
                    </Box>
                    <Paper elevation={0} sx={{textAlign:'center'}} className={classes.paperStyle}>
                        <Stack sx={{paddingY:'1.2rem',alginItem:'center'}}>
                            <Typography>Drop CSV here</Typography>
                            <Typography sx={{color:'gray'}}>Or</Typography>
                            <Typography  >
                             <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }} // Hide the default file input
                                accept=".csv" // Specify accepted file types if needed
                            />
                            <Button variant='outlined' onClick={handleButtonClick} >Upload CSV</Button>  
                            </Typography>
                            
                        </Stack>
                    </Paper>
                   {bulkSendData.csvFile && <Box sx={{marginY:'1rem',display:'flex'}}>
                    <Box>
                    <Icon name='/extension/microsoft/excel.png'/>
                    </Box>
                        
                        <Typography marginLeft={'.2rem'}>{bulkSendData.csvFile.name}</Typography>
                         
                    </Box>
                }
            </Grid>
                <Divider/>
            <Grid sx={{marginY:'3rem'}} item>
                    <Box item>
                        <Typography >Title</Typography>
                        <TextField placeholder='Document Title'  
                                   onChange={handleDocumentTitleChange} 
                                   fullWidth
                                   value={bulkSendData.documentTitle}
                                   />
                    </Box>
                    <Box item>
                        <Typography>Message for Signers {`(optional)`}</Typography>
                        <TextareaAutosize placeholder='Add an optional message for signers' 
                                          className={classes.customTextarea}
                                          onChange={handleOptionalMessageChange}
                                          />
                    </Box>
            </Grid>
            <Divider/>
            <Grid item sx={{marginTop:'3rem',marginBottom:'1rem'}}>
            {rows && <DataGrid
                rows={rows}
                getRowId={getRowId}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                }}
                pageSizeOptions={[5, 10,100]}
            />}
             <Popover
                            id={1}
                            open={open}
                           // anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'center',
                            }}
                            PaperProps={{
                                style: {
                                    width: '25%', // Set the desired width here
                                },
                            }}
                        >
                          <FormControl   fullWidth>
                            <InputLabel shrink={false} id="role-select-label">Assign Role</InputLabel>
                            <Select
                            labelId="role-select-label"
                            id="role-select"
                            value={bulkSendData.selectedTemplate?.templateName}
                            onChange={handleRoleAssignChange}
                            >
                            {bulkSendData.selectedTemplate?.roles.length===0 && <MenuItem value="">Choose a Role</MenuItem>}
                             {bulkSendData.selectedTemplate?.roles.map((role,index) => (
                                <MenuItem key={index} value={role}>
                                {role}
                                </MenuItem>
                            ))} 
                            </Select>
                    </FormControl>
                        </Popover>
            </Grid>
            <Grid item sx={{marginTop:'3rem',marginBottom:'1rem'}}>
                    <Button variant='outlined' disabled={isSelectColumn} onClick={handleRequestForSign}>Request For Sign </Button>
                    
            </Grid>
         </CustomPaper>
    );
}

export default BulkSend;