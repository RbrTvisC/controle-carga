// pdf.js
// Requer jsPDF + jspdf-autotable carregados no index.html

function gerarPDF(carga) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const verde = carga.carretas.filter(c => c.tipo === "Verde");
    const preto = carga.carretas.filter(c => c.tipo === "Preto");

    const totalPallets = carga.carretas.reduce((s, c) => s + Number(c.pallets), 0);
    const totalSacos = carga.carretas.reduce((s, c) => s + Number(c.sacos), 0);

    const verdeSacos = verde.reduce((s, c) => s + Number(c.sacos), 0);
    const pretoSacos = preto.reduce((s, c) => s + Number(c.sacos), 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("CONTROLE DE CARGA", 105, 18, { align: "center" });

    doc.setFontSize(14);
    doc.text(`Balsa: ${carga.nomeBalsa}`, 14, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    let y = 42;

    const linhas = [
        ["Data de Início", carga.dataInicio],
        ["Hora de Início", carga.horaInicio],
        ["Data de Término", carga.dataFim],
        ["Hora de Término", carga.horaFim],
        ["Quantidade de Carretas", carga.carretas.length],
        ["Total de Pallets", totalPallets],
        ["Carretas Verde", verde.length],
        ["Carretas Preto", preto.length],
        ["Cimento Verde (sacos)", verdeSacos],
        ["Cimento Preto (sacos)", pretoSacos],
        ["Quantidade Total de Cimento", totalSacos]
    ];

    linhas.forEach(([k, v]) => {
        doc.text(`${k} ................................`, 14, y);
        doc.text(String(v), 130, y);
        y += 7;
    });

    y += 5;

    doc.autoTable({
        startY: y,
        head: [["Carreta", "Tipo", "Pallets", "Sacos"]],
        body: carga.carretas.map((c, i) => [
            i + 1,
            c.tipo,
            c.pallets,
            c.sacos
        ]),
        styles: {
            fontSize: 10
        },
        headStyles: {
            fillColor: [40, 40, 40]
        }
    });

    doc.save(
        `Controle_${carga.nomeBalsa.replace(/\s+/g, "_")}.pdf`
    );
}