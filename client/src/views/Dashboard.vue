<template>
    <div class="container">
        <header class="dashboard-header">
            <h1>Gestão de Propostas</h1>
            <div class="actions">
                <span>Bem-vindo, {{ user.nome }}</span>
                <button @click="logout" class="btn-outline">Sair</button>
            </div>
        </header>

        <section class="content">
            <button @click="$router.push('/propostas/nova')" class="btn-primary mb">
                + Nova Proposta
            </button>

            <div v-if="loading">A carregar propostas...</div>
            
            <div v-else class="grid">
                <div v-for="prop in propostas" :key="prop.id" class="card">
                    <div class="card-header">
                        <h3>{{ prop.titulo }}</h3>
                        <button @click="deleteProposal(prop.id)" class="btn-danger-sm">X</button>
                    </div>
                    <p class="desc">{{ prop.descricao_objetivos }}</p>
                    
                    <div class="meta">
                        <strong>Coorientadores:</strong>
                        <span v-if="prop.coorientadores.length">
                            {{ prop.coorientadores.map(c => c.nome).join(', ') }}
                        </span>
                        <span v-else class="text-muted">Nenhum</span>
                    </div>

                    <div class="meta">
                        <strong>Alunos:</strong>
                        <span v-if="prop.alunos.length">
                            {{ prop.alunos.map(a => a.nome).join(', ') }}
                        </span>
                        <span v-else class="text-muted">Nenhum</span>
                    </div>
                    
                    <div class="tags">
                        <span v-for="k in prop.keywords" :key="k.id" class="tag">{{ k.palavra }}</span>
                    </div>
                </div>
            </div>
            <p v-if="!loading && propostas.length === 0">Não tem propostas registadas.</p>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');
const propostas = ref([]);
const loading = ref(true);

const fetchProposals = async () => {
    try {
        const res = await api.get('/propostas');
        propostas.value = res.data;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const deleteProposal = async (id) => {
    if (!confirm('Tem a certeza que deseja apagar esta proposta?')) return;
    try {
        await api.delete(`/propostas/${id}`);
        propostas.value = propostas.value.filter(p => p.id !== id);
    } catch (err) {
        alert('Erro ao apagar proposta.');
    }
};

const logout = () => {
    localStorage.clear();
    router.push('/login');
};

onMounted(fetchProposals);
</script>

<style scoped>
.container { max-width: 1000px; margin: 0 auto; padding: 20px; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
.card { background: white; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; }
.desc { white-space: pre-wrap; margin: 15px 0; color: #444; }
.meta { font-size: 0.9em; margin-bottom: 5px; }
.tags { margin-top: 15px; }
.tag { background: #e0f7fa; color: #006064; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 5px; display: inline-block; }
.btn-primary { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
.btn-danger-sm { background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; }
.btn-outline { background: transparent; border: 1px solid #666; padding: 5px 15px; cursor: pointer; }
.text-muted { color: #999; font-style: italic; }
.mb { margin-bottom: 20px; }
</style>