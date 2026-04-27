const clubMembers = [
  { name: "Александр В.", role: "Предприниматель, Москва" },
  { name: "Мария К.", role: "Арт-директор, Санкт-Петербург" },
  { name: "Дмитрий С.", role: "Инвестор, Москва" },
  { name: "Екатерина П.", role: "Галерист, Москва" },
  { name: "Михаил Т.", role: "Tech Founder, Екатеринбург" },
];

const validInviteCodes = new Set(["VC-2026", "VIOLET-CROWN", "PRIVATE-VC"]);

const state = {
  applications: [],
  activeMembership: false,
};

const viewButtons = document.querySelectorAll("[data-view-button]");
const views = document.querySelectorAll("[data-view]");
const inviteForm = document.getElementById("inviteForm");
const inviteCodeInput = document.getElementById("inviteCodeInput");
const inviteMessage = document.getElementById("inviteMessage");
const applicationForm = document.getElementById("applicationForm");
const applicationMessage = document.getElementById("applicationMessage");
const membersList = document.getElementById("membersList");
const membersCounter = document.getElementById("membersCounter");
const applicationsCounter = document.getElementById("applicationsCounter");
const openApplicationFromHeader = document.getElementById("openApplicationFromHeader");
const openPaymentModal = document.getElementById("openPaymentModal");
const closePaymentModal = document.getElementById("closePaymentModal");
const paymentModal = document.getElementById("paymentModal");
const paymentForm = document.getElementById("paymentForm");
const membershipBadge = document.getElementById("membershipBadge");
const nextBillingDate = document.getElementById("nextBillingDate");
const copyInviteCode = document.getElementById("copyInviteCode");
const personalInviteCode = document.getElementById("personalInviteCode");
const preloader = document.getElementById("preloader");
const ambientOne = document.querySelector(".ambient-one");
const ambientTwo = document.querySelector(".ambient-two");

function setActiveView(viewName) {
  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === viewName);
  });
  viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.viewButton === viewName);
  });
}

function renderMembers() {
  if (!membersList || !membersCounter) {
    return;
  }

  membersList.innerHTML = "";
  clubMembers.forEach((member) => {
    const item = document.createElement("article");
    item.className = "member-item";
    item.innerHTML = `
      <div>
        <p class="member-name">${member.name}</p>
        <p class="member-role">${member.role}</p>
      </div>
      <span class="kicker">ACTIVE</span>
    `;
    membersList.appendChild(item);
  });
  membersCounter.textContent = String(clubMembers.length);
}

function renderApplicationsCount() {
  if (applicationsCounter) {
    applicationsCounter.textContent = String(state.applications.length);
  }
}

function openModal() {
  paymentModal?.classList.add("open");
  paymentModal?.setAttribute("aria-hidden", "false");
}

function closeModal() {
  paymentModal?.classList.remove("open");
  paymentModal?.setAttribute("aria-hidden", "true");
}

function updateMembershipUi() {
  if (!membershipBadge || !nextBillingDate) {
    return;
  }

  if (!state.activeMembership) {
    membershipBadge.textContent = "Неактивно";
    membershipBadge.classList.remove("active");
    nextBillingDate.textContent = "—";
    return;
  }

  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  nextBillingDate.textContent = nextDate.toLocaleDateString("ru-RU");
  membershipBadge.textContent = "Активно";
  membershipBadge.classList.add("active");
}

function handleInviteSubmit(event) {
  event.preventDefault();
  if (!inviteCodeInput || !inviteMessage) {
    return;
  }

  const inviteCode = inviteCodeInput.value.trim().toUpperCase();
  if (!validInviteCodes.has(inviteCode)) {
    inviteMessage.textContent = "Неверный код приглашения. Подайте заявку на рассмотрение.";
    return;
  }

  inviteMessage.textContent = "Код принят. Добро пожаловать в закрытый контур клуба.";
  setActiveView("profile");
}

function handleApplicationSubmit(event) {
  event.preventDefault();
  if (!applicationForm || !applicationMessage) {
    return;
  }
  if (!applicationForm.reportValidity()) {
    return;
  }

  const formData = new FormData(applicationForm);
  const candidate = {
    fullName: String(formData.get("fullName") || ""),
    age: String(formData.get("age") || ""),
    city: String(formData.get("city") || ""),
    occupation: String(formData.get("occupation") || ""),
    about: String(formData.get("about") || ""),
    reference: String(formData.get("reference") || ""),
    social: String(formData.get("social") || ""),
    createdAt: new Date().toISOString(),
  };

  state.applications.unshift(candidate);
  renderApplicationsCount();
  applicationMessage.textContent = "Заявка отправлена. Мы свяжемся с вами после верификации.";
  applicationForm.reset();
}

function handlePaymentSubmit(event) {
  event.preventDefault();
  if (!paymentForm) {
    return;
  }
  if (!paymentForm.reportValidity()) {
    return;
  }

  state.activeMembership = true;
  updateMembershipUi();
  closeModal();
}

function handleCopyInviteCode() {
  const code = personalInviteCode?.textContent?.trim() || "";
  if (!code || !copyInviteCode) {
    return;
  }

  navigator.clipboard
    .writeText(code)
    .then(() => {
      copyInviteCode.textContent = "Скопировано";
      setTimeout(() => {
        if (copyInviteCode) {
          copyInviteCode.textContent = "Скопировать код";
        }
      }, 1600);
    })
    .catch(() => {
      copyInviteCode.textContent = "Ошибка копирования";
      setTimeout(() => {
        if (copyInviteCode) {
          copyInviteCode.textContent = "Скопировать код";
        }
      }, 1600);
    });
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.viewButton) {
      setActiveView(button.dataset.viewButton);
    }
  });
});

openApplicationFromHeader?.addEventListener("click", () => setActiveView("application"));
inviteForm?.addEventListener("submit", handleInviteSubmit);
applicationForm?.addEventListener("submit", handleApplicationSubmit);
openPaymentModal?.addEventListener("click", openModal);
closePaymentModal?.addEventListener("click", closeModal);
paymentForm?.addEventListener("submit", handlePaymentSubmit);
copyInviteCode?.addEventListener("click", handleCopyInviteCode);

paymentModal?.addEventListener("click", (event) => {
  if (event.target === paymentModal) {
    closeModal();
  }
});

renderMembers();
renderApplicationsCount();
updateMembershipUi();

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader?.classList.add("hidden");
  }, 520);
});

window.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mx", `${x}%`);
  document.documentElement.style.setProperty("--my", `${y}%`);

  if (ambientOne) {
    ambientOne.style.transform = `translate(${(x - 50) * 0.25}px, ${(y - 50) * 0.2}px)`;
  }
  if (ambientTwo) {
    ambientTwo.style.transform = `translate(${(50 - x) * 0.18}px, ${(50 - y) * 0.22}px)`;
  }
});

document.querySelectorAll(".light-button").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const lx = event.clientX - rect.left;
    const ly = event.clientY - rect.top;
    button.style.setProperty("--lx", `${lx}px`);
    button.style.setProperty("--ly", `${ly}px`);
  });
});
