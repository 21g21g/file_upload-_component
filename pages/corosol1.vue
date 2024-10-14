<script setup>
import {Corosol} from "../utils/util"
const windowWidth=ref(1024)
console.log(windowWidth)
const updateWindowWidth =()=>{
    windowWidth.value=window.innerWidth
}
onMounted(()=>{
window.addEventListener('resize', updateWindowWidth)
updateWindowWidth()

})
const itemsToShow=computed(()=>{
    if(windowWidth.value>=1024){
        return 4
        
    }
    else if(windowWidth.value>=768){
        return 3
    }
    else if(windowWidth.value>=640){
        return 2
    }
    else{
        return 1
    }

})
</script>
<template>
<CorosolComponent  :item="itemsToShow" :corosolArray="Corosol"/>

</template>