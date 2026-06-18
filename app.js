// ========================================
// CONTROLE DE CARGA
// app.js - PARTE 1
// ========================================

const STORAGE_KEY = "controle_carga_v1";

let estado = {
    tela: "inicio",

    nomeBalsa: "",

    dataInicio: "",

    horaInicio: "",

    dataFim: "",

    horaFim: "",

    carretas: [],

    historico: []
};

// ===============================
// ELEMENTOS
// ===============================

const telaInicial = document.getElementById("telaInicial");
const telaCarreta = document.getElementById("telaCarreta");
const telaFinalizar = document.getElementById("telaFinalizar");

const nomeBalsa = document.getElementById("nomeBalsa");
const dataInicio = document.getElementById("dataInicio");
const horaInicio = document.getElementById("horaInicio");

const btnIniciar = document.getElementById("btnIniciar");

const tituloCarreta = document.getElementById("tituloCarreta");
const totalAcumulado = document.getElementById("totalAcumulado");

const pallets = document.getElementById("pallets");
const sacos = document.getElementById("sacos");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnDesfazer = document.getElementById("btnDesfazer");
const btnFinalizar = document.getElementById("btnFinalizar");

const dataFim = document.getElementById("dataFim");
const horaFim = document.getElementById("horaFim");

const btnGerarPDF = document.getElementById("btnGerarPDF");

// ===============================
// STORAGE
// ===============================

function salvarEstado() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(estado)

    );

}

function carregarEstado() {

    const salvo = localStorage.getItem(STORAGE_KEY);

    if (!salvo)
        return;

    try {

        estado = JSON.parse(salvo);

    }

    catch {

        return;

    }

}

carregarEstado();

// ===============================
// MÁSCARA DATA
// ===============================

function aplicarMascaraData(input) {

    let valor = input.value.replace(/\D/g, "");

    if (valor.length > 2)
        valor =
            valor.substring(0, 2)
            + "/"
            + valor.substring(2);

    if (valor.length > 5)
        valor =
            valor.substring(0, 5)
            + "/"
            + valor.substring(5, 9);

    input.value = valor;

}

// ===============================
// MÁSCARA HORA
// ===============================

function aplicarMascaraHora(input) {

    let valor = input.value.replace(/\D/g, "");

    if (valor.length > 2)
        valor =
            valor.substring(0, 2)
            + ":"
            + valor.substring(2, 4);

    input.value = valor;

}

// ===============================
// VALIDA DATA
// ===============================

function dataValida(texto) {

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto))
        return false;

    const partes = texto.split("/");

    const dia = Number(partes[0]);

    const mes = Number(partes[1]);

    const ano = Number(partes[2]);

    if (ano < 2000)
        return false;

    const dt =
        new Date(

            ano,

            mes - 1,

            dia

        );

    return (

        dt.getFullYear() === ano &&

        dt.getMonth() === mes - 1 &&

        dt.getDate() === dia

    );

}

// ===============================
// VALIDA HORA
// ===============================

function horaValida(texto) {

    if (!/^\d{2}:\d{2}$/.test(texto))
        return false;

    const partes = texto.split(":");

    const h = Number(partes[0]);

    const m = Number(partes[1]);

    if (h < 0 || h > 23)
        return false;

    if (m < 0 || m > 59)
        return false;

    return true;

}

// ===============================
// EVENTOS MÁSCARA
// ===============================

dataInicio.addEventListener("input", () => {

    aplicarMascaraData(dataInicio);

    validarTelaInicial();

});

horaInicio.addEventListener("input", () => {

    aplicarMascaraHora(horaInicio);

    validarTelaInicial();

});

dataFim.addEventListener("input", () => {

    aplicarMascaraData(dataFim);

});

horaFim.addEventListener("input", () => {

    aplicarMascaraHora(horaFim);

});

nomeBalsa.addEventListener("input", () => {

    validarTelaInicial();

});

pallets.addEventListener("input", () => {

    const qtdPallets = Number(pallets.value);

    if (isNaN(qtdPallets) || pallets.value.trim() === "") {

        sacos.value = "";

        return;

    }

    sacos.value = qtdPallets * 40;

});

// ===============================
// BOTÃO INICIAR
// ===============================

function validarTelaInicial() {

    const ok =

        nomeBalsa.value.trim() !== ""

        &&

        dataValida(dataInicio.value)

        &&

        horaValida(horaInicio.value);

    btnIniciar.disabled = !ok;

}

validarTelaInicial();

// ========================================
// app.js - PARTE 2
// CONTINUAÇÃO DA PARTE 1
// ========================================

// ===============================
// TROCA DE TELAS
// ===============================

function esconderTodas() {

    telaInicial.classList.add("hidden");
    telaCarreta.classList.add("hidden");
    telaFinalizar.classList.add("hidden");

}

function abrirTelaInicio() {

    esconderTodas();

    telaInicial.classList.remove("hidden");

    estado.tela = "inicio";

    salvarEstado();

}

function abrirTelaCarreta() {

    esconderTodas();

    telaCarreta.classList.remove("hidden");

    estado.tela = "carreta";

    atualizarNumeroCarreta();

    salvarEstado();

}

function atualizarTotalAcumulado () {
    const total = estado.carretas.reduce((soma, item) => soma + Number(item.sacos), 0 );
    
    totalAcumulado.textContent = total + " sacos";

}   

function abrirTelaFinalizar() {

    esconderTodas();

    telaFinalizar.classList.remove("hidden");

    estado.tela = "finalizar";

    salvarEstado();

}

// ===============================
// ATUALIZA NUMERO
// ===============================

function atualizarNumeroCarreta() {

    tituloCarreta.textContent =
        "CARRETA Nº " +
        (estado.carretas.length + 1);

}

// ===============================
// RESTAURA CAMPOS
// ===============================

function restaurarCampos() {

    nomeBalsa.value = estado.nomeBalsa || "";

    dataInicio.value = estado.dataInicio || "";

    horaInicio.value = estado.horaInicio || "";

    dataFim.value = estado.dataFim || "";

    horaFim.value = estado.horaFim || "";

}

// ===============================
// RESTAURA TELA
// ===============================

restaurarCampos();
atualizarTotalAcumulado();

switch (estado.tela) {

    case "carreta":

        abrirTelaCarreta();

        break;

    case "finalizar":

        abrirTelaFinalizar();

        break;

    default:

        abrirTelaInicio();

        break;

}

// ===============================
// INICIAR
// ===============================

btnIniciar.addEventListener("click", () => {

    estado.nomeBalsa =
        nomeBalsa.value.trim();

    estado.dataInicio =
        dataInicio.value;

    estado.horaInicio =
        horaInicio.value;

    salvarEstado();

    abrirTelaCarreta();

});

// ===============================
// REGISTRAR CARRETA
// ===============================

btnRegistrar.addEventListener("click", () => {

    const radioSelecionado =
        document.querySelector(
            "input[name='cimento']:checked"
        );

    if (!radioSelecionado) {

        alert("Selecione o tipo do cimento.");

        return;

    }

    if (pallets.value.trim() === "") {

        alert("Informe a quantidade de pallets.");

        pallets.focus();

        return;

    }

    if (sacos.value.trim() === "") {

        alert("Informe a quantidade de sacos.");

        sacos.focus();

        return;

    }

    estado.carretas.push({

        tipo:

            radioSelecionado.value,

        pallets:

            Number(pallets.value),

        sacos:

            Number(sacos.value)

    });

    salvarEstado();
    atualizarTotalAcumulado();

    document
        .querySelectorAll(
            "input[name='cimento']"
        )
        .forEach(item => {

            item.checked = false;

        });

    pallets.value = "";

    sacos.value = "";

    atualizarNumeroCarreta();

    pallets.focus();

});

// ===============================
// DESFAZER ULTIMA
// ===============================

btnDesfazer.addEventListener("click", () => {

    if (estado.carretas.length === 0) {

        alert("Nenhuma carreta registrada.");

        return;

    }

    const confirmar = confirm(

        "Tem certeza que deseja desfazer a última carreta registrada?"

    );

    if (!confirmar)
        return;

    estado.carretas.pop();
    salvarEstado();
    atualizarTotalAcumulado();
    atualizarNumeroCarreta();

});

// ===============================
// FINALIZAR
// ===============================

btnFinalizar.addEventListener("click", () => {

    if (estado.carretas.length === 0) {

        alert("Nenhuma carreta registrada.");

        return;

    }

    const confirmar = confirm(

        "Tem certeza que deseja finalizar esta carga?"

    );

    if (!confirmar)
        return;

    abrirTelaFinalizar();

});

// ========================================
// app.js - PARTE 3
// FINALIZAÇÃO + PDF + HISTÓRICO
// ========================================

// ===============================
// GERAR PDF
// ===============================

btnGerarPDF.addEventListener("click", () => {

    if (!dataValida(dataFim.value)) {

        alert("Data de término inválida.");

        dataFim.focus();

        return;

    }

    if (!horaValida(horaFim.value)) {

        alert("Hora de término inválida.");

        horaFim.focus();

        return;

    }

    estado.dataFim = dataFim.value;
    estado.horaFim = horaFim.value;

    salvarEstado();

    const cargaFinalizada = JSON.parse(
        JSON.stringify({
            nomeBalsa: estado.nomeBalsa,
            dataInicio: estado.dataInicio,
            horaInicio: estado.horaInicio,
            dataFim: estado.dataFim,
            horaFim: estado.horaFim,
            carretas: estado.carretas
        })
    );

    // salva no histórico
    estado.historico.push(cargaFinalizada);

    salvarEstado();

    // gera PDF (usa pdf.js)
    if (typeof gerarPDF === "function") {

        gerarPDF(cargaFinalizada);

    } else {

        alert("pdf.js não carregado.");

    }

    // pergunta se deseja iniciar nova carga

    const nova = confirm(

        "PDF gerado com sucesso.\n\nDeseja iniciar uma NOVA CARGA?"

    );

    if (!nova)
        return;

    // mantém histórico
    const historicoSalvo = estado.historico;

    estado = {

        tela: "inicio",

        nomeBalsa: "",

        dataInicio: "",

        horaInicio: "",

        dataFim: "",

        horaFim: "",

        carretas: [],

        historico: historicoSalvo

    };

    salvarEstado();

    location.reload();

});

// ===============================
// FUNÇÕES AUXILIARES
// ===============================

function totalPallets() {

    return estado.carretas.reduce(

        (soma, item) =>

            soma + Number(item.pallets),

        0

    );

}

function totalSacos() {

    return estado.carretas.reduce(

        (soma, item) =>

            soma + Number(item.sacos),

        0

    );

}

function totalSacosVerde() {

    return estado.carretas

        .filter(

            x => x.tipo === "Verde"

        )

        .reduce(

            (soma, item) =>

                soma + Number(item.sacos),

            0

        );

}

function totalSacosPreto() {

    return estado.carretas

        .filter(

            x => x.tipo === "Preto"

        )

        .reduce(

            (soma, item) =>

                soma + Number(item.sacos),

            0

        );

}

function totalCarretasVerde() {

    return estado.carretas.filter(

        x => x.tipo === "Verde"

    ).length;

}

function totalCarretasPreto() {

    return estado.carretas.filter(

        x => x.tipo === "Preto"

    ).length;

}

// ===============================
// ATALHO ENTER
// ===============================

sacos.addEventListener(

    "keydown",

    e => {

        if (e.key === "Enter") {

            btnRegistrar.click();

        }

    }

);

// ===============================
// DEBUG
// ===============================

window.estadoCarga = estado;

console.log("Controle de Carga carregado com sucesso.");
