import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import { registrar } from "../../services/auth-store.js";
import { onlyDigits, isValidCpf, checkPassword } from "../../utils/validators.js";

const form = document.getElementById("cadastroForm");
const steps = [...document.querySelectorAll(".step")];
const indicators = [...document.querySelectorAll("[data-step-indicator]")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const passwordInput = form.password;
const passwordField = passwordInput.closest(".password-field");
const passwordChecks = document.querySelector(".password-checks");
const passwordRules = {
  length: document.querySelector('[data-rule="length"]'),
  uppercase: document.querySelector('[data-rule="uppercase"]'),
  lowercase: document.querySelector('[data-rule="lowercase"]'),
  number: document.querySelector('[data-rule="number"]'),
  special: document.querySelector('[data-rule="special"]'),
  sequence: document.querySelector('[data-rule="sequence"]'),
};
let currentStep = 1;

const stepValidity = { 1: false, 2: false, 3: false };
const stepDirty = { 1: false, 2: false, 3: false };
const stepFlashing = { 1: false, 2: false, 3: false };
const stepTimers = new Map();

function updatePasswordRules() {
  const valid = checkPassword(passwordInput.value);
  Object.entries(passwordRules).forEach(([key, el]) => el.classList.toggle("is-valid", valid[key]));
  return Object.values(valid).every(Boolean);
}

function showPasswordPopup(show) {
  passwordChecks.classList.toggle("is-visible", show);
}

function positionPasswordPopup() {
  const fieldRect = passwordField.getBoundingClientRect();
  const popupRect = passwordChecks.getBoundingClientRect();
  const spaceRight = window.innerWidth - fieldRect.right;
  const fitsRight = spaceRight >= popupRect.width + 12;
  passwordChecks.style.left = fitsRight ? "calc(100% + 12px)" : "0";
  passwordChecks.style.top = fitsRight ? "0" : "calc(100% + 12px)";
}

function renderIndicators() {
  indicators.forEach((item) => {
    const step = Number(item.dataset.stepIndicator);
    item.classList.remove("is-active", "is-valid", "is-error", "is-changed");
    if (stepFlashing[step]) {
      item.classList.add("is-error");
    } else if (step === currentStep) {
      item.classList.add("is-active");
    } else if (stepDirty[step]) {
      item.classList.add("is-changed");
    } else if (stepValidity[step]) {
      item.classList.add("is-valid");
    }
  });
}

function showStep(step) {
  currentStep = step;
  steps.forEach((section) =>
    section.classList.toggle("is-active", Number(section.dataset.step) === step),
  );
  renderIndicators();
  prevBtn.disabled = step === 1;
  nextBtn.hidden = step === steps.length;
  submitBtn.hidden = step !== steps.length;
  feedback.textContent = "";
  feedback.className = "feedback";
}

function setStepValidity(step, isValid) {
  stepValidity[step] = isValid;
  renderIndicators();
}

function markStepDirty(step) {
  stepDirty[step] = true;
  renderIndicators();
}

function flashStepError(step) {
  clearTimeout(stepTimers.get(step));
  stepFlashing[step] = true;
  renderIndicators();
  stepTimers.set(
    step,
    setTimeout(() => {
      stepFlashing[step] = false;
      renderIndicators();
    }, 1500),
  );
}

function validateStep(step) {
  stepDirty[step] = false;

  const fail = (message) => {
    if (message) {
      feedback.textContent = message;
      feedback.className = "feedback is-error";
    }
    setStepValidity(step, false);
    flashStepError(step);
    return false;
  };

  const fields = steps[step - 1].querySelectorAll("input");
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return fail();
    }
  }
  if (step === 2 && !updatePasswordRules()) return fail("A senha não atende aos requisitos.");
  if (step === 2 && form.password.value !== form.confirmPassword.value)
    return fail("As senhas não conferem.");
  if (step === 3 && !isValidCpf(onlyDigits(form.cpf.value))) {
    alert("CPF inválido");
    return fail("CPF inválido.");
  }

  setStepValidity(step, true);
  return true;
}

prevBtn.addEventListener("click", () => showStep(Math.max(1, currentStep - 1)));
nextBtn.addEventListener("click", () => {
  if (validateStep(currentStep)) showStep(Math.min(steps.length, currentStep + 1));
});
indicators.forEach((item) =>
  item.addEventListener("click", () => showStep(Number(item.dataset.stepIndicator))),
);
form.querySelectorAll("input").forEach((input) =>
  input.addEventListener("input", () => {
    const step = Number(input.closest(".step")?.dataset.step);
    markStepDirty(step);
  }),
);
["focus", "click"].forEach((evt) =>
  passwordInput.addEventListener(evt, () => {
    positionPasswordPopup();
    showPasswordPopup(true);
  }),
);
passwordInput.addEventListener("blur", () => showPasswordPopup(false));
passwordInput.addEventListener("input", updatePasswordRules);
window.addEventListener("resize", () => {
  if (document.activeElement === passwordInput) positionPasswordPopup();
});
form.cpf.addEventListener("input", (e) => {
  const digits = onlyDigits(e.target.value).slice(0, 11);
  e.target.value = digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateStep(1)) {
    showStep(1);
    return;
  }
  if (!validateStep(2)) {
    showStep(2);
    return;
  }
  if (!validateStep(3)) {
    showStep(3);
    return;
  }

  try {
    await registrar({
      username: form.username.value.trim(),
      fullname: form.fullname.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      cpf: form.cpf.value.trim(),
    });
  } catch (erro) {
    feedback.textContent = erro.message || "Falha ao cadastrar. Tente novamente.";
    feedback.className = "feedback is-error";
    return;
  }

  feedback.textContent = "Cadastro realizado com sucesso. Redirecionando…";
  feedback.className = "feedback is-success";
  form.reset();
  updatePasswordRules();
  [1, 2, 3].forEach((step) => {
    stepValidity[step] = false;
    stepDirty[step] = false;
    stepFlashing[step] = false;
  });
  showStep(1);

  setTimeout(() => {
    window.location.href = "../home/index.html";
  }, 900);
});

showStep(1);
updatePasswordRules();

mountHeader(document.querySelector("#app-header"), {
  activePage: "cadastro",
});

mountFooter(document.querySelector("#app-footer"));
