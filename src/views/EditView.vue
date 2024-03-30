<script setup>
import { useTodoStore } from "../stores/todo";
import { RouterLink, useRoute} from 'vue-router'
import { onMounted, ref } from "vue";

const todoStore = useTodoStore();
const todoId = ref(-1);
const isLoading = ref(false);
const route = useRoute();

onMounted(async()=>{
  //console.log(route.params.id);
  await todoStore.loadTodo(route.params.id);
  isLoading.value=true;
  todoId.value = parseInt(route.params.id);
  console.log(todoStore.selectedTodo);
})


const updateTodo = async (selectedTodo) =>{

  try{
    const updataData = {
      name:selectedTodo.name, 
      status:selectedTodo.status
      
    }
    await todoStore.editTodo(updataData,selectedTodo.id);
    alert('Update complate..');
  }catch(error){
    console.log('error',error);
  }

}
</script>

<template>
  <div>
    <div v-if="isLoading"><h1>Edit ID : {{ todoId }}</h1>
    
    
    <input type="text" v-model="todoStore.selectedTodo.name">
    <select
          v-model="todoStore.selectedTodo.status"
        >
          <option>Select status</option>
          <option v-for="status in todoStore.statuses" :value="status" :key="status">
            {{ status }}
          </option>
        </select>
    <button @click="updateTodo(todoStore.selectedTodo)">update</button>
    </div> 
    <div v-else><h1>Loading..</h1> </div>
    
  </div>
</template>


