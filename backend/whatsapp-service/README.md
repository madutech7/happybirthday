# Service WhatsApp Simple

Ce service Node.js utilise `whatsapp-web.js` pour envoyer des messages WhatsApp de manière simple, sans avoir besoin de Meta ou Twilio.

## 🚀 Installation

1. **Installer Node.js** (version 14 ou supérieure)

   - Téléchargez depuis https://nodejs.org/

2. **Installer les dépendances:**
   ```bash
   cd whatsapp-service
   npm install
   ```

## 📱 Configuration

1. **Lancer le service:**

   ```bash
   npm start
   ```

2. **Scanner le QR Code:**

   - Un QR code apparaîtra dans la console
   - Ouvrez WhatsApp sur votre téléphone
   - Allez dans Paramètres > Appareils liés > Lier un appareil
   - Scannez le QR code affiché

3. **C'est tout!** Une fois connecté, le service est prêt à envoyer des messages.

## 🔧 Variables d'environnement (optionnel)

Vous pouvez créer un fichier `.env` ou définir ces variables:

```bash
PORT=3000
FROM_NUMBER=221774451982
TO_NUMBER=22176823080
```

## 📡 API

### Envoyer un message

**POST** `/send`

```json
{
  "message": "Votre message ici",
  "to": "22176823080"
}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Message envoyé avec succès",
  "to": "22176823080"
}
```

### Vérifier l'état

**GET** `/health`

**Réponse:**

```json
{
  "status": "ready",
  "ready": true
}
```

## ⚠️ Notes importantes

- Le service doit rester allumé pour fonctionner
- La première connexion nécessite de scanner un QR code
- Les sessions sont sauvegardées dans `.wwebjs_auth/` (ne supprimez pas ce dossier)
- Si vous vous déconnectez de WhatsApp, vous devrez re-scanner le QR code

## 🐛 Dépannage

### Le QR code ne s'affiche pas

- Assurez-vous que `qrcode-terminal` est installé
- Vérifiez que votre terminal supporte les caractères spéciaux

### Erreur de connexion

- Vérifiez votre connexion Internet
- Assurez-vous que WhatsApp n'est pas ouvert sur un autre appareil
- Supprimez le dossier `.wwebjs_auth/` et reconnectez-vous

### Le service ne démarre pas

- Vérifiez que le port 3000 n'est pas utilisé
- Changez le port avec `PORT=3001 npm start`
