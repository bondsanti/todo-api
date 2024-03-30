<script setup>
import { useTodoStore } from "../stores/todo";
import { RouterLink, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import Loading from "../components/Loading.vue";
import Swal from "sweetalert2";

const todoStore = useTodoStore();
const todoId = ref(-1);
const isLoading = ref(false);
const route = useRoute();

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

onMounted(async () => {
  //console.log(route.params.id);
  await todoStore.loadTodo(route.params.id);
  isLoading.value = true;
  todoId.value = parseInt(route.params.id);
  console.log(todoStore.selectedTodo);
});

const updateTodo = async (selectedTodo) => {
  try {
    const updataData = {
      name: selectedTodo.name,
      status: selectedTodo.status,
    };
    isLoading.value = true;
    await todoStore.editTodo(updataData, selectedTodo.id);
    Toast.fire({
      icon: "success",
      title: "Successfully",
    });
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<template>
  <div class="w-1/4 mx-auto mt-2">

    <div v-if="isLoading">
      <h1 class="">Edit ID : {{ todoId }}</h1>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Fullname</span>
        </div>
        <input
          type="text"
          placeholder="Full Name.."
          class="input input-bordered w-full mb-2"
          v-model="todoStore.selectedTodo.name"
        />
        <div class="label">
          <span class="label-text">Status</span>
        </div>
        <select
          class="select select-bordered mb-2"
          v-model="todoStore.selectedTodo.status"
        >
          <option>Select status</option>
          <option
            v-for="status in todoStore.statuses"
            :value="status"
            :key="status"
          >
            {{ status }}
          </option>
        </select>
      </label>

      <button
        class="btn btn-primary w-full"
        @click="updateTodo(todoStore.selectedTodo)"
      >
        Update
      </button>
    </div>
    <div v-else><loading></loading></div>
  </div>
</template>
