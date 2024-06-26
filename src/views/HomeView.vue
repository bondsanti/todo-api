<script setup>
import { useTodoStore } from "../stores/todo";
import { RouterLink } from "vue-router";
import { onMounted, ref,computed } from "vue";
import Loading from "../components/Loading.vue";
import Swal from "sweetalert2";

const todoStore = useTodoStore();
const todoText = ref("");
const isLoading = ref(false);
const selectedStatus = ref('Pending');

const filterTodoList = computed(()=>{
  return todoStore.list.filter(todo => todo.status===selectedStatus.value)
})

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
    Toast.fire({
      icon: "success",
      title: "Successfully",
    });
  } catch (error) {
    console.log("error : ", error);
  }
};

const editStatus = async (todoData, todoId) => {
  try {
    const updataData = {
      name: todoData.name,
      status: todoData.status,
    };
    isLoading.value = true;
    await todoStore.editTodo(updataData, todoId);
    await todoStore.loadTodos();
    isLoading.value = false;
    Toast.fire({
      icon: "success",
      title: "Successfully",
    });
  } catch (error) {
    console.log("error : ", error);
  }
};

const updateStatus = async (event, todoId) => {
  try {
    console.log(event.target.checked);
    if (event.target.checked) {
      isLoading.value = true;
      await todoStore.editTodo({ status: "Done" }, todoId);
      await todoStore.loadTodos();
      isLoading.value = false;
      Toast.fire({
        icon: "success",
        title: "Successfully",
      });
    } else {
      isLoading.value = true;
      await todoStore.editTodo({ status: "Doing" }, todoId);
      await todoStore.loadTodos();
      isLoading.value = false;
      Toast.fire({
        icon: "success",
        title: "Successfully",
      });
    }
  } catch (error) {
    console.log("error : ", error);
  }
};

const deleteTodo = async (todoId) => {
  try {
    isLoading.value = true;
    await todoStore.deleteTodo(todoId);
    await todoStore.loadTodos();
    isLoading.value = false;
    Toast.fire({
      icon: "success",
      title: "Successfully",
    });
  } catch (error) {
    console.log("error :", error);
  }
};

const tabFilterStatus = async (newStatus) => {
  selectedStatus.value = newStatus
}
</script>
<template>
  <div class="absolute left-1/3 right-1/3">
    <div class="flex mt-5 justify-center">
      <input
        class="input input-bordered w-full max-w-xs mr-2"
        type="text"
        placeholder="Full Name.."
        v-model="todoText"
      />
      <button class="btn btn-primary" @click="addTodo(todoText)">
        Add Data
      </button>
    </div>

    <loading v-if="isLoading"></loading>

    <div role="tablist" class="tabs tabs-boxed mt-2">
      <a v-for="status in todoStore.statuses" role="tab" :class="status===selectedStatus ? 'tab tab-active':'tab'" :key="status"
      @click="tabFilterStatus(status)">{{status}}</a>
    </div>
    <div
      class="flex items-center justify-between mt-2"
      v-for="todo in filterTodoList"
      :key="todo.id"
    >
      <div class="form-control">
        <label class="cursor-pointer label">
          <input
            type="checkbox"
            :checked="todo.status === 'Done'"
            class="checkbox checkbox-accent"
            @change="updateStatus($event, todo.id)"
          />
        </label>
      </div>
      <div
        :class="
          todo.status === 'Done' ? 'line-through decoration-green-500' : ''
        "
      >
        {{ todo.name }}
      </div>
      <div>
        <RouterLink :to="{ name: 'todo-edit', params: { id: todo.id } }"
          ><button class="btn btn-circle ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1rem"
              viewBox="0 0 512 512"
            >
              <path
                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
              />
            </svg>
          </button>
        </RouterLink>
        <button class="btn btn-circle ml-2" @click="deleteTodo(todo.id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1rem"
            viewBox="0 0 448 512"
          >
            <path
              d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  fill: azure;
}
</style>
