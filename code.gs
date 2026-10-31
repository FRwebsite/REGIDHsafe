/**
 * REGIDHsafe - Backend Google Apps Script (code.gs)
 * Mode: B (GitHub Pages API - ContentService JSON + CORS & JSONP)
 */

const SHEET_FADHIL_ = 'Transaksi_Fadhil';
const SHEET_REGYNA_ = 'Transaksi_Regyna';
const SHEET_LIMIT_ = 'Batas_Bulanan';
const SHEET_NOTES_ = 'Catatan_Bersama';
const SHEET_TASKS_ = 'Tugas_Kuliah';

function doGet(e) {
  return handle_(e);
}

function doPost(e) {
  return handle_(e);
}

function handle_(e) {
  var out;
  try {
    var req = parseRequest_(e);
    if (!req.action) {
      out = { ok: true, message: 'REGIDHsafe API Backend is running.' };
    } else {
      out = route_(req);
    }
  } catch (err) {
    out = { ok: false, message: String(err && err.message || err) };
  }
  return jsonOut_(out, e);
}

function parseRequest_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return { action: '', payload: {} };
    }
  }
  var p = (e && e.parameter) || {};
  var payloadObj = {};
  if (p.payload) {
    try {
      payloadObj = typeof p.payload === 'string' ? JSON.parse(p.payload) : p.payload;
    } catch (err) {
      payloadObj = {};
    }
  }
  return { action: p.action, payload: payloadObj, token: p.token };
}

function jsonOut_(obj, e) {
  var text = JSON.stringify(obj);
  var cb = e && e.parameter && e.parameter.callback;
  if (cb && /^[A-Za-z_$][\w$.]*$/.test(cb)) {
    return ContentService.createTextOutput(cb + '(' + text + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

function route_(req) {
  var action = req.action;
  var p = req.payload || {};

  switch (action) {
    case 'getInitialData':
      return getInitialData(p.profile);
    case 'saveTransaction':
      return saveTransaction(p.profile, p.txData);
    case 'deleteTransaction':
      return deleteTransaction(p.profile, p.txId);
    case 'setMonthlyLimit':
      return setMonthlyLimit(p.profile, p.period, p.limitAmount);
    case 'saveNote':
      return saveNote(p.noteData);
    case 'deleteNote':
      return deleteNote(p.noteId);
    case 'saveTask':
      return saveTask(p.taskData);
    case 'toggleTaskStatus':
      return toggleTaskStatus(p.taskId, p.newStatus);
    case 'deleteTask':
      return deleteTask(p.taskId);
    default:
      return { ok: false, message: 'Action tidak dikenal: ' + action };
  }
}

function getSpreadsheet_() {
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  throw new Error('Spreadsheet tidak ditemukan. Buat script dari Spreadsheet (Extensions > Apps Script) atau isi Script Property SPREADSHEET_ID.');
}

function getInitialData(profile) {
  try {
    if (!profile || (profile !== 'Fadhil' && profile !== 'Regyna')) {
      return { ok: false, message: 'Profil tidak valid' };
    }

    var ss = getSpreadsheet_();
    var sheetName = (profile === 'Fadhil') ? SHEET_FADHIL_ : SHEET_REGYNA_;
    var txSheet = ss.getSheetByName(sheetName);
    var transactions = [];

    if (txSheet && txSheet.getLastRow() > 1) {
      var txValues = txSheet.getRange(2, 1, txSheet.getLastRow() - 1, 7).getValues();
      for (var i = txValues.length - 1; i >= 0; i--) {
        var row = txValues[i];
        if (row[0]) {
          transactions.push({
            id: String(row[0]),
            tanggal: formatDateISO_(row[1]),
            jenis: String(row[2]),
            kategori: String(row[3]),
            nominal: Number(row[4]) || 0,
            keterangan: String(row[5] || ''),
            created_at: formatDateTimeISO_(row[6])
          });
        }
      }
    }

    var currentPeriod = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Jakarta', 'yyyy-MM');
    var limitSheet = ss.getSheetByName(SHEET_LIMIT_);
    var monthlyLimit = 0;
    if (limitSheet && limitSheet.getLastRow() > 1) {
      var limitVals = limitSheet.getRange(2, 1, limitSheet.getLastRow() - 1, 4).getValues();
      for (var j = 0; j < limitVals.length; j++) {
        if (String(limitVals[j][0]) === profile && String(limitVals[j][1]) === currentPeriod) {
          monthlyLimit = Number(limitVals[j][2]) || 0;
          break;
        }
      }
    }

    var notesSheet = ss.getSheetByName(SHEET_NOTES_);
    var notes = [];
    if (notesSheet && notesSheet.getLastRow() > 1) {
      var noteVals = notesSheet.getRange(2, 1, notesSheet.getLastRow() - 1, 5).getValues();
      for (var k = noteVals.length - 1; k >= 0; k--) {
        var nRow = noteVals[k];
        if (nRow[0]) {
          notes.push({
            id: String(nRow[0]),
            judul: String(nRow[1]),
            isi: String(nRow[2]),
            penulis: String(nRow[3]),
            updated_at: formatDateTimeISO_(nRow[4])
          });
        }
      }
    }

    var taskSheet = ss.getSheetByName(SHEET_TASKS_);
    var tasks = [];
    if (taskSheet && taskSheet.getLastRow() > 1) {
      var taskVals = taskSheet.getRange(2, 1, taskSheet.getLastRow() - 1, 8).getValues();
      for (var m = taskVals.length - 1; m >= 0; m--) {
        var tRow = taskVals[m];
        if (tRow[0]) {
          tasks.push({
            id: String(tRow[0]),
            nama_matkul: String(tRow[1]),
            keterangan_tugas: String(tRow[2]),
            deadline: tRow[3] ? formatDateISO_(tRow[3]) : '',
            foto_thumbnail: String(tRow[4] || ''),
            status: String(tRow[5]),
            created_by: String(tRow[6]),
            created_at: formatDateTimeISO_(tRow[7])
          });
        }
      }
    }

    return {
      ok: true,
      data: {
        profile: profile,
        period: currentPeriod,
        transactions: transactions,
        monthlyLimit: monthlyLimit,
        notes: notes,
        tasks: tasks
      }
    };
  } catch (err) {
    return { ok: false, message: 'Gagal memuat data: ' + err.message };
  }
}

function saveTransaction(profile, txData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    if (!profile || (profile !== 'Fadhil' && profile !== 'Regyna')) {
      return { ok: false, message: 'Profil tidak valid' };
    }

    var ss = getSpreadsheet_();
    var sheetName = (profile === 'Fadhil') ? SHEET_FADHIL_ : SHEET_REGYNA_;
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet ' + sheetName + ' tidak ditemukan.');

    var id = txData.id ? String(txData.id) : ('tx_' + Utilities.getUuid());
    var tanggal = txData.tanggal ? new Date(txData.tanggal) : new Date();
    var jenis = String(txData.jenis || 'Pengeluaran');
    var kategori = String(txData.kategori || '').trim();
    var nominal = Math.abs(Number(txData.nominal)) || 0;
    var keterangan = String(txData.keterangan || '').trim();
    var now = new Date();

    if (!kategori) return { ok: false, message: 'Kategori wajib diisi' };
    if (nominal <= 0) return { ok: false, message: 'Nominal harus lebih dari 0' };

    var dataRow = [id, tanggal, jenis, kategori, nominal, keterangan, now];
    var lastRow = sheet.getLastRow();
    var updated = false;

    if (txData.id && lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(txData.id)) {
          sheet.getRange(i + 2, 1, 1, 7).setValues([dataRow]);
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      sheet.appendRow(dataRow);
    }

    return { ok: true, data: { id: id, updated: updated } };
  } catch (err) {
    return { ok: false, message: 'Gagal menyimpan transaksi: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function deleteTransaction(profile, txId) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    if (!profile || (profile !== 'Fadhil' && profile !== 'Regyna')) {
      return { ok: false, message: 'Profil tidak valid' };
    }
    var ss = getSpreadsheet_();
    var sheetName = (profile === 'Fadhil') ? SHEET_FADHIL_ : SHEET_REGYNA_;
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet tidak ditemukan.');

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(txId)) {
          sheet.deleteRow(i + 2);
          return { ok: true, data: { deletedId: txId } };
        }
      }
    }
    return { ok: false, message: 'Transaksi tidak ditemukan' };
  } catch (err) {
    return { ok: false, message: 'Gagal menghapus: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function setMonthlyLimit(profile, period, limitAmount) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    if (!profile || (profile !== 'Fadhil' && profile !== 'Regyna')) {
      return { ok: false, message: 'Profil tidak valid' };
    }
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(SHEET_LIMIT_);
    if (!sheet) throw new Error('Sheet ' + SHEET_LIMIT_ + ' tidak ditemukan.');

    var amount = Math.abs(Number(limitAmount)) || 0;
    var now = new Date();
    var lastRow = sheet.getLastRow();
    var updated = false;

    if (lastRow > 1) {
      var rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i][0]) === profile && String(rows[i][1]) === String(period)) {
          sheet.getRange(i + 2, 3, 1, 2).setValues([[amount, now]]);
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      sheet.appendRow([profile, period, amount, now]);
    }

    return { ok: true, data: { profile: profile, period: period, limit: amount } };
  } catch (err) {
    return { ok: false, message: 'Gagal mengatur limit: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function saveNote(noteData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(SHEET_NOTES_);
    if (!sheet) throw new Error('Sheet ' + SHEET_NOTES_ + ' tidak ditemukan.');

    var id = noteData.id ? String(noteData.id) : ('note_' + Utilities.getUuid());
    var judul = String(noteData.judul || '').trim();
    var isi = String(noteData.isi || '').trim();
    var penulis = String(noteData.penulis || 'Fadhil');
    var now = new Date();

    if (!judul || !isi) {
      return { ok: false, message: 'Judul dan isi catatan wajib diisi' };
    }

    var lastRow = sheet.getLastRow();
    var updated = false;

    if (noteData.id && lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(noteData.id)) {
          sheet.getRange(i + 2, 2, 1, 4).setValues([[judul, isi, penulis, now]]);
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      sheet.appendRow([id, judul, isi, penulis, now]);
    }

    return { ok: true, data: { id: id, updated: updated } };
  } catch (err) {
    return { ok: false, message: 'Gagal menyimpan catatan: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function deleteNote(noteId) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(SHEET_NOTES_);
    if (!sheet) throw new Error('Sheet ' + SHEET_NOTES_ + ' tidak ditemukan.');

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(noteId)) {
          sheet.deleteRow(i + 2);
          return { ok: true, data: { deletedId: noteId } };
        }
      }
    }
    return { ok: false, message: 'Catatan tidak ditemukan' };
  } catch (err) {
    return { ok: false, message: 'Gagal menghapus: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function saveTask(taskData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(SHEET_TASKS_);
    if (!sheet) throw new Error('Sheet ' + SHEET_TASKS_ + ' tidak ditemukan.');

    var id = taskData.id ? String(taskData.id) : ('task_' + Utilities.getUuid());
    var namaMatkul = String(taskData.nama_matkul || '').trim();
    var keteranganTugas = String(taskData.keterangan_tugas || '').trim();
    var deadline = taskData.deadline ? new Date(taskData.deadline) : '';
    var fotoThumbnail = String(taskData.foto_thumbnail || '');
    var status = String(taskData.status || 'Belum Selesai');
    var createdBy = String(taskData.created_by || 'Fadhil');
    var now = new Date();

    if (!namaMatkul || !keteranganTugas) {
      return { ok: false, message: 'nama matkul dan keterangan tugas wajib diisi' };
    }

    var lastRow = sheet.getLastRow();
    var updated = false;

    if (taskData.id && lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(taskData.id)) {
          var existingRow = sheet.getRange(i + 2, 1, 1, 8).getValues()[0];
          var existingThumbnail = fotoThumbnail || existingRow[4];
          sheet.getRange(i + 2, 2, 1, 6).setValues([[
            namaMatkul,
            keteranganTugas,
            deadline,
            existingThumbnail,
            status,
            createdBy
          ]]);
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      sheet.appendRow([id, namaMatkul, keteranganTugas, deadline, fotoThumbnail, status, createdBy, now]);
    }

    return { ok: true, data: { id: id, updated: updated } };
  } catch (err) {
    return { ok: false, message: 'Gagal menyimpan tugas: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function toggleTaskStatus(taskId, newStatus) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(SHEET_TASKS_);
    if (!sheet) throw new Error('Sheet ' + SHEET_TASKS_ + ' tidak ditemukan.');

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(taskId)) {
          sheet.getRange(i + 2, 6).setValue(String(newStatus));
          return { ok: true, data: { id: taskId, status: newStatus } };
        }
      }
    }
    return { ok: false, message: 'Tugas tidak ditemukan' };
  } catch (err) {
    return { ok: false, message: 'Gagal memperbarui status: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function deleteTask(taskId) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(SHEET_TASKS_);
    if (!sheet) throw new Error('Sheet ' + SHEET_TASKS_ + ' tidak ditemukan.');

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(taskId)) {
          sheet.deleteRow(i + 2);
          return { ok: true, data: { deletedId: taskId } };
        }
      }
    }
    return { ok: false, message: 'Tugas tidak ditemukan' };
  } catch (err) {
    return { ok: false, message: 'Gagal menghapus: ' + err.message };
  } finally {
    lock.releaseLock();
  }
}

function formatDateISO_(d) {
  if (!d) return '';
  try {
    var dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return Utilities.formatDate(dt, Session.getScriptTimeZone() || 'Asia/Jakarta', 'yyyy-MM-dd');
  } catch (e) {
    return '';
  }
}

function formatDateTimeISO_(d) {
  if (!d) return '';
  try {
    var dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return Utilities.formatDate(dt, Session.getScriptTimeZone() || 'Asia/Jakarta', 'yyyy-MM-dd HH:mm');
  } catch (e) {
    return '';
  }
}
