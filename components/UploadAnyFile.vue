<script setup>
import {Form,Field,ErrorMessage} from "vee-validate"
import {toFieldValidator} from "@vee-validate/zod"
import {z} from "zod"
import {computed, onMounted, ref } from "vue";
import addition from "../assets/icons/addition.vue";
import cancel from "../assets/icons/cancel.vue";
import fileupload from "../assets/icons/fileupload.vue";
const returnedData=ref([])
const spanFlag = ref(true);
const status = ref(" ");
const base64Data = ref([
  {
    data: "https://w7.pngwing.com/pngs/926/178/png-transparent-brown-vehicle-car-icon-car-compact-car-glass-mode-of-transport-thumbnail.png",
    status: "completed",
    filename: "default-image.png"
  },
  {
    data: "https://www.w3schools.com/html/mov_bbb.mp4", 
    status: "completed",
    filename: "default-video.mp4"
  },
  {
    data: "https://pdfobject.com/pdf/sample.pdf",
    status: "completed",
    filename: "default-file.pdf"
  }
]);



const errorMessage = ref("");
const updateIndex=ref(null)
const changedFiles=ref([])
const emit = defineEmits(['file_upload']);
const props = defineProps({
  accept: {
    type: String,
    default: 'image/*,video/*,application/*',
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  maxFiles: {
    type: Number,
    default: 15,
  },
  filesize:{
    type:Number,

  }
});

const schema = z.object({
  files: z.array(
    z.object({
      file: z
        .instanceof(File)
        .refine(
          (file) => props.accept.split(',').includes(file.type),
          `File type must be one of: ${props.accept}`
        )
        .refine(
          (file) => file.size <= props.filesize,
          `File size must not exceed ${(props.filesize / 1000).toFixed(2)} KB`
        ),
    })
  )
  .refine(
    (files) => files.length <= props.maxFiles,
    `You can only upload up to ${props.maxFiles} files`
  ),
});

const validateSchema = toFieldValidator(schema);



onMounted(() => {
  setInterval(() => {
    errorMessage.value = "";
  }, 4000);
});

const validateFile = (file) => {
  const validTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff', 'image/heif', 'image/heic',
    'video/x-msvideo', 'video/mpeg', 'video/quicktime', 'video/x-flv', 'video/x-matroska', 'video/3gpp',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip'
  ];
  return validTypes.includes(file.type);
};
const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const fileBase64 = reader.result; 
        const newFile = {
            data: fileBase64,
            status: "pending",
            filename: file.name,
        };

        const existingIndex = base64Data.value.findIndex(item => item.filename === file.name);
        
        if (existingIndex !== -1) {
            base64Data.value[existingIndex] = newFile;
        } else {
            base64Data.value.push(newFile);
        }
        
        emit("file_upload", fileBase64);
    };
    reader.readAsDataURL(file);
};

const remainingFilesCount = computed(() => {
  return props.maxFiles - base64Data.value.length;
});
const isImage = (index) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff'];
  
  
  if (base64Data.value[index].data.startsWith('data:image/')) {
    return true;
  }
  
  return imageExtensions.some(ext => base64Data.value[index].data.toLowerCase().endsWith(ext));
};

const isVideo=(index)=>{
  const vedeoExtensions=['mpeg','x-msvideo','mp4','quicktime','x-flv','x-matroska','3gpp']
  if(base64Data.value[index].data.startsWith('data:video/')){
    return true;
  }
  return vedeoExtensions.some(ext=>base64Data.value[index].data.toLocaleLowerCase().endsWith(ext))
}
const isPdfDocument=(index)=>{
  const pdfExtensions=['pdf', 'msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document',
    'vnd.ms-excel', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'vnd.ms-powerpoint', 'vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip']
    if(base64Data.value[index].data.startsWith('data:application/')){
      return true
    }
    return pdfExtensions.some(ext=>base64Data.value[index].data.toLocaleLowerCase().endsWith(ext))
}
const getFileTypeFromFilename = (filename) => {
  const fileExtension = filename.split('.').pop().toLowerCase();
  console.log(fileExtension)

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'].includes(fileExtension)) {
    return "image";
  } else if (['mp4', 'mpeg', 'avi', 'flv', 'mkv', '3gp', 'mov'].includes(fileExtension)) {
    return "video";
  } else if (['pdf', 'msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document',
    'vnd.ms-excel', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'vnd.ms-powerpoint', 'vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip'].includes(fileExtension)) {
    return "pdf";
  }

  return null; 
};

const replaceDefaultFile = (file) => {
  console.log(file)
  const fileType = getFileTypeFromFilename(file.name);
  const reader = new FileReader();
  reader.onloadend = () => {
    const fileBase64 = reader.result;
    const index = base64Data.value.findIndex(fileItem => {
      if (fileType === "image") return fileItem.filename === "default-image.png";
      else if (fileType === "video") return fileItem.filename === "default-video.mp4";
      else if (fileType === "pdf") return fileItem.filename === "default-file.pdf";
    });
    if (index !== -1) {
      base64Data.value[index] = { data: fileBase64, status: "pending", filename: file.name };
      emit("file_upload", fileBase64);
    }
  };
  reader.readAsDataURL(file);
};
const triggerFileInput = (index=null) => {
  updateIndex.value = index;  
  document.getElementById("customFileInput").click();
};
const onFileChange = (event) => {
  const files = Array.from(event.target.files);
   console.log(files.map((file)=>{
    return{
      file:file.size
    }
   }))
  
  if (files.length > 0) {
    spanFlag.value = false;
  }
 const hasDefaults = base64Data.value.every(file => file.filename.startsWith("default-"));
  if (hasDefaults) {
    files.forEach(file => replaceDefaultFile(file));
  }
  // else{
      const totalFilesSelected = base64Data.value.length + (updateIndex.value === null ? files.length : 0); ;
  
  if (totalFilesSelected > props.maxFiles) {
    errorMessage.value = `You cannot upload more than ${props.maxFiles} files.`;
    return;
  }

  errorMessage.value = "";
  
     files.forEach((file) => {
    if (validateFile(file)) {
      if (updateIndex.value !== null) {
        // Update the existing file at the specific index
        const reader = new FileReader();
        reader.onloadend = () => {
          base64Data.value[updateIndex.value] = {
            data: reader.result,
            status: "pending",
            filename: file.name,
          };
          console.log(updateIndex.value)
          // updateIndex.value = null; 
          emit("file_upload", reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // if UpdateIndex=null ,ake a normal file upload process.
        convertToBase64(file);
      }
    } else {
      errorMessage.value = "Invalid file format.";
    }
  });
  // }




};
// for the below code index=null means set the defgault value =null if you don't pass the value.




const cancelUpload = (index) => {

  returnedData.value.splice(index,1)
  base64Data.value.splice(index, 1);
  
  
};

const canceAll = () => {
  base64Data.value.splice(0, base64Data.value.length);
  returnedData.value=[]
};


const uploadFunctionality = async () => {

   const nodDefaultValues=base64Data.value.filter(file=>!file.filename.startsWith("default-")&& file.status === "pending")

  // const nodDefaultValues=base64Data.value.filter(file=>!file.filename.startsWith("default-"))
  console.log(nodDefaultValues)
   changedFiles.value=[]
  if(nodDefaultValues.length===0){
    console.log("no send request for empty files")
    return;
  }
  if(updateIndex.value !== null){
    console.log(nodDefaultValues)
    console.log(updateIndex.value)
        // nodDefaultValues=[]
       const file=nodDefaultValues[updateIndex.value]
      changedFiles.value=[{
      name:file.filename,
      secure_url:`https://cdn.com/${file.filename}`,
    }]
   
      //  updateIndex.value=null
     
  
    }
   
  else{
       changedFiles.value = nodDefaultValues.map(file => ({
        name: file.filename,
        secure_url: `https://cdn.com/${file.filename}`,
    }));


  }
    
    console.log(changedFiles.value)

    try {
      const currentIndex=updateIndex.value
      
      console.log(currentIndex)
      updateIndex.value=null
      // console.log(updateIndex.value)
        const response = await fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({changedFiles:changedFiles.value}), 
        });

        if (!response.ok) {
            throw new Error(`Failed to upload files: ${response.statusText}`);
        }
         
        const responseData = await response.json();
       if (currentIndex !== null) {
    // Access the item at the current index
    const itemAtCurrentIndex = returnedData.value[currentIndex];

  
    const newEre = responseData.data.changedFiles[currentIndex]?.name; 
    const newBas = responseData.data.changedFiles[currentIndex]?.secure_url; 

    if (newEre && newBas) {
        itemAtCurrentIndex.ere = newEre;
        itemAtCurrentIndex.bas = newBas; 
        console.log("Item after update:", itemAtCurrentIndex);
    } else {
        console.warn("New values not found in responseData for the current index.");
    }
}
else{
   returnedData.value = [
        ...returnedData.value,  
        ...responseData.data.changedFiles.map(res => ({
          ere: res.name,
          bas: res.secure_url
       }))
            ];
}
     
    
  
        
        changedFiles.value=[]
        console.log(returnedData.value)
        
    } catch (error) {
        console.error("Error occurred:", error.message); 
    }

    // Update the status of files
       base64Data.value.forEach((file, index) => {
        if (file.status === "pending") {
            file.status = "completed";
        }
    });
};

</script>

<template>
<div class="flex w-full flex-row">
  
  <div class="border-2 rounded-lg border-gray-300 py-7 px-5 md:w-[75rem] ml-1 md:ml-5 flex flex-col mt-6">
   <!-- <Form :validation-schema="validateSchema"> -->

    <Field
      id="customFileInput"
      type="file"
       name="files"
      @change="onFileChange"
      :accept="accept"
      :multiple="multiple"
      :filesize="filesize"
      :disabled="remainingFilesCount <= 0"
      class="hidden"
    />
       <!-- <ErrorMessage name="files" class="text-red-500" /> -->

    <div class=" border-2 rounded-lg border-gray-300 py-7 px-2 md:px-5 w-full md:w-[70rem] mt-6">
      <div class="flex flex-row gap-3 md:gap-6 items-center mb-5">
        <div class="flex flex-row gap-1 md:gap-2 items-center bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out" @click="triggerFileInput()">
          <addition class="w-3 h-3 md:w-6 md:h-6" />
          <p class="text-lg font-semibold">Choose</p>
        </div>

        <div 
          @click="uploadFunctionality"
          class="flex flex-row gap-1 md:gap-2  items-center bg-gray-400 text-white py-2 px-4 rounded-lg cursor-pointer shadow-lg transition-all duration-300 ease-in-out"
          :class="{ 'cursor-not-allowed opacity-50': base64Data.length === 0, 'hover:bg-green-600': base64Data.length > 0 }"
          :disabled="base64Data.length === 0">
          <fileupload class="w-3 h-3 md:w-6 md:h-6" />
          <p class="text-lg font-semibold">Upload</p>
        </div>

        <div 
          @click="canceAll"
          class="flex flex-row gap-1 md:gap-2  items-center bg-gray-400 text-white py-2 px-4 rounded-lg cursor-pointer shadow-lg"
          :class="{ 'cursor-not-allowed opacity-50': base64Data.length === 0, 'hover:bg-zinc-400': base64Data.length > 0 }"
          :disabled="base64Data.length === 0">
          <cancel class="w-3 h-3 md:w-6 md:h-6" /> 
          <p class="text-lg font-semibold">Cancel</p>
        </div>
      </div>

      <span v-if="spanFlag" class="text-gray-700 text-lg text-center font-medium">Click to upload or drag and drop files here</span>
    </div>

    <div v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </div>

    <div v-if="base64Data.length > 0">
      <div v-for="(base64, index) in base64Data" :key="index">
        <div class="gap-1 border-b-2 flex flex-row justify-between border-zinc-400 mt-4" v-if="isImage(index)">
        
          <img
            :src="base64.data"
            alt="Image Preview"
            class="w-[10rem] h-[5rem] md:w-[20rem] md:h-[10rem] object-cover"
          />
          
          <Status :status="base64.status" />

          <div class="flex items-center justify-end">
           <!-- <div class="flex items-center flex-col ml-5 mt-10" v-if="returnedData[index]">
        <div class="flex flex-col gap-1">
          <p>Name: {{ returnedData[index].ere}}</p>
          <p>base64: {{ returnedData[index].bas }}</p>
        </div>
      </div> -->
          
             <button class="mr-4 text-blue-500 cursor-pointer" @click="triggerFileInput(index)">change</button>

            <cancel @click="cancelUpload(index)" class="cursor-pointer stroke-red-700" />
          </div>
        </div>

        <div v-if="isVideo(index)" class="gap-1 border-b-2 flex flex-row justify-between border-zinc-400 mt-4">
          <video :src="base64.data" controls class="w-[20rem] h-[10rem]"></video>
          <Status :status="base64.status" />
          
          <div class="flex items-center justify-end">
      
         <!-- <div class="flex items-center flex-col ml-5 mt-10" v-if="returnedData[index]">
        <div class="flex flex-col gap-1">
          <p>Name: {{ returnedData[index].ere }}</p>
          <p>base64: {{ returnedData[index].bas }}</p>
        </div>
      </div> -->
            <button class="mr-4 text-blue-500 cursor-pointer" @click="triggerFileInput(index)">change</button>
            <cancel @click="cancelUpload(index)" class="cursor-pointer" />
          </div>
        </div>

        <div class="gap-1 border-b-2 flex flex-row justify-between border-zinc-400 mt-4" v-if="isPdfDocument(index)">
          <iframe :src="base64.data" class="w-[20rem] h-[10rem]" frameborder="0"></iframe>
          <Status :status="base64.status" />
          
          <div class="flex items-center justify-end">
       
         <!-- <div class="flex items-center flex-col ml-5 mt-10" v-if="returnedData[index]">
        <div class="flex flex-col gap-1">
          <p>Name: {{ returnedData[index].ere }}</p>
          <p>base64: {{ returnedData[index].bas }}</p>
        </div>
      </div> -->
            <button class="mr-4 text-blue-500 cursor-pointer" @click="triggerFileInput(index)">change</button>

            <cancel @click="cancelUpload(index)" class="cursor-pointer" />
          </div>
        </div>
      </div>
         </div>

         <!-- </Form> -->
          </div>
           <div  class="flex items-center flex-col ml-5 mt-10" v-if="returnedData.length>0">
            <div v-for="read in returnedData" :key="read" class="flex flex-col gap-1">
              <p>Name:{{read.ere}}</p>
              <p>base64:{{read.bas}}</p>


            </div>
           
            </div>
</div>
  
</template>