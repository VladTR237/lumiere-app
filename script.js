const profiles = [
  {
    id: 1,
    name: "Принцесса Алина",
    age: 26,
    city: "Москва",
    bio: "Образование: Сорбонна. Увлечения: благотворительность, opera, antique jewelry. Ищу мужчину с безупречным вкусом.",
    tags: ["Культура", "Путешествия", "Благотворительность"],
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Граф Егор",
    age: 29,
    city: "Санкт-Петербург",
    bio: "Наследник семейного дела. Коллекционирую винтажные часы. Ценю интеллект и изысканность.",
    tags: ["Бизнес", "Искусство", "Винтаж"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Маркиза София",
    age: 24,
    city: "Казань",
    bio: "Художница, представлена в галерее Винзор. Музей современного искусства — моя страсть.",
    tags: ["Искусство", "Галерея", "Творчество"],
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Барон Максим",
    age: 31,
    city: "Екатеринбург",
    bio: "Основатель tech-startup. Успешный, но ищу настоящую связь. Путешествия — моя жизнь.",
    tags: ["IT", "Путешествия", "Бизнес"],
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Герцогиня Полина",
    age: 27,
    city: "Новосибирск",
    bio: "CEO рекламного агентства. Ambitious. Ищу equal partner для жизни.",
    tags: ["Бизнес", " karriere", "Успех"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Виконт Данил",
    age: 28,
    city: "Краснодар",
    bio: "Виноторговец. Виртуоз сноуборда. Поздние ужины при свечах — моя романтика.",
    tags: ["Вино", "Спорт", "Романтика"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    name: "Графиня Мария",
    age: 30,
    city: "Нижний Новгород",
    bio: "Архитектор с мировым именем. Фанат современного искусства и редких вин.",
    tags: ["Архитектура", "Искусство", "Дизайн"],
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    name: "Лорд Илья",
    age: 25,
    city: "Ростов-на-Дону",
    bio: "Инвестор. Ищу того, кто оценит хороший кофе, горные вершины и тишину.",
    tags: ["Инвестиции", "Хайкинг", "Кофе"],
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80",
  },
];

let profileIndex = 0;
let likesLeft = 5;
let matches = [];
let premiumActive = false;
let superLikesLeft = 1;

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileCity = document.getElementById("profileCity");
const profileBio = document.getElementById("profileBio");
const profileTags = document.getElementById("profileTags");
const likesLeftNode = document.getElementById("likesLeft");
const matchesCountNode = document.getElementById("matchesCount");
const profilePositionNode = document.getElementById("profilePosition");
const actionMessage = document.getElementById("actionMessage");
const matchesList = document.getElementById("matchesList");
const planBadge = document.getElementById("planBadge");
const verifiedBadge = document.getElementById("verifiedBadge");

const skipButton = document.getElementById("skipButton");
const likeButton = document.getElementById("likeButton");
const superLikeButton = document.getElementById("superLikeButton");
const openPaywall = document.getElementById("openPaywall");
const paymentModal = document.getElementById("paymentModal");
const closeModal = document.getElementById("closeModal");
const paymentForm = document.getElementById("paymentForm");
const verifyBtn = document.getElementById("verifyBtn");
const verifyModal = document.getElementById("verifyModal");
const closeVerify = document.getElementById("closeVerify");
const verifyForm = document.getElementById("verifyForm");

function currentProfile() {
  if (profileIndex >= profiles.length) {
    profileIndex = 0;
  }
  return profiles[profileIndex];
}

function renderProfile() {
  const profile = currentProfile();
  profileImage.src = profile.image;
  profileName.textContent = `${profile.name}, ${profile.age}`;
  profileCity.textContent = profile.city;
  profileBio.textContent = profile.bio;
  profileTags.innerHTML = "";
  profile.tags.forEach((tag) => {
    const tagNode = document.createElement("span");
    tagNode.textContent = tag;
    profileTags.appendChild(tagNode);
  });
  profilePositionNode.textContent = `${profileIndex + 1} / ${profiles.length}`;
}

function renderStats() {
  likesLeftNode.textContent = premiumActive ? "∞" : String(likesLeft);
  matchesCountNode.textContent = String(matches.length);
  planBadge.textContent = premiumActive ? "Elite" : "Member";
}

function renderMatches() {
  if (!matches.length) {
    matchesList.innerHTML =
      '<p class="muted">Пока нет мэтчей. Поставь первый лайк.</p>';
    return;
  }

  matchesList.innerHTML = "";
  matches.forEach((match) => {
    const node = document.createElement("article");
    node.className = "match-item";
    node.innerHTML = `<strong>${match.name}</strong><p class="muted">${match.city}</p>`;
    matchesList.appendChild(node);
  });
}

function nextProfile() {
  profileIndex += 1;
  renderProfile();
}

function setMessage(text) {
  actionMessage.textContent = text;
}

function maybeMatch(profile) {
  const chance = Math.random();
  if (chance > 0.55) {
    matches = [profile, ...matches].slice(0, 8);
    renderMatches();
    renderStats();
    setMessage(`Мэтч с ${profile.name.split(",")[0]}! Напиши первым.`);
    return true;
  }
  return false;
}

function handleLike() {
  if (!premiumActive && likesLeft <= 0) {
    setMessage("Лимит лайков исчерпан. Оформи подписку для безлимита.");
    openModalByButton();
    return;
  }
  if (!premiumActive) {
    likesLeft -= 1;
  }
  const profile = currentProfile();
  if (!maybeMatch(profile)) {
    setMessage(`Лайк отправлен: ${profile.name}.`);
  }
  renderStats();
  nextProfile();
}

function handleSkip() {
  setMessage(`Анкета ${currentProfile().name} пропущена.`);
  nextProfile();
}

function handleSuperLike() {
  if (!premiumActive && superLikesLeft <= 0) {
    setMessage("Суперлайк доступен только с Premium.");
    openModalByButton();
    return;
  }
  if (!premiumActive) {
    superLikesLeft -= 1;
  }
  const profile = currentProfile();
  matches = [profile, ...matches].slice(0, 8);
  setMessage(`Суперлайк сработал! У тебя мэтч с ${profile.name.split(",")[0]}.`);
  renderMatches();
  renderStats();
  nextProfile();
}

function openModalByButton() {
  paymentModal.classList.add("open");
  paymentModal.setAttribute("aria-hidden", "false");
}

function closeModalByButton() {
  paymentModal.classList.remove("open");
  paymentModal.setAttribute("aria-hidden", "true");
}

function handlePayment(event) {
  event.preventDefault();
  if (!paymentForm.reportValidity()) {
    return;
  }
  premiumActive = true;
  likesLeft = 999;
  superLikesLeft = 5;
  renderStats();
  closeModalByButton();
  setMessage("Подписка Premium активирована. Теперь доступны безлимитные лайки.");
}

function openVerifyModal() {
  verifyModal.classList.add("open");
  verifyModal.setAttribute("aria-hidden", "false");
}

function closeVerifyModal() {
  verifyModal.classList.remove("open");
  verifyModal.setAttribute("aria-hidden", "true");
}

function handleVerify(event) {
  event.preventDefault();
  verifiedBadge.textContent = "✓ Верифицирован";
  verifiedBadge.classList.add("verified");
  closeVerifyModal();
  setMessage("Личность подтверждена! Теперь твой профиль отмечен галочкой.");
}

skipButton?.addEventListener("click", handleSkip);
if (
  profileImage &&
  profileName &&
  profileCity &&
  profileBio &&
  profileTags &&
  likesLeftNode &&
  matchesCountNode &&
  profilePositionNode &&
  actionMessage &&
  matchesList &&
  planBadge &&
  verifiedBadge
) {
  likeButton?.addEventListener("click", handleLike);
  superLikeButton?.addEventListener("click", handleSuperLike);
  openPaywall?.addEventListener("click", openModalByButton);
  closeModal?.addEventListener("click", closeModalByButton);
  paymentForm?.addEventListener("submit", handlePayment);

  paymentModal?.addEventListener("click", (event) => {
    if (event.target === paymentModal) {
      closeModalByButton();
    }
  });

  verifyBtn?.addEventListener("click", openVerifyModal);
  closeVerify?.addEventListener("click", closeVerifyModal);
  verifyForm?.addEventListener("submit", handleVerify);

  verifyModal?.addEventListener("click", (event) => {
    if (event.target === verifyModal) {
      closeVerifyModal();
    }
  });

  renderProfile();
  renderStats();
  renderMatches();
}
