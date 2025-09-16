// Background Animation for Portfolio
'use strict';

class BackgroundAnimation {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'background-animation';
        document.body.prepend(this.container);

        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.particles = null;
        this.clock = new THREE.Clock();
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.isMobile = window.innerWidth < 768;

        this.init();
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    }

    init() {
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.z = 1000;

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0e1c2b, 0.0007);

        // Particle system
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const size = 2000;
        const particleCount = this.isMobile ? 1000 : 2000;

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() * size) - (size / 2);
            const y = (Math.random() * size) - (size / 2);
            const z = (Math.random() * size) - (size / 2);
            vertices.push(x, y, z);
            
            // Create gradient effect from deep blue to lighter blue
            const blueBase = 0.3 + Math.random() * 0.7; // 0.3 to 1.0
            colors.push(0.1 * blueBase, 0.2 * blueBase, 0.6 * blueBase);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Create an array of particle sizes for more visual interest
        const sizes = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) {
            sizes[i] = 2 + Math.random() * 4;
        }
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Material setup with custom shaders
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                pointTexture: { 
                    value: this.createParticleTexture() 
                }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    
                    // Add subtle movement based on time
                    vec3 pos = position;
                    pos.y += sin(time * 0.2 + position.x * 0.01) * 15.0;
                    pos.x += cos(time * 0.1 + position.z * 0.01) * 15.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                    
                    // Add a glow effect
                    vec2 uv = gl_PointCoord - 0.5;
                    float distSqr = dot(uv, uv);
                    gl_FragColor.a *= smoothstep(0.25, 0.15, distSqr);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });

        // Create particle system
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // Limit for performance
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // Hide loader when ready
        setTimeout(() => {
            const loader = document.querySelector('.loader');
            if (loader) {
                loader.classList.add('loaded');
            }
        }, 800);

        // Start animation
        this.animate();
    }

    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(
            canvas.width / 2, 
            canvas.height / 2, 
            0, 
            canvas.width / 2, 
            canvas.height / 2, 
            canvas.width / 2
        );
        
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.5, 'rgba(200,200,255,0.5)');
        gradient.addColorStop(1, 'rgba(100,100,200,0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.isMobile = window.innerWidth < 768;
    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
        this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render() {
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update shader time uniform
        this.particles.material.uniforms.time.value = elapsedTime;
        
        // Rotate particle system
        this.particles.rotation.x += 0.0005;
        this.particles.rotation.y += 0.001;

        // Move camera based on mouse position
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Create background animation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if Three.js is loaded
    if (typeof THREE !== 'undefined') {
        const animation = new BackgroundAnimation();
    } else {
        console.error('Three.js is not loaded');
        
        // Fallback: hide loader even if Three.js fails to load
        setTimeout(() => {
            const loader = document.querySelector('.loader');
            if (loader) {
                loader.classList.add('loaded');
            }
        }, 500);
    }
});
