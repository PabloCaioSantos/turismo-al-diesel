import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import { login, estaLogado } from "../../services/auth-store.js";
import { getQueryParam } from "../../utils/url.js";

const form = document.getElementById("loginForm");
const feedback = document.getElementById("feedback");

if (estaLogado()) {
  window.location.href = "../home/index.html";
}

const emailParam = getQueryParam("email");
if (emailParam) form.email.value = emailParam;

function fail(msg) {
  feedback.textContent = msg;
  feedback.className = "feedback is-error";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    fail("Preencha e-mail e senha.");
    return;
  }

  let user;
  try {
    user = await login(email, password);
  } catch (erro) {
    fail(erro.message || "E-mail ou senha incorretos.");
    return;
  }

  feedback.textContent = `Bem-vindo(a), ${user.fullname || user.username}! Redirecionando…`;
  feedback.className = "feedback is-success";

  setTimeout(() => {
    window.location.href = "../roteiro/index.html";
  }, 700);
});

mountHeader(document.querySelector("#app-header"), { activePage: "login" });
mountFooter(document.querySelector("#app-footer"));
