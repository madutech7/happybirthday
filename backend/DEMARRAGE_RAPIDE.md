# 🚀 Démarrage Rapide

## Étape 1: Installer Node.js

Si vous n'avez pas Node.js:

- Téléchargez depuis https://nodejs.org/
- Installez la version LTS (recommandée)

Vérifiez l'installation:

```bash
node --version
npm --version
```

## Étape 2: Démarrer le Service WhatsApp

```bash
cd whatsapp-service
npm install
npm start
```

**Important:** Un QR code va apparaître. Scannez-le avec votre téléphone:

1. Ouvrez WhatsApp sur votre téléphone
2. Allez dans **Paramètres** > **Appareils liés** > **Lier un appareil**
3. Scannez le QR code affiché dans la console

Une fois connecté, vous verrez: `✅ WhatsApp connecté avec succès!`

## Étape 3: Configurer Spring Boot

Ouvrez `src/main/resources/application.properties` et vérifiez:

```properties
whatsapp.service.url=http://localhost:3000
whatsapp.to=22176823080
app.url=http://localhost:4200/anniv
```

## Étape 4: Lancer Spring Boot

Dans un **nouveau terminal** (gardez le service Node.js ouvert):

```bash
cd backend
mvn spring-boot:run
```

## Étape 5: Tester

Envoyez une requête de test:

```bash
curl -X POST http://localhost:8080/api/whatsapp/send
```

Ou ouvrez dans votre navigateur:

```
http://localhost:8080/api/whatsapp/send
```

## ✅ C'est tout!

Le message sera envoyé automatiquement **tous les jours à 17h10**.

## 📝 Notes

- Les deux services (Node.js et Spring Boot) doivent rester allumés
- La première fois, vous devez scanner le QR code
- Après, la session est sauvegardée automatiquement
- Si vous vous déconnectez de WhatsApp, vous devrez re-scanner

## 🐛 Problèmes?

- **Port 3000 occupé?** Changez le port dans `whatsapp-service/server.js`
- **Erreur de connexion?** Vérifiez que les deux services sont bien démarrés
- **QR code ne s'affiche pas?** Essayez un autre terminal
