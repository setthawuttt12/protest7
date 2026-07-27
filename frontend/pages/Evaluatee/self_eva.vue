<template>
<v-container>
    <v-row>
        <v-col cols="12">
            <v-form v-if="user.status_eva === 1" @submit.prevent="saveScore">
                <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>

            </v-form>
        </v-col>
    </v-row>
</v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { A } from 'vue-router/dist/index-BN0B0y8a.js';
import { eva } from '~/API/base';

const user = ref({})
const topics = ref([])

const saveScore = async()=>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap((t:any)=>
        t.indicates.map((i:any)=>{
            const key = `${t.id_topic}-${i.id_indicate}`
            const file = fileMap.value[key]
            if(file)formData.append(`file_${key}`,file)
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
                detail_eva:i.detail_eva,
                file_key:file ? `file_${key}` :null
            }
        })
    )
    if(allScore.some((s:any)=> !s.score)){
        alert('กรุณากรอกคะแนนให้สมบูรณ์')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    try {
        await axios.post(`${eva}/selfeva/save`,formData,{ headers: { Authorization: `Bearer ${token}` } })
    } catch (error) {
        
    }
}
</script>

<style scoped>

</style>