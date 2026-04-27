const profiles = [
  {
    id: 1,
    name: "Princess Alina",
    age: 26,
    city: "Moscow",
    bio: "Sorbonne graduate. Charity, opera, antique jewelry.",
    tags: ["Culture", "Travel", "Charity"],
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"
  },
  {
    id: 2,
    name: "Count Egor",
    age: 29,
    city: "St. Petersburg",
    bio: "Family business heir. Vintage watch collector.",
    tags: ["Business", "Art", "Vintage"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
  },
  {
    id: 3,
    name: "Marquise Sophia",
    age: 24,
    city: "Kazan",
    bio: "Artist at Windsor Gallery. Modern art muse.",
    tags: ["Art", "Gallery", "Creativity"],
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80"
  },
  {
    id: 4,
    name: "Baron Maxim",
    age: 31,
    city: "Ekaterinburg",
    bio: "Tech startup founder. Travel is my life.",
    tags: ["IT", "Travel", "Business"],
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80"
  },
  {
    id: 5,
    name: "Duchess Polina",
    age: 27,
    city: "Novosibirsk",
    bio: "CEO of advertising agency. Ambitious.",
    tags: ["Business", "Career", "Success"],
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80"
  },
  {
    id: 6,
    name: "Viscount Danil",
    age: 28,
    city: "Krasnodar",
    bio: "Wine trader. Snowboard virtuoso.",
    tags: ["Wine", "Sport", "Romance"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
  },
  {
    id: 7,
    name: "Countess Maria",
    age: 30,
    city: "Nizhny Novgorod",
    bio: "Renowned architect. Fan of fine wines.",
    tags: ["Architecture", "Art", "Design"],
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80"
  },
  {
    id: 8,
    name: "Lord Ilya",
    age: 25,
    city: "Rostov-on-Don",
    bio: "Investor. Mountains and silence lover.",
    tags: ["Investing", "Hiking", "Coffee"],
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800&q=80"
  }
];

let profileIndex = 0;
let likesLeft = 5;
let matches = [];
let premiumActive = false;
let currentRotationY = 0;
let targetRotationY = 0;

const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xc9a962, 0.8);
dirLight.position.set(2, 2, 4);
scene.add(dirLight);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 300;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 12;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xc9a962,
  transparent: true,
  opacity: 0.4
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const cardGroup = new THREE.Group();
scene.add(cardGroup);

let cardMesh = null;
let currentProfile = profiles[0];

function createCardTexture(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const texture = new THREE.CanvasTexture(canvas);
      resolve(texture);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function loadProfile(index) {
  const profile = profiles[index];
  currentProfile = profile;
  
  if (cardMesh) {
    cardGroup.remove(cardMesh);
    cardMesh.geometry.dispose();
    cardMesh.material.dispose();
  }
  
  const texture = await createCardTexture(profile.image);
  
  const material = texture 
    ? new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    : new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.DoubleSide });
  
  const geometry = new THREE.PlaneGeometry(2.8, 4.2);
  cardMesh = new THREE.Mesh(geometry, material);
  cardGroup.add(cardMesh);
  
  updateProfileInfo(profile);
}

function updateProfileInfo(profile) {
  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('profileCity').textContent = `${profile.city}, ${profile.age}`;
  document.getElementById('profileBio').textContent = profile.bio;
  
  const tagsContainer = document.getElementById('profileTags');
  tagsContainer.innerHTML = '';
  profile.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.style.fontSize = '0.65rem';
    span.textContent = tag;
    tagsContainer.appendChild(span);
  });
}

function nextProfile() {
  profileIndex = (profileIndex + 1) % profiles.length;
  loadProfile(profileIndex);
}

let isAnimating = false;

function swipeCard(direction) {
  if (isAnimating) return;
  isAnimating = true;
  
  const targetX = direction === 'left' ? -6 : 6;
  const startX = 0;
  const duration = 400;
  const startTime = Date.now();
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    
    cardGroup.position.x = startX + (targetX - startX) * ease;
    cardGroup.rotation.y = ease * (direction === 'left' ? -0.8 : 0.8);
    cardGroup.scale.setScalar(1 - t * 0.3);
    
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      cardGroup.position.x = 0;
      cardGroup.rotation.y = 0;
      cardGroup.scale.setScalar(1);
      isAnimating = false;
      nextProfile();
    }
  }
  animate();
}

function setMessage(text) {
  document.querySelector('.hint').textContent = text;
}

document.getElementById('likeBtn').addEventListener('click', () => {
  if (!premiumActive && likesLeft <= 0) {
    setMessage("Limit reached. Become Elite.");
    return;
  }
  
  if (!premiumActive) {
    likesLeft--;
    document.getElementById('likesLeft').textContent = likesLeft;
  }
  
  const chance = Math.random();
  if (chance > 0.55) {
    matches = [currentProfile, ...matches].slice(0, 8);
    document.getElementById('matchesCount').textContent = matches.length;
    setMessage(`Match with ${currentProfile.name}!`);
  } else {
    setMessage(`Like sent to ${currentProfile.name}`);
  }
  swipeCard('right');
});

document.getElementById('skipBtn').addEventListener('click', () => {
  setMessage(`Passed on ${currentProfile.name}`);
  swipeCard('left');
});

document.getElementById('superBtn').addEventListener('click', () => {
  if (!premiumActive) {
    setMessage("Super Like is Elite only.");
    return;
  }
  matches = [currentProfile, ...matches].slice(0, 8);
  document.getElementById('matchesCount').textContent = matches.length;
  setMessage(`Super Match with ${currentProfile.name}!`);
  swipeCard('left');
});

document.getElementById('premiumBtn').addEventListener('click', () => {
  premiumActive = true;
  document.getElementById('planBadge').textContent = 'Elite';
  document.getElementById('planBadge').classList.add('gold');
  document.getElementById('likesLeft').textContent = '∞';
  setMessage("Welcome to Elite membership!");
});

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

let touchStartX = 0;
let touchStartY = 0;

renderer.domElement.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

renderer.domElement.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;
  
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      document.getElementById('likeBtn').click();
    } else {
      document.getElementById('skipBtn').click();
    }
  }
});

function animate() {
  requestAnimationFrame(animate);
  
  cardGroup.rotation.y += (mouseX * 0.3 - cardGroup.rotation.y) * 0.08;
  cardGroup.position.x += (mouseX * 0.2 - cardGroup.position.x) * 0.08;
  cardGroup.position.y += (-mouseY * 0.15 - cardGroup.position.y) * 0.08;
  
  particles.rotation.y += 0.0005;
  
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

loadProfile(0).then(() => {
  animate();
}).finally(() => {
  document.getElementById('loading').classList.add('hidden');
});