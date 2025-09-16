/**
 * Elegant gradient wave background animation
 * Creates smooth, subtle flowing gradients in the background
 */

class GradientWaveBackground {
  constructor() {
    this.createCanvas();
    this.initializeGradients();
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initializeGradients();
    });
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'gradient-background';
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
    this.canvas.style.zIndex = '-3';
    this.canvas.style.pointerEvents = 'none';
  }
  
  initializeGradients() {
    // Initialize time
    this.time = 0;
    
    // Colors for the gradient - professional blue theme
    this.colors = [
      { r: 14, g: 28, b: 43, a: 1 },     // Deep navy
      { r: 22, g: 44, b: 66, a: 1 },     // Medium blue
      { r: 30, g: 60, b: 90, a: 0.5 },   // Blue
      { r: 40, g: 70, b: 110, a: 0.3 },  // Light blue
    ];
    
    // Create gradient points that will move around
    this.gradientPoints = [];
    
    // Add base points for stability
    this.gradientPoints.push({
      x: this.canvas.width * 0.5,
      y: this.canvas.height * 0.5,
      vx: 0,
      vy: 0,
      radius: Math.min(this.canvas.width, this.canvas.height) * 0.5,
      color: this.colors[0]
    });
    
    // Add moving points
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.3;
      const distance = Math.min(this.canvas.width, this.canvas.height) * 0.3;
      
      this.gradientPoints.push({
        x: this.canvas.width * 0.5 + Math.cos(angle) * distance,
        y: this.canvas.height * 0.5 + Math.sin(angle) * distance,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.min(this.canvas.width, this.canvas.height) * (0.2 + Math.random() * 0.3),
        color: this.colors[i % this.colors.length]
      });
    }
  }
  
  drawGradientBackground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create base gradient
    const baseGradient = this.ctx.createRadialGradient(
      this.canvas.width * 0.5, this.canvas.height * 0.5, 0,
      this.canvas.width * 0.5, this.canvas.height * 0.5, Math.max(this.canvas.width, this.canvas.height) * 0.8
    );
    
    baseGradient.addColorStop(0, 'rgb(14, 28, 43)');
    baseGradient.addColorStop(1, 'rgb(10, 20, 30)');
    
    // Fill background
    this.ctx.fillStyle = baseGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw each gradient point
    for (const point of this.gradientPoints) {
      const gradient = this.ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, point.radius
      );
      
      const color = point.color;
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.7})`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.3})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'source-over';
    }
    
    // Add subtle grid pattern overlay for depth
    this.drawGridPattern();
  }
  
  drawGridPattern() {
    const gridSize = 40;
    const gridOpacity = 0.03;
    
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
    this.ctx.lineWidth = 0.5;
    this.ctx.beginPath();
    
    // Vertical lines with perspective effect
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      const offset = Math.sin((x + this.time * 10) * 0.01) * 5;
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + offset, this.canvas.height);
    }
    
    // Horizontal lines with wave effect
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      const offset = Math.sin((y + this.time * 10) * 0.01) * 5;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y + offset);
    }
    
    this.ctx.stroke();
  }
  
  update() {
    // Update time
    this.time += 0.01;
    
    // Update gradient points (except the base point at index 0)
    for (let i = 1; i < this.gradientPoints.length; i++) {
      const point = this.gradientPoints[i];
      
      // Move point
      point.x += point.vx;
      point.y += point.vy;
      
      // Add some gentle wave motion
      point.x += Math.sin(this.time * 0.5 + i) * 0.5;
      point.y += Math.cos(this.time * 0.3 + i * 2) * 0.5;
      
      // Bounce off edges with some damping
      if (point.x < point.radius || point.x > this.canvas.width - point.radius) {
        point.vx *= -0.9;
        point.x = Math.max(point.radius, Math.min(this.canvas.width - point.radius, point.x));
      }
      
      if (point.y < point.radius || point.y > this.canvas.height - point.radius) {
        point.vy *= -0.9;
        point.y = Math.max(point.radius, Math.min(this.canvas.height - point.radius, point.y));
      }
      
      // Random small adjustments to prevent stagnation
      if (Math.random() < 0.01) {
        point.vx += (Math.random() - 0.5) * 0.2;
        point.vy += (Math.random() - 0.5) * 0.2;
      }
      
      // Cap velocity
      const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
      if (speed > 1.5) {
        point.vx = (point.vx / speed) * 1.5;
        point.vy = (point.vy / speed) * 1.5;
      }
    }
  }
  
  animate() {
    this.update();
    this.drawGradientBackground();
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Initialize the background when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  const gradientBackground = new GradientWaveBackground();
});
