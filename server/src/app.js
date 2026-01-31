const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const proposalRoutes = require('./routes/proposals');
const publicRoutes = require('./routes/public');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/propostas', proposalRoutes);
app.use('/api/public', publicRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));