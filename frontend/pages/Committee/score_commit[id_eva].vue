<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_commit === 'y'">
                    <h1 class="text-5 font-weight-bold">คะแนนประเมินของกรรมการประเมิน</h1>
                    <v-row class="mt-2" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ topic.name_topic }}</h1>
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
                                    <td class="border pa-1 text-center" style="width: 10%;">{{ indicate.score_commit*indicate.point_indicate }}</td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="text-center mt-4">
                        <v-card color="success" class="pa-2 text-end">คะแนนรวม: {{ user.total_commit }} คะแนน</v-card>
                    </div>
                </v-form>
                <v-alert type="info" v-else-if="user.status_commit === 'n'">ยังไม่ได้ประเมิน</v-alert>
                <v-alert type="warning" v-else>ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {commit} from '../../API/base'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const user = ref<any>({})
const topics = ref<any>([])
const id_eva = useRoute().params.id_eva
const totalScore = ref(0)

const viweFile =(filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'_blank')
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/score_commit/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error Get Profile!',error)
    }
}

const fetchTopics = async () =>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/score_commit/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
        res.data.forEach((s:any) => s.indicates.forEach((i:any) => totalScore.value +=(i.score_commit*i.point_indicate)))
    } catch (error) {
        console.error('Error Get Profile!',error)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopics()])
})
</script>

<style scoped>

</style>