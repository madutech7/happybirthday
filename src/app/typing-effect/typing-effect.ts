import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-typing-effect',
  imports: [],
  templateUrl: './typing-effect.html',
  styleUrl: './typing-effect.css',
})
export class TypingEffect implements OnInit {
  displayedText = signal('');
  messages = [
    'Ma chérie Racky, en ce jour si spécial, je veux te dire à quel point tu es importante pour moi. ❤️',
    'Tu illumines ma vie de ta douceur, de ton sourire et de ton amour. Chaque jour à tes côtés est un cadeau précieux. ✨',
    'Tu es ma source de bonheur, ma raison de sourire, ma lumière dans les moments sombres. Ta présence dans ma vie est le plus beau des miracles. 💕',
    'Que cette nouvelle année de ta vie soit remplie de bonheur, de réussites, de rires et de moments magiques que nous partagerons ensemble. 🌹',
    'Je souhaite que tous tes rêves se réalisent, que tous tes projets aboutissent, et que chaque jour t\'apporte de nouvelles raisons d\'être heureuse. 💖',
    'Tu mérites tout le bonheur du monde, ma belle Racky. Je t\'aime infiniment, aujourd\'hui et pour toujours. Tu es mon cœur, mon âme, ma vie. ❤️✨💕'
  ];
  private currentMessageIndex = 0;
  private currentIndex = 0;
  private isDeleting = false;
  private pauseBeforeNext = false;

  ngOnInit() {
    this.startTyping();
  }

  startTyping() {
    if (this.currentMessageIndex >= this.messages.length) {
      this.currentMessageIndex = 0; // Recommencer depuis le début
    }
    this.isDeleting = false;
    this.pauseBeforeNext = false;
    this.currentIndex = 0;
    this.typeText();
  }

  typeText() {
    const currentMessage = this.messages[this.currentMessageIndex];

    if (!this.isDeleting && this.currentIndex < currentMessage.length) {
      // Écriture
      this.displayedText.set(currentMessage.substring(0, this.currentIndex + 1));
      this.currentIndex++;
      setTimeout(() => this.typeText(), 40);
    } else if (!this.isDeleting && this.currentIndex === currentMessage.length) {
      // Pause après avoir écrit le message complet
      if (!this.pauseBeforeNext) {
        this.pauseBeforeNext = true;
        setTimeout(() => {
          this.isDeleting = true;
          this.typeText();
        }, 2000);
      }
    } else if (this.isDeleting && this.currentIndex > 0) {
      // Effacement
      this.displayedText.set(currentMessage.substring(0, this.currentIndex - 1));
      this.currentIndex--;
      setTimeout(() => this.typeText(), 30);
    } else if (this.isDeleting && this.currentIndex === 0) {
      // Passage au message suivant
      this.currentMessageIndex++;
      setTimeout(() => this.startTyping(), 500);
    }
  }
}
