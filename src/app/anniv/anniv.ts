import { Component, ViewChild, signal } from '@angular/core';
import { Confetti } from '../confetti/confetti';
import { Fireworks } from '../fireworks/fireworks';
import { EmojisRain } from '../emojis-rain/emojis-rain';
import { TypingEffect } from '../typing-effect/typing-effect';

@Component({
  selector: 'app-anniv',
  imports: [Confetti, Fireworks, EmojisRain, TypingEffect],
  templateUrl: './anniv.html',
  styleUrl: './anniv.css',
})
export class Anniv {
  @ViewChild('confettiRef') confettiComponent!: Confetti;
  showSurpriseModal = signal(false);

  showSurprise() {
    this.showSurpriseModal.set(true);
    if (this.confettiComponent) {
      this.confettiComponent.triggerConfetti();
    }
  }

  closeSurprise() {
    this.showSurpriseModal.set(false);
  }
}
