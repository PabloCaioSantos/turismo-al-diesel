import { mountHeader } from "../../components/header/header.js";
import { mountFooter } from "../../components/footer/footer.js";
import { estaLogado, getUsuario, atualizarPerfil } from "../../services/auth-store.js";
import { onlyDigits, formatCpf, isValidCpf, isStrongPassword } from "../../utils/validators.js";

if (!estaLogado()) {
  window.location.href = "../login/index.html";
}

const form = document.getElementById("contaForm");
const feedback = document.getElementById("feedback");
const fotoInput = document.getElementById("fotoInput");
const fotoPreview = document.getElementById("fotoPreview");
const fotoRemover = document.getElementById("fotoRemover");
const usuario = getUsuario();

const TAMANHO_MAX_FOTO = 2 * 1024 * 1024;

let fotoAtual = usuario?.foto || null;

function iniciais(nome) {
  const partes = String(nome || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (partes.length === 0) return "?";
  return (
    (partes[0][0] || "") + (partes.length > 1 ? partes[partes.length - 1][0] : "")
  ).toUpperCase();
}

function renderFotoPreview() {
  if (fotoAtual) {
    fotoPreview.innerHTML = `<img src="${fotoAtual}" alt="Sua foto de perfil" />`;
    fotoPreview.classList.add("conta-foto__preview--img");
    fotoRemover.hidden = false;
  } else {
    fotoPreview.textContent = iniciais(usuario?.fullname || usuario?.username);
    fotoPreview.classList.remove("conta-foto__preview--img");
    fotoRemover.hidden = true;
  }
}

if (usuario) {
  form.username.value = usuario.username || "";
  form.fullname.value = usuario.fullname || "";
  form.email.value = usuario.email || "";
  form.cpf.value = usuario.cpf || "";
}
renderFotoPreview();

form.cpf.addEventListener("input", (e) => {
  e.target.value = formatCpf(e.target.value);
});

fotoInput.addEventListener("change", () => {
  const arquivo = fotoInput.files?.[0];
  if (!arquivo) return;
  if (!arquivo.type.startsWith("image/")) {
    fail("Selecione um arquivo de imagem.");
    fotoInput.value = "";
    return;
  }
  if (arquivo.size > TAMANHO_MAX_FOTO) {
    fail("A imagem deve ter no máximo 2 MB.");
    fotoInput.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    fotoAtual = String(reader.result);
    renderFotoPreview();
    feedback.textContent = "Foto selecionada. Clique em “Salvar alterações” para confirmar.";
    feedback.className = "feedback";
  };
  reader.readAsDataURL(arquivo);
});

fotoRemover.addEventListener("click", () => {
  fotoAtual = null;
  fotoInput.value = "";
  renderFotoPreview();
});

function fail(msg) {
  feedback.textContent = msg;
  feedback.className = "feedback is-error";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = form.username.value.trim();
  const fullname = form.fullname.value.trim();
  const email = form.email.value.trim();
  const cpf = form.cpf.value.trim();
  const novaSenha = form.password.value;

  if (!username || !fullname || !email || !cpf) {
    fail("Preencha todos os campos obrigatórios.");
    return;
  }
  if (!form.email.checkValidity()) {
    form.email.reportValidity();
    return;
  }
  if (!isValidCpf(onlyDigits(cpf))) {
    fail("CPF inválido.");
    return;
  }
  if (novaSenha && !isStrongPassword(novaSenha)) {
    fail(
      "A nova senha não atende aos requisitos (8+ caracteres, maiúscula, minúscula, número, especial e sem sequências).",
    );
    return;
  }

  const parcial = { username, fullname, email, cpf, foto: fotoAtual };
  if (novaSenha) parcial.password = novaSenha;

  try {
    await atualizarPerfil(parcial);
  } catch (erro) {
    fail(erro.message || "Não foi possível salvar as alterações.");
    return;
  }

  form.password.value = "";
  feedback.textContent = "Dados atualizados com sucesso.";
  feedback.className = "feedback is-success";

  mountHeader(document.querySelector("#app-header"), { activePage: "minha-conta" });
});

mountHeader(document.querySelector("#app-header"), { activePage: "minha-conta" });
mountFooter(document.querySelector("#app-footer"));
