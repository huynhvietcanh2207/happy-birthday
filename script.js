// Initialize particles background
document.addEventListener('DOMContentLoaded', () => {
    // Particles.js configuration
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 120,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#ff1493', '#4169e1', '#ffd700', '#ff69b4', '#00bfff']
            },
            shape: {
                type: ['circle', 'star', 'triangle'],
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 6,
                random: true,
                anim: {
                    enable: true,
                    speed: 4,
                    size_min: 0.3,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 2.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 800,
                    rotateY: 1500
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'bubble'
                },
                onclick: {
                    enable: true,
                    mode: 'repulse'
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 300,
                    size: 8,
                    duration: 2,
                    opacity: 0.9,
                    speed: 3
                },
                repulse: {
                    distance: 250,
                    duration: 0.4
                }
            }
        },
        retina_detect: true
    });

    // Add click event to gift box
    document.getElementById('initial-gift').addEventListener('click', openGift);
    
    // Add event listener to celebration button (cake)
    document.getElementById('celebrateBtn').addEventListener('click', () => {
        createBottomUpFireworks();
    });
    
    // Add event listener to heart icon
    document.getElementById('heartIcon').addEventListener('click', showHeart3D);
    
    // Add event listener to close button for 3D heart
    document.getElementById('closeHeart').addEventListener('click', hideHeart3D);
    
    // Tạo audio element toàn cục để phát nhạc sinh nhật
    window.birthdayAudio = new Audio('nhac.mp4');
    window.birthdayAudio.loop = true; // Cho phép nhạc lặp lại
});

// Heart-related functions (showHeart3D, hideHeart3D, init3DHeart, createHeartParticles, animateHeart) 
// were moved to heart.js

// Open gift and reveal birthday content
function openGift() {
    const initialGift = document.getElementById('initial-gift');
    const birthdayContent = document.getElementById('birthday-content');
    
    // Phát nhạc sinh nhật
    try {
        window.birthdayAudio.volume = 0.6; // Điều chỉnh âm lượng (0.0 - 1.0)
        window.birthdayAudio.play().catch(err => {
            console.log("Không thể tự động phát nhạc:", err);
            // Tạo thông báo nhấn để phát nhạc nếu trình duyệt chặn autoplay
            createPlayMusicButton();
        });
    } catch (err) {
        console.log("Lỗi phát nhạc:", err);
    }
    
    // Animate the gift opening
    initialGift.classList.add('animate__animated', 'animate__bounceOut');
    
    setTimeout(() => {
        // Hide initial gift
        initialGift.style.display = 'none';
        
        // Show birthday content with animation
        birthdayContent.style.display = 'block';
        birthdayContent.classList.add('animate__animated', 'animate__zoomIn');
        
        // Initialize birthday animations after revealing content
        initGift3D();
        initConfetti();
        
        // Auto launch celebration after a short delay
        setTimeout(() => {
            launchCelebration();
        }, 1500);
    }, 800);
}

// Tạo nút phát nhạc nếu trình duyệt chặn autoplay
function createPlayMusicButton() {
    // Kiểm tra xem nút đã tồn tại chưa
    if (document.getElementById('play-music-button')) return;
    
    const button = document.createElement('button');
    button.id = 'play-music-button';
    button.innerHTML = '<i class="fa fa-music"></i> Phát nhạc';
    button.className = 'play-music-button';
    
    // Thêm style cho nút phát nhạc
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.left = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = 'var(--primary-color)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '30px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
    button.style.fontFamily = "'Montserrat', sans-serif";
    button.style.fontSize = '16px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.gap = '8px';
    
    // Thêm hiệu ứng hover
    button.onmouseover = function() {
        this.style.transform = 'scale(1.05)';
    };
    button.onmouseout = function() {
        this.style.transform = 'scale(1)';
    };
    
    // Xử lý sự kiện click
    button.onclick = function() {
        window.birthdayAudio.play();
        this.innerHTML = '<i class="fa fa-volume-up"></i> Đang phát...';
        setTimeout(() => {
            this.remove(); // Xóa nút sau khi nhạc đã phát
        }, 2000);
    };
    
    document.body.appendChild(button);
}

// Create 3D gift using Three.js
function initGift3D() {
    const container = document.getElementById('gift-3d');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Create present box geometry
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Materials with different colors for each side
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0xff1493, shininess: 100 }), // Pink
        new THREE.MeshPhongMaterial({ color: 0x4169e1, shininess: 100 }), // Royal blue
        new THREE.MeshPhongMaterial({ color: 0xff1493, shininess: 100 }), // Pink
        new THREE.MeshPhongMaterial({ color: 0x4169e1, shininess: 100 }), // Royal blue
        new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100 }), // Gold
        new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100 })  // Gold
    ];
    
    // Create mesh with geometry and materials
    const boxMesh = new THREE.Mesh(boxGeometry, materials);
    scene.add(boxMesh);
    
    // Create ribbon
    const ribbonGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 64, 8, 2, 3);
    const ribbonMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd700, 
        shininess: 150,
        specular: 0xffffff
    });
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon.position.y = 1.5;
    scene.add(ribbon);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffd700, 1, 100);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        boxMesh.rotation.x += 0.01;
        boxMesh.rotation.y += 0.01;
        
        ribbon.rotation.y += 0.02;
        
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
}

// Initialize confetti effect
function initConfetti() {
    // We'll create actual confetti in the celebration function
    const confettiContainer = document.querySelector('.confetti-container');
    
    // Pre-create some confetti for visual effect
    for (let i = 0; i < 30; i++) {
        createConfettiPiece(confettiContainer, i * 100);
    }
}

// Create a single confetti piece
function createConfettiPiece(container, delay = 0) {
    const colors = ['#ff1493', '#4169e1', '#ffd700', '#ff69b4', '#00bfff', '#ff6347'];
    const shapes = ['square', 'circle'];
    
    const confetti = document.createElement('div');
    confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.opacity = Math.random();
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear ${delay}ms`;
    
    container.appendChild(confetti);
    
    // Remove confetti after animation ends
    setTimeout(() => {
        confetti.remove();
    }, 5000 + delay);
}

// Launch celebration effects
function launchCelebration() {
    // Tạo nhiều confetti
    const confettiContainer = document.querySelector('.confetti-container');
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            createConfettiPiece(confettiContainer);
        }, i * 20);
    }
    
    // Thêm hiệu ứng pháo hoa
    createFireworks();
    
    // Thêm animation cho các phần tử
    const elements = document.querySelectorAll('.birthday-card, h1, .birthday-message, .gift-box');
    elements.forEach(el => {
        el.classList.add('animate__animated', 'animate__tada');
        setTimeout(() => {
            el.classList.remove('animate__tada');
        }, 1000);
    });
}

// Tạo pháo hoa bắn từ dưới lên khi click vào bánh kem
function createBottomUpFireworks() {
    // Phát âm thanh nổ (nếu có)
    try {
        const audio = new Audio('explosion.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } catch (e) {}
    
    // Tạo container cho pháo hoa nếu chưa có
    let fireworksContainer = document.querySelector('.fireworks');
    if (!fireworksContainer) {
        fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'fireworks';
        document.body.appendChild(fireworksContainer);
    }
    
    // Tạo nhiều quả pháo hoa phóng lên từ dưới
    const fireworksCount = 3; // Số lượng pháo hoa
    
    for (let i = 0; i < fireworksCount; i++) {
        setTimeout(() => {
            const startX = 15 + (i * 10) + Math.random() * 30; // Phân bố đều trên màn hình
            createBottomUpFirework(fireworksContainer, startX);
        }, i * 200); // Thời gian giãn cách giữa các quả pháo
    }
}

// Tạo một quả pháo hoa bắn lên từ dưới
function createBottomUpFirework(container, xPosition) {
    // Tạo tên lửa pháo hoa
    const rocket = document.createElement('div');
    rocket.className = 'firework-rocket';
    
    // Đặt vị trí ban đầu ở phía dưới màn hình
    rocket.style.left = `${xPosition}%`;
    rocket.style.bottom = '0';
    
    // Thêm hiệu ứng đuôi tên lửa
    const trail = document.createElement('div');
    trail.className = 'firework-trail';
    rocket.appendChild(trail);
    
    container.appendChild(rocket);
    
    // Hoạt ảnh tên lửa bay lên
    const destinationY = 30 + Math.random() * 60; // Độ cao ngẫu nhiên (30-70% chiều cao màn hình)
    const duration = 0.8 + Math.random() * 0.6; // Thời gian bay (0.8-1.4s)
    
    // Sử dụng requestAnimationFrame cho hoạt ảnh mượt mà hơn
    let startTime = null;
    
    function animateRocket(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);
        
        if (progress < 1) {
            const currentY = progress * destinationY;
            rocket.style.bottom = `${currentY}%`;
            requestAnimationFrame(animateRocket);
        } else {
            // Tên lửa đã đạt tới đích, nổ!
            rocket.remove();
            createFireworkExplosion(container, xPosition, destinationY);
        }
    }
    
    requestAnimationFrame(animateRocket);
}

// Tạo vụ nổ pháo hoa
function createFireworkExplosion(container, x, y) {
    // Tạo container cho vụ nổ
    const explosion = document.createElement('div');
    explosion.className = 'firework-explosion';
    explosion.style.left = `${x}%`;
    explosion.style.bottom = `${y}%`;
    container.appendChild(explosion);
    
    // Màu sắc cho vụ nổ này
    const colors = [
        '#ff1493', // Hồng
        '#4169e1', // Xanh dương đậm
        '#ffd700', // Vàng
        '#ff69b4', // Hồng đậm
        '#00bfff', // Xanh da trời
        '#ff4500', // Đỏ cam
        '#7cfc00', // Xanh lá cây
        '#9400d3', // Tím
        '#ff8c00'  // Cam đậm
    ];
    const explosionColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Tạo các hạt cho vụ nổ
    const particleCount = 30 + Math.floor(Math.random() * 30); // 30-60 hạt
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        // Kích thước ngẫu nhiên
        const size = 1 + Math.random() * 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Màu sắc (cùng màu cơ bản với độ sáng khác nhau)
        particle.style.backgroundColor = explosionColor;
        particle.style.boxShadow = `0 0 ${4 + Math.random() * 6}px ${explosionColor}`;
        
        // Tính góc và khoảng cách
        const angle = Math.random() * Math.PI * 2; // Góc ngẫu nhiên 0-360 độ
        const distance = 30 + Math.random() * 120; // Khoảng cách bắn xa từ tâm
        const duration = 0.6 + Math.random() * 0.8; // Thời gian hiệu ứng
        
        // Thêm hạt vào vụ nổ
        explosion.appendChild(particle);
        
        // Hoạt ảnh cho hạt
        let startTime = null;
        
        function animateParticle(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / (duration * 1000);
            
            if (progress < 1) {
                // Chuyển động của hạt: bắt đầu nhanh, chậm dần về cuối
                const currentDistance = distance * Math.sin(progress * Math.PI);
                const fadeOut = 1 - progress;
                
                // Tính toán vị trí
                const x = Math.cos(angle) * currentDistance;
                const y = Math.sin(angle) * currentDistance;
                
                // Áp dụng vị trí và độ mờ
                particle.style.transform = `translate(${x}px, ${-y}px) scale(${1 - progress * 0.5})`;
                particle.style.opacity = fadeOut;
                
                requestAnimationFrame(animateParticle);
            } else {
                // Kết thúc hiệu ứng, xóa hạt
                particle.remove();
            }
        }
        
        requestAnimationFrame(animateParticle);
    }
    
    // Xóa container vụ nổ sau khi hoạt ảnh kết thúc
    setTimeout(() => {
        explosion.remove();
    }, 2000);
}

// Create fireworks effect
function createFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fireworks';
    document.body.appendChild(fireworksContainer);
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = `${Math.random() * 100}%`;
            firework.style.top = `${Math.random() * 50 + 10}%`;
            
            // Create particles for explosion
            for (let j = 0; j < 30; j++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const hue = Math.floor(Math.random() * 360);
                particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
                particle.style.transform = `rotate(${j * 12}deg) translate(${Math.random() * 50 + 60}px)`;
                firework.appendChild(particle);
            }
            
            fireworksContainer.appendChild(firework);
            
            // Remove firework after animation
            setTimeout(() => {
                firework.remove();
            }, 2000);
            
        }, i * 1000);
    }
    
    // Remove fireworks container after all animations
    setTimeout(() => {
        fireworksContainer.remove();
    }, 7000);
}

// Add CSS styles for confetti and fireworks animations
const addAnimationStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
            }
        }
        
        .confetti {
            position: absolute;
            top: -10px;
            z-index: 10;
            pointer-events: none;
        }
        
        .square {
            border-radius: 0;
        }
        
        .circle {
            border-radius: 50%;
        }
        
        .fireworks {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        }
        
        .firework {
            position: absolute;
            transform: translate(-50%, -50%);
        }
        
        .particle {
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            transform-origin: center;
            opacity: 1;
            animation: explode 1.5s forwards;
        }
        
        /* CSS cho hiệu ứng pháo hoa bắn từ dưới lên */
        .firework-rocket {
            position: absolute;
            width: 4px;
            height: 15px;
            background: #ffffff;
            border-radius: 50% 50% 0 0;
            transform: translateX(-50%);
            z-index: 101;
        }
        
        .firework-trail {
            position: absolute;
            bottom: -10px;
            left: 30%;
            transform: translateX(-50%);
            width: 2px;
            height: 10px;
            background: linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,0.8));
            border-radius: 50%;
            filter: blur(1px);
        }
        
        .firework-explosion {
            position: absolute;
            transform: translate(-50%, 50%);
            z-index: 102;
        }
        
        .firework-particle {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: #fff;
            border-radius: 50%;
            transform-origin: center;
            transform: translate(0, 0);
            opacity: 1;
            top: 0;
            left: 0;
        }
        
        @keyframes explode {
            0% {
                transform: rotate(0deg) translate(0);
                opacity: 1;
            }
            100% {
                transform: rotate(var(--rotation)) translate(var(--distance));
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);
};

// Add animation styles when DOM loads
document.addEventListener('DOMContentLoaded', addAnimationStyles); 