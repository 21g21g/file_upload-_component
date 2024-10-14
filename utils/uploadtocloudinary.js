import axios from "axios"
import { Base64 } from "js-base64";
export const uploadFileFunction=async(file)=>{
   const config=useRuntimeConfig()
      const url=`https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`;
      const UPLOAD_PREIST="file_upload";
      const formData = new FormData();
      formData.append('file',file)
      formData.append("upload_preset",UPLOAD_PREIST)

       try{
        const response=await axios.post(url,formData)
        const securUrl=response.data.secure_url
        // first fetch the data as a binary format.
        const comingFile=await axios.get(securUrl,{
            responseType:"arraybuffer" //this means accept the data as binary type.
         })
        console.log(comingFile)
        const mimeType = file.type;
         const changetoBase64=`data:${mimeType};base64,${Base64.fromUint8Array(new Uint8Array(comingFile.data))}`;
         console.log(changetoBase64)
         return changetoBase64
         }catch(error){
        console.log("error")
         }
   

}