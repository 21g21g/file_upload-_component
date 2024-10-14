<script setup>
const handleFileUpload=(changedBase64)=>{
    console.log("base64 data is",changedBase64)

}
// accept="image/*"
</script>
<template>
    <div>
<UploadAnyFile  @file_upload="handleFileUpload"/>
    </div>
</template>