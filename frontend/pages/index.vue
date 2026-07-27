<template>
    <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
            <v-col cols="12" md="6" lg="5">
                <v-card color="#7d0c14" elevation="10" rounded="lg">
                    <br>
                    <center><img src="../public/img/logo.png" width="20%" alt=""></center>
                    <p class="text-center font-weight-bold text-white text-h5">NTC EVALUATION SYSTEM</p>
                    <p class="text-center font-weight-bold text-white ">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</p>
                    <v-container class="bg-white">
                        <p class="text-center font-weight-bold  text-h5">เข้าสู่ระบบ</p>
                        <v-alert type="error" variant="tonal" v-if="error">{{ error }}</v-alert>
                        <v-form @submit.prevent="Login">
                            <v-text-field v-model="username" label="ชื่อผู้ใช้" prepend-inner-icon="mdi-account"></v-text-field>
                            <v-text-field v-model="password" label="รหัสผ่าน" prepend-inner-icon="mdi-lock"
                            :type="showPw ? 'text' : 'password'" :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showPw = !showPw"></v-text-field>
                            <v-select v-model="role" label="ประเภทสมาชิก" :items="g" prepend-inner-icon="mdi-account-group" />
                            <v-btn color="#7d0c14" block type="submit">เข้าสู่ระบบ</v-btn>
                        </v-form>
                        <br>
                        <center><nuxt-link to="/regis" class="text-blue">สมัครสมาชิก</nuxt-link></center>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

definePageMeta({
    layout:false
})

import auth from '../API/auth'

const showPw = ref(false)
const show = ref(false)
const error = ref('')
const username = ref('')
const password = ref('')
const role = ref('')
const g = ['ฝ่ายบุคลากร','กรรมการประเมิน','ผู้รับการประเมินผล']

const Login = async () => {
    try{
        const res = await auth.login({
            username: username.value,
            password: password.value,
            role: role.value,
        })
        console.log("API Response : ",res.data)
        localStorage.setItem('token',res.data.token)
        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร') useRouter().push('/Staff')
        else if(useRole === 'กรรมการประเมิน') useRouter().push('/Committee')
        else if(useRole === 'ผู้รับการประเมินผล') useRouter().push('/Evaluatee')
    }catch(err){
        console.error("Login Failed!",err)
        error.value = error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ' 
    }
}
</script>

<style scoped>

</style>