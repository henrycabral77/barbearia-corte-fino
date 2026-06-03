// ================================================================
// CONFIGURAÇÃO DO GOOGLE SHEETS
// ================================================================
// PASSO: Cole aqui a URL do seu Google Apps Script depois de criar
// Veja as instruções no README.md
// ================================================================
const SCRIPT_URL = "COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT";

// ── Data mínima: hoje ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const dataInput = document.getElementById("data");
  const hoje = new Date().toISOString().split("T")[0];
  dataInput.setAttribute("min", hoje);
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
