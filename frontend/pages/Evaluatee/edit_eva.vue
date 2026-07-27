<template>
    <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="8" lg="6">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="#404040">
                        <h1 class="text-h5 font-weight-bold">แก้ไขข้อมูลส่วนตัว</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ" v-model="form.first_name"
                                        :error-messages="error.first_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="นามสกุล" v-model="form.last_name"
                                        :error-messages="error.last_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="อีเมล" v-model="form.email"
                                        :error-messages="error.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username"
                                        :error-messages="error.username"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" v-model="form.password"
                                        :error-messages="error.password" :type="showPw ? 'text' : 'password'"
                                        :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="confirmPassword"
                                        :error-messages="error.confirmPassword" :type="showPw2 ? 'text' : 'password'"
                                        :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-alert>{{ form.role }}</v-alert>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <v-btn type="submit" color="success">แก้ไข</v-btn>&nbsp;&nbsp;<v-btn type="reset"
                                        color="#7d0c14">ยกเลิก</v-btn>

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
import { eva } from '~/API/base'


const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    role: '',
})
const confirmPassword = ref('')
const error = ref<Record<string, string>>({})
const showPw = ref(false)
const showPw2 = ref(false)
const show = ref(false)

const emailReget = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function validateForm() {
    error.value = {}
    const f = form.value

    if (!(f.first_name ?? '').trim())
        error.value.first_name = 'กรุณากรอกชื่อ'

    if (!(f.last_name ?? '').trim())
        error.value.last_name = 'กรุณากรอกนามสกุล'

    if (!(f.email ?? '').trim())
        error.value.email = 'กรุณากรอกอีเมล'
    else if (!emailReget.test((f.email ?? '').trim()))
        error.value.email = 'รูปแบบอีเมลไม่ถูกต้อง'

    if (!(f.username ?? '').trim())
        error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if ((f.username ?? '').trim().length < 4)
        error.value.username = 'ต้องมีอย่างน้อย 4 ตัวอักษร'

    return Object.keys(error.value).length === 0
}
const saveMember = async () => {
    const token = localStorage.getItem('token')
    if (!validateForm()) return
    try {
        await axios.put(`${eva}/edit_eva`, form.value, { headers: { Authorization: `Bearer ${token}` } })
        alert('แก้ไขสำเร็จ')
        return navigateTo('/Evaluatee/edit_eva', { replace: true })
    } catch (err) {
        console.error('Error put Member!', err)
    }
}
const fecth = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/edit_eva`, { headers: { Authorization: `Bearer ${token}` } })
        console.log(res.data)
        form.value = res.data
    } catch (error) {
        console.error('Errorr Get User', error)

    }

}
onMounted(fecth)
</script>

<style scoped></style>