import eSignApi from '../../../api'
import { getCookie } from '../../../utilities/cookies';

export const getTemplates = async ()=>{
    let data = {
        userId: getCookie('userId'),
    };
    return await eSignApi.post('/template/getTemplates', data );
}

export const getTemplate = async (id)=>{
    
}

export const addTemplate = async (data)=>{
   return await eSignApi.post("/template/addTemplate",data);
}

export const updateTemplate = async (data)=>{
    return await eSignApi.put("/template/updateTemplate",data);
}

export const editTemplate = async (id)=>{
    
}

export const deleteTemplate = async (id,handleClose,fetchData,showError,showSuccess)=>{

        const response = await eSignApi.delete('/template/deleteTemplate/'+id,);

        if(response.status===200){
         handleClose()
         showSuccess('template deleted !')
         fetchData();
        }
        else{
         showError("template not delete!")
        }
}

export const getFile = async (fileId)=>{
    const accessToken = getCookie('accessToken');
    return await eSignApi.get("/document/upload/" + fileId,
        {
            responseType: 'arraybuffer',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        }
    );
}

export const uploadFile = async (formData)=>{
   return await eSignApi.post("/document/upload", 
    //'https://api.files.clikkle.com/file/private',      
      formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
}