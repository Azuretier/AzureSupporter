// server.js
const express = require('express');
const cors = require('cors');
const { assignRole } = require('./bot');
const { config } = require('dotenv');
config();

const DISCORD_CLIENT_ID = config.DISCORD_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3000/callback';

// 1. Redirect user to Discord login
const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint for role assignment
app.post('/api/assign-role', async (req, res) => {
  const { userId, role } = req.body;
  
  // Validate
  if (!userId || !['EN', 'JP'].includes(role)) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  const result = await assignRole(userId, role);
  
  if (result.success) {
    res.json({ message: `Assigned ${role} role successfully` });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.listen(3001, () => console.log('API running on :3001'));