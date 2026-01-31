<template>
    <div class="auth-container">
        <h2>Área Docente</h2>
        <form @submit.prevent="handleLogin" class="form-card">
            <div class="form-group">
                <label>Email</label>
                <input v-model="email" type="email" required placeholder="ex: joao@uni.pt">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input v-model="password" type="password" required>
            </div>
            <button type="submit" class="btn-primary">Entrar</button>
            <p v-if="error" class="error-msg">{{ error }}</p>
        </form>
        <router-link to="/">Voltar à lista pública</router-link>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
    try {
        const response = await api.post('/auth/login', {
            email: email.value,
            password: password.value
        });
        
        // Guardar Token e User
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        router.push('/dashboard');
    } catch (err) {
        error.value = err.response?.data?.message || 'Erro ao efetuar login';
    }
};
</script>

<style scoped>
.auth-container { max-width: 400px; margin: 50px auto; text-align: center; }
.form-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 1rem; }
.form-group { margin-bottom: 1rem; text-align: left; }
.form-group input { width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; }
.btn-primary { width: 100%; padding: 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary:hover { background: #2980b9; }
.error-msg { color: red; margin-top: 10px; font-size: 0.9em; }
</style>