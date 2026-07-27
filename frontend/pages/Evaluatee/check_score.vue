<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h5 font-weight-bold">ตรวจสอบผลการประเมิน</h1>
                <v-card class="py-2">
                    <v-sheet >
                            <nuxt-link  to="/Evaluatee/Score_member"><v-btn class="justify-center" color="blue">ตรวจสอบผลการประเมินตนเอง</v-btn></nuxt-link>&nbsp;&nbsp;
                            <nuxt-link to="/Evaluatee/Score_commit"><v-btn class="justify-center" color="green">ตรวจสอบผลการประเมินกรรมการ</v-btn></nuxt-link>
                    </v-sheet>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>