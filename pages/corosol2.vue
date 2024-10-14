<script setup>
import {Corosol2} from "../utils/util"
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
        return 5
        
    }
    else if(windowWidth.value>=768){
        return 4
    }
    else if(windowWidth.value>=640){
        return 3
    }
    else{
        return 2
    }

})
</script>
<template>
 <CorosolComponent  :item="itemsToShow" :corosolArray="Corosol2"/>

</template>