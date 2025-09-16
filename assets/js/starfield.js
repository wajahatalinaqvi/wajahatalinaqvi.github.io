/**
 * Starfield Animation
 * Creates a beautiful moving star field in the background
 */

class StarField {
  constructor() {
    this.createCanvas();
    this.initializeStars();
    this.animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initializeStars();
    });
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'starfield';
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    
    // Style canvas
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100vh';
    this.canvas.style.zIndex = '-2';
    this.canvas.style.pointerEvents = 'none';
  }
  
  initializeStars() {
    // Number of stars based on screen size
    const density = Math.min(window.innerWidth, window.innerHeight) / 8;
    const starCount = Math.floor(density);
    
    this.stars = [];
    
    // Create stars with different properties for a more natural look
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() * 0.2 - 0.1) * 0.5,
        vy: (Math.random() * 0.2 - 0.1) * 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.1 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        color: this.getStarColor()
      });
    }
    
    // Create a few brighter stars
    for (let i = 0; i < 20; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1.5,
        vx: (Math.random() * 0.1 - 0.05) * 0.8,
        vy: (Math.random() * 0.1 - 0.05) * 0.8,
        opacity: 0.9,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        color: '#ffffff'
      });
    }
  }
  
  getStarColor() {
    // Small chance of having a colored star
    const colors = [
      '#ffffff', // white
      '#fffcdf', // warm white
      '#dfe9ff', // cool white
      '#b8e9ff', // blue hint
      '#ffeaac'  // yellow hint
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  drawStar(star) {
    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    this.ctx.closePath();
    
    // Apply gradient for more realistic stars
    const gradient = this.ctx.createRadialGradient(
      star.x, star.y, 0, 
      star.x, star.y, star.radius * 2
    );
    
    gradient.addColorStop(0, star.color);
    gradient.addColorStop(1, 'transparent');
    
    this.ctx.fillStyle = gradient;
    this.ctx.globalAlpha = star.opacity;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
  
  drawShootingStar() {
    // Randomly create shooting stars
    if (Math.random() < 0.002) {
      const shootingStar = {
        x: Math.random() * this.canvas.width,
        y: Math.random() * (this.canvas.height / 3),
        length: Math.random() * 80 + 100,
        speed: Math.random() * 15 + 5,
        angle: Math.PI / 4 + (Math.random() * Math.PI / 4),
        opacity: 1
      };
      
      this.animateShootingStar(shootingStar);
    }
  }
  
  animateShootingStar(star) {
    let progress = 0;
    const duration = 1000; // ms
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      progress = (currentTime - startTime) / duration;
      
      if (progress < 1) {
        // Draw shooting star
        this.ctx.save();
        this.ctx.beginPath();
        
        const moveX = progress * star.speed * Math.cos(star.angle) * 20;
        const moveY = progress * star.speed * Math.sin(star.angle) * 20;
        
        const x = star.x + moveX;
        const y = star.y + moveY;
        
        // Create gradient trail
        const gradient = this.ctx.createLinearGradient(
          x, y,
          x - star.length * Math.cos(star.angle) * progress,
          y - star.length * Math.sin(star.angle) * progress
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${(1 - progress) * star.opacity})`);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
          x - star.length * Math.cos(star.angle) * progress,
          y - star.length * Math.sin(star.angle) * progress
        );
        
        this.ctx.stroke();
        this.ctx.restore();
        
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  updateStars() {
    this.stars.forEach(star => {
      // Move the star
      star.x += star.vx;
      star.y += star.vy;
      
      // Twinkle effect
      star.opacity += star.twinkleSpeed * star.twinkleDirection;
      
      // Change direction when reaching opacity bounds
      if (star.opacity <= 0.2) {
        star.twinkleDirection = 1;
      } else if (star.opacity >= 0.9) {
        star.twinkleDirection = -1;
      }
      
      // Wrap around the screen if the star goes off the edge
      if (star.x < 0) star.x = this.canvas.width;
      if (star.x > this.canvas.width) star.x = 0;
      if (star.y < 0) star.y = this.canvas.height;
      if (star.y > this.canvas.height) star.y = 0;
    });
  }
  
  draw() {
    // Clear canvas with a transparent gradient to create depth effect
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw all stars
    this.stars.forEach(star => this.drawStar(star));
    
    // Chance to draw shooting stars
    this.drawShootingStar();
  }
  
  animate() {
    this.updateStars();
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Initialize starfield when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const starfield = new StarField();
});
