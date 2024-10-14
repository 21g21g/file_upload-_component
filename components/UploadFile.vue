<script setup>
import { ref } from "vue";
import { uploadFileFunction } from "../utils/uploadtocloudinary";

// Reactive references for file and loading state
const selectedFile = ref([]);
const uploadedImage=ref([])
const loading = ref(false);
// const emit=defineEmits(['fileupload'])
const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
//   emit("fileupload",files)
  selectedFile.value = files;
};

const uploadHandler = async () => {
  if (!selectedFile.value.length) {
    console.log("No file selected");
    return;
  }

  loading.value = true;

  try {
    for(let i=0;i<selectedFile.value.length;i++){

  const base64 = await uploadFileFunction(selectedFile.value[i]); 
     uploadedImage.value.push(base64)
    }
  
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
<div class="flex flex-col">
     <div class="flex flex-col items-center space-y-4">
    <input type="file" @change="handleFileChange" multiple>

    <button 
      @click="uploadHandler" 
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
      Upload
    </button>

    <p v-if="loading" class="text-gray-500">Uploading...</p>
  </div>
 <div v-if="uploadedImage.length > 0" class="flex flex-wrap gap-4">
      <div v-for="(ima, index) in uploadedImage" :key="index" class="w-1/4 p-2">
        <img :src="ima" alt="Uploaded image" class="w-full h-auto rounded-lg shadow-md" /> 
      </div>
    </div>
  
</div>
 
</template>