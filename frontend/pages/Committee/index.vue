<template>
    <v-container fluid class="py-10">
        <v-card>
            <v-sheet class="pa-4" color="">
                <h1 class="text-h5 font-weight-bold">รายชื่อผู้รับการประเมิน</h1> 
            </v-sheet>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-center border">ลำดับ</th>
                            <th class="text-center border">ชื่อ</th>
                            <th class="text-center border">นามสกุล</th>
                            <th class="text-center border">วันที่ออกแบบการประเมิน</th>
                            <th class="text-center border">คะแนนประเมิน</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in result" :key="item.id_eva">
                            <td class="text-center border">{{ index+1 }}</td>
                            <td class="text-center border">{{ item.first_name }}</td>
                            <td class="text-center border">{{ item.last_name }}</td>
                            <td class="text-center border">{{ item.date_eva }}</td>
                            <td class="text-center border">
                                <v-btn color="blue" class="text-white" size="small" @click="go(item.id_eva)">ตรวจสอบ</v-btn>
                            </td>
                        </tr>
                        <tr v-if="result.length === 0">
                            <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,commit} from '../../API/base'

const token = import.meta.client ? localStorage.getItem('token') : null

const result = ref ([])

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/show_eva`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const go = (id_eva:number) => {
    navigateTo(`/Committee/Score_member${id_eva}`)
}

onMounted(fetch)
</script>

<style scoped>

</style>