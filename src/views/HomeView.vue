<script setup>
import { useTodoStore } from "../stores/todo";
import { RouterLink} from 'vue-router'
import { onMounted, ref } from "vue";

const todoStore = useTodoStore();
const todoText = ref("");
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  await todoStore.loadTodos();
  isLoading.value = false;
  //console.log(todoStore.list);
  
});

const addTodo = async (todoText) => {
  try {
    isLoading.value = true;
    await todoStore.addTodo(todoText);
    await todoStore.loadTodos();
    isLoading.value = false;
  } catch (error) {
    console.log("error : ", error);
  }
}

const editStatus = async (todoData,todoId) => {
  try {
    const updataData = {
      name:todoData.name, 
      status:todoData.status
    }
    isLoading.value = true;
    await todoStore.editTodo(updataData,todoId);
    await todoStore.loadTodos();
    isLoading.value = false;
  } catch (error) {
    console.log("error : ", error);
  }
}

const deleteTodo = async (todoId) => {
  try{
    isLoading.value = true;
    await todoStore.deleteTodo(todoId);
    await todoStore.loadTodos();
    isLoading.value = false;
  }catch (error) {
    console.log("error :", error);
  }
}
</script>
<template>
  <div>
   
    <div>
      <input type="text" v-model="todoText" />
      <button @click="addTodo(todoText)">add</button>
    </div>
    <br />
    <div v-if="isLoading">
      <h1>Loading..</h1>
    </div>
    <br />
    <ul>
      <li v-for="todo in todoStore.list" :key="todo.id">
        {{ todo.name }}

        <select
          v-model="todo.status"
          @change="editStatus(todo,todo.id )"
        >
          <option>Select status</option>
          <option v-for="status in todoStore.statuses" :value="status" :key="status">
            {{ status }}
          </option>
        </select>

        <RouterLink :to="{ name: 'todo-edit', params: {id: todo.id}}"><button>edit</button></RouterLink>
        
        <button @click="deleteTodo(todo.id)">delete</button>
      </li>
    </ul>
  </div>
</template>
