<script setup>
const props=defineProps({
    status:{
        type:String
    }
})
</script>
<template>
    <div class="flex items-center">
            <p v-if="status==='pending'" class="text-orange-400">pending</p> 
            <p v-if="status==='completed'" class="text-green-600">completed</p>
          </div>
</template>