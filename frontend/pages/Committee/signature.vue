<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 " color="">
                        <h1 class="text-h5 font-weight-bold">ยืนยันผลการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-file-input label="ไฟล์" v-model="file" accept=".png,.jpg" />
                                     <p class="text-error font-weight-bold ">*** รองรับเฉพาะไฟล์ .png และ.jpg  เท่านั้น***</p>
                                </v-col>
                               
                               <v-row>
                                <v-col  cols="12" md="6" >
                                    <v-btn color="blue" block type="submit">บันทึก</v-btn>
                                </v-col>
                                <v-col  cols="12" md="6" >
                                    <v-btn color="error" block type="reset">ยกเลิก</v-btn>
                                </v-col>
                               </v-row>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
   </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,commit} from '../../API/base'

const token = import.meta.client ? localStorage.getItem('token') : null

const result = ref ([])
const name_doc = ref('')
const file = ref<File | null>(null)
const id_eva = useRoute().params.id_eva
const saveMember = async () => {
    if(!file.value ) return alert('กรุณาแนบไฟล์ก่อนบันทึก')
    const formData = new FormData()
    formData.append('file',file.value!)
    try{
        
        await axios.post(`${commit}/signature/${id_eva}`,formData,{headers: {Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        file.value = null
        await fetch()
    }catch(error){
        console.error('Error!',error)
    }
}

const del = async (id_eva:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${commit}/signature/${id_eva}`,{headers:{Authorization: `Bearer ${token}`}})
        alert('ลบสำเร็จ')
        await fetch()
    }catch(err){
        console.error("Error Delete",err)
    }
}

const views = (filename:string) =>   {
    const url = new URL(`/uploads/signature/${filename}`,commit).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>