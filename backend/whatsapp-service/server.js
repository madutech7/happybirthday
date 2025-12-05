const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configuration
const FROM_NUMBER = process.env.FROM_NUMBER || '221774451982';
const TO_NUMBER = process.env.TO_NUMBER || '22176823080';

// Initialiser le client WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth',
  }),
});

// Générer le QR code pour la première connexion
client.on('qr', (qr) => {
  console.log('📱 Scannez ce QR code avec WhatsApp:');
  qrcode.generate(qr, { small: true });
  console.log('\nOu ouvrez WhatsApp sur votre téléphone et scannez le QR code ci-dessus');
});

// Connexion réussie
client.on('ready', () => {
  console.log('✅ WhatsApp connecté avec succès!');
});

// Erreur de connexion
client.on('disconnected', (reason) => {
  console.log('❌ WhatsApp déconnecté:', reason);
});

// Démarrer le client
client.initialize();

// Endpoint pour envoyer un message
app.post('/send', async (req, res) => {
  try {
    const { message, to } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Le message est requis',
      });
    }

    const recipientNumber = to || TO_NUMBER;
    // Formater le numéro (ajouter @c.us pour WhatsApp Web)
    const chatId = recipientNumber.includes('@c.us') ? recipientNumber : `${recipientNumber}@c.us`;

    // Envoyer le message
    await client.sendMessage(chatId, message);

    console.log(`✅ Message envoyé à ${recipientNumber}`);

    res.json({
      success: true,
      message: 'Message envoyé avec succès',
      to: recipientNumber,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint de santé
app.get('/health', (req, res) => {
  const isReady = client.info ? true : false;
  res.json({
    status: isReady ? 'ready' : 'connecting',
    ready: isReady,
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur WhatsApp démarré sur le port ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/send`);
});
