#!/bin/bash

echo "Démarrage du backend Spring Boot pour l'envoi automatique WhatsApp..."
echo ""
echo "Assurez-vous d'avoir configuré application.properties avec vos identifiants Twilio!"
echo ""

mvn spring-boot:run
