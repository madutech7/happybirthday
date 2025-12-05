package com.happybirthday.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WhatsAppService {

  private static final Logger logger = LoggerFactory.getLogger(WhatsAppService.class);

  @Value("${whatsapp.service.url:http://localhost:3000}")
  private String whatsappServiceUrl;

  @Value("${whatsapp.to}")
  private String toNumber;

  @Value("${app.url}")
  private String appUrl;

  private final WebClient webClient;
  private final ObjectMapper objectMapper;

  public WhatsAppService() {
    this.webClient = WebClient.builder()
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();
    this.objectMapper = new ObjectMapper();
  }

  public void sendWhatsAppMessage(String message) {
    try {
      // Construire le corps de la requête JSON
      ObjectNode requestBody = objectMapper.createObjectNode();
      requestBody.put("message", message);
      requestBody.put("to", toNumber);

      String jsonBody = objectMapper.writeValueAsString(requestBody);

      logger.info("Envoi du message WhatsApp à {} via le service local", toNumber);

      // Envoyer la requête au service Node.js
      String response = webClient.post()
          .uri(whatsappServiceUrl + "/send")
          .bodyValue(jsonBody)
          .retrieve()
          .bodyToMono(String.class)
          .block();

      logger.info("Message WhatsApp envoyé avec succès! Réponse: {}", response);

      // Vérifier la réponse pour les erreurs
      if (response != null && response.contains("\"success\":false")) {
        logger.error("Erreur dans la réponse WhatsApp: {}", response);
        throw new RuntimeException("Erreur lors de l'envoi: " + response);
      }

    } catch (Exception e) {
      logger.error("Erreur lors de l'envoi du message WhatsApp: {}", e.getMessage(), e);
      throw new RuntimeException("Échec de l'envoi du message WhatsApp", e);
    }
  }

  public void sendSiteLink() {
    String message = String.format(
        "🎉 Bonjour mon amour! 🎉%n%n" +
            "J'ai préparé quelque chose de spécial pour toi! 💕%n%n" +
            "Clique sur ce lien pour découvrir ta surprise:%n%s%n%n" +
            "Je t'aime! ❤️",
        appUrl);
    sendWhatsAppMessage(message);
  }
}
