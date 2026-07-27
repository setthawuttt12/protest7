<template>
 <v-app>
    <v-app-bar :color="bg(user.role)" flat>
        <v-app-bar-nav-icon @click="drawer = !drawer"/>
        <v-toolbar-title>NTC EVALUATION SYSTEM</v-toolbar-title>
        <v-spacer></v-spacer>

        <p>ผู้ใช้งาน : {{ user.first_name }} {{ user.last_name }} <br> {{ user.role }} </p>&nbsp;&nbsp;
        <v-btn icon="mdi-logout" @click="logout" variant="text" />&nbsp;&nbsp;
    </v-app-bar>

    <ClientOnly>
        <v-navigation-drawer v-model="drawer" width="260" app color="#404040" :temporary="isMobile" :permanent="!isMobile">
            <v-list density="comfortable">
                <v-list-item v-for="(item) in navitem" :key="item.title" :to="item.to">
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </ClientOnly>

    <v-main>
        <v-container fluid class="py-2">
            <slot/>
        </v-container>
        <v-footer app class="text-caption justify-center">©2026 NTC EVALUATION SYSTEM</v-footer>
    </v-main>
 </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useDisplay } from 'vuetify'
import {api, commit} from '~/API/base'

const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)
const drawer = ref(false)
const user = ref<any>({})

const roles = [
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมินผล',to:'/Staff/ManageEva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการกรรมการประเมิน',to:'/Staff/ManageCommit',role:'ฝ่ายบุคลากร'},
    {title:'จัดการหัวข้อการประเมิน',to:'/Staff/Topic',role:'ฝ่ายบุคลากร'},
    {title:'จัดการตัวชี้วัด',to:'/Staff/Indicate',role:'ฝ่ายบุคลากร'},
    {title:'จัดการรอบการประเมิน',to:'/Staff/Round_eva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการแบบประเมิน',to:'/Staff/Eva',role:'ฝ่ายบุคลากร'},
    {title:'ผลสรุปการประเมินของผู้รับการประเมินผล',to:'/Staff/Score_evaList',role:'ฝ่ายบุคลากร'},
    {title:'ผลสรุปการประเมินของกรรมการประเมิน',to:'/Staff/Score_commitList',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของผู้รับการประเมินผล',to:'/Staff/statusEva',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของกรรมการ',to:'/Staff/statusCommit',role:'ฝ่ายบุคลากร'},
    {title:'เอกสารหรือคู่มือสำหรับการประเมิน',to:'/Staff/Document',role:'ฝ่ายบุคลากร'},
    {title:'รายงาน',to:'/Staff/Report',role:'ฝ่ายบุคลากร'},
    {title:'ประวัติการจัดการข้อมูล',to:'/Staff/His',role:'ฝ่ายบุคลากร'},

    {title:'รายชื่อผู้รับการประเมิน',to:'/Committee/',role:'กรรมการประเมิน'},
    {title:'ดำเนินการประเมิน',to:'/Committee/show_eva',role:'กรรมการประเมิน'},
    {title:'ตรวจสอบผลและยืนยัน',to:'/Committee/check_confirm',role:'กรรมการประเมิน'},
    {title:'คู่มือประกอบการประเมิน',to:'/Committee/Doc',role:'กรรมการประเมิน'},

    {title:'หน้าหลัก',to:'/Evaluatee/',role:'ผู้รับการประเมินผล'},
    {title:'แก้ไขข้อมูลส่วนตัว',to:'/Evaluatee/edit_eva',role:'ผู้รับการประเมินผล'},
    {title:'แบบการประเมิน',to:'/Evaluatee/self_eva',role:'ผู้รับการประเมินผล'},
    {title:'ตรวจสอบผลการประเมิน',to:'/Evaluatee/check_score',role:'ผู้รับการประเมินผล'},
    {title:'รายงานผลการประเมิน',to:'/Evaluatee/Report_eva',role:'ผู้รับการประเมินผล'},
    {title:'คู่มือประกอบการประเมิน',to:'/Evaluatee/Doc',role:'ผู้รับการประเมินผล'},
]

const navitem = computed(()=> roles.filter((item)=> item.role.includes(user.value.role)))


const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const fecth = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        return await navigateTo('/',{replace:true})
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value =res.data
    } catch (error) {
        console.error('Errorr Get Profile',error)
        
    }

}
onMounted(fecth)

const bg = (role) =>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007FFF'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
} 
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