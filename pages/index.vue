<script setup>
import {ref} from "vue"
import {Jobs} from "../utils/util"
// const activeLink = ref('home'); 
// const links = ['home', 'about', 'services', 'teams', 'projects', 'partners', 'contacts'];
// const setactiveLink=(link)=>{
//     activeLink.value=link
// }
// const  itemsToShow=ref(4)






</script>
      <template>
    
         <div class="flex flex-col">
            <h1>jobs</h1>
            <div>
             <JobCard  :jobValue="Jobs"/>
            </div>
           
          <!-- <div class="fixed p-5 left-0 top-0  flex flex-row gap-1" >
            <a v-for="link in links" :key="link" :href="`#${link}`" @click="setactiveLink(link)" :class="{'text-red-600':activeLink==link}" class="gap-2">{{link}} </a>
          </div> -->

    </div>
</template>