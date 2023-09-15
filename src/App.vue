<template>
<div class="flex justify-center items-center h-screen">
  <div class="border-4 w-[80vw] h-[60vh] md:h-[70vh] md:w-[42vw] flex justify-between flex-col items-center p-5 shadow-2xl">
      <div>
        <input type="text" class="border-4 text-center border-black w-[68vw] md:w-[38vw] md:text-5xl h-[30vh] bg-black text-white text-3xl" v-model="Text" disabled>
      </div>
      <div class="flex flex-col gap-10">
        <input type="text" class="border rounded-lg border-black md:w-[38vw] w-[58vw] h-10 p-2" placeholder="Change the wallpaper" v-model="NewText"/>
        <button class="p-3 bg-blue-500 text-white font-bold rounded-lg" @click="SendText">Change the Wallpaper</button>
      </div>
  </div>
</div>

</template>


<script setup>
import { ref,onMounted ,watch} from 'vue';
import axios from 'axios'
const Text = ref('')
const NewText = ref('')

const GetText = async () => {
  try {
    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: ' https://eea1-2401-4900-1c97-54b0-1d6d-bc54-332e-c0e5.ngrok-free.app/getImage',
  headers: { 
    'Accept': 'application/json'
  }
};

axios.request(config)
.then((response) => {
  Text.value = response.data.text;
})
.catch((error) => {
  console.log(error);
});



   
   
  } catch (error) {
    console.error('Error fetching data:', error);
    // You can handle the error in a way that makes sense for your application
  }
};


const SendText =()=>{
  let data = JSON.stringify({
  "text": NewText.value
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: ' https://eea1-2401-4900-1c97-54b0-1d6d-bc54-332e-c0e5.ngrok-free.app/',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
window.location.reload();
})
.catch((error) => {
  console.log(error);
});
}

onMounted(()=>{
  GetText();
})


</script>