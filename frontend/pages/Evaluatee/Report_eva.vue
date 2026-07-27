<template>
<v-container>
    <v-row>
        <v-col cols="12">
            <v-form v-if="user.status_eva === 3">
                <h1 class="text-h5 font-weight-bold">คะแนนประเมินตนเอง</h1>
                <v-card class="pa-2 mt-2">
                    <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                </v-card>
                <v-row class="mt-2" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="bg-grey border pa-1" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="bg-grey border pa-1" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="bg-grey border pa-1" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="bg-grey border pa-1" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="bg-grey border pa-1" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.name_indicate }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.detail_indicate }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.point_indicate }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.point_indicate*4 }}</td>
                                    <td class="border pa-1 text-center" style="width: 10%;">
                                        {{ (((scores[indicate.id_indicate]?.a ?? 0)+(scores[indicate.id_indicate]?.b ?? 0)+(scores[indicate.id_indicate]?.c ?? 0))/3).toFixed(2) }}
                                    </td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="text-center mt-4">
                        <v-card class="pa-2 text-end" color="success">คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }}</v-card>
                    </div>
                    <div class="mt-4">
                        <v-card class="pa-2">
                            <label for="">ข้อเสนอแนะของกรรมการ</label>
                            <v-row>
                                <v-col cols="12" v-for="(commit,c) in commits" :key="commit.id_commit">
                                    <img :src="`http://localhost:3001/uploads/signature/${commit.signature}`" :alt="`รอ${commit.level_commit}ประเมิน`" width="20%"> <br>
                                    ( {{ commit.first_name }} {{ commit.last_name }} )
                                    {{ commit.level_commit }}
                                </v-col>
                            </v-row>
                        </v-card>
                        <div class="text-center mt-4">
                            <v-btn color="warning" class="no-p" @click="printDoc">พิมพ์</v-btn>
                        </div>
                    </div>
            </v-form>
            <v-alert type="info" v-else-if="user.status_eva === 2">รอกรรมดำเนินการประเมิน</v-alert>
                <v-alert type="info" v-else-if="user.status_eva === 1">ยังไม่ได้ประเมิน</v-alert>
                <v-alert type="warning" v-else>ยังไม่มีแบบประเมิน</v-alert>
        </v-col>
    </v-row>
</v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { eva } from '~/API/base';

const user = ref<any>({})
const topics =ref<any>([])
const scores = ref<any>([])
const commits = ref<any>([])

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'_blank')
}

const printDoc =async()=>{
    window.print()
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}
const fetchTopics = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}
const fetchCommits = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/commit`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}
const fetchScore = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/score_commit/scores`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res.data
    }catch(err){
        console.error('Error Get Profile!',err)
    }
}

onMounted(async()=>{
    await Promise.all([fetchUser(),fetchTopics(),fetchCommits(),fetchScore()])
})
</script>

<style scoped>
@media print{
    .v-app-bar,.v-btn.no-p{
        display: 0 !important;
        margin: 0 !important;
        margin-top: 0 !important;
        padding: 0 !important;
        width: 100% !important;
    }
}
</style>