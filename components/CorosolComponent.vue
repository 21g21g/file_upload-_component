<script setup>
// import {ref,onMounted} from "vue"
const props=defineProps({
    item:String,
    corosolArray:Array
    
})

</script>
<template>
      <Carousel  :items-to-show="props.item" class="mt-10">
    <Slide v-for="slide in props.corosolArray" :key="slide">
         <div class="flex flex-col w-[20rem]">   
                 <img :src="slide.ima" alt="there is no image" class="object-cover w-full h-44">
        <h2 class="bg-stone-600 py-4 text-white w-full text-sm">{{slide.description}}</h2>
       
      </div>
        </Slide>

    <template #addons>
      <Navigation />
     
    </template>
  </Carousel>
    </template>
