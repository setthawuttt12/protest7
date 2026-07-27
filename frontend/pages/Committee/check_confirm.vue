<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-h5 font-weight-bold">ตรวจสอบผลและยืนยันผล</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อ</th>
                                    <th class="text-center border">นามสกุล</th>
                                    <th class="text-center border">วันที่ออกแบบประเมิน</th>
                                    <th class="text-center border">รอบการประเมิน</th>
                                    <th class="text-center border">ผลการประเมิน</th>
                                    <th class="text-center border">ยืนยันผลประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }}</td>
                                    <td class="text-center border">{{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ year_sys }}</td>
                                    <td class="text-center border"><v-btn color="blue" class="text-white" size="small" @click="check(items.id_eva)">ตรวจสอบ</v-btn></td>
                                    <td class="text-center border">
                                        <!-- <v-btn color="warning" class="text-white" size="small" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn v-if="items.signature" color="success" class="text-white" size="small" @click="go(items.id_eva)">ยืนยันผลแล้ว</v-btn>
                                        <v-btn v-else color="blue" class="text-white" size="small" @click="go(items.id_eva)">ยืนยันผล</v-btn>
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
        const res = await axios.get(`${commit}/check_confirm`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path:`/Committee/signature${id_eva}`})
}

const check = (id_eva:number) => {
    navigateTo({path:`/Committee/score_commit${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>

</style>