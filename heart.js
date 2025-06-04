   // Biến toàn cục cho trái tim 3D
   let heartScene, heartCamera, heartRenderer;
   let allParticles = []; // Lưu tất cả các hạt
   let heartPositions = []; // Lưu vị trí trái tim mục tiêu
   let trailParticles = []; // Lưu các hạt đuôi mờ cho ion xanh
   let explosionParticles = []; // Thêm mảng để lưu hạt bùng nổ
   let lightWaves = []; // Mảng toàn cục để lưu trữ các hiệu ứng sóng ánh sáng
   
   // Biến chứa audio để phát nhạc trang trái tim
   let heartAudio = null;
   let musicAlreadyPlayed = false; // Biến kiểm tra xem nhạc đã được phát chưa
   
   // Biến theo dõi trạng thái
           let formingHeart = false;
           let formingStartTime = 0;
   const formingDuration = 5000; // 5 giây để hình thành trái tim
   let animationStarted = false; // Biến kiểm soát trạng thái hoạt ảnh
   
   // Thiết lập vòng lặp vô tận
   const heartCycleTime = 12000; // 12 giây cho một chu kỳ hoàn chỉnh
           const ionEmitterConfig = {
               position: new THREE.Vector3(0, -80, 0),
               radius: 30,
               coreRadius: 6,
       spawnRate: 5, // Giảm từ 8 xuống 5 hạt mỗi frame
               lastSpawnTime: 0,
       trailConfig: {  // Thêm cấu hình đuôi mờ cho ion thường
           enabled: true,          // Bật hiệu ứng đuôi mờ
           particlesPerTrail: 6,   // Số hạt trong một đuôi mờ
           spawnInterval: 100,      // Tăng khoảng thời gian giữa các hạt đuôi (từ 60ms lên 80ms)
           lifespan: 800,          // Thời gian tồn tại của hạt đuôi (ms)
           sizeDecay: 0.8,         // Hệ số giảm kích thước dọc theo đuôi
           opacityDecay: 0.85,      // Hệ số giảm độ trong suốt dọc theo đuôi
           blueIonProbability: 0.1  // Giảm xác suất ion là ion xanh từ 0.2 xuống 0.1
       },
       explosionConfig: { // Tối ưu cấu hình hiệu ứng bùng nổ khi chuyển đổi
                   enabled: true,
           particles: 6,       // Giảm số lượng hạt trong vụ nổ từ 15 xuống 6
           spread: 2,          // Giảm độ lan tỏa của vụ nổ từ 3 xuống 2
           speed: 0.4,         // Giảm tốc độ các hạt bay ra từ 0.5 xuống 0.4
           lifespan: 400,      // Giảm thời gian sống của hạt nổ từ 500ms xuống 400ms
           color1: 0xffccff,   // Màu 1 cho hạt nổ (hồng nhạt)
           color2: 0x00ffff    // Màu 2 cho hạt nổ (xanh lam)
       },
       heartbeatConfig: { // Cải thiện cấu hình nhịp đập trái tim
                   enabled: true,
           durationFactor: 0.3,     // Giảm tỷ lệ thời gian co (co nhanh hơn, giãn chậm hơn)
           minScale: 0.92,          // Tỷ lệ co nhỏ nhất (co nhiều hơn)
           maxScale: 1.08,          // Tỷ lệ nở lớn nhất (nở nhiều hơn)
           glowIntensity: 0.6,      // Tăng cường độ phát sáng theo nhịp
           pulseInterval: 2000,     // Khoảng thời gian giữa hai nhịp đập (ms)
           lightWaveEnabled: true,  // Bật hiệu ứng sóng ánh sáng
           waveSpeed: 0.1,          // Tốc độ lan tỏa của sóng ánh sáng
           particleMoveFactor: 0.05 // Hệ số dao động hạt theo nhịp
       }
   };
   
   // Cache materials để tái sử dụng
           const cachedMaterials = {
       // Vật liệu ion (xanh)
               ionMaterials: [
                   new THREE.MeshPhongMaterial({ color: 0x00ffff, shininess: 100, specular: 0xffffff, transparent: true }),
                   new THREE.MeshPhongMaterial({ color: 0x00e5ff, shininess: 100, specular: 0xffffff, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0x00bcd4, shininess: 100, specular: 0xffffff, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0x80deea, shininess: 100, specular: 0xffffff, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0x4fc3f7, shininess: 100, specular: 0xffffff, transparent: true })
               ],
       // Vật liệu hạt trái tim (50% đỏ, 30% hồng, 20% trắng)
               heartMaterials: [
           // Đỏ (50%)
           new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
           // Hồng (30%)
            new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
           // Hồng (30%)
                   new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 120, specular: 0x333333, transparent: true }),
   
                   new THREE.MeshPhongMaterial({ color: 0xff69b4, shininess: 120, specular: 0x333333, transparent: true }),
           new THREE.MeshPhongMaterial({ color: 0xff69b4, shininess: 120, specular: 0x333333, transparent: true }),
          
               ],
       // Vật liệu cho đuôi mờ
               trailMaterials: [
                   new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true }),
           new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true }),
           new THREE.MeshBasicMaterial({ color: 0x80deea, transparent: true })
               ],
       // Thêm vật liệu cho hiệu ứng bùng nổ
               explosionMaterials: [
                   new THREE.MeshBasicMaterial({ color: 0xffccff, transparent: true }),
           new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true }),
           new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })
               ],
       // Thêm vật liệu cho hiệu ứng sóng ánh sáng
               lightWaveMaterial: new THREE.MeshBasicMaterial({ 
                   color: 0xffccff, 
                   transparent: true, 
                   opacity: 0.4,
                   side: THREE.DoubleSide,
                   blending: THREE.AdditiveBlending 
       })
   };
   
   // Cache geometries để tái sử dụng
           const cachedGeometries = {
       // Danh sách các geometry cho ion
       ionGeometries: [
           new THREE.SphereGeometry(0.2, 8, 8),     // Hình cầu cơ bản
           new THREE.SphereGeometry(0.2, 16, 16),   // Hình cầu mịn hơn
           new THREE.BoxGeometry(0.3, 0.3, 0.3),    // Hình lập phương
           new THREE.CircleGeometry(0.25, 16),      // Hình tròn phẳng
           new THREE.TorusGeometry(0.2, 0.08, 12, 16), // Hình tròn xuyến (donut)
           new THREE.OctahedronGeometry(0.25, 0),   // Hình bát diện
       ],
       // Vị trí cũ giữ lại để tương thích
               ionGeometry: new THREE.SphereGeometry(0.2, 8, 8),
               trailGeometry: new THREE.SphereGeometry(0.1, 6, 6),
       explosionGeometry: new THREE.SphereGeometry(0.15, 6, 6), // Thêm geometry cho hiệu ứng bùng nổ
       ringGeometry: new THREE.RingGeometry(1, 2, 32) // Thêm geometry cho hiệu ứng sóng ánh sáng
           };
   
   // Tiện ích xử lý các hàm chung
           const ParticleUtils = {
       // Xử lý làm mờ dần hạt
               handleParticleFadeOut: function(particle, currentTime, particlesToRemove) {
                   const userData = particle.userData;
           
           // Xử lý làm mờ dần
                   if (userData.isFadingOut || userData.fadingOut) {
                       const fadeStartTime = userData.fadeOutStart || userData.fadeStartTime;
                       const fadeDuration = userData.fadeOutDuration || userData.fadeDuration;
                       const fadeAge = currentTime - fadeStartTime;
                       const fadeProgress = Math.min(1.0, fadeAge / fadeDuration);
               
                       if (particle.material) {
                           particle.material.opacity = 1 - fadeProgress;
                       }
               
               // Xóa hạt nếu đã hoàn toàn mờ
                       if (fadeProgress >= 1.0) {
                           particlesToRemove.push(particle);
                           return true;
                       }
                   }
                   return false;
               },
       
       // Tạo tốc độ quay ngẫu nhiên
               createRandomRotationSpeed: function() {
                   return {
                       x: (Math.random() - 0.5) * 0.06,
                       y: (Math.random() - 0.5) * 0.04,
                       z: (Math.random() - 0.5) * 0.04
                   };
               },
       
       // Áp dụng quay cho hạt
               applyParticleRotation: function(particle, rotationSpeed, boost = 1) {
                   particle.rotation.x += rotationSpeed.x * boost;
                   particle.rotation.y += rotationSpeed.y * boost;
                   particle.rotation.z += rotationSpeed.z * boost;
               },
       
       // Tạo hiệu ứng nhấp nháy ngẫu nhiên
               applyRandomGlow: function(particle, probability, intensity) {
                   if (Math.random() < probability && particle.material && particle.material.emissive) {
                       const glowIntensity = intensity.base + Math.random() * intensity.random;
                       particle.material.emissive.setRGB(
                           glowIntensity * intensity.r, 
                           glowIntensity * intensity.g, 
                           glowIntensity * intensity.b
                       );
                   }
               },
       
       // Tạo hình dạng trái tim nhỏ
               createHeartShape: function() {
                   if (!this.cachedHeartGeometry) {
                       const smallHeartShape = new THREE.Shape();
                       smallHeartShape.moveTo(0, 0);
                       smallHeartShape.bezierCurveTo(0, -0.5, 0.5, -0.5, 0.5, 0);
                       smallHeartShape.bezierCurveTo(0.5, 0.5, 0, 0.5, 0, 1);
                       smallHeartShape.bezierCurveTo(0, 0.5, -0.5, 0.5, -0.5, 0);
                       smallHeartShape.bezierCurveTo(-0.5, -0.5, 0, -0.5, 0, 0);
               
                       this.cachedHeartGeometry = new THREE.ExtrudeGeometry(smallHeartShape, {
                           depth: 0.25,
                           bevelEnabled: true,
                           bevelThickness: 0.08,
                           bevelSize: 0.08,
                           bevelSegments: 3
                       });
               
               // Tăng kích thước của trái tim lên 20% để to hơn
               this.cachedHeartGeometry.scale(0.3, 0.3, 0.3);
                   }
           
                   return this.cachedHeartGeometry;
               },
       
       // Xóa các hạt từ scene và mảng
               removeParticles: function(particlesToRemove, particleArray, scene) {
                   particlesToRemove.forEach(particle => {
                       scene.remove(particle);
                       const index = particleArray.indexOf(particle);
                       if (index !== -1) {
                           particleArray.splice(index, 1);
                       }
                   });
               },
       
       // Tạo một hạt đuôi mờ để theo sau ion
               createTrailParticle: function(ionParticle) {
           // Lấy vị trí của hạt ion để đặt hạt đuôi
                   const position = ionParticle.position.clone();
           
           // Chọn ngẫu nhiên một vật liệu từ danh sách vật liệu đuôi mờ
                   const materialIndex = Math.floor(Math.random() * cachedMaterials.trailMaterials.length);
                   const material = cachedMaterials.trailMaterials[materialIndex].clone();
           
           // Nếu ion là xanh thì đuôi cũng xanh
           if(ionParticle.userData.isBlueIon) {
                       material.color = new THREE.Color(0x33ffff);  // Màu xanh sáng hơn
               material.opacity = 0.85; // Tăng độ đậm để thấy rõ hơn
               material.blending = THREE.AdditiveBlending; // Thêm hiệu ứng cộng màu để sáng hơn
                   } else {
               // Đuôi cho ion thường
                       material.opacity = 0.65; // Tăng độ đậm
               material.blending = THREE.AdditiveBlending; // Thêm hiệu ứng cộng màu
               material.color = new THREE.Color(0x88ddff); // Màu xanh nhẹ hơn
                   }
           
           // Tạo lưới cho hạt đuôi mờ
                   const mesh = new THREE.Mesh(cachedGeometries.trailGeometry, material);
                   mesh.position.copy(position);
           
           // Lấy kích thước của hạt ion để tính kích thước hạt đuôi
                   const parentScale = ionParticle.scale.x || 0.8;
           const scaleMultiplier = 1.1; // Hạt đuôi to hơn một chút để tạo hiệu ứng phát sáng
                   const scale = parentScale * scaleMultiplier;
           
           // Áp dụng kích thước
                   mesh.scale.set(scale, scale, scale);
           
           // Thiết lập thông số cho hạt đuôi mờ
                   mesh.userData = {
                       type: 'trail',
                       birthTime: Date.now(),
                       lifespan: ionEmitterConfig.trailConfig.lifespan * 1.2, // Kéo dài thời gian sống để hiệu ứng đẹp hơn
                       fadingOut: true,
               fadeStartTime: Date.now(), // Bắt đầu mờ dần ngay lập tức
               fadeDuration: ionEmitterConfig.trailConfig.lifespan * 1.2, // Thời gian mờ dần bằng tuổi thọ mới
               isBlueTrail: ionParticle.userData.isBlueIon // Đánh dấu nếu là đuôi của ion xanh
           };
           
           // Thêm vào scene và mảng quản lý
                   heartScene.add(mesh);
                   trailParticles.push(mesh);
           
                   return mesh;
               },
       
       // Xử lý chuyển động xoáy lốc cho hạt ion chuẩn
               updateStandardIonSpiralMotion: function(particle, userData, currentTime, age) {
           // Lưu vị trí cũ để tạo đuôi mờ
                   const oldPosition = particle.position.clone();
           
           // Chuyển động bay lên cơ bản
                   particle.position.y += userData.velocity.y;
           
           // Tính toán tiến trình chiều cao của hạt
                   const heightProgress = Math.min(1.0, (particle.position.y - (-80)) / 80);
           
           // Hệ số dựa trên vị trí ban đầu
                   const distanceFactor = Math.sqrt(
                       Math.pow(userData.spiral.initialX, 2) + 
                       Math.pow(userData.spiral.initialZ, 2)
                   ) / ionEmitterConfig.radius;
           
           // Hiệu ứng xoáy lốc đơn giản hơn
           const mainPhase = userData.spiral.phase + age * 0.0015 * userData.spiral.speed;
           
           // Tính bán kính xoáy lốc dựa trên chiều cao - thu hẹp dần khi lên cao
                   const spiralRadiusMultiplier = 1 - Math.pow(heightProgress, 1.2) * 0.6;
           
           // Bán kính hiệu quả
                   const effectiveRadius = userData.spiral.radius * spiralRadiusMultiplier;
           
           // Tính toán chuyển động xoáy chính - đơn giản hóa
                   let spiralX = Math.cos(mainPhase) * effectiveRadius;
                   let spiralZ = Math.sin(mainPhase) * effectiveRadius;
           
           // Hiệu ứng hình nón - hạt bay ra xa hơn khi lên cao
                   const coneEffect = Math.pow(heightProgress, 1.3) * 1.5;
           
           // Giảm dần ảnh hưởng của vị trí ban đầu khi lên cao
                   const initialPositionWeight = Math.max(0, 1 - heightProgress * 2.5);
                   const spiralWeight = 1 - initialPositionWeight;
           
           // Áp dụng hiệu ứng hình nón vào chuyển động xoáy
           spiralX *= (1 + coneEffect * 0.4);
           spiralZ *= (1 + coneEffect * 0.4);
           
           // Kết hợp vị trí ban đầu và hiệu ứng xoáy lốc
                   particle.position.x = userData.spiral.initialX * initialPositionWeight + spiralX * spiralWeight;
                   particle.position.z = userData.spiral.initialZ * initialPositionWeight + spiralZ * spiralWeight;
           
           // Hiệu ứng hội tụ đột ngột khi gần đạt độ cao chuyển đổi
           const convergenceThreshold = -45; // Độ cao bắt đầu hội tụ
                   if (particle.position.y > convergenceThreshold) {
                       const convergenceFactor = Math.min(1.0, (particle.position.y - convergenceThreshold) / 10);
                       const convergenceStrength = Math.pow(convergenceFactor, 2) * 0.6;
               
               // Thu hẹp dần vào trung tâm
                       particle.position.x *= (1 - convergenceStrength);
                       particle.position.z *= (1 - convergenceStrength);
                   }
           
           // Quay hạt với tốc độ cố định
           const rotationBoost = 1 + heightProgress * 0.2; 
                   this.applyParticleRotation(particle, userData.rotationSpeed, rotationBoost);
           
           // Kiểm tra và tạo hiệu ứng đuôi mờ - giảm tần suất
                   if (ionEmitterConfig.trailConfig.enabled && !userData.transformToHeart) {
               // Tạo đuôi mờ chỉ cho ion xanh hoặc ion đang bay lên cao
               const shouldCreateTrail = userData.isBlueIon || particle.position.y > -60;
               
               if (shouldCreateTrail && 
                           (!userData.lastTrailTime || currentTime - userData.lastTrailTime >= ionEmitterConfig.trailConfig.spawnInterval)) {
                   // 50% khả năng tạo đuôi để giảm số lượng hạt
                   if (Math.random() < 0.5) {
                           this.createTrailParticle(particle);
                   }
                           userData.lastTrailTime = currentTime;
                       }
                   }
           
                   return heightProgress;
               },
       
       // Tạo hiệu ứng bùng nổ khi chuyển đổi ion thành trái tim
               createExplosion: function(position, scene, color = null) {
                   const config = ionEmitterConfig.explosionConfig;
                   if (!config.enabled) return;
           
           // Giảm số lượng hạt nổ từ 15 xuống 8
           const particleCount = 8;
           
           for (let i = 0; i < particleCount; i++) {
               // Chọn ngẫu nhiên một vật liệu từ danh sách vật liệu bùng nổ
                       const materialIndex = Math.floor(Math.random() * cachedMaterials.explosionMaterials.length);
                       const material = cachedMaterials.explosionMaterials[materialIndex].clone();
               
               // Nếu có màu cụ thể, sử dụng màu đó
                       if (color) {
                           material.color = new THREE.Color(color);
                       }
               
               // Độ trong suốt ban đầu
               material.opacity = 0.7;
               
               // Tạo hạt bùng nổ - sử dụng geometry đơn giản hơn
                       const mesh = new THREE.Mesh(cachedGeometries.explosionGeometry, material);
               
               // Vị trí ban đầu tại điểm chuyển đổi
                       mesh.position.copy(position);
               
               // Kích thước cố định thay vì ngẫu nhiên
               const scale = 0.8;
                       mesh.scale.set(scale, scale, scale);
               
               // Tốc độ bay ra ngẫu nhiên - giảm tốc độ
                       const velocity = new THREE.Vector3(
                   (Math.random() - 0.5) * config.speed * 0.7,
                   (Math.random() - 0.5) * config.speed * 0.7,
                   (Math.random() - 0.5) * config.speed * 0.7
               );
               
               // Giảm thời gian sống của hạt nổ
               const lifespan = config.lifespan * 0.6;
               
               // Thiết lập thông số cho hạt bùng nổ
                       mesh.userData = {
                           type: 'explosion',
                           birthTime: Date.now(),
                           velocity: velocity,
                   rotationSpeed: {
                       x: (Math.random() - 0.5) * 0.03,
                       y: (Math.random() - 0.5) * 0.03,
                       z: (Math.random() - 0.5) * 0.03
                   },
                   lifespan: lifespan,
                   fadeStartTime: Date.now() + lifespan * 0.3,
                   fadeDuration: lifespan * 0.7,
                           fadingOut: false
                       };
               
               // Thêm vào scene và mảng quản lý
                       scene.add(mesh);
                       explosionParticles.push(mesh);
                   }
               },
       
       // Tạo hiệu ứng sóng ánh sáng lan tỏa từ trung tâm trái tim
               createLightWave: function(scene, origin = new THREE.Vector3(0, 10, 0)) {
                   const config = ionEmitterConfig.heartbeatConfig;
           
           // Tạo sóng ánh sáng
                   const material = cachedMaterials.lightWaveMaterial.clone();
           material.opacity = 0.7; // Độ mờ ban đầu
           
           // Tạo mặt phẳng tròn tại tâm trái tim
                   const ring = new THREE.Mesh(cachedGeometries.ringGeometry, material);
           
           // Đặt vị trí và xoay nhẹ theo góc nhìn
                   ring.position.copy(origin);
           ring.rotation.x = Math.PI / 2; // Xoay để vòng nằm ngang
           ring.rotation.y = Math.random() * Math.PI * 0.2; // Xoay nhẹ theo trục Y
           
           // Kích thước ban đầu nhỏ
                   ring.scale.set(0.5, 0.5, 0.5);
           
           // Màu sắc ngẫu nhiên
           const useBlueColor = Math.random() < 0.3; // 30% khả năng dùng màu xanh
                   if (useBlueColor) {
                       material.color = new THREE.Color(0x00ffff);
                   } else {
                       material.color = new THREE.Color(0xffccff);
                   }
           
           // Thêm thông tin cho hiệu ứng sóng
                   ring.userData = {
                       birthTime: Date.now(),
               lifespan: 1500, // 1.5 giây sống
               maxRadius: 20 + Math.random() * 10, // Bán kính tối đa
               velocity: config.waveSpeed * (0.8 + Math.random() * 0.4), // Tốc độ lan tỏa
               fadeStartTime: Date.now() + 500, // Bắt đầu mờ dần sau 0.5s
               fadeDuration: 1000 // Mờ dần trong 1s
           };
           
           // Thêm vào scene và mảng quản lý
                   scene.add(ring);
                   lightWaves.push(ring);
           
                   return ring;
               },
       
       // Cập nhật trạng thái các sóng ánh sáng
               updateLightWaves: function(currentTime, wavesToRemove) {
                   lightWaves.forEach(wave => {
                       const userData = wave.userData;
                       const age = currentTime - userData.birthTime;
               
                       if (age > userData.lifespan) {
                           wavesToRemove.push(wave);
                           return;
                       }
               
               // Tính toán bán kính hiện tại (lan tỏa theo thời gian)
                       const progressRadius = Math.min(1.0, age / userData.lifespan);
                       const currentRadius = progressRadius * userData.maxRadius;
                       wave.scale.set(currentRadius, currentRadius, currentRadius);
               
               // Xử lý làm mờ dần
                       if (currentTime > userData.fadeStartTime) {
                           const fadeAge = currentTime - userData.fadeStartTime;
                           const fadeProgress = Math.min(1.0, fadeAge / userData.fadeDuration);
                           wave.material.opacity = 0.7 * (1 - fadeProgress);
                       }
               
               // Hiệu ứng dao động nhẹ
                       const wobbleAmount = Math.sin(age * 0.01) * 0.05;
                       wave.rotation.z = userData.initialRotationZ + wobbleAmount;
                   });
               },
       
       // Thêm hiệu ứng lan tỏa ánh sáng theo nhịp đập
               updateHeartbeatGlow: function(heartParticles, currentTime) {
                   const config = ionEmitterConfig.heartbeatConfig;
                   if (!config.enabled || heartParticles.length === 0) return;
           
           // Tính toán chu kỳ nhịp đập
                   const pulsePhase = (currentTime % config.pulseInterval) / config.pulseInterval;
           
           // Hiệu ứng tạo sóng ánh sáng khi tim co lại đột ngột
                   if (pulsePhase < 0.1 && pulsePhase > 0.05) {
               // Chỉ tạo sóng ở đỉnh co
               if (Math.floor(currentTime / 100) % 20 === 0) { // Giới hạn tốc độ tạo sóng
                   // Vị trí trung bình của trái tim
                           const heartCenter = new THREE.Vector3(0, 10, 0);
                   
                   // Tạo sóng ánh sáng
                           if (config.lightWaveEnabled) {
                               this.createLightWave(heartScene, heartCenter);
                           }
                       }
                   }
           
           // Tính toán cường độ phát sáng dựa trên giai đoạn nhịp đập
                   let glowIntensity = 0;
           
           // Hiệu ứng nhịp đập tự nhiên: thu nhỏ nhanh, phình to từ từ
                   if (pulsePhase < config.durationFactor) {
               // Giai đoạn thu nhỏ nhanh (co thắt tâm thu - systole)
               // Sử dụng hàm phi tuyến để tạo cảm giác co lại đột ngột
                       const contractionProgress = pulsePhase / config.durationFactor;
               const easing = 1 - Math.pow(1 - contractionProgress, 3); // Easing cubic
                       glowIntensity = (1 - easing) * config.glowIntensity;
                   } else {
               // Giai đoạn phình to từ từ (giãn tâm trương - diastole)
               // Sử dụng hàm sin để tạo hiệu ứng mềm mại
                       const expansionProgress = (pulsePhase - config.durationFactor) / (1 - config.durationFactor);
                       glowIntensity = Math.sin(expansionProgress * Math.PI) * config.glowIntensity * 0.7;
                   }
           
           // Tính toán tỷ lệ co giãn
                   let scaleFactor = config.minScale;
                   if (pulsePhase < config.durationFactor) {
               // Giai đoạn thu nhỏ nhanh với hiệu ứng tăng tốc đột ngột
                       const contractionProgress = pulsePhase / config.durationFactor;
               const easing = 1 - Math.pow(1 - contractionProgress, 4); // Easing quartic
                       scaleFactor = config.maxScale - easing * (config.maxScale - config.minScale);
                   } else {
               // Giai đoạn phình to từ từ
                       const expansionProgress = (pulsePhase - config.durationFactor) / (1 - config.durationFactor);
                       scaleFactor = config.minScale + Math.sin(expansionProgress * Math.PI) * (config.maxScale - config.minScale);
                   }
           
           // Tính hệ số lan tỏa từ trung tâm
                   const spreadFactor = function(position) {
               // Tính khoảng cách từ trung tâm trái tim (0, 10, 0)
                       const dx = position.x;
                       const dy = position.y - 10;
                       const dz = position.z;
                       const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
               
               // Delay hiệu ứng lan tỏa theo khoảng cách (càng xa trung tâm càng chậm)
               const delay = Math.min(1, distance / 25) * 0.2; // Tối đa 0.2 chu kỳ delay
               
               // Pha sau delay
                       let delayedPhase = pulsePhase - delay;
                       if (delayedPhase < 0) delayedPhase += 1;
               
               // Giảm cường độ theo khoảng cách
                       return {
                           intensity: Math.max(0, 1 - distance / 30),
                           delay: delayedPhase
                       };
                   };
           
           // Áp dụng hiệu ứng cho từng hạt trái tim
                   heartParticles.forEach(particle => {
                       if (particle.userData.type !== 'heart') return;
               
               // Hệ số lan tỏa dựa trên khoảng cách
                       const spread = spreadFactor(particle.position);
               
               // Áp dụng hiệu ứng phát sáng
                       if (particle.material && particle.material.emissive) {
                           const intensity = glowIntensity * spread.intensity;
                   
                   // Màu phát sáng theo loại hạt với độ sáng cao hơn
                   if (particle.material.color.r > 0.8) {  // Màu đỏ/hồng
                               particle.material.emissive.setRGB(intensity * 0.7, intensity * 0.15, intensity * 0.15);
                   } else if (particle.material.color.g > 0.8) {  // Màu vàng
                               particle.material.emissive.setRGB(intensity * 0.7, intensity * 0.7, intensity * 0.15);
                           } else {
                               particle.material.emissive.setRGB(intensity * 0.4, intensity * 0.15, intensity * 0.25);
                           }
                   
                   // Điều chỉnh cường độ phát sáng
                           particle.material.emissiveIntensity = 0.3 + intensity * 0.8;
                       }
               
               // Áp dụng hiệu ứng co giãn theo khoảng cách và độ trễ
                       const delayedPhase = spread.delay;
                       let localScaleFactor = config.minScale;
               
               // Giảm tỷ lệ co giãn ở vùng ngoài để tạo hiệu ứng lan tỏa rõ rệt
                       const scaleAmplitude = (config.maxScale - config.minScale) * spread.intensity;
               
               // Tính tỷ lệ co giãn cho hạt hiện tại dựa trên pha có độ trễ
                       if (delayedPhase < config.durationFactor) {
                           const contractionProgress = delayedPhase / config.durationFactor;
                           const easing = 1 - Math.pow(1 - contractionProgress, 4);
                           localScaleFactor = config.maxScale - easing * scaleAmplitude;
                       } else {
                           const expansionProgress = (delayedPhase - config.durationFactor) / (1 - config.durationFactor);
                           localScaleFactor = config.minScale + Math.sin(expansionProgress * Math.PI) * scaleAmplitude;
                       }
               
                       const originalScale = particle.userData.originalScale || 1;
                       particle.scale.set(
                           originalScale * localScaleFactor,
                           originalScale * localScaleFactor,
                           originalScale * localScaleFactor
                       );
               
               // Thêm hiệu ứng rung nhẹ theo nhịp đập
                       if (config.particleMoveFactor > 0) {
                           const heartbeatPhase = delayedPhase * Math.PI * 2;
                           const wobble = Math.sin(heartbeatPhase) * config.particleMoveFactor;
                   
                   // Tạo vector hướng từ tâm trái tim ra ngoài
                           const dirX = particle.position.x;
                   const dirY = particle.position.y - 10; // Tâm trái tim ở y=10
                           const dirZ = particle.position.z;
                   
                   // Chuẩn hóa vector hướng
                           const len = Math.sqrt(dirX*dirX + dirY*dirY + dirZ*dirZ);
                           if (len > 0) {
                       // Áp dụng dao động theo hướng ra từ tâm
                       const factor = wobble / len;
                       
                       // Lưu trữ vị trí gốc nếu chưa có
                               if (!particle.userData.origPos) {
                                   particle.userData.origPos = {
                                       x: particle.position.x,
                                       y: particle.position.y,
                                       z: particle.position.z
                                   };
                               }
                       
                       // Áp dụng dao động lên vị trí gốc
                               particle.position.x = particle.userData.origPos.x + dirX * factor;
                               particle.position.y = particle.userData.origPos.y + dirY * factor;
                               particle.position.z = particle.userData.origPos.z + dirZ * factor;
                           }
                       }
                   });
       }
   };
   
   // Hiển thị hiệu ứng trái tim 3D
   function showHeart3D() {
       const heartContainer = document.getElementById('heart3DContainer');
       heartContainer.style.display = 'flex';
       
      
       
       // Đặt lại tất cả các hạt
       if (heartScene) {
           const container = document.getElementById('heart3D');
           container.innerHTML = '';
           heartScene = null;
           allParticles = [];
           trailParticles = [];
           explosionParticles = [];
           lightWaves = [];
       }
       
       // Chỉ khởi tạo nếu chưa bắt đầu hoạt ảnh
       if (!animationStarted) {
           init3DHeart();
           animationStarted = true;
       }
   }
   
   // Phát nhạc cho hiệu ứng trái tim
   function playHeartMusic() {
       try {
           // Dừng nhạc cũ nếu đang phát
           if (heartAudio) {
               heartAudio.pause();
               heartAudio = null;
           }
           
           // Tạo đối tượng audio mới và phát
           heartAudio = new Audio('nhactrong.mp4');
           heartAudio.volume = 0.5; // Âm lượng 50%
           heartAudio.loop = true; // Cho phép lặp lại
           
           // Phát nhạc và xử lý khi không thể phát tự động
           heartAudio.play().catch(err => {
               console.log("Không thể tự động phát nhạc trái tim:", err);
               // Tạo nút phát nhạc nếu cần
               createHeartMusicButton();
           });
       } catch (err) {
           console.log("Lỗi phát nhạc trái tim:", err);
       }
   }
   
//    // Tạo nút phát nhạc cho trái tim
//    function createHeartMusicButton() {
//        // Kiểm tra nếu nút đã tồn tại
//        if (document.getElementById('heart-music-button')) return;
       
//        const button = document.createElement('button');
//        button.id = 'heart-music-button';
//        button.innerHTML = '<i class="fa fa-music"></i> Phát nhạc';
//        button.className = 'heart-music-button';
       
//        // CSS cho nút
//        button.style.position = 'absolute';
//        button.style.top = '15px';
//        button.style.left = '15px';
//        button.style.zIndex = '2002'; // Trên cả heart container
//        button.style.padding = '10px 15px';
//        button.style.backgroundColor = 'rgba(255, 20, 147, 0.8)';
//        button.style.color = 'white';
//        button.style.border = 'none';
//        button.style.borderRadius = '30px';
//        button.style.cursor = 'pointer';
//        button.style.fontFamily = "'Montserrat', sans-serif";
//        button.style.fontSize = '14px';
//        button.style.display = 'flex';
//        button.style.alignItems = 'center';
//        button.style.gap = '8px';
//        button.style.boxShadow = '0 0 10px rgba(255, 20, 147, 0.6)';
       
//        // Hiệu ứng hover
//        button.onmouseover = function() {
//            this.style.backgroundColor = 'rgba(255, 20, 147, 1)';
//            this.style.transform = 'scale(1.05)';
//        };
//        button.onmouseout = function() {
//            this.style.backgroundColor = 'rgba(255, 20, 147, 0.8)';
//            this.style.transform = 'scale(1)';
//        };
       
//        // Xử lý khi click
//        button.onclick = function() {
//            if (heartAudio) {
//                heartAudio.play();
//                this.innerHTML = '<i class="fa fa-volume-up"></i> Đang phát';
//                setTimeout(() => {
//                    this.remove();
//                }, 2000);
//            }
//        };
       
//        // Thêm vào heart container
//        document.getElementById('heart3DContainer').appendChild(button);
//    }
   
   // Ẩn hiệu ứng trái tim 3D
           function hideHeart3D() {
       document.getElementById('heart3DContainer').style.display = 'none';
       
       // Dừng phát nhạc khi đóng trái tim
       if (heartAudio) {
           heartAudio.pause();
           heartAudio = null;
           musicAlreadyPlayed = false; // Reset biến khi đóng trái tim
       }
       
       // Dọn dẹp khi đóng
       if (heartScene) {
           const container = document.getElementById('heart3D');
           container.innerHTML = '';
           heartScene = null;
           // Reset trạng thái animation
           animationStarted = false;
       }
       
       // Đảm bảo nhạc từ trang chính cũng được dừng
       if (window.birthdayAudio) {
           window.birthdayAudio.pause();
           window.birthdayAudio.currentTime = 0;
       }
   }
   
   // Khởi tạo trái tim 3D được tạo từ nhiều hạt
           function init3DHeart() {
       const container = document.getElementById('heart3D');
               const width = container.clientWidth;
               const height = container.clientHeight;
   
       // Xóa container nếu cần
       container.innerHTML = '';
   
       // Tạo scene
               heartScene = new THREE.Scene();
       
       // Tạo camera với góc nhìn phù hợp
               heartCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
               heartCamera.position.z = 80;
       heartCamera.position.y = 0; // Di chuyển camera xuống để trái tim hiển thị cao hơn
               heartCamera.position.x = 8;
       
       // Tạo renderer với chất lượng cao
               heartRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
               heartRenderer.setSize(width, height);
               heartRenderer.setClearColor(0x000000, 0);
       heartRenderer.setPixelRatio(window.devicePixelRatio);
       // Bật hiệu ứng tông màu vật lý
       heartRenderer.physicallyCorrectLights = true;
       // Tăng độ phơi sáng để làm nổi bật các hiệu ứng phát sáng
       heartRenderer.toneMappingExposure = 1.5;
       container.appendChild(heartRenderer.domElement);
   
       // Khởi tạo mảng lưu các hạt
               allParticles = [];
       trailParticles = []; // Khởi tạo mảng đuôi mờ
       explosionParticles = []; // Khởi tạo mảng hạt bùng nổ
       lightWaves = []; // Khởi tạo mảng sóng ánh sáng
       
       // Tính toán các vị trí mục tiêu hình trái tim
       calculateHeartPositions(3000);
       
       // Tạo các hạt ion ban đầu
               createInitialParticles(width, height);
   
       // Thêm ánh sáng môi trường
               const ambientLight = new THREE.AmbientLight(0x6b6b6b); // Tăng cường độ ánh sáng môi trường
               heartScene.add(ambientLight);
       
       // Thêm ánh sáng định hướng
               const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Tăng cường độ
               directionalLight.position.set(1, 1, 1);
               heartScene.add(directionalLight);
       
       // Thêm nhiều nguồn sáng điểm với các màu sắc khác nhau để chiếu sáng 3D tốt hơn
               const pointLight1 = new THREE.PointLight(0xff1493, 2.5, 120); // Tăng cường độ và phạm vi
               pointLight1.position.set(10, 10, 20);
               heartScene.add(pointLight1);
       
               const pointLight2 = new THREE.PointLight(0x4169e1, 2.5, 120); // Tăng cường độ và phạm vi
               pointLight2.position.set(-10, -10, 20);
               heartScene.add(pointLight2);
       
               const pointLight3 = new THREE.PointLight(0xff6347, 2.5, 120); // Tăng cường độ và phạm vi
               pointLight3.position.set(0, 15, -10);
               heartScene.add(pointLight3);
       
       // Thêm ánh sáng điểm từ phía dưới để chiếu sáng dòng ion
               const bottomLight = new THREE.PointLight(0x00bfff, 3.8, 150); // Tăng cường độ và phạm vi
               bottomLight.position.set(0, -50, 0);
               heartScene.add(bottomLight);
       
       // Thêm ánh sáng tỏa ra từ trung tâm để tạo hiệu ứng lấp lánh
               const centerLight = new THREE.PointLight(0xffcce6, 2, 70);
               centerLight.position.set(0, 10, 0); // Vị trí trung tâm trái tim
               heartScene.add(centerLight);
   
       // Vô hiệu hóa điều khiển orbit để không cho phép tương tác chuột
               const controls = new THREE.OrbitControls(heartCamera, heartRenderer.domElement);
       controls.enabled = false; // Tắt hoàn toàn điều khiển
       controls.enableRotate = false;
       controls.enablePan = false;
       controls.enableZoom = false;
       controls.enableDamping = false;
       
       // Đặt góc xoay cố định cho scene
               heartScene.rotation.x = 0.15;
               heartScene.rotation.y = 0.05;
               heartScene.rotation.z = 0;
   
       // Bắt đầu hoạt ảnh
               formingHeart = true;
               formingStartTime = Date.now();
               animateHeart();
           }
   
   // Tính toán các vị trí mục tiêu hình trái tim
           function calculateHeartPositions(count) {
               heartPositions = [];
       
       // Hệ số điều chỉnh độ nhọn đáy - giảm xuống để làm ngắn đáy
               const tipAdjustment = 1.1;
       
       // Tính toán vị trí trái tim mục tiêu bằng phương trình trái tim
               for (let i = 0; i < count; i++) {
           // Sử dụng tọa độ cầu để phân bố đồng đều hơn trong 3D
                   const phi = Math.acos(-1 + (2 * i) / count);
                   const theta = Math.sqrt(count * Math.PI) * phi;
           
           // Tham số phương trình trái tim
                   const t = Math.PI * 2 * Math.random();
           const u = Math.random(); // Cho phân bố khối
           const scale = 18; // Kích thước trái tim
           
                   let x, y, z;
           
           // Tăng xác suất cho các hạt ở dưới đáy
           const forceBottomParticle = Math.random() < 0.1; // 10% xác suất tạo hạt ở đáy
           
                   if (forceBottomParticle) {
               // Tạo một hạt đặc biệt cho khu vực đáy (phần dưới của trái tim)
               const bottomT = Math.PI + (Math.random() * 0.8 - 0.4); // Phạm vi xung quanh π (đáy trái tim)
                       const a = scale;
                       x = a * Math.pow(Math.sin(bottomT), 3);
               
               // Áp dụng hệ số điều chỉnh đáy để làm ngắn phần nhọn
                       y = a * (13 * Math.cos(bottomT) / 16 - 5 * Math.cos(2 * bottomT) / 16 - 2 * Math.cos(3 * bottomT) / 16 - Math.cos(4 * bottomT) / 16) * tipAdjustment;
               
               // Giảm mạnh hạt ở phần nhọn nhất
                       if (y < -20 && Math.abs(x) < 2 && Math.random() < 0.95) {
                   // Bỏ qua vị trí này và thử lại với một góc ngẫu nhiên mới
                           i--;
                           continue;
                       }
               
               // Tính toán z để tạo độ sâu cho các hạt đáy
                       const radius = Math.random() * 3 + 1;
                       z = (Math.random() * 2 - 1) * radius * 2;
               
               // Di chuyển trái tim lên cao thêm 10 đơn vị
                       y += 10;
           }
           // Phân phối hạt dọc theo đường viền trái tim
           else if (Math.random() < 0.4) { // 40% xác suất tạo hạt đường viền
                       const a = scale;
                       x = a * Math.pow(Math.sin(t), 3);
                       y = a * (13 * Math.cos(t) / 16 - 5 * Math.cos(2 * t) / 16 - 2 * Math.cos(3 * t) / 16 - Math.cos(4 * t) / 16) * tipAdjustment;
               
               // Lọc bỏ hạt ở phần nhọn
                       if (y < -20 && Math.abs(x) < 1 && Math.random() < 0.95) {
                           i--;
                           continue;
                       }
               
               // Lọc bỏ hạt ở phần giữa phía trên
                       if (y > 0 && y < 12 && Math.abs(x) < 5 && Math.random() < 0.8) {
                           i--;
                           continue;
                       }
               
               // Đảm bảo hạt nằm trên đường viền
                       const outlineFactor = 0.80 + Math.random() * 0.3;
                       x *= outlineFactor;
                       y *= outlineFactor;
               
               // Biến thiên z nhỏ cho các hạt đường viền (ít độ sâu)
                       z = (Math.random() * 2 - 1) * 2;
               
               // Giảm mật độ ở phần giữa thẳng đứng
                       if (Math.abs(x) < 5 && Math.random() < 0.2) {
                           i--;
                           continue;
                       }
               
               // Di chuyển trái tim lên cao thêm 10 đơn vị
                       y += 10;
           }
           // Phân phối thông thường cho phần còn lại
           else if (Math.random() > 0.4) { // 60% bề mặt, 40% thể tích
                       const a = scale;
                       x = a * Math.pow(Math.sin(t), 3);
                       y = a * (13 * Math.cos(t) / 16 - 5 * Math.cos(2 * t) / 16 - 2 * Math.cos(3 * t) / 16 - Math.cos(4 * t) / 16) * tipAdjustment;
               
               // Lọc bỏ hạt ở phần nhọn
                       if (y < -20 && Math.abs(x) < 7 && Math.random() < 0.95) {
                           i--;
                           continue;
                       }
               
               // Lọc bỏ hạt ở phần giữa phía trên
                       if (y > 0 && y < 12 && Math.abs(x) < 5 && Math.random() < 0.8) {
                           i--;
                           continue;
                       }
               
               // Giảm mật độ ở phần giữa thẳng đứng
                       if (Math.abs(x) < 5 && Math.random() < 0.6) {
                           i--;
                           continue;
                       }
               
               // Cải thiện độ sâu 3D với phân bố cầu
                       const radius = Math.random() * 4 + 3;
                       const sphericalOffset = new THREE.Vector3(
                           Math.sin(phi) * Math.cos(theta),
                           Math.sin(phi) * Math.sin(theta),
                           Math.cos(phi)
                       );
               
                       z = sphericalOffset.z * radius;
                       x += sphericalOffset.x * 0.8;
                       y += sphericalOffset.y * 0.8;
               
               // Di chuyển trái tim lên cao thêm 10 đơn vị
                       y += 10;
               
                   } else {
               // Điểm thể tích (bên trong trái tim)
                       const r = Math.random() * 0.85;
                       const a = scale * r;
                       x = a * Math.pow(Math.sin(t), 3);
                       y = a * (13 * Math.cos(t) / 16 - 5 * Math.cos(2 * t) / 16 - 2 * Math.cos(3 * t) / 16 - Math.cos(4 * t) / 16) * tipAdjustment;
               
               // Lọc bỏ hạt ở phần nhọn
                       if (y < -20 && Math.abs(x) < 5 && Math.random() < 0.95) {
                           i--;
                           continue;
                       }
               
               // Lọc bỏ hạt ở phần giữa phía trên
                       if (y > 0 && y < 12 && Math.abs(x) < 2 && Math.random() < 0.9) {
                           i--;
                           continue;
                       }
               
               // Giảm mật độ ở phần giữa thẳng đứng
                       if (Math.abs(x) < 6 && Math.random() < 0.7) {
                           i--;
                           continue;
                       }
               
               // Tăng cường độ sâu Z cho hiệu ứng thể tích
                       const maxDepth = 20 * r;
                       z = (Math.random() * 2 - 1) * maxDepth;
               
               // Di chuyển trái tim lên cao thêm 10 đơn vị
                       y += 10;
                   }
           
           // Nhấn mạnh vị trí z với các biến thể màu sắc
                   const zDepthFactor = Math.abs(z) / 20;
           
           // Lưu vị trí trái tim mục tiêu
                   heartPositions.push({
                       x: x,
                       y: y,
                       z: z,
                       zDepthFactor: zDepthFactor
                   });
               }
           }
   
   // Tạo các hạt ion ban đầu
           function createInitialParticles(containerWidth, containerHeight) {
       // Số lượng hạt khởi đầu
       const particleCount = 700; // Giảm từ 1500 xuống 1000
       
       // Tạo hạt ban đầu
               for (let i = 0; i < particleCount; i++) {
                   createNewIonParticle(Date.now());
               }
           }
   
   // Hàm tạo ion mới
           function createNewIonParticle(currentTime) {
       // Xác định vị trí phát hạt ban đầu
               let distance;
       
               if (Math.random() < 0.6) {
           // 60% hạt từ khu vực lõi
                   distance = Math.random() * ionEmitterConfig.coreRadius;
               } else {
           // 40% hạt từ vùng rìa
                   distance = ionEmitterConfig.coreRadius + Math.random() * (ionEmitterConfig.radius - ionEmitterConfig.coreRadius);
               }
       
       // Vị trí ban đầu ngẫu nhiên xung quanh vị trí phát hạt
               const angle = Math.random() * Math.PI * 2;
               const x = Math.cos(angle) * distance;
               const z = Math.sin(angle) * distance;
               const y = ionEmitterConfig.position.y + (Math.random() - 0.5) * 2;
       
       // Tính khoảng cách từ trung tâm
               const distanceFromCenter = Math.sqrt(x*x + z*z);
               const centerFactor = 1 - Math.min(1, distanceFromCenter / ionEmitterConfig.radius);
       
       // Xác định xem có phải ion xanh không
               const isBlueIon = Math.random() < ionEmitterConfig.trailConfig.blueIonProbability;
       
       // Khởi tạo vật liệu và kích thước dựa trên loại ion
               const materialIndex = Math.floor(Math.random() * cachedMaterials.ionMaterials.length);
               const material = cachedMaterials.ionMaterials[materialIndex].clone();
       
               if (isBlueIon) {
           // Ion xanh
                   material.emissive = new THREE.Color(0x00ffff);
                   material.emissiveIntensity = 1.2 + Math.random() * 0.8; // Tăng cường độ phát sáng
                   material.shininess = 150; // Tăng độ bóng
                   material.specular = new THREE.Color(0xaaffff); // Màu phản chiếu ánh sáng
               } else {
           // Ion thường
                   material.emissive = new THREE.Color(0x00bfff);
                   material.emissiveIntensity = 0.5 + centerFactor * 0.5; // Tăng cường độ phát sáng
                   material.shininess = 120; // Tăng độ bóng
                   material.specular = new THREE.Color(0x88ccff); // Màu phản chiếu ánh sáng
               }
       
               material.transparent = true;
       
       // Chọn ngẫu nhiên hình dạng cho hạt ion
       const geometryIndex = Math.floor(Math.random() * cachedGeometries.ionGeometries.length);
       const ionGeometry = cachedGeometries.ionGeometries[geometryIndex];
       
       // Tạo mesh hạt ion với hình dạng đã chọn
       const mesh = new THREE.Mesh(ionGeometry, material);
               mesh.position.set(x, y, z);
       
       // Xoay ngẫu nhiên hình dạng để tạo đa dạng
       mesh.rotation.set(
           Math.random() * Math.PI * 2,
           Math.random() * Math.PI * 2,
           Math.random() * Math.PI * 2
       );
       
       // Kích thước ngẫu nhiên cho các hạt - tăng phạm vi kích thước
       const baseSize = isBlueIon ? 0.9 : 0.8;
       const randomFactor = Math.random() * 0.8 + 0.6; // Từ 0.6 đến 1.4 lần kích thước cơ bản
       const centerBonus = centerFactor * 0.3;
       const geometryFactor = (geometryIndex === 3) ? 1.5 : 1.0; // Hình tròn phẳng lớn hơn
       
       const size = (baseSize + centerBonus) * randomFactor * geometryFactor;
               mesh.scale.set(size, size, size);
       
       // Gán chỉ số vị trí trái tim mục tiêu
               const targetIndex = Math.floor(Math.random() * heartPositions.length);
       
       // Tạo tham số chuyển động cho hạt
               mesh.userData = {
           type: 'ion', // Loại hạt ban đầu: ion
           isBlueIon: isBlueIon, // Đánh dấu nếu là ion xanh
           targetIndex: targetIndex, // Vị trí mục tiêu trong trái tim
           originalScale: size, // Kích thước ban đầu
           geometryIndex: geometryIndex, // Lưu hình dạng đã được chọn
           
           // Vận tốc ban đầu - ion xanh nhanh hơn
                   velocity: new THREE.Vector3(
                       (x * 0.002),
                       isBlueIon ? (0.15 + Math.random() * 0.25) : (0.1 + Math.random() * 0.2 + centerFactor * 0.15),
                       (z * 0.002)
                   ),
           
           // Tham số xoắn
                   spiral: {
                       initialX: x,
                       initialZ: z,
                       radius: Math.max(2.0, distance * 0.6),
                       speed: isBlueIon ? (0.12 + Math.random() * 0.22) : (0.08 + Math.random() * 0.12),
                       phase: Math.random() * Math.PI * 2,
                       intensity: 0.15 + Math.random() * 0.2,
                       heightFactor: 1.2
                   },
           
           // Góc và tốc độ quay
                   rotation: {
                       x: Math.random() * Math.PI * 2,
                       y: Math.random() * Math.PI * 2,
                       z: Math.random() * Math.PI * 2
                   },
                   rotationSpeed: ParticleUtils.createRandomRotationSpeed(),
           
           // Thông số chuyển đổi từ ion thành trái tim
                   transformToHeart: false,
                   transformStartTime: 0,
                   transformDuration: 500 + Math.random() * 500,
           
           // Thông số khác
                   birthTime: currentTime,
                   centerFactor: centerFactor,
                   heartGeometry: ParticleUtils.createHeartShape(),
                   heartMaterials: cachedMaterials.heartMaterials,
           
           // Thời gian sống của hạt trái tim
           lifetime: heartCycleTime - 3000 + Math.random() * 2000, // 9-11 giây
           
           // Thông số xóa mờ
                   fadeOutStart: 0,
           fadeOutDuration: 2000, // 2 giây để mờ dần
                   isFadingOut: false,
           
           // Thông số hoạt ảnh trái tim
                   heartAnimation: {
                       amplitude: 0.4 + Math.random() * 0.6,
                       speed: 1.2 + Math.random() * 2.5,
                       phase: Math.random() * Math.PI * 2,
                       drift: {
                           x: (Math.random() - 0.5) * 0.15,
                           y: (Math.random() - 0.5) * 0.08,
                           z: (Math.random() - 0.5) * 0.3
                       }
                   },
           
           // Thông số cho đuôi mờ
                   lastTrailTime: 0
               };
       
       // Thêm vào scene và mảng quản lý
               heartScene.add(mesh);
               allParticles.push(mesh);
       
               return mesh;
           }
   
   // Hàm tạo ion mới liên tục
           function spawnNewIons(currentTime) {
       // Sinh ra các hạt ion mới
               for (let i = 0; i < ionEmitterConfig.spawnRate; i++) {
                   createNewIonParticle(currentTime);
               }
       
       // Cập nhật thời gian phát ion gần nhất
               ionEmitterConfig.lastSpawnTime = currentTime;
           }
   
   // Hoạt ảnh trái tim 3D
           function animateHeart() {
               if (!heartScene) return;
       
       requestAnimationFrame(animateHeart);
       
               const currentTime = Date.now();
               const elapsedTime = currentTime - formingStartTime;
       
       // Tạo hạt ion mới liên tục chỉ khi animation đang chạy
       if (animationStarted) {
           spawnNewIons(currentTime);
       }
       
       // Hoạt ảnh nhịp đập toàn bộ trái tim
               const time = currentTime * 0.0012;
               const pulseFactor = Math.sin(time) * 0.08 + 1;
       
       // Các hạt cần loại bỏ
               const particlesToRemove = [];
       const trailsToRemove = []; // Mảng chứa đuôi mờ cần xóa
       const explosionsToRemove = []; // Mảng chứa hạt nổ cần xóa
       const wavesToRemove = []; // Thêm mảng cho sóng ánh sáng cần xóa
       
       // Độ cao để bắt đầu chuyển đổi thành trái tim
       const transformHeight = -40; // Độ cao bắt đầu chuyển đổi
       
       // Tìm tất cả các hạt trái tim cho hiệu ứng nhịp đập
               const heartParticles = allParticles.filter(p => p.userData.type === 'heart');
       
       // Cập nhật hiệu ứng nhịp đập trái tim
               ParticleUtils.updateHeartbeatGlow(heartParticles, currentTime);
       
       // Cập nhật các sóng ánh sáng
               ParticleUtils.updateLightWaves(currentTime, wavesToRemove);
       
       // Cập nhật từng hạt
               allParticles.forEach(particle => {
           // Lấy thông tin hạt
                   const userData = particle.userData;
                   const age = currentTime - userData.birthTime;
           
           // Kiểm tra loại hạt
                   if (userData.type === 'ion') {
               // === XỬ LÝ HẠT ION ===
               
               // Áp dụng chuyển động xoáy lốc
                       const heightProgress = ParticleUtils.updateStandardIonSpiralMotion(particle, userData, currentTime, age);
               
               // Kiểm tra để chuyển đổi thành hạt trái tim
                       if (particle.position.y > transformHeight && !userData.transformToHeart && heartPositions.length > 0) {
                           userData.transformToHeart = true;
                           userData.transformStartTime = currentTime;
                       }
               
               // Xử lý chuyển đổi từ ion thành trái tim
                       if (userData.transformToHeart) {
                           const transAge = currentTime - userData.transformStartTime;
                           const transProgress = Math.min(1.0, transAge / userData.transformDuration);
                   
                   // Áp dụng hiệu ứng biến đổi kích thước khi chuyển đổi
                           const scaleFactor = 1.0 + Math.sin(Math.PI * transProgress) * 0.2;
                           const originalScale = userData.originalScale || 1;
                           particle.scale.set(
                               originalScale * scaleFactor,
                               originalScale * scaleFactor,
                               originalScale * scaleFactor
                           );
                   
                   // Hiệu ứng phát sáng khi chuyển đổi
                           if (particle.material && particle.material.emissive) {
                               const glowIntensity = Math.sin(Math.PI * transProgress);
                       
                               if (userData.isBlueIon) {
                                   particle.material.emissive.setRGB(0.4, 0.8, 1.0);
                               } else {
                                   particle.material.emissive.setRGB(1.0, 0.6, 0.6);
                               }
                       
                               particle.material.emissiveIntensity = 0.5 + glowIntensity * 0.9;
                           }
                   
                           if (transProgress >= 1.0) {
                       // Hoàn thành chuyển đổi
                               const targetPos = heartPositions[userData.targetIndex];
                       
                       // Xóa mesh ion cũ
                               heartScene.remove(particle);
                       
                       // Tạo hạt trái tim mới
                               const materialIndex = Math.floor(Math.random() * userData.heartMaterials.length);
                               const heartMaterial = userData.heartMaterials[materialIndex].clone();
                       heartMaterial.transparent = true; // Đảm bảo vật liệu có thể trong suốt
                       heartMaterial.shininess = 130; // Tăng độ bóng cho trái tim
                       heartMaterial.specular = new THREE.Color(0xffffff); // Phản chiếu ánh sáng trắng
                       
                       // Điều chỉnh emissive dựa trên độ sâu
                               if (targetPos.zDepthFactor > 0.5) {
                                   const lowEmissive = Math.min(0.15, targetPos.zDepthFactor * 0.3);
                                   heartMaterial.emissive = new THREE.Color(lowEmissive * 1.2, lowEmissive * 0.7, lowEmissive * 0.5);
                                   heartMaterial.emissiveIntensity = 0.5;
                               }
                       
                       // Tạo mesh trái tim
                               const heartMesh = new THREE.Mesh(userData.heartGeometry, heartMaterial);
                               heartMesh.position.copy(particle.position);
                               heartMesh.rotation.copy(particle.rotation);
                       
                       // Kích thước ngẫu nhiên cho từng hạt trái tim (0.9 - 1.5)
                       const heartScale = 0.9 + Math.random() * 0.6;
                               heartMesh.scale.set(heartScale, heartScale, heartScale);
                       
                       // Thiết lập thông số cho hạt trái tim
                               heartMesh.userData = {
                                   type: 'heart',
                                   targetPosition: {
                                       x: targetPos.x,
                                       y: targetPos.y, 
                                       z: targetPos.z
                                   },
                                   startPosition: {
                                       x: particle.position.x,
                                       y: particle.position.y,
                                       z: particle.position.z
                                   },
                                   originalMaterial: {
                                       color: heartMaterial.color.clone(),
                                       emissive: heartMaterial.emissive ? heartMaterial.emissive.clone() : new THREE.Color(0x000000),
                                       emissiveIntensity: heartMaterial.emissiveIntensity || 0
                                   },
                                   movement: userData.heartAnimation,
                                   rotationSpeed: userData.rotationSpeed,
                                   zDepthFactor: targetPos.zDepthFactor,
                                   moveStartTime: currentTime,
                           // Thời gian sống của hạt
                                   lifetime: userData.lifetime,
                                   fadeOutStart: 0,
                                   fadeOutDuration: userData.fadeOutDuration,
                                   isFadingOut: false,
                                   birthTime: currentTime,
                           originalScale: heartScale // Lưu kích thước ban đầu cho hiệu ứng nhịp đập
                               };
                       
                       // Thêm vào scene và mảng
                               heartScene.add(heartMesh);
                               allParticles.push(heartMesh);
                       
                       // Tạo hiệu ứng bùng nổ
                               const explosionColor = userData.isBlueIon ? 0x00ffff : null;
                               ParticleUtils.createExplosion(particle.position, heartScene, explosionColor);
                       
                       // Đánh dấu hạt ion cần xóa
                               particlesToRemove.push(particle);
                           }
                       }
               
                   } else if (userData.type === 'heart') {
               // === XỬ LÝ HẠT TRÁI TIM ===
               
               // Kiểm tra tuổi thọ của hạt trái tim
                       const particleAge = currentTime - userData.birthTime;
               
               // Bắt đầu mờ dần nếu đã tồn tại đủ lâu
                       if (!userData.isFadingOut && particleAge > userData.lifetime) {
                           userData.isFadingOut = true;
                           userData.fadeOutStart = currentTime;
                       }
               
               // Xử lý làm mờ dần và kiểm tra đã xóa chưa
                       if (ParticleUtils.handleParticleFadeOut(particle, currentTime, particlesToRemove)) {
                           return;
                       }
               
                       const moveAge = currentTime - userData.moveStartTime;
               const moveProgress = Math.min(1.0, moveAge / 2000); // 2 giây để di chuyển đến vị trí
               
                       if (moveProgress < 1.0) {
                   // Di chuyển đến vị trí trái tim
                           const easing = moveProgress < 0.5 ? 
                               2 * moveProgress * moveProgress : 
                               1 - Math.pow(-2 * moveProgress + 2, 2) / 2;
                   
                           particle.position.x = userData.startPosition.x + (userData.targetPosition.x - userData.startPosition.x) * easing;
                           particle.position.y = userData.startPosition.y + (userData.targetPosition.y - userData.startPosition.y) * easing;
                           particle.position.z = userData.startPosition.z + (userData.targetPosition.z - userData.startPosition.z) * easing;
                   
                   // Quay trong quá trình di chuyển
                           particle.rotation.x += 0.02;
                           particle.rotation.y += 0.02;
                       } else {
                   // Đã đến vị trí trái tim - thực hiện hoạt ảnh
                           const { amplitude, speed, phase, drift } = userData.movement;
                           const zDepthFactor = userData.zDepthFactor || 0;
                   
                   // Áp dụng quay riêng lẻ
                           ParticleUtils.applyParticleRotation(particle, userData.rotationSpeed);
                   
                   // Chuyển động lắc lư
                           const wobbleX = Math.sin(time * speed + phase) * amplitude;
                           const wobbleY = Math.cos(time * (speed * 0.6) + phase + 1) * amplitude * 0.6;
                           const wobbleZ = Math.sin(time * (speed * 0.7) + phase + 2) * amplitude * 1.5;
                   
                   // Trôi dạt chậm
                           const driftX = Math.sin(time * 0.2 + phase * 10) * drift.x;
                           const driftY = Math.cos(time * 0.15 + phase * 15) * drift.y;
                           const driftZ = Math.sin(time * 0.3 + phase * 5) * drift.z;
                   
                   // Áp dụng các hiệu ứng
                           particle.position.x = userData.targetPosition.x * pulseFactor + wobbleX + driftX;
                           particle.position.y = userData.targetPosition.y * pulseFactor + wobbleY + driftY;
                   
                           const zPulsing = Math.sin(time * 0.3 + userData.targetPosition.z) * 0.5;
                           particle.position.z = userData.targetPosition.z * pulseFactor + wobbleZ + driftZ + (zPulsing * zDepthFactor);
                   
                   // Sửa lỗi màu trắng sáng
                           if (Math.random() < 0.01 && userData.originalMaterial) {
                               const original = userData.originalMaterial;
                               if (particle.material) {
                                   if (particle.material.emissive) {
                                       particle.material.emissive.copy(original.emissive);
                                   }
                                   if (original.emissiveIntensity !== undefined) {
                                       particle.material.emissiveIntensity = original.emissiveIntensity;
                                   }
                               }
                           }
                       }
                   }
               });
       
       // Cập nhật các hạt đuôi mờ
               trailParticles.forEach(trail => {
           // Kiểm tra và xử lý làm mờ dần cho đuôi mờ
                   ParticleUtils.handleParticleFadeOut(trail, currentTime, trailsToRemove);
               });
       
       // Cập nhật các hạt bùng nổ
               explosionParticles.forEach(particle => {
           // Cập nhật vị trí theo vận tốc
                   if (particle.userData.velocity) {
                       particle.position.x += particle.userData.velocity.x;
                       particle.position.y += particle.userData.velocity.y;
                       particle.position.z += particle.userData.velocity.z;
               
               // Giảm vận tốc dần
                       particle.userData.velocity.x *= 0.95;
                       particle.userData.velocity.y *= 0.95;
                       particle.userData.velocity.z *= 0.95;
                   }
           
           // Quay hạt
                   ParticleUtils.applyParticleRotation(particle, particle.userData.rotationSpeed);
           
           // Kiểm tra thời gian sống và xử lý mờ dần
                   const age = currentTime - particle.userData.birthTime;
                   if (age > particle.userData.lifespan) {
                       explosionsToRemove.push(particle);
                   } else if (currentTime > particle.userData.fadeStartTime) {
               // Tính toán độ trong suốt
                       const fadeAge = currentTime - particle.userData.fadeStartTime;
                       const fadeProgress = Math.min(1.0, fadeAge / particle.userData.fadeDuration);
               
                       if (particle.material) {
                           particle.material.opacity = 1 - fadeProgress;
                       }
                   }
               });
       
       // Xóa các hạt đã đánh dấu
               ParticleUtils.removeParticles(particlesToRemove, allParticles, heartScene);
               ParticleUtils.removeParticles(trailsToRemove, trailParticles, heartScene);
               ParticleUtils.removeParticles(explosionsToRemove, explosionParticles, heartScene);
               ParticleUtils.removeParticles(wavesToRemove, lightWaves, heartScene);
       
       // Render scene
               heartRenderer.render(heartScene, heartCamera);
           }
   
   // Thiết lập trình lắng nghe sự kiện cho chức năng trái tim
           document.addEventListener('DOMContentLoaded', () => {
       // Thêm trình lắng nghe sự kiện cho biểu tượng trái tim
               const heartIcon = document.getElementById('heartIcon');
               if (heartIcon) {
           heartIcon.addEventListener('click', showIntro);
               }
       
       // Thêm trình lắng nghe sự kiện để đóng trái tim
               const closeHeart = document.getElementById('closeHeart');
               if (closeHeart) {
                   closeHeart.addEventListener('click', hideHeart3D);
               }
           });
   
   // Hiệu ứng intro sao băng
   function showIntro() {
       // Tắt nhạc nhac.mp4 nếu đang phát
       if (window.birthdayAudio) {
           window.birthdayAudio.pause();
           window.birthdayAudio.currentTime = 0;
       }
       
       // Xóa sạch các hiệu ứng trái tim nếu có
       if (heartScene) {
           const container = document.getElementById('heart3D');
           container.innerHTML = '';
           heartScene = null;
           allParticles = [];
           trailParticles = [];
           explosionParticles = [];
           lightWaves = [];
       }
       
       // Reset trạng thái animation để đảm bảo không lặp lại
       animationStarted = false;
       
       const introContainer = document.getElementById('introContainer');
       
       // Xóa sạch container trước khi tạo mới
       const oldStars = introContainer.querySelectorAll('.shooting-star, .star-tail');
       oldStars.forEach(star => star.remove());
       
       // Hiển thị container
       introContainer.style.display = 'block';
       
       // Đảm bảo opacity được thiết lập
       setTimeout(() => {
           introContainer.style.opacity = '1';
       }, 10);
       
       // Tạo nhiều sao băng với số lượng ngẫu nhiên từ 20-30
       const starCount = Math.floor(Math.random() * 10) + 10;
       
       // Xác định một góc chung để các sao băng song song với nhau
       const commonAngle = (Math.random() * 10 + 30) * Math.PI / 180; // 30-40 độ
       
       // Tạo sao băng đồng loạt
       const initialDelay = 300; // Đợi 0.3s trước khi bắt đầu
       const waveDuration = 3000; // 3s cho một đợt sao băng
       
       // Tạo các sao băng trong 3 đợt (waves) song song
       createStarWave(introContainer, Math.floor(starCount/3), commonAngle, initialDelay, waveDuration);
       createStarWave(introContainer, Math.floor(starCount/3), commonAngle + 0.1, initialDelay + waveDuration/3, waveDuration);
       createStarWave(introContainer, Math.ceil(starCount/3), commonAngle - 0.1, initialDelay + waveDuration*2/3, waveDuration);
       
       // Sau 5s, chuyển sang hiệu ứng trái tim
       setTimeout(() => {
           // Ẩn intro và hiển thị hiệu ứng trái tim
           fadeOutIntro(introContainer, () => {
               introContainer.style.display = 'none';
               showHeart3D();
               // Phát nhạc khi intro kết thúc và hiện trái tim
               playHeartMusic();
           });
       }, 3000);
   }
   
   // Tạo đợt sao băng song song
   function createStarWave(container, count, baseAngle, startDelay, waveDuration) {
       const angleVariation = 0.05; // Biến thiên góc rất nhỏ để trông song song
       
       for (let i = 0; i < count; i++) {
           // Thời gian xuất hiện phân bố đều trong khoảng waveDuration
           const delay = startDelay + (waveDuration * i / count);
           
           setTimeout(() => {
               // Góc bay gần như song song
               const angle = baseAngle + (Math.random() * 2 - 1) * angleVariation;
               
               // Vị trí bắt đầu được phân bố đều trên một đường thẳng vuông góc với hướng bay
               const screenWidth = window.innerWidth;
               const screenHeight = window.innerHeight;
               
               // Tính toán điểm bắt đầu trên cạnh trên màn hình
               // Đường vuông góc với góc bay
               const perpendicular = baseAngle + Math.PI/2;
               const spreadDistance = screenWidth * 0.8;
               const spreadCenter = screenWidth * 0.5;
               
               const startX = spreadCenter + (Math.random() - 0.5) * spreadDistance;
               const startY = screenHeight * 0.1; // Bắt đầu từ gần đỉnh màn hình
               
               createShootingStar(container, startX, startY, angle);
           }, delay);
       }
   }
   
   // Tạo hiệu ứng sao băng
   function createShootingStar(container, startX, startY, angle) {
       const shootingStar = document.createElement('div');
       shootingStar.classList.add('shooting-star');
       
       // Thêm các phần tử tia sáng
       for (let i = 0; i < 3; i++) {
           const sparkle = document.createElement('i');
           shootingStar.appendChild(sparkle);
       }
       
       // Độ dài của sao băng - thay đổi ngẫu nhiên nhưng giới hạn biến thiên
       const length = 70 + Math.random() * 40;
       
       // Đặt thuộc tính cho sao băng
       shootingStar.style.left = `${startX}px`;
       shootingStar.style.top = `${startY}px`;
       shootingStar.style.width = `${length}px`;
       shootingStar.style.transform = `rotate(${angle}rad)`;
       
       // Màu đồng nhất để trông đẹp hơn
       const tailColor = 'rgba(255, 255, 255, 1)';
       shootingStar.style.boxShadow = `0 0 10px 3px ${tailColor}`;
       
       // Mảng lưu các phần tử đuôi
       const tailElements = [];
       
       // Thêm vào container
       container.appendChild(shootingStar);
       
       // Hiệu ứng animation
       const startTime = performance.now();
       
       // Điểm đích
       const travelDistance = Math.max(window.innerWidth, window.innerHeight) * 1.2;
       const targetX = startX + Math.cos(angle) * travelDistance;
       const targetY = startY + Math.sin(angle) * travelDistance;
       
       // Độ lâu của sao băng - đồng nhất hơn, nhanh hơn
       const duration = 2000 + Math.random() * 300;
       
       // Lưu thời điểm tạo vệt đuôi cuối cùng
       let lastTailTime = 0;
       
       // Hiệu ứng chuyển động
       function animateStar(timestamp) {
           const elapsed = timestamp - startTime;
           const progress = elapsed / duration;
           
           if (progress < 1) {
               // Di chuyển sao băng
               const currentX = startX + (targetX - startX) * progress;
               const currentY = startY + (targetY - startY) * progress;
               
               shootingStar.style.left = `${currentX}px`;
               shootingStar.style.top = `${currentY}px`;
               
               // Luôn hiển thị sao băng với độ sáng cao
               let opacity = 1;
               
               // Chỉ làm mờ ở cuối hành trình
               if (progress > 0.85) {
                   opacity = (1 - progress) / 0.15;
               }
               
               shootingStar.style.opacity = opacity.toString();
               
               // Tạo vệt đuôi mờ dần đồng bộ hơn với sao băng
               if (timestamp - lastTailTime > 30 && progress > 0.05 && progress < 0.95) {
                   const tail = document.createElement('div');
                   tail.classList.add('star-tail');
                   tail.style.width = `${length * 0.9}px`;
                   tail.style.left = `${currentX}px`;
                   tail.style.top = `${currentY}px`;
                   tail.style.transform = `rotate(${angle}rad)`;
                   tail.style.opacity = `${opacity * 0.8}`;
                   tail.style.boxShadow = `0 0 8px 2px rgba(255,255,255,0.7)`;
                   
                   // Lưu thời gian tạo vệt
                   tail.dataset.createdAt = timestamp.toString();
                   
                   container.appendChild(tail);
                   tailElements.push(tail);
                   lastTailTime = timestamp;
               }
               
               // Xử lý mờ dần các vệt đuôi
               for (let i = tailElements.length - 1; i >= 0; i--) {
                   const tail = tailElements[i];
                   const tailAge = timestamp - parseFloat(tail.dataset.createdAt);
                   
                   // Mờ dần nhanh hơn, trong 400ms
                   if (tailAge < 400) {
                       tail.style.opacity = (0.8 * (1 - tailAge / 400)).toString();
                   } else {
                       // Xóa vệt đuôi quá cũ
                       container.removeChild(tail);
                       tailElements.splice(i, 1);
                   }
               }
               
               requestAnimationFrame(animateStar);
           } else {
               // Xóa sao băng sau khi hoàn thành
               if (container.contains(shootingStar)) {
                   container.removeChild(shootingStar);
               }
               
               // Xóa tất cả các vệt đuôi
               tailElements.forEach(tail => {
                   if (container.contains(tail)) {
                       container.removeChild(tail);
                   }
               });
           }
       }
       
       requestAnimationFrame(animateStar);
   }
   
   // Làm mờ dần intro trước khi hiển thị trái tim
   function fadeOutIntro(element, callback) {
       element.style.opacity = '0';
       
       // Đợi hiệu ứng transition hoàn thành (0.5s)
       setTimeout(() => {
           callback();
       }, 500);
   }