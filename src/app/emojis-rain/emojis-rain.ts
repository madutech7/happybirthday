import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-emojis-rain',
  imports: [],
  templateUrl: './emojis-rain.html',
  styleUrl: './emojis-rain.css',
})
export class EmojisRain implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('container', { static: false }) containerRef!: ElementRef<HTMLDivElement>;
  private emojis = ['❤', '🎉', '🥳', '✨', '💖', '🎁'];
  private intervalId: any;
  private emojiElements: HTMLElement[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Ne pas démarrer ici car containerRef n'est pas encore disponible
  }

  ngAfterViewInit() {
    this.startRain();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.emojiElements.forEach(el => {
      if (el.parentNode) {
        this.renderer.removeChild(el.parentNode, el);
      }
    });
  }

  startRain() {
    this.intervalId = setInterval(() => {
      this.createEmoji();
    }, 300);
  }

  createEmoji() {
    if (!this.containerRef) return;

    const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    const emojiEl = this.renderer.createElement('span');
    this.renderer.addClass(emojiEl, 'emoji-drop');
    this.renderer.setProperty(emojiEl, 'textContent', emoji);

    const startX = Math.random() * window.innerWidth;
    this.renderer.setStyle(emojiEl, 'left', `${startX}px`);
    this.renderer.setStyle(emojiEl, 'fontSize', `${20 + Math.random() * 20}px`);
    this.renderer.setStyle(emojiEl, 'animationDuration', `${2 + Math.random() * 2}s`);
    this.renderer.setStyle(emojiEl, 'opacity', String(0.7 + Math.random() * 0.3));

    this.renderer.appendChild(this.containerRef.nativeElement, emojiEl);
    this.emojiElements.push(emojiEl);

    setTimeout(() => {
      if (emojiEl.parentNode) {
        this.renderer.removeChild(emojiEl.parentNode, emojiEl);
        const index = this.emojiElements.indexOf(emojiEl);
        if (index > -1) {
          this.emojiElements.splice(index, 1);
        }
      }
    }, 4000);
  }
}
