const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/passwords', require('./routes/passwordRoutes'));
app.use('/api/profile',   require('./routes/profileRoutes'));
app.use('/api/settings',  require('./routes/settingsRoutes'));

app.get('/', (req, res) => res.json({ message: 'SecurePass API v2 running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SecurePass server running on port ${PORT}`));
