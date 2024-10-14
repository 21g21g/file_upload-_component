<script setup>
import { ref } from "vue";
import { uploadFileFunction } from "../utils/uploadtocloudinary";
const selectedFile = ref([]);
const uploadedImage=ref([])
const loading = ref(false);
// fileupload 
   const inputValue=ref({
    firstName:"",
    image:[],
    })
   const handleFileUpload=(files)=>{
    selectedFile.value=files



   }
   const handleSubmit=async()=>{

    if(!selectedFile.value){
        console.log("first select the file")
    }
    try{
        for(let i=0;i<selectedFile.value.length;i++){
     const response=await uploadFileFunction(selectedFile.value[i]) 
     uploadedImage.value.push(response)

         // for example if there is insert operation
        inputValue.value.image=uploadedImage



        }
   


    }catch(error){
        console.log("this is error")
    }


}
</script>
<template>
 <div class="flex flex-col">
       <form @submit="handleSubmit" class="flex flex-col">

        <div class="flex flex-col">
         <label for="first first name">First Name</label>
         <input type="text" v-model="inputValue.firstName" placeholder="Enter first name" class="border border-neutral-400">
        </div>
        <div class="flex flex-col">
            <label for="file upload">Upload file</label>
            <UploadFile  @fileupload="handleFileUpload"/>

        </div>

      <button type="submit">submit</button>
       </form>
    </div>
</template>