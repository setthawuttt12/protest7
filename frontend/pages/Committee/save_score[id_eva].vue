<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-alert type="info" v-if="user.status_eva === 1">ผู้รับการประเมินยังไม่ได้ประเมินตนเอง</v-alert>
                <v-form v-else-if="user.status_commit === 'n'" @submit.prevent="saveScore">
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-card class="pa-2">
                                <v-row v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        {{ t+1 }}.{{ i+1 }} {{ indicate.name_indicate }} รายละเอียดตัวชี้วัด : {{ indicate.detail_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม : {{ indicate.point_indicate*4 }}
                                        <p class="mt-2">รายละเอียด : {{ indicate.detail_eva || '-' }}</p>
                                        <p class="mt-2">file : <v-btn v-if="indicate.file_eva" size="small" @click="viweFile(indicate.file_eva)" color="blue">เปิดดู</v-btn><span v-else>-</span></p>
                                        <v-select class="mt-2" label="ใส่คะแนนประเมิน 1-4" :items="[1,2,3,4]" v-model="indicate.score"></v-select>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-4">
                        <v-card class="pa-2">
                            <label for="">ข้อเสนอแนะ</label>
                            <v-textarea label="(ถ้ามี)" v-model="detail_commit" rows="2"></v-textarea>
                        </v-card>
                    </div>
                    <div class="text-center mt-4">
                        <v-btn type="submit" color="blue">บันทึกคะแนน</v-btn>
                    </div>
                </v-form>
                <v-alert type="success" v-else-if="user.status_commit === 'y'">ประเมินสำเร็จ</v-alert>
                <v-alert type="warning" v-else>ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {commit, eva} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])
const detail_commit = ref('')
const id_eva = useRoute().params.id_eva

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'_blank')
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}
const fetchTopics = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/save_score/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopics()])
})

const saveScore = async () =>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap((t:any) =>
        t.indicates.map((i:any) =>{
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
            }
        })
    )
    if(allScore.some((s:any) => !s.score)){
        alert('กรุณากรอกคะแนนให้สมบูรณ์')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    const detail_commitTo = ref('')
    if(detail_commit.value && detail_commit.value.trim()){
        detail_commitTo.value = detail_commit.value
    }else{
        detail_commitTo.value = 'ไม่มี'
    }
    formData.append('detail_commit',detail_commitTo.value)
    try{
        await axios.post(`${commit}/save_score/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        await Promise.all([fetchUser(),fetchTopics()])
        navigateTo('/Committee/Check_confirm',{replace:true})
    }catch(err){
        console.error('Error POST Score!',err)
    }
}
</script>

<style scoped>

</style>