<template>
    <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="8" lg="6">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="#7d0c14">
                        <h1 class="text-h5 font-weight-bold">สมัครสมาชิก</h1>
                        <p class="text-sm mt-2">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</p>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ" v-model="form.first_name" :error-messages="error.first_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="นามสกุล" v-model="form.last_name" :error-messages="error.last_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password"
                                    :type="showPw ? 'text' : 'password'" :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="confirmPassword" :error-messages="error.confirmPassword"
                                    :type="showPw2 ? 'text' : 'password'" :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="เลือกประะเภทสมาชิก" v-model="form.role" :items="['กรรมการประเมิน','ผู้รับการประเมินผล']" :error-messages="error.role"></v-select>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <v-btn type="submit" color="#7d0c14">สมัคร</v-btn>&nbsp;&nbsp;<v-btn type="reset" color="#7d0c14">ยกเลิก</v-btn>
                                    <p class="text-sm mt-3">มีบัญชีอยู่แล้ว? <nuxt-link to="/"><u>เข้าสู่ระบบ</u></nuxt-link></p>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
   </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api} from '../API/base'

definePageMeta({
    layout:false
})

const form = ref({
    first_name:'',
    last_name:'',
    email:'',
    username:'',
    password:'',
    role:'',
})
const confirmPassword = ref('')
const error = ref<Record<string,string>>({})
const showPw = ref(false)
const showPw2 = ref(false)
const show = ref(false)

const emailReget = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.first_name.trim())error.value.first_name='กรุณากรอกชื่อ'
    if(!f.last_name.trim())error.value.last_name='กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email='กรุณากรอกอีเมล'
    else if(!emailReget.test(f.email.trim()))error.value.email='รูปแบบอีเมลไม่ถูกต้อง'
    if(!f.username.trim())error.value.username='กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username='ต้องมีอย่างน้อย 4 ตัวอักษร'
    if(!f.password.trim())error.value.password='กรุณากรอกรหัสผ่าน'
    else if(f.password.trim().length < 6)error.value.password='ต้องมีอย่างน้อย 6 ตัวอักษร'
    if(!confirmPassword.value.trim())error.value.confirmPassword='กรุณายืนยันรหัสผ่าน'
    else if(confirmPassword.value.trim() != f.password.trim())error.value.confirmPassword='รหัสผ่านไม่ตรงกัน'
    if(!f.role.trim())error.value.role='กรุณาเลือกประเภทสมาชิก'
    return Object.keys(error.value).length === 0
}
const saveMember = async () =>{
    if(!validateForm())return
    try{
        await axios.post(`${api}/auth/regis`,form.value)
        alert('สมัครสำเร็จ')
        navigateTo('/',{replace:true})
    }catch(err){
        console.error('Error POST Member!',err)
    }
}
</script>

<style scoped>

</style>