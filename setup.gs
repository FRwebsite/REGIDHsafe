/**
 * REGIDHsafe - Setup Database Spreadsheet (setup.gs)
 * Menyiapkan struktur sheet, kolom, format, autofit, data seed manual, dan menu Spreadsheet.
 * TIDAK mendeklarasikan variabel global apapun.
 */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Setup Database')
    .addItem('Buat / Perbarui Database', 'setupApp')
    .addItem('Rapikan Spreadsheet', 'rapikanSpreadsheet')
    .addItem('Inisialisasi Data Bulan Baru (Tanggal 1)', 'initMonthlyDataManual')
    .addToUi();
}

function getDbSchema_() {
  return {
    'Transaksi_Fadhil': [
      { name: 'id', type: 'id' },
      { name: 'tanggal', type: 'date' },
      { name: 'jenis', type: 'text' },
      { name: 'kategori', type: 'text' },
      { name: 'nominal', type: 'currency' },
      { name: 'keterangan', type: 'text' },
      { name: 'created_at', type: 'datetime' }
    ],
    'Transaksi_Regyna': [
      { name: 'id', type: 'id' },
      { name: 'tanggal', type: 'date' },
      { name: 'jenis', type: 'text' },
      { name: 'kategori', type: 'text' },
      { name: 'nominal', type: 'currency' },
      { name: 'keterangan', type: 'text' },
      { name: 'created_at', type: 'datetime' }
    ],
    'Batas_Bulanan': [
      { name: 'profil', type: 'text' },
      { name: 'periode_bulan', type: 'text' },
      { name: 'limit_nominal', type: 'currency' },
      { name: 'updated_at', type: 'datetime' }
    ],
    'Catatan_Bersama': [
      { name: 'id', type: 'id' },
      { name: 'judul', type: 'text' },
      { name: 'isi', type: 'longtext' },
      { name: 'penulis', type: 'text' },
      { name: 'updated_at', type: 'datetime' }
    ],
    'Tugas_Kuliah': [
      { name: 'id', type: 'id' },
      { name: 'nama_matkul', type: 'text' },
      { name: 'keterangan_tugas', type: 'longtext' },
      { name: 'deadline', type: 'date' },
      { name: 'foto_thumbnail', type: 'longtext' },
      { name: 'status', type: 'text' },
      { name: 'created_by', type: 'text' },
      { name: 'created_at', type: 'datetime' }
    ]
  };
}

function setupApp() {
  try {
    var ss = getSpreadsheet_();
    var schema = getDbSchema_();
    var names = Object.keys(schema);
    var lines = [];

    names.forEach(function (name, idx) {
      var cols = schema[name];
      var sh = ss.getSheetByName(name);
      var status = 'SUDAH ADA';
      if (!sh) {
        sh = ss.insertSheet(name);
        status = 'DIBUAT BARU';
      }
      var headers = cols.map(function (c) { return c.name; });
      if (sh.getLastRow() === 0) {
        sh.getRange(1, 1, 1, headers.length).setValues([headers]);
        if (status === 'SUDAH ADA') status = 'HEADER DIISI';
      }
      formatSheet_(sh, cols);
      ss.setActiveSheet(sh);
      ss.moveActiveSheet(idx + 1);
      lines.push('- ' + name + ' [' + status + ']\n   Kolom: ' + headers.join(', '));
    });

    removeDefaultSheets_(ss, names);
    var seedMsg = seedDefaults_(ss);
    ensureMonthlyData_(ss);
    setupMonthlyTrigger_();

    var msg = 'Database berhasil disiapkan\n\nData yang dibuat:\n' + lines.join('\n') +
              (seedMsg ? '\n\n' + seedMsg : '') +
              '\n\nBy - Fadhil';
    Logger.log(msg);

    try {
      SpreadsheetApp.getUi().alert('Setup Database', msg, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {
      try {
        ss.toast('Database siap. By - Fadhil', 'Setup Database', 10);
      } catch (e2) {}
    }
    return msg;
  } catch (err) {
    Logger.log('SETUP ERROR: ' + err.message + '\n' + err.stack);
    throw new Error('Setup gagal: ' + err.message);
  }
}

function initMonthlyDataManual() {
  try {
    var ss = getSpreadsheet_();
    var res = ensureMonthlyData_(ss);
    var msg = 'Inisialisasi data bulan baru berhasil dijalankan.\nPeriode: ' + (res && res.period ? res.period : 'Aktif') + '\n\nBy - Fadhil';
    try {
      SpreadsheetApp.getUi().alert('Inisialisasi Bulan Baru', msg, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {
      ss.toast('Bulan baru siap. By - Fadhil', 'Setup Database', 6);
    }
    return msg;
  } catch (err) {
    throw new Error('Gagal inisialisasi data bulan baru: ' + err.message);
  }
}

function seedDefaults_(ss) {
  var countFadhil = 0;
  var countRegyna = 0;

  // Seed Transaksi_Fadhil jika masih kosong (hanya ada header)
  var shFadhil = ss.getSheetByName('Transaksi_Fadhil');
  if (shFadhil && shFadhil.getLastRow() <= 1) {
    var rawFadhil = [
      ['tx_f01', '2026-10-18', 'Pemasukan', 'Gaji/Pemasukan', 50000, 'joki tugas web cms', '2026-10-18 13:00'],
      ['tx_f02', '2026-10-19', 'Pemasukan', 'Gaji/Pemasukan', 50000, 'Sangu', '2026-10-19 23:00'],
      ['tx_f03', '2026-10-20', 'Pemasukan', 'Gaji/Pemasukan', 10000, 'Jastip', '2026-10-19 23:00'],
      ['tx_f04', '2026-10-20', 'Pemasukan', 'Lainnya', 123000, 'Dana Bisnis saat Ini', '2026-10-19 23:00'],
      ['tx_f05', '2026-10-20', 'Pemasukan', 'Lainnya', 200000, 'Isi Dompet', '2026-10-19 23:00'],
      ['tx_f06', '2026-10-20', 'Pemasukan', 'Gaji/Pemasukan', 23000, 'Joki + Print ( Rizky, Ega)', '2026-10-20 00:00'],
      ['tx_f07', '2026-10-20', 'Pengeluaran', 'Makan Pribadi', 21000, 'Makan + Minum', '2026-10-20 09:00'],
      ['tx_f08', '2026-10-20', 'Pemasukan', 'Gaji/Pemasukan', 50000, 'Joki Laprak Adit', '2026-10-20 09:00'],
      ['tx_f09', '2026-10-20', 'Pengeluaran', 'Kebutuhan Diri', 40000, 'Bensin', '2026-10-20 14:00'],
      ['tx_f10', '2026-10-18', 'Pemasukan', 'Gaji/Pemasukan', 50000, 'Sangu', '2026-10-20 14:00'],
      ['tx_f11', '2026-10-21', 'Pemasukan', 'Lainnya', 50000, 'Sangu', '2026-10-21 05:00'],
      ['tx_f12', '2026-10-21', 'Pengeluaran', 'Kopi', 5000, 'Jajan', '2026-10-21 05:00'],
      ['tx_f13', '2026-10-22', 'Pengeluaran', 'Kopi', 62000, 'Kopken + Pisju + Nasgor', '2026-10-22 00:00'],
      ['tx_f14', '2026-10-22', 'Pengeluaran', 'Makan Pribadi', 55000, 'Richesee Double Chicken + Lava', '2026-10-22 00:00'],
      ['tx_f15', '2026-10-21', 'Pengeluaran', 'Kebutuhan Diri', 50000, 'Bensin', '2026-10-22 00:00'],
      ['tx_f16', '2026-10-22', 'Pemasukan', 'Gaji/Pemasukan', 115000, 'Dompet', '2026-10-22 00:00'],
      ['tx_f17', '2026-10-22', 'Pemasukan', 'Gaji/Pemasukan', 100000, 'Sangu + Joki CMS T1 T2 (Riyas)', '2026-10-22 03:00'],
      ['tx_f18', '2026-10-22', 'Pemasukan', 'Gaji/Pemasukan', 50000, 'Joki CMS 1&2 - David', '2026-10-22 04:00'],
      ['tx_f19', '2026-10-22', 'Pengeluaran', 'Kopi', 65000, 'Ngopi + Jajan Terbul+Martabak W', '2026-10-22 11:00'],
      ['tx_f20', '2026-10-23', 'Pemasukan', 'Gaji/Pemasukan', 100000, 'Joki Laprak Yopi + Sangu', '2026-10-23 07:00']
    ];
    shFadhil.getRange(2, 1, rawFadhil.length, 7).setValues(rawFadhil);
    countFadhil = rawFadhil.length;
  }

  // Seed Transaksi_Regyna jika masih kosong (hanya ada header)
  var shRegyna = ss.getSheetByName('Transaksi_Regyna');
  if (shRegyna && shRegyna.getLastRow() <= 1) {
    var rawRegyna = [
      ['tx_r01', '2026-10-25', 'Pemasukan', 'Gaji/Pemasukan', 400000, 'uang jajan', '2026-10-17 14:00'],
      ['tx_r02', '2026-10-25', 'Pengeluaran', 'Lainnya', 33500, 'hshs', '2026-10-17 14:00'],
      ['tx_r03', '2026-10-25', 'Pengeluaran', 'Lainnya', 15000, 'shshhs', '2026-10-17 14:00'],
      ['tx_r04', '2026-10-25', 'Pengeluaran', 'Makan Pribadi', 20000, 'shshhdhd', '2026-10-17 14:00'],
      ['tx_r05', '2026-10-20', 'Pengeluaran', 'Lainnya', 20000, 'udang keduuu', '2026-10-20 14:00'],
      ['tx_r06', '2026-10-23', 'Pengeluaran', 'Makan Pribadi', 15000, 'geprek matahhh', '2026-10-23 13:00']
    ];
    shRegyna.getRange(2, 1, rawRegyna.length, 7).setValues(rawRegyna);
    countRegyna = rawRegyna.length;
  }

  if (countFadhil > 0 || countRegyna > 0) {
    return 'Data manual berhasil diimpor:\n- Transaksi Fadhil: ' + countFadhil + ' baris\n- Transaksi Regyna: ' + countRegyna + ' baris';
  }
  return '';
}

function rapikanSpreadsheet() {
  try {
    var ss = getSpreadsheet_();
    var schema = getDbSchema_();
    var names = Object.keys(schema);

    names.forEach(function (name) {
      var sh = ss.getSheetByName(name);
      if (sh) {
        formatSheet_(sh, schema[name]);
      }
    });

    try {
      SpreadsheetApp.getUi().alert('Rapikan Spreadsheet', 'Semua sheet berhasil dirapikan dan diformat autofit.\n\nBy - Fadhil', SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {
      ss.toast('Spreadsheet dirapikan. By - Fadhil', 'Rapikan Spreadsheet', 5);
    }
  } catch (err) {
    throw new Error('Gagal merapikan spreadsheet: ' + err.message);
  }
}

function formatSheet_(sh, cols) {
  var n = cols.length;
  var rows = Math.max(sh.getMaxRows(), 2);
  
  // Header style: dark teal #0f766e, bold, putih, rata tengah
  sh.getRange(1, 1, 1, n)
    .setFontWeight('bold')
    .setBackground('#0f766e')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sh.setRowHeight(1, 34);
  sh.setFrozenRows(1);

  cols.forEach(function (c, i) {
    var r = sh.getRange(2, i + 1, rows - 1, 1).setVerticalAlignment('middle');
    if (c.type === 'date') r.setNumberFormat('yyyy-mm-dd');
    else if (c.type === 'datetime') r.setNumberFormat('yyyy-mm-dd hh:mm');
    else if (c.type === 'number') r.setNumberFormat('#,##0.##');
    else if (c.type === 'currency') r.setNumberFormat('"Rp" #,##0');
    else if (c.type === 'longtext') r.setWrap(true);
    else if (c.type === 'text') r.setNumberFormat('@');
  });

  if (sh.getFilter()) {
    sh.getFilter().remove();
  }
  sh.getRange(1, 1, Math.max(sh.getLastRow(), 2), n).createFilter();

  sh.autoResizeColumns(1, n);
  for (var i = 1; i <= n; i++) {
    var w = sh.getColumnWidth(i);
    if (w < 95) sh.setColumnWidth(i, 95);
    if (w > 360) sh.setColumnWidth(i, 360);
  }
}

function removeDefaultSheets_(ss, activeNames) {
  var defaultNames = ['Sheet1', 'Lembar1'];
  defaultNames.forEach(function (def) {
    if (activeNames.indexOf(def) === -1) {
      var sh = ss.getSheetByName(def);
      if (sh && ss.getSheets().length > activeNames.length) {
        try {
          ss.deleteSheet(sh);
        } catch (e) {}
      }
    }
  });
}
