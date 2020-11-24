<template>
  
    <div>
        
            <positem    v-for="item in availableItems" 
                        v-bind:item="item"
                        v-bind:key="item.id"
                        @click="$emit('itemclick',item)">
            </positem>
    </div>
</template>

<script>
import positem from './positem.vue'
export default {
    components : { positem },
    props : ['availableItems']

}
</script>

<style>

</style>