import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL_API='https://65f466eef54db27bc0219c16.mockapi.io'

export const useTodoStore = defineStore('todo', {
  state:()=>({
    list:[],
    selectedTodo:{},
    statuses:['Pending','Doing','Done']
  }),
  actions:{
   async loadTodos (){
    
      try{
        const response = await axios.get(`${BASE_URL_API}/todos`)
        this.list = response.data
      }catch (error){
        console.log('error ', error);
      }
     
    },
    async loadTodo (id){
      try{
        const response = await axios.get(`${BASE_URL_API}/todos/${id}`)
        this.selectedTodo = response.data
        //this.list.push(esponse.data);
        console.log('loaddata complete ');
      }catch (error){
        console.log('error ', error);
      }
    },
    async addTodo (todoText){
      const bodyData = {
        name:todoText,
        status: 'Pending'
      }

      try{
        const response = await axios.post(`${BASE_URL_API}/todos`,bodyData)
        console.log('Add todo Success');
      }catch (error){
        console.log('error ', error);
      }
    },
    async editTodo (todoData,id){
      try{
        const response = await axios.put(`${BASE_URL_API}/todos/${id}`,todoData)
        console.log('update todo Success');
      }catch (error){
        console.log('error ', error);
      }
    },
    async deleteTodo (id){
      try{
        const response = await axios.delete(`${BASE_URL_API}/todos/${id}`)
        console.log('Delete todo Success');
      }catch (error){
        console.log('error ', error);
      }
    }
  }
})
