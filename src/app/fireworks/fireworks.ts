import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-fireworks',
  imports: [],
  templateUrl: './fireworks.html',
  styleUrl: './fireworks.css',
})
export class Fireworks implements AfterViewInit, OnDestroy {
  @ViewChild('fireworksCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private particles: Particle[] = [];
  private fireworks: Firework[] = [];
  private explosions: Explosion[] = [];
  private hue = 120;
  private tick = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    this.animate();
    this.launchFirework();
    setInterval(() => this.launchFirework(), 2000);
  }

  ngOnDestroy() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }

  launchFirework() {
    const x = Math.random() * this.canvasRef.nativeElement.width;
    // Les pétards montent jusqu'en haut (entre 50 et 150px du haut)
    const targetY = Math.random() * 100 + 50;
    const firework = new Firework(x, this.canvasRef.nativeElement.height, targetY);
    this.fireworks.push(firework);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.hue += 0.5;

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const firework = this.fireworks[i];
      firework.update();
      firework.draw(this.ctx);

      if (firework.exploded) {
        // Créer une explosion réaliste
        this.explosions.push(new Explosion(firework.x, firework.y, firework.hue));
        this.fireworks.splice(i, 1);
      }
    }

    // Gérer les explosions
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      explosion.update();
      explosion.draw(this.ctx);

      if (explosion.isFinished()) {
        this.explosions.splice(i, 1);
      }
    }

    // Gérer les particules individuelles (si encore utilisées)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();
      particle.draw(this.ctx);

      if (particle.alpha <= 0 || particle.size <= 0) {
        this.particles.splice(i, 1);
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

class Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  exploded = false;
  hue: number;
  trail: { x: number; y: number; alpha: number }[] = [];
  initialSpeed: number;

  constructor(x: number, y: number, targetY: number) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.initialSpeed = Math.random() * 2 + 4; // Vitesse entre 4 et 6
    this.speed = this.initialSpeed;
    this.hue = Math.random() * 360;
  }

  update() {
    // Ajouter un point à la traînée
    this.trail.push({ x: this.x, y: this.y, alpha: 1 });
    if (this.trail.length > 8) {
      this.trail.shift();
    }

    // Le pétard monte vers le haut
    this.y -= this.speed;
    // La vitesse ralentit légèrement mais reste rapide
    if (this.speed > 1) {
      this.speed *= 0.995;
    }

    // Faire disparaître progressivement la traînée
    for (let i = 0; i < this.trail.length; i++) {
      this.trail[i].alpha -= 0.15;
    }

    // Exploser quand il atteint le haut
    if (this.y <= this.targetY) {
      this.exploded = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Dessiner la traînée lumineuse (comme une vraie étincelle)
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      const size = 2 + (i / this.trail.length) * 3;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${50 + i * 5}%, ${point.alpha})`;
      ctx.fill();
    }

    // Dessiner le pétard principal (plus brillant)
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
    ctx.fill();

    // Ajouter un halo lumineux autour (comme une vraie flamme)
    ctx.beginPath();
    ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.4)`;
    ctx.fill();

    // Ajouter un point central très brillant
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.hue}, 100%, 90%)`;
    ctx.fill();
  }
}

class Explosion {
  x: number;
  y: number;
  particles: Particle[] = [];
  age: number = 0;
  maxAge: number = 120; // ~2 secondes à 60fps
  flashAlpha: number = 1;

  constructor(x: number, y: number, baseHue: number) {
    this.x = x;
    this.y = y;

    // Créer des particules dans toutes les directions (explosion sphérique)
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      // Distribution plus naturelle : plus de particules dans certaines directions
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;

      // Vitesse variable : certaines particules plus rapides que d'autres
      const speedVariation = 0.7 + Math.random() * 0.3;
      const baseVelocity = 5 + Math.random() * 4;
      const velocity = baseVelocity * speedVariation;

      // Variation de couleur autour de la teinte de base
      const hueVariation = (Math.random() - 0.5) * 40;
      const hue = (baseHue + hueVariation) % 360;

      // Taille variable
      const size = 1.5 + Math.random() * 3;

      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * velocity,
        Math.sin(angle) * velocity,
        hue,
        size
      ));
    }
  }

  update() {
    this.age++;
    this.flashAlpha = Math.max(0, 1 - this.age / 10); // Flash qui disparaît rapidement

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();

      // Supprimer les particules mortes
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Flash initial blanc/brillant
    if (this.flashAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.flashAlpha;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 50);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 200, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Dessiner toutes les particules
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }

  isFinished(): boolean {
    return this.age > this.maxAge && this.particles.length === 0;
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: number;
  size: number;
  life: number;
  maxLife: number;
  gravity: number;
  resistance: number;

  constructor(x: number, y: number, vx: number, vy: number, hue: number, size: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.hue = hue;
    this.size = size;
    this.alpha = 1;
    this.life = 0;
    this.maxLife = 60 + Math.random() * 60; // Durée de vie variable
    this.gravity = 0.15 + Math.random() * 0.1; // Gravité légèrement variable
    this.resistance = 0.985 + Math.random() * 0.01; // Résistance de l'air
  }

  update() {
    this.life++;

    // Appliquer la résistance de l'air (ralentissement progressif)
    this.vx *= this.resistance;
    this.vy *= this.resistance;

    // Appliquer la gravité
    this.vy += this.gravity;

    // Mettre à jour la position
    this.x += this.vx;
    this.y += this.vy;

    // Faire disparaître progressivement la particule
    const lifeRatio = this.life / this.maxLife;
    this.alpha = 1 - lifeRatio;

    // La taille diminue légèrement
    this.size = this.size * (1 - lifeRatio * 0.3);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0 || this.size <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Particule principale avec gradient
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    gradient.addColorStop(0, `hsl(${this.hue}, 100%, 75%)`);
    gradient.addColorStop(0.5, `hsl(${this.hue}, 100%, 60%)`);
    gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Point central très brillant
    ctx.fillStyle = `hsl(${this.hue}, 100%, 90%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  isDead(): boolean {
    return this.alpha <= 0 || this.size <= 0 || this.life >= this.maxLife;
  }
}
