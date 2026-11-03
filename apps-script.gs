// ===== Cole TUDO isto no Apps Script da sua planilha (apague o que estiver lá) =====
// Recebe: confirmação de presença, reserva de presente e aviso de contribuição.
// Cria as abas "Presenças", "Reservas" e "Contribuições" sozinho.

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var agora = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');

    if (d.tipo === 'presenca') {
      aba(ss, 'Presenças', ['Data', 'Nome', 'Telefone', 'Comparece', 'Qtd acompanhantes', 'Acompanhantes'])
        .appendRow([agora, t(d.nome), t(d.telefone), t(d.comparecer), t(d.quantidade), t(d.acompanhantes)]);

    } else if (d.tipo === 'reserva') {
      var r = aba(ss, 'Reservas', ['Data', 'Nome', 'Presente']);
      if (reservados(r).indexOf(norm(d.presente)) === -1) {   // não duplica reserva
        r.appendRow([agora, t(d.nome), t(d.presente)]);
      }

    } else if (d.tipo === 'contribuicao') {
      aba(ss, 'Contribuições', ['Data', 'Nome', 'Valor', 'Mensagem', 'Presente'])
        .appendRow([agora, t(d.nome), t(d.valor), t(d.mensagem), t(d.presente)]);
    }
    return saida({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// O site consulta isto: presentes reservados e total arrecadado por presente da vaquinha.
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var r = ss.getSheetByName('Reservas');
  return saida({ reservados: r ? reservados(r, true) : [], arrecadado: totais(ss.getSheetByName('Contribuições')) });
}

// Soma automática das contribuições. Para desconsiderar uma, apague a linha.
function totais(sh) {
  var out = {};
  var n = sh ? sh.getLastRow() - 1 : 0;
  if (n < 1) return out;
  sh.getRange(2, 3, n, 3).getValues().forEach(function (l) {   // colunas C (valor), D (mensagem), E (presente)
    var v = numero(l[0]), p = norm(l[2]);
    if (p && v > 0) out[p] = (out[p] || 0) + v;
  });
  return out;
}
function numero(x) {
  if (typeof x === 'number') return x;
  var s = String(x || '').replace(/[^\d.,]/g, '');
  if (s.indexOf(',') > -1) s = s.replace(/\./g, '').replace(',', '.');
  var v = parseFloat(s);
  return isNaN(v) ? 0 : v;
}

function aba(ss, nome, titulos) {
  var sh = ss.getSheetByName(nome);
  if (!sh) { sh = ss.insertSheet(nome); sh.appendRow(titulos); sh.setFrozenRows(1); }
  return sh;
}
function reservados(sh, original) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 3, n, 1).getValues()
    .map(function (x) { return original ? String(x[0]) : norm(x[0]); })
    .filter(String);
}
function norm(s) { return String(s || '').trim().toLowerCase(); }
// evita que texto digitado vire fórmula na planilha
function t(v) {
  v = String(v == null ? '' : v).trim().slice(0, 500);
  return /^[=@]|^[+\-](?!\d)/.test(v) ? "'" + v : v;
}
function saida(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
