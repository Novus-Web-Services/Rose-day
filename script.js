// Rose Day Animation Script
// Uses GSAP for SVG path animations and custom canvas for falling petals

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const bloomContainer = document.getElementById('bloom-container');
    const bloomBtn = document.getElementById('bloom-btn');
    const roseContainer = document.getElementById('rose-container');
    const messageCard = document.getElementById('message-card');
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');

    // State
    let hasBloomStarted = false;
    let particles = [];
    let animationId = null;

    // Initialize
    init();

    function init() {
        // Set canvas size
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Start loading sequence
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                
                // Animate button entrance
                gsap.fromTo(bloomBtn, 
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
                );
            }, 1000);
        }, 3000);

        // Bloom button click handler
        bloomBtn.addEventListener('click', startBloomAnimation);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function startBloomAnimation() {
        if (hasBloomStarted) return;
        hasBloomStarted = true;

        // Fade out button
        bloomContainer.classList.add('fade-out');
        
        setTimeout(() => {
            bloomContainer.style.display = 'none';
            roseContainer.classList.remove('hidden');
            
            // Start the rose drawing animation
            animateRoseDrawing();
        }, 500);
    }

    function animateRoseDrawing() {
        // Get all paths
        const stem = document.getElementById('stem');
        const thorns = document.querySelectorAll('.thorn');
        const leaves = document.querySelectorAll('.leaf');
        const outerPetals = document.querySelectorAll('.petal-outer');
        const midPetals = document.querySelectorAll('.petal-mid');
        const innerPetals = document.querySelectorAll('.petal-inner');
        const centerBud = document.getElementById('center-bud');
        const sparkles = document.querySelectorAll('.sparkle');

        // Create master timeline
        const masterTl = gsap.timeline({
            onComplete: () => {
                // Start floating animation and show message
                startFloatingRose();
                showMessageCard();
                startPetalsFall();
            }
        });

        // Set initial states
        gsap.set('.rose-path', { strokeDashoffset: 1000, fillOpacity: 0 });
        gsap.set(sparkles, { opacity: 0, scale: 0 });

        // Phase 1: Draw Stem (2 seconds)
        masterTl.to(stem, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut"
        });

        // Phase 2: Draw Thorns (0.8 seconds)
        masterTl.to(thorns, {
            strokeDashoffset: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.5");

        // Phase 3: Draw Leaves (1.5 seconds)
        masterTl.to(leaves, {
            strokeDashoffset: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: "power2.inOut"
        }, "-=0.3");

        // Phase 4: Draw Outer Petals (2 seconds)
        masterTl.to(outerPetals, {
            strokeDashoffset: 0,
            duration: 2,
            stagger: 0.4,
            ease: "power2.inOut"
        }, "-=0.5");

        // Phase 5: Draw Middle Petals (1.8 seconds)
        masterTl.to(midPetals, {
            strokeDashoffset: 0,
            duration: 1.8,
            stagger: 0.3,
            ease: "power2.inOut"
        }, "-=1.2");

        // Phase 6: Draw Inner Petals (1.5 seconds)
        masterTl.to(innerPetals, {
            strokeDashoffset: 0,
            duration: 1.5,
            stagger: 0.25,
            ease: "power2.inOut"
        }, "-=1");

        // Phase 7: Draw Center Bud (0.8 seconds)
        masterTl.to(centerBud, {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5");

        // Phase 8: Fill with color (2 seconds)
        masterTl.add(() => {
            // Add filled class for CSS transitions
            document.querySelectorAll('.rose-path').forEach(path => {
                path.classList.add('filled');
            });
        });

        // Animate fill opacity
        masterTl.to('.rose-path', {
            fillOpacity: 1,
            duration: 2,
            stagger: 0.1,
            ease: "power2.out"
        });

        // Phase 9: Sparkle effects (1.5 seconds)
        masterTl.to(sparkles, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=1");

        masterTl.to(sparkles, {
            opacity: 0,
            scale: 1.5,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3");

        // Add glow effect to rose
        masterTl.to('#rose-svg', {
            filter: 'drop-shadow(0 0 30px rgba(230, 57, 80, 0.6))',
            duration: 1.5,
            ease: "power2.out"
        }, "-=2");
    }

    function startFloatingRose() {
        // Add continuous subtle glow pulse
        gsap.to('#rose-svg', {
            filter: 'drop-shadow(0 0 40px rgba(230, 57, 80, 0.8))',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    function showMessageCard() {
        messageCard.classList.remove('hidden');
        
        // Small delay before showing
        setTimeout(() => {
            messageCard.classList.add('visible');
            
            // Animate card elements
            gsap.fromTo('.title', 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
            );
            
            gsap.fromTo('.divider',
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.8, delay: 0.6, ease: "power2.out" }
            );
            
            gsap.fromTo('.personal-note',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.9, ease: "power3.out" }
            );
            
            gsap.fromTo('.signature',
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 1.2, ease: "power3.out" }
            );
        }, 500);
    }

    // Particle System for Falling Petals
    function startPetalsFall() {
        const petalColors = [
            'rgba(255, 179, 193, 0.8)',  // Light pink
            'rgba(255, 107, 122, 0.8)',  // Medium pink
            'rgba(230, 57, 80, 0.8)',    // Deep rose
            'rgba(212, 175, 55, 0.6)',   // Gold
            'rgba(255, 215, 0, 0.5)'     // Bright gold
        ];

        class Petal {
            constructor() {
                this.reset();
                this.y = Math.random() * -canvas.height; // Start above screen
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -50;
                this.size = Math.random() * 8 + 4;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 2;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
                this.sway = Math.random() * 2;
                this.swaySpeed = Math.random() * 0.02 + 0.01;
                this.time = 0;
            }

            update() {
                this.time += this.swaySpeed;
                this.y += this.speedY;
                this.x += Math.sin(this.time) * this.sway + this.speedX;
                this.rotation += this.rotationSpeed;

                // Reset if off screen
                if (this.y > canvas.height + 50) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                
                // Draw petal shape (ellipse-like)
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Add subtle glow
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                
                ctx.restore();
            }
        }

        // Create particles
        const particleCount = 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Petal());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(petal => {
                petal.update();
                petal.draw();
            });
            
            animationId = requestAnimationFrame(animate);
        }

        animate();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
});
