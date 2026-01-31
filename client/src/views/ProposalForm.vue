<template>
    <div class="container">
        <h2>Criar Nova Proposta</h2>
        <form @submit.prevent="submitForm" class="form-container">
            
            <div class="form-group">
                <label>Título do Projeto</label>
                <input v-model="form.titulo" type="text" required>
            </div>

            <div class="form-group">
                <label>Descrição e Objetivos</label>
                <textarea v-model="form.descricao" rows="6" required></textarea>
            </div>

            <!-- Select Múltiplo Coorientadores -->
            <div class="form-group">
                <label>Coorientadores (Opcional)</label>
                <select v-model="form.coorientadoresIds" multiple class="multi-select">
                    <option v-for="d in auxData.docentes" :key="d.id" :value="d.id">
                        {{ d.nome }}
                    </option>
                </select>
                <small>Segure Ctrl (Windows) ou Cmd (Mac) para selecionar vários.</small>
            </div>

            <!-- Select Múltiplo Alunos -->
            <div class="form-group">
                <label>Alunos Sugeridos (Opcional)</label>
                <select v-model="form.alunosIds" multiple class="multi-select">
                    <option v-for="a in auxData.alunos" :key="a.id" :value="a.id">
                        {{ a.nome }} ({{ a.numero_estudante }})
                    </option>
                </select>
            </div>

            <!-- Select Múltiplo Keywords -->
            <div class="form-group">
                <label>Palavras-Chave</label>
                <select v-model="form.keywordsIds" multiple class="multi-select">
                    <option v-for="k in auxData.keywords" :key="k.id" :value="k.id">
                        {{ k.palavra }}
                    </option>
                </select>
            </div>

            <div class="actions">
                <button type="button" @click="$router.back()" class="btn-cancel">Cancelar</button>
                <button type="submit" class="btn-submit">Gravar Proposta</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const auxData = reactive({ docentes: [], alunos: [], keywords: [] });
const form = reactive({
    titulo: '',
    descricao: '',
    coorientadoresIds: [],
    alunosIds: [],
    keywordsIds: []
});

onMounted(async () => {
    try {
        const res = await api.get('/propostas/aux');
        auxData.docentes = res.data.docentes;
        auxData.alunos = res.data.alunos;
        auxData.keywords = res.data.keywords;
    } catch (err) {
        console.error('Erro ao carregar dados auxiliares');
    }
});

const submitForm = async () => {
    try {
        await api.post('/propostas', form);
        router.push('/dashboard');
    } catch (err) {
        alert('Erro ao gravar proposta. Verifique os dados.');
    }
};
</script>

<style scoped>
.container { max-width: 800px; margin: 30px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.multi-select { height: 120px; }
.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-submit { background: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-cancel { background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
small { color: #666; font-style: italic; display: block; margin-top: 5px; }
</style>