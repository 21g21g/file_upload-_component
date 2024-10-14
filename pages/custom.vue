<script setup>
import { ref } from "vue";

const base64Data = ref([]);
const errorMessage = ref("");  // Store error message
const emit = defineEmits(['file_upload']);

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*,application/*',
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  maxFiles: {
    type: Number,
    default: 5,
  },
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
    const changedBase64 = reader.result;
    base64Data.value.push(changedBase64);
    emit("file_upload", changedBase64);
  };
  reader.readAsDataURL(file);
};

// File type checkers
const isImage = (index) => base64Data.value[index].startsWith('data:image/');
const isVideo = (index) => base64Data.value[index].startsWith('data:video/');
const isPdfDocument = (index) => base64Data.value[index].startsWith('data:application/');

// Handle file change
const onFileChange = (event) => {
  const files = Array.from(event.target.files);

  const totalFilesSelected = base64Data.value.length + files.length;

  if (totalFilesSelected > props.maxFiles) {
    errorMessage.value = `You cannot upload more than ${props.maxFiles} files.`;
    return; 
  }

  errorMessage.value = "";

  files.forEach((file) => {
    if (validateFile(file)) {
      convertToBase64(file);
    } else {
      errorMessage.value = "Invalid file format.";
    }
  });
};

const remainingFilesCount = () => {
  return props.maxFiles - base64Data.value.length;
};

const triggerFileInput = () => {
  document.getElementById("customFileInput").click();  // Trigger file input click
};
</script>

<template>
  <div class="file-uploader">
    <!-- Hidden default input -->
    <input
      id="customFileInput"
      type="file"
      @change="onFileChange"
      :accept="accept"
      :multiple="multiple"
      :disabled="remainingFilesCount() <= 0"
      class="hidden"
    />

    <!-- Custom file upload button -->
    <div class="custom-upload-area" @click="triggerFileInput">
      <span>Click to upload or drag files here</span>
    </div>

    <div v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </div>

    <div v-if="base64Data.length > 0" class="file-previews">
      <div v-for="(base64, index) in base64Data" :key="index">
        <div v-if="isImage(index)">
          <h4>Image Preview:</h4>
          <img
            :src="base64"
            alt="Image Preview"
            class="preview-image"
          />
        </div>

        <div v-if="isVideo(index)">
          <h4>Video Preview:</h4>
          <video
            :src="base64"
            controls
            class="preview-video"
          ></video>
        </div>

        <div v-if="isPdfDocument(index)">
          <h4>Document Preview:</h4>
          <iframe
            :src="base64"
            class="preview-pdf"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide the native file input */
.hidden-input {
  display: none;
}

/* Custom file upload area */
.custom-upload-area {
  border: 2px dashed #4a90e2;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #f4f4f4;
  transition: background-color 0.3s;
}

.custom-upload-area:hover {
  background-color: #e0e0e0;
}

/* Styling for the file previews */
.preview-image, .preview-video {
  max-width: 300px;
  max-height: 300px;
  margin-top: 10px;
}

.preview-pdf {
  width: 100%;
  height: 500px;
  margin-top: 10px;
}
</style>