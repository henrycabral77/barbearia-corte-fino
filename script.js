// ================================================================
// CONFIGURAÇÃO DO GOOGLE SHEETS
// ================================================================
// PASSO: Cole aqui a URL do seu Google Apps Script depois de criar
// Veja as instruções no README.md
// ================================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWIGxzku20J5fBSVEY0gwlD2HUSpeGc4jkdPtBjzy68-_NCn5HLq1CaVqcnmKReNRk/exec";
const STORAGE_KEY = "corte-fino-agendamentos";

function salvarAgendamentoLocal(dados) {
  const agendamentos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  agendamentos.unshift({
    ...dados,
    id: Date.now().toString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
}

// ── Data mínima: hoje ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const dataInput = document.getElementById("data");
  if (dataInput) {
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.setAttribute("min", hoje);
  }
});

// ── Formulário ───────────────────────────────────────────────────
document.getElementById("formAgendamento").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn     = document.getElementById("btnSubmit");
  const btnText = document.getElementById("btnText");

  // Coleta os dados
  const dados = {
    nome:      document.getElementById("nome").value.trim(),
    telefone:  document.getElementById("telefone").value.trim(),
    servico:   document.getElementById("servico").value,
    barbeiro:  document.getElementById("barbeiro").value,
    data:      document.getElementById("data").value,
    horario:   document.getElementById("horario").value,
    obs:       document.getElementById("obs").value.trim() || "—",
    timestamp: new Date().toLocaleString("pt-BR"),
  };

  salvarAgendamentoLocal(dados);

  // Loading
  btn.disabled = true;
  btnText.textContent = "Enviando...";

  try {
    // Envia para o Google Sheets via Apps Script
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    // Sucesso
    document.getElementById("formAgendamento").style.display = "none";
    const box = document.getElementById("successBox");
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "center" });

  } catch (err) {
    alert("Erro ao enviar. Verifique sua conexão e tente novamente.");
    btn.disabled = false;
    btnText.textContent = "Confirmar Agendamento";
  }
});

// ── Novo agendamento ─────────────────────────────────────────────
function novoAgendamento() {
  document.getElementById("formAgendamento").reset();
  document.getElementById("formAgendamento").style.display = "block";
  document.getElementById("successBox").classList.remove("show");
  document.getElementById("btnSubmit").disabled = false;
  document.getElementById("btnText").textContent = "Confirmar Agendamento";
  document.getElementById("agendar").scrollIntoView({ behavior: "smooth" });
}
