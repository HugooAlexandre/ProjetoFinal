<template>
    <div class="public-container">
        <h1>Docentes Registados</h1>
        <p>Consulte a lista de docentes disponíveis para orientação.</p>
        
        <div class="list">
            <div v-for="d in docentes" :key="d.id" class="docente-item">
                <strong>{{ d.nome }}</strong>
                <span>{{ d.email }}</span>
            </div>
        </div>

        <div class="login-link">
            <router-link to="/login" class="btn-link">É docente? Faça Login</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const docentes = ref([]);

onMounted(async () => {
    try {
        const res = await api.get('/public/docentes');
        docentes.value = res.data;
    } catch (err) {
        console.error(err);
    }
});
</script>

<style scoped>
.public-container { max-width: 600px; margin: 50px auto; text-align: center; font-family: sans-serif; }
.list { margin: 30px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
.docente-item { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee; background: white; }
.docente-item:last-child { border-bottom: none; }
.btn-link { display: inline-block; margin-top: 20px; color: #3498db; text-decoration: none; font-weight: bold; }
</style>