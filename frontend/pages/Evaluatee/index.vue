<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">Dashboard - Evaluatee</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="4" v-for="b in box" :key="b">
                                <v-card elevation="3" class="pa-4">
                                    <div class="text-h5 text-center">{{ b.title }}</div>
                                    <div class="text-h5 text-center">{{ b.value }}</div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
   </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const token = import.meta.client ? localStorage.getItem('token') : null

const box = ref ([])


const fetch = async () => {
    try{
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
    }catch(err){
        console.error("Error Fetching",err)
    }
}

onMounted(fetch)
</script>

<style scoped>

</style>