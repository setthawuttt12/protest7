<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 " color="">
                        <h1 class="text-h5 font-weight-bold">คู่มือกอบการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">ชื่อเอกสาร</th>
                                    <th class="text-center border">วันที่เพิ่ม</th>
                                    <th class="text-center border">ไฟล์</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_doc">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.name_doc }}</td>
                                    <td class="text-center border">{{ items.day_doc }}</td>
                                    <td class="text-center border">
                                        <v-btn color="warning" size="small" prepend-icon="mdi-eye" @click="views(items.file)">เปิดดู</v-btn>
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
        const res = await axios.get(`${api}/docnoe`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}
const views = (filename:string) =>   {
    const url = new URL(`/uploads/document/${filename}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>