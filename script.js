import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, setDoc,
  onSnapshot, query, orderBy, serverTimestamp, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---- Firebase init ----
const firebaseConfig = {
  apiKey: "AIzaSyBurwSv5x-7lms6Zcy-SIJYLfHxhtLMdfA",
  authDomain: "istetatil-6b58e.firebaseapp.com",
  projectId: "istetatil-6b58e",
  storageBucket: "istetatil-6b58e.firebasestorage.app",
  messagingSenderId: "446690901913",
  appId: "1:446690901913:web:c10cf72e5d69ed57a0dd08",
  measurementId: "G-FL58T13YQ6"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---- Elemanlar ----
const loginScreen = document.getElementById('loginScreen');
const appScreen = document.getElementById('appScreen');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const navUser = document.getElementById('navUser');
const logoutBtn = document.getElementById('logoutBtn');
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const adminToggleItem = document.getElementById('adminToggleItem');
const adminTogglePill = document.getElementById('adminTogglePill');
const notesMenuItem = document.getElementById('notesMenuItem');
const sectionsMenuItem = document.getElementById('sectionsMenuItem');
const depoMenuItem = document.getElementById('depoMenuItem');
const sectionsModalOverlay = document.getElementById('sectionsModalOverlay');
const sectionsList = document.getElementById('sectionsList');
const sectionsCloseBtn = document.getElementById('sectionsCloseBtn');
const depoPassOverlay = document.getElementById('depoPassOverlay');
const depoPassInput = document.getElementById('depoPassInput');
const depoPassError = document.getElementById('depoPassError');
const depoPassCancelBtn = document.getElementById('depoPassCancelBtn');
const depoPassOkBtn = document.getElementById('depoPassOkBtn');
const depoViewOverlay = document.getElementById('depoViewOverlay');
const depoList = document.getElementById('depoList');
const depoViewCloseBtn = document.getElementById('depoViewCloseBtn');
const depoSearchInput = document.getElementById('depoSearchInput');
const codeInput = document.getElementById('codeInput');
const suppliersMenuItem = document.getElementById('suppliersMenuItem');
const suppliersModalOverlay = document.getElementById('suppliersModalOverlay');
const suppliersList = document.getElementById('suppliersList');
const suppliersCloseBtn = document.getElementById('suppliersCloseBtn');
const activeSupplierLabel = document.getElementById('activeSupplierLabel');
const istyaFields = document.getElementById('istyaFields');
const ottoFields = document.getElementById('ottoFields');
const ottoTitleInput = document.getElementById('ottoTitleInput');
const ottoProgramInput = document.getElementById('ottoProgramInput');
const ottoExtraContainer = document.getElementById('ottoExtraContainer');
const ottoExtraCountLabel = document.getElementById('ottoExtraCount');
const ottoExtraMinusBtn = document.getElementById('ottoExtraMinusBtn');
const ottoExtraPlusBtn = document.getElementById('ottoExtraPlusBtn');
const ottoSourceInput = document.getElementById('ottoSourceInput');
const ottoParseBtn = document.getElementById('ottoParseBtn');

const sidebar = document.getElementById('sidebar');
const resetBtn = document.getElementById('resetBtn');

const titleInput = document.getElementById('titleInput');
const programInput = document.getElementById('programInput');
const lastDayExtraInput = document.getElementById('lastDayExtraInput');
const dahilVarInput = document.getElementById('dahilVarInput');
const dahilYokInput = document.getElementById('dahilYokInput');

const btnTurBasligi = document.getElementById('btnTurBasligi');
const btnGeceleme = document.getElementById('btnGeceleme');
const btnUlasim = document.getElementById('btnUlasim');
const btnKonaklama = document.getElementById('btnKonaklama');
const btnZiyaret = document.getElementById('btnZiyaret');
const btnKalkis = document.getElementById('btnKalkis');
const starButtons = document.querySelectorAll('.star-btn');
const noteMatchArea = document.getElementById('noteMatchArea');
const umreGidisRow = document.getElementById('umreGidisRow');
const umreDonusRow = document.getElementById('umreDonusRow');

const btnDahil = document.getElementById('btnDahil');
const btnDahilDegil = document.getElementById('btnDahilDegil');
const dahilExtraRow = document.getElementById('dahilExtraRow');

const programDays = document.getElementById('programDays');

const notesModalOverlay = document.getElementById('notesModalOverlay');
const notesCloseBtn = document.getElementById('notesCloseBtn');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const noteSearchInput = document.getElementById('noteSearchInput');

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const noteTitleInput = document.getElementById('noteTitleInput');
const noteContentInput = document.getElementById('noteContentInput');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');

const adminModalOverlay = document.getElementById('adminModalOverlay');
const adminModalTitle = document.getElementById('adminModalTitle');
const adminTextInput = document.getElementById('adminTextInput');
const adminCancelBtn = document.getElementById('adminCancelBtn');
const adminSaveBtn = document.getElementById('adminSaveBtn');

const confirmOverlay = document.getElementById('confirmOverlay');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

// ---- Durum ----
let notes = [];
let editingId = null;
let pendingDeleteId = null;
let unsubscribeNotes = null;
let unsubscribeAdmin = null;
let adminMode = false;
let adminTexts = {}; // key -> text
let adminEditingKey = null;
let activeSection = '0';
let hiddenSections = [];
let unsubscribeSettings = null;
let depoData = [];
let unsubscribeDepo = null;
let currentSupplier = 'istya'; // 'istya' | 'otto'
let ottoExtraCount = 1;
let selectedStars = new Set();

const SUPPLIERS = [
  { key: 'istya', label: 'İstya' },
  { key: 'otto', label: 'Otto' }
];

const SECTION_LABELS = {
  '0': '🏠 Form',
  '1': 'Tur Detayı',
  '2': 'Tarihler',
  '3': 'Dahil - Hariç',
  '4': 'Program',
  '5': 'Fotoğraf',
  '6': 'Yorumlar',
  '7': 'SEO',
  '8': 'Kategori'
};

const ACTIVE_SECTIONS = ['0', '1', '3', '4'];

// Umre / Dahil-Hariç buton tanımları
const UMRE_GIDIS_KEYS = [
  { key: 'umre_gidis_yurtici', label: 'Yurtiçi' },
  { key: 'umre_gidis_yurtdisi', label: 'Yurtdışı' },
  { key: 'umre_gidis_gemi', label: 'Gemi' }
];
const UMRE_DONUS_KEYS = [
  { key: 'umre_donus_yurtici', label: 'Yurtiçi' },
  { key: 'umre_donus_yurtdisi', label: 'Yurtdışı' },
  { key: 'umre_donus_gemi', label: 'Gemi' }
];
const DAHIL_EXTRA_KEYS = [
  { key: 'dahil_notlar', label: 'Notlar' },
  { key: 'dahil_vize', label: 'Vize Bilgisi' },
  { key: 'dahil_iptal', label: 'İptal Şartları' }
];

// ==================== AUTH ====================
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  loginError.textContent = '';
  if (!email || !pass) { loginError.textContent = 'E-posta ve şifre gerekli.'; return; }
  loginBtn.disabled = true;
  loginBtn.textContent = 'Giriş yapılıyor…';
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (e) {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Giriş Yap';
    const msgs = {
      'auth/invalid-credential': 'E-posta veya şifre hatalı.',
      'auth/user-not-found': 'Bu e-posta kayıtlı değil.',
      'auth/wrong-password': 'Şifre hatalı.',
      'auth/too-many-requests': 'Çok fazla deneme. Lütfen bekleyin.',
      'auth/invalid-email': 'Geçersiz e-posta formatı.'
    };
    loginError.textContent = msgs[e.code] || 'Giriş başarısız: ' + e.message;
  }
});
passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') loginBtn.click(); });

logoutBtn.addEventListener('click', async () => {
  if (unsubscribeNotes) unsubscribeNotes();
  if (unsubscribeAdmin) unsubscribeAdmin();
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginScreen.style.display = 'none';
    appScreen.style.display = 'block';
    navUser.textContent = user.email;
    loginBtn.disabled = false;
    loginBtn.textContent = 'Giriş Yap';
   startListeningNotes();
    startListeningAdminTexts();
    startListeningSettings();
    startListeningDepo();
    renderUmreButtons();
    renderDahilExtraButtons();
    renderSuppliersList();
    suppliersModalOverlay.classList.add('open');
  } else {
    loginScreen.style.display = 'flex';
    appScreen.style.display = 'none';
    if (unsubscribeNotes) unsubscribeNotes();
    if (unsubscribeAdmin) unsubscribeAdmin();
    if (unsubscribeSettings) unsubscribeSettings();
    if (unsubscribeDepo) unsubscribeDepo();
    notes = [];
    hiddenSections = [];
    depoData = [];
    notesList.innerHTML = '<div class="loading-notes">Yükleniyor…</div>';
  }
});

// ==================== MENU / ADMIN TOGGLE ====================
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menuDropdown.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!menuDropdown.contains(e.target) && e.target !== menuBtn) {
    menuDropdown.classList.remove('open');
  }
});
adminToggleItem.addEventListener('click', () => {
  adminMode = !adminMode;
  adminTogglePill.classList.toggle('on', adminMode);
  renderUmreButtons();
  renderDahilExtraButtons();
});
notesMenuItem.addEventListener('click', () => {
  menuDropdown.classList.remove('open');
  openNotesModal();
});
sectionsMenuItem.addEventListener('click', () => {
  menuDropdown.classList.remove('open');
  renderSectionsList();
  sectionsModalOverlay.classList.add('open');
});
sectionsCloseBtn.addEventListener('click', () => sectionsModalOverlay.classList.remove('open'));
sectionsModalOverlay.addEventListener('click', (e) => { if (e.target === sectionsModalOverlay) sectionsModalOverlay.classList.remove('open'); });

depoMenuItem.addEventListener('click', () => {
  menuDropdown.classList.remove('open');
  depoPassInput.value = '';
  depoPassError.textContent = '';
  depoPassOverlay.classList.add('open');
  setTimeout(() => depoPassInput.focus(), 50);
});
depoPassCancelBtn.addEventListener('click', () => depoPassOverlay.classList.remove('open'));
depoPassOverlay.addEventListener('click', (e) => { if (e.target === depoPassOverlay) depoPassOverlay.classList.remove('open'); });
depoPassInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') depoPassOkBtn.click(); });
depoPassOkBtn.addEventListener('click', () => {
  if (depoPassInput.value === '8761') {
    depoPassOverlay.classList.remove('open');
    depoSearchInput.value = '';
    renderDepoList();
    depoViewOverlay.classList.add('open');
  } else {
    depoPassError.textContent = 'Şifre hatalı.';
  }
});
depoViewCloseBtn.addEventListener('click', () => depoViewOverlay.classList.remove('open'));
depoViewOverlay.addEventListener('click', (e) => { if (e.target === depoViewOverlay) depoViewOverlay.classList.remove('open'); });
depoSearchInput.addEventListener('input', renderDepoList);
suppliersMenuItem.addEventListener('click', () => {
  menuDropdown.classList.remove('open');
  renderSuppliersList();
  suppliersModalOverlay.classList.add('open');
});
suppliersCloseBtn.addEventListener('click', () => suppliersModalOverlay.classList.remove('open'));
suppliersModalOverlay.addEventListener('click', (e) => { if (e.target === suppliersModalOverlay) suppliersModalOverlay.classList.remove('open'); });

function renderSuppliersList() {
  suppliersList.innerHTML = '';
  SUPPLIERS.forEach(s => {
    const row = document.createElement('div');
    row.className = 'menu-item supplier-row';
    const span = document.createElement('span');
    span.textContent = s.label;
    row.appendChild(span);
    if (s.key === currentSupplier) {
      const check = document.createElement('span');
      check.textContent = '✓';
      row.appendChild(check);
    }
    row.addEventListener('click', () => {
      setSupplier(s.key);
      suppliersModalOverlay.classList.remove('open');
    });
    suppliersList.appendChild(row);
  });
}

function setSupplier(key) {
  currentSupplier = key;
  activeSupplierLabel.textContent = SUPPLIERS.find(s => s.key === key).label;
  istyaFields.style.display = key === 'istya' ? '' : 'none';
  ottoFields.style.display = key === 'otto' ? '' : 'none';
  updateAll();
}

ottoExtraMinusBtn.addEventListener('click', () => {
  if (ottoExtraCount > 1) { ottoExtraCount--; renderOttoExtraFields(); updateAll(); }
});
ottoExtraPlusBtn.addEventListener('click', () => {
  ottoExtraCount++; renderOttoExtraFields(); updateAll();
});

function renderOttoExtraFields() {
  ottoExtraCountLabel.textContent = ottoExtraCount;
  const existingValues = Array.from(ottoExtraContainer.querySelectorAll('textarea')).map(t => t.value);
  ottoExtraContainer.innerHTML = '';
  for (let i = 0; i < ottoExtraCount; i++) {
    const field = document.createElement('div');
    field.className = 'form-field';
    const label = document.createElement('label');
    label.textContent = (i + 1) + '. Son Gün Ek Metni';
    const ta = document.createElement('textarea');
    ta.value = existingValues[i] || '';
    ta.addEventListener('input', updateAll);
    field.appendChild(label);
    field.appendChild(ta);
    ottoExtraContainer.appendChild(field);
  }
}
ottoTitleInput.addEventListener('input', updateAll);
ottoProgramInput.addEventListener('input', updateAll);
renderOttoExtraFields();
function flashField(el) {
  el.classList.add('field-filled');
  setTimeout(() => el.classList.remove('field-filled'), 1000);
}

function extractAvantajBlocks(text) {
  const results = [];
  const headerRe = /AVANTAJLI[^\n]*PAKET[İI]/gi;
  const headerMatches = [];
  let match;
  while ((match = headerRe.exec(text)) !== null) {
    headerMatches.push({ text: match[0], index: match.index });
  }
  headerMatches.forEach((h, i) => {
    const start = h.index;
    const end = (i + 1 < headerMatches.length) ? headerMatches[i + 1].index : text.length;
    let block = text.slice(start, end);

    const stopMatch = block.match(/Fiyata\s*Dahil\s*Olan\s*Hizmetler/i);
    if (stopMatch) block = block.slice(0, stopMatch.index);

    const tumMatch = block.match(/T[ÜU]M[^\n]*DAH[İI]L[^\n]*/i);
    const tumLine = tumMatch ? tumMatch[0].trim() : '';

    const packageMatch = block.match(/^.*Turu.*\+.*Turu.*$/im);
    const packageLine = packageMatch ? packageMatch[0].trim() : '';

    const yetiskinIdx = block.search(/YET[İI]ŞK[İI]N/i);
    let price = '';
    if (yetiskinIdx !== -1) {
      const afterYetiskin = block.slice(yetiskinIdx);
      const priceMatch = afterYetiskin.match(/YER[İI]NE\s*([\d.,]+\s*€?)/i);
      if (priceMatch) price = priceMatch[1].trim();
    }

    const headerLine = price ? (h.text + ' ' + price) : h.text;
    results.push([headerLine, '', tumLine, packageLine].join('\n'));
  });
  return results;
}

function parseOttoSource(text) {
  if (!text.trim()) return;

  // Başlık: "Tur Arama Sonuçları" ifadesinden sonra gelen kısım
  let title = '';
  const titleMatch = text.match(/Tur\s*Arama\s*Sonuçları\s*(.+)/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  } else {
    // yedek yöntem: art arda tekrar eden ilk satır çifti
    const lines = text.replace(/\r/g, '').split(/\n+/).map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i] && lines[i] === lines[i + 1]) { title = lines[i]; break; }
    }
  }
  if (title) {
    ottoTitleInput.value = title;
    flashField(ottoTitleInput);
  }

  // Program: ilk "N. GÜN" ile "Tarih Alternatifi" arası
  const dayStart = text.search(/1\s*\.?\s*g[üu]n\b/i);
  if (dayStart !== -1) {
    const afterStart = text.slice(dayStart);
    const endMatch = afterStart.search(/tarih\s*alternatif/i);
    const programChunk = endMatch !== -1 ? afterStart.slice(0, endMatch) : afterStart;
    ottoProgramInput.value = programChunk.trim();
    flashField(ottoProgramInput);
  }

  // Fiyata Dahil Olan Hizmetler
  const dahilVarMatch = text.match(/Fiyata\s*Dahil\s*Olan\s*Hizmetler([\s\S]*?)Fiyata\s*Dahil\s*Olmayan\s*Hizmetler/i);
  if (dahilVarMatch) {
    let dahilVarText = dahilVarMatch[1].trim();
    dahilVarText = dahilVarText.replace(/^F[İI]YATA[^\n]*\n+/i, '').trim();
    dahilVarInput.value = dahilVarText;
    flashField(dahilVarInput);
  }

  // Fiyata Dahil Olmayan Hizmetler
  const dahilYokMatch = text.match(/Fiyata\s*Dahil\s*Olmayan\s*Hizmetler([\s\S]*?)(Ekstra\s*Turlar|Alternatifler|$)/i);
  if (dahilYokMatch) {
    let dahilYokText = dahilYokMatch[1].trim();
    dahilYokText = dahilYokText.replace(/^F[İI]YATA[^\n]*\n+/i, '').trim();
    dahilYokInput.value = dahilYokText;
    flashField(dahilYokInput);
  }

  // Yıldız tespiti
  const starLineMatch = text.match(/((?:\d\s*(?:VE|,|\/)?\s*)+)Y[İI]LDIZLI\s*OTELLER/i);
  if (starLineMatch) {
    const starNums = starLineMatch[1].match(/\d/g) || [];
    selectedStars.clear();
    starButtons.forEach(b => b.classList.remove('selected'));
    starNums.forEach(starNum => {
      const btn = Array.from(starButtons).find(b => b.dataset.star === starNum);
      if (btn) { btn.classList.add('selected'); selectedStars.add(starNum); }
    });
  }

  const avantajBlocks = extractAvantajBlocks(text);
  if (avantajBlocks.length) {
    ottoExtraCount = avantajBlocks.length;
    renderOttoExtraFields();
    const textareas = ottoExtraContainer.querySelectorAll('textarea');
    avantajBlocks.forEach((val, i) => {
      if (textareas[i]) textareas[i].value = val;
    });
    flashField(ottoExtraContainer);
  }

  updateAll();
}

ottoParseBtn.addEventListener('click', () => {
  parseOttoSource(ottoSourceInput.value);
});

// ---- Yıldız Seç ----
starButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const star = btn.dataset.star;
    if (selectedStars.has(star)) {
      selectedStars.delete(star);
      btn.classList.remove('selected');
    } else {
      selectedStars.add(star);
      btn.classList.add('selected');
    }
  });
});

btnKonaklama.addEventListener('click', () => {
  if (!selectedStars.size) { alert('Lütfen en az bir yıldız seçin.'); return; }
  const sorted = Array.from(selectedStars).sort((a, b) => a - b);
  const text = sorted.map(s => s + '*').join(', ') + ' Oteller';
  copyPlain(text, btnKonaklama);
});

// ==================== SIDEBAR NAV ====================
sidebar.querySelectorAll('.sec-item').forEach(item => {
  item.addEventListener('click', () => {
    const sec = item.dataset.sec;
    if (!ACTIVE_SECTIONS.includes(sec)) return;
    activeSection = sec;
    sidebar.querySelectorAll('.sec-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + sec).classList.add('active');
  });
});

function setDot(sec, color) {
  const d = document.getElementById('dot-' + sec);
  if (!d) return;
  d.classList.remove('red', 'orange', 'green', 'gray');
  d.classList.add(color);
}

// ==================== KOPYALAMA YARDIMCILARI ====================
function startListeningSettings() {
  unsubscribeSettings = onSnapshot(doc(db, 'settings', 'hiddenSections'), (snap) => {
    hiddenSections = (snap.exists() && snap.data().sections) || [];
    applyHiddenSections();
    renderSectionsList();
  }, (err) => console.error('Ayarlar yüklenemedi:', err.message));
}

function applyHiddenSections() {
  sidebar.querySelectorAll('.sec-item').forEach(item => {
    const sec = item.dataset.sec;
    item.style.display = hiddenSections.includes(sec) ? 'none' : '';
  });
}

function renderSectionsList() {
  sectionsList.innerHTML = '';
  Object.keys(SECTION_LABELS).forEach(sec => {
    const isHidden = hiddenSections.includes(sec);
    const row = document.createElement('div');
    row.className = 'menu-item';
    row.style.cursor = 'default';
    const span = document.createElement('span');
    span.textContent = SECTION_LABELS[sec];
    row.appendChild(span);
    const btn = document.createElement('button');
    btn.className = 'action-btn ' + (isHidden ? 'green' : 'red');
    btn.style.margin = '0';
    btn.textContent = isHidden ? 'Göster' : 'Gizle';
    btn.addEventListener('click', () => toggleSectionHidden(sec));
    row.appendChild(btn);
    sectionsList.appendChild(row);
  });
}

async function toggleSectionHidden(sec) {
  const updated = hiddenSections.includes(sec)
    ? hiddenSections.filter(s => s !== sec)
    : [...hiddenSections, sec];
  try {
    await setDoc(doc(db, 'settings', 'hiddenSections'), { sections: updated });
  } catch (e) {
    alert('Kaydedilemedi: ' + e.message);
  }
}

function flashBtn(btn) {
  const orig = btn.textContent;
  const wasGreen = btn.classList.contains('green');
  btn.textContent = '✓ Kopyalandı';
  setTimeout(() => { btn.textContent = orig; }, 1300);
}

async function copyPlain(text, btn) {
  if (!text) return;
  try { await navigator.clipboard.writeText(text); if (btn) flashBtn(btn); }
  catch (e) { alert('Kopyalanamadı: ' + e.message); }
}

async function copyRich(html, plain, btn) {
  if (!plain && !html) return;
  try {
    if (window.ClipboardItem) {
      const item = new ClipboardItem({
        'text/html': new Blob([html || plain], { type: 'text/html' }),
        'text/plain': new Blob([plain || html.replace(/<[^>]+>/g, '')], { type: 'text/plain' })
      });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(plain || html.replace(/<[^>]+>/g, ''));
    }
    if (btn) flashBtn(btn);
  } catch (e) {
    try { await navigator.clipboard.writeText(plain || ''); if (btn) flashBtn(btn); }
    catch (e2) { alert('Kopyalanamadı: ' + e2.message); }
  }
}

// ==================== BAŞ HARF BÜYÜTME ====================
function toTitleCaseStr(text) {
  return text.replace(/\S+/g, (word) => {
    let i = 0;
    while (i < word.length && !/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(word[i])) i++;
    if (i >= word.length) return word;
    return word.slice(0, i)
      + word[i].toLocaleUpperCase('tr-TR')
      + word.slice(i + 1).toLocaleLowerCase('tr-TR');
  });
}

// ==================== ULAŞIM (HAVAYOLU) TESPİTİ ====================
function extractAirline(text) {
  const m = text.match(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+[Hh]ava\s*[Yy]olları/);
  if (!m) return null;
  const phrase = m[1] + ' Hava Yolları';
  return toTitleCaseStr(phrase);
}
// ---- OTTO: Tur Başlığı büyük/küçük harf (parantez ve kış/yaz istisnası) ----
function toTitleCaseOtto(text) {
  const m = text.match(/^([\s\S]*?)(\([^()]*\)\s*)$/);
  if (!m) return toTitleCaseStr(text);
  const before = m[1];
  const parenPart = m[2];
  const wordMatch = before.match(/(\S+)(\s*)$/);
  if (!wordMatch) return toTitleCaseStr(before) + parenPart;
  const lastWord = wordMatch[1];
  const trailingSpace = wordMatch[2];
  const rest = before.slice(0, before.length - wordMatch[0].length);
  const isSeasonWord = /^(kış|yaz)$/i.test(lastWord);
  const restFormatted = toTitleCaseStr(rest);
  const lastWordFormatted = isSeasonWord ? toTitleCaseStr(lastWord) : lastWord;
  return restFormatted + lastWordFormatted + trailingSpace + parenPart;
}

// ---- OTTO: Fiyata Dahil ilk maddesinden "Hava Yolu" tespiti ----
function extractOttoAirline() {
  const items = dahilVarInput.value.split(/\n/)
    .map(l => l.replace(/^[-•*\u2022]\s*/, '').trim())
    .filter(Boolean);
  const firstItem = items[0] || '';
  if (!firstItem) return null;
  const m = firstItem.match(/([A-Za-zÇĞİÖŞÜçğıöşü]+)\s*(hava\s*yollar[ıi]|hava\s*yolu)/i);
  if (!m) return null;
  return toTitleCaseStr(m[1] + ' ' + m[2]);
}

// ==================== ZİYARET EDİLECEK YERLER ====================
const EXCLUDED_CITIES = ['istanbul', 'ankara', 'adana', 'diyarbakır', 'izmir'];

// ==================== KALKIŞ ŞEHRİ TESPİTİ ====================
const TR_CITIES = ['Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'];
const TR_CITIES_LOWER = TR_CITIES.map(c => c.toLocaleLowerCase('tr-TR'));

function extractDepartureCity(text) {
  if (!text.trim()) return null;
  const dayRe = /(\d+)\s*\.?\s*g[üu]n\b/i;
  const m = text.match(dayRe);
  if (!m) return null;
  const rest = text.slice(m.index + m[0].length);
  const firstLine = (rest.split(/\n+/).map(l => l.trim()).filter(Boolean)[0]) || '';
  const tokens = firstLine.split(/[-–—/]+/).map(t => t.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, '').trim()).filter(Boolean);
  for (const t of tokens) {
    const key = t.toLocaleLowerCase('tr-TR');
    const idx = TR_CITIES_LOWER.indexOf(key);
    if (idx !== -1) return toTitleCaseStr(TR_CITIES[idx]);
  }
  return null;
}

function extractVisitedPlaces(text) {
  if (!text.trim()) return [];
  const lines = text.replace(/\r/g, '').split(/\n+/);
  const dayLineRe = /(\d+)\s*\.?\s*g[üu]n\b/i;
  const seen = new Set();
  const result = [];
  lines.forEach(line => {
    const m = line.match(dayLineRe);
    if (!m) return;
    let rest = line.slice(m.index + m[0].length);
    const dateMatch = rest.match(DATE_RE);
    if (dateMatch) rest = rest.slice(0, dateMatch.index);
    const tokens = rest.split(/[-–—/]/).map(t => t.trim()).filter(Boolean);
    tokens.forEach(t => {
      const key = t.toLocaleLowerCase('tr-TR');
      if (!key || EXCLUDED_CITIES.includes(key) || seen.has(key)) return;
      seen.add(key);
      result.push(toTitleCaseStr(t));
    });
  });
  return result;
}

// ==================== NOT EŞLEŞMESİ (Tur Başlığı kutusu) ====================
function findMatchingNotes(text) {
  if (!text.trim()) return [];
  const words = text.toLocaleLowerCase('tr-TR')
    .split(/[^a-zA-ZçğıöşüÇĞİÖŞÜ0-9]+/)
    .filter(Boolean);
  if (!words.length) return [];
  const matched = notes.filter(n => words.includes((n.title || '').toLocaleLowerCase('tr-TR')));
  const seen = new Set();
  return matched.filter(n => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
}
// ==================== PROGRAM AYRIŞTIRMA ====================
const DATE_RE = /((\d{1,2}[./]\d{1,2}[./]\d{2,4})|((\d{1,2}\s+)?(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s*\d{0,4})|((Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar)))/i;

function flowText(str) {
  // düz metne çevir: satır sonlarını boşluğa çevir, fazla boşlukları temizle
  return str
    .replace(/\r/g, '')
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function preserveLines(str) {
  // satır sonlarını koru, sadece boş satırları ve baştaki/sondaki boşlukları temizle
  return str
    .replace(/\r/g, '')
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean)
    .join('\n');
}

function parseProgram(text) {
  if (!text.trim()) return [];
  const dayRe = /(\d+)\s*\.?\s*g[üu]n\b/gi;
  const markers = [];
  let m;
  while ((m = dayRe.exec(text)) !== null) {
    markers.push({ day: m[1], index: m.index, end: m.index + m[0].length });
  }
  if (!markers.length) return [];
  const days = [];
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].end;
    const stop = (i + 1 < markers.length) ? markers[i + 1].index : text.length;
    const block = text.slice(start, stop);
    const dateMatch = block.match(DATE_RE);
    let aciklama = '', icerik = '';
 if (dateMatch) {
      aciklama = block.slice(0, dateMatch.index).trim();
      icerik = block.slice(dateMatch.index + dateMatch[0].length).trim();
      icerik = icerik.replace(/^[^a-zA-ZçğıöşüÇĞİÖŞÜ]+/, '');
    } else {
      aciklama = block.trim();
      icerik = '';
    }
    days.push({ day: markers[i].day, aciklama, icerik: preserveLines(icerik) });
  }
  return days;
}

// ==================== OTTO PROGRAM GÜN AYRIŞTIRMA ====================
function parseOttoProgram(text) {
  if (!text.trim()) return [];
  const dayRe = /(\d+)\s*\.?\s*g[üu]n\b/gi;
  const markers = [];
  let m;
  while ((m = dayRe.exec(text)) !== null) {
    markers.push({ day: m[1], index: m.index, end: m.index + m[0].length });
  }
  if (!markers.length) return [];
  const days = [];
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].end;
    const stop = (i + 1 < markers.length) ? markers[i + 1].index : text.length;
    const block = text.slice(start, stop).trim();
    const lines = block.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const title = lines[0] || '';
    const content = lines.slice(1).join(' ').replace(/\s{2,}/g, ' ').trim();
    days.push({ day: markers[i].day, title, content });
  }
  return days;
}

// ==================== DAHIL / DAHIL DEĞİL AYRIŞTIRMA ====================
function parseDahilVar(text) {
  if (!text.trim()) return { found: false, html: '', plain: '' };
  const items = text.split(/\n/)
    .map(l => l.replace(/^[-•*\u2022]\s*/, '').trim())
    .filter(Boolean);
  if (!items.length) return { found: false, html: '', plain: '' };
  const plain = items.map(i => '• ' + i).join('\n');
  const html = '<ul>' + items.map(i => `<li>${escHtml(i)}</li>`).join('') + '</ul>';
  return { found: true, html, plain };
}

const DAHIL_YOK_BOLD_RE = /zorunlu|vergiler[ıi]|vergiler|vergi|tur\s*rehberine\s*ödenecektir/i;

function parseDahilYok(text) {
  if (!text.trim()) return { found: false, html: '', plain: '' };
  const items = text.split(/\n/)
    .map(l => l.replace(/^[-•*\u2022]\s*/, '').trim())
    .filter(Boolean);
  if (!items.length) return { found: false, html: '', plain: '' };
  const plain = items.map(i => (DAHIL_YOK_BOLD_RE.test(i) ? '• ' + i.toUpperCase() : '• ' + i)).join('\n');
  const html = '<ul>' + items.map(i => {
    const esc = escHtml(i);
    return DAHIL_YOK_BOLD_RE.test(i) ? `<li><b>${esc}</b></li>` : `<li>${esc}</li>`;
  }).join('') + '</ul>';
  return { found: true, html, plain };
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function escHtmlBr(str) {
  return escHtml(str).replace(/\n/g, '<br>');
}

// ==================== CANLI GÜNCELLEME / RENDER ====================
function renderNoteMatch() {
  const matches = findMatchingNotes(titleInput.value);
  noteMatchArea.innerHTML = '';
  if (!matches.length) return;
  matches.forEach(note => {
    const div = document.createElement('div');
    div.className = 'search-note';
    div.innerHTML = `<h4>📌 ${escHtml(note.title)}</h4><p>${escHtml(note.content || '')}</p>`;
    const copyB = document.createElement('button');
    copyB.className = 'action-btn';
    copyB.textContent = 'Açıklamayı Kopyala';
    copyB.addEventListener('click', () => copyPlain(note.content || '', copyB));
    div.appendChild(copyB);
    noteMatchArea.appendChild(div);
  });
}

function renderProgramDays() {
  if (currentSupplier === 'otto') {
    renderOttoProgramButton();
    return;
  }
  const days = parseProgram(programInput.value);
  programDays.innerHTML = '';
  if (!days.length) {
    programDays.innerHTML = '<div class="empty">Henüz program metni girilmedi.</div>';
    return;
  }
const extraRaw = lastDayExtraInput.value.trim();
  let extraHtml = '', extraPlain = '';
  if (extraRaw) {
    const rawLines = extraRaw.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const firstLine = rawLines[0] || '';
    const restLines = rawLines.slice(1);
    const restHtml = restLines.map(l => escHtml(l)).join('<br>');
    const restPlain = restLines.join('\n');
    extraHtml = `<div style="text-align:center;"><b>${escHtml(firstLine)}</b>${restHtml ? '<br>' + restHtml : ''}</div>`;
    extraPlain = firstLine + (restPlain ? '\n' + restPlain : '');
    extraHtml = extraHtml.slice(0, -6) + '<br>(Ekstra Turlar Bölgede Satın Alınmaktadır)</div>';
    extraPlain += '\n(Ekstra Turlar Bölgede Satın Alınmaktadır)';
  }

  days.forEach((d, idx) => {
    const isLast = idx === days.length - 1;
    const block = document.createElement('div');
    block.className = 'day-block';
    const title = document.createElement('div');
    title.className = 'day-title';
    title.textContent = d.day + '. Gün';
    block.appendChild(title);

    const row = document.createElement('div');
    row.className = 'btn-row';

    const aciklamaBtn = document.createElement('button');
    aciklamaBtn.className = 'action-btn';
    aciklamaBtn.textContent = 'Açıklama';
    aciklamaBtn.addEventListener('click', () => copyPlain(d.aciklama, aciklamaBtn));
    row.appendChild(aciklamaBtn);

    const icerikBtn = document.createElement('button');
    icerikBtn.className = 'action-btn';
    icerikBtn.textContent = 'İçerik';
    icerikBtn.addEventListener('click', () => {
    if (isLast && extraRaw) {
        const html = `<div style="text-align:justify;">${escHtml(d.icerik)}</div><br>${extraHtml}`;
        const plain = d.icerik + (extraPlain ? '\n\n' + extraPlain : '');
        copyRich(html, plain, icerikBtn);
      } else {
        copyRich(`<div style="text-align:justify;">${escHtml(d.icerik)}</div>`, d.icerik, icerikBtn);
      }
    });
    row.appendChild(icerikBtn);

    block.appendChild(row);
    programDays.appendChild(block);
  });
}
function renderOttoProgramButton() {
  programDays.innerHTML = '';
  const raw = ottoProgramInput.value;
  if (!raw.trim()) {
    programDays.innerHTML = '<div class="empty">Henüz program metni girilmedi.</div>';
    return;
  }
  const days = parseOttoProgram(raw);
  let htmlParts = [];
  let plainParts = [];
  if (days.length) {
    days.forEach(d => {
      htmlParts.push(
        `<div>${d.day}. GÜN ${escHtml(d.title)}</div>` +
        `<div style="text-align:justify;">${escHtml(d.content)}</div>`
      );
      plainParts.push(`${d.day}. GÜN ${d.title}\n${d.content}`);
    });
  } else {
    const programPlain = flowText(raw);
    htmlParts.push(`<div style="text-align:justify;">${escHtml(programPlain)}</div>`);
    plainParts.push(programPlain);
  }

  let hasOttoExtra = false;
  Array.from(ottoExtraContainer.querySelectorAll('textarea')).forEach(ta => {
    const raw2 = ta.value.trim();
    if (!raw2) return;
    hasOttoExtra = true;
    const rawLines = raw2.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const firstLine = rawLines[0] || '';
    const restLines = rawLines.slice(1);
    const restHtml = restLines.map(l => escHtml(l)).join('<br>');
    const restPlain = restLines.join('\n');
    htmlParts.push(`<div style="text-align:center;"><b>${escHtml(firstLine)}</b>${restHtml ? '<br>' + restHtml : ''}</div>`);
    plainParts.push(firstLine + (restPlain ? '\n' + restPlain : ''));
  });
  if (hasOttoExtra) {
    const lastIdx = htmlParts.length - 1;
    htmlParts[lastIdx] = htmlParts[lastIdx].slice(0, -6) + '<br>(Ekstra Turlar Bölgede Satın Alınmaktadır)</div>';
    plainParts[lastIdx] += '\n(Ekstra Turlar Bölgede Satın Alınmaktadır)';
  }

  const finalHtml = htmlParts.join('<br><br>');
  const finalPlain = plainParts.join('\n\n');

  const block = document.createElement('div');
  block.className = 'day-block';
  const btn = document.createElement('button');
  btn.className = 'action-btn';
  btn.textContent = 'Programı Kopyala';
  btn.addEventListener('click', () => copyRich(finalHtml, finalPlain, btn));
  block.appendChild(btn);
  programDays.appendChild(block);
}

function renderUmreButtons() {
  umreGidisRow.innerHTML = '';
  umreDonusRow.innerHTML = '';
  UMRE_GIDIS_KEYS.forEach(k => umreGidisRow.appendChild(buildAdminButton(k)));
  UMRE_DONUS_KEYS.forEach(k => umreDonusRow.appendChild(buildAdminButton(k)));
}
function renderDahilExtraButtons() {
  dahilExtraRow.innerHTML = '';
  DAHIL_EXTRA_KEYS.forEach(k => dahilExtraRow.appendChild(buildAdminButton(k)));
}

function buildAdminButton(k) {
  const wrap = document.createElement('span');
  wrap.style.display = 'inline-flex';
  wrap.style.alignItems = 'center';
  const data = adminTexts[k.key] || { html: '', plain: '' };
  const btn = document.createElement('button');
  btn.className = 'action-btn ' + (data.plain ? 'green' : 'red');
  btn.textContent = k.label;
  btn.addEventListener('click', () => {
    if (!data.plain) return;
    copyRich(data.html, data.plain, btn);
  });
  wrap.appendChild(btn);
  if (adminMode) {
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-mini';
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', () => openAdminModal(k.key, k.label, data));
    wrap.appendChild(editBtn);
  }
  return wrap;
}

function startListeningDepo() {
  unsubscribeDepo = onSnapshot(collection(db, 'depo'), (snapshot) => {
    depoData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    renderDepoList();
  }, (err) => console.error('Depo yüklenemedi:', err.message));
}

function renderDepoList() {
  const term = (depoSearchInput.value || '').toLocaleLowerCase('tr-TR').trim();
  depoList.innerHTML = '';
  let anyMatch = false;
  depoData.forEach(u => {
    const items = (u.texts || []).filter(t => {
      const val = (typeof t === 'string') ? t : (t.text || '');
      return !term || val.toLocaleLowerCase('tr-TR').includes(term);
    });
    if (!items.length) return;
    anyMatch = true;
    const group = document.createElement('div');
    group.className = 'day-block';
    const title = document.createElement('div');
    title.className = 'day-title';
    title.textContent = u.email || u.id;
    group.appendChild(title);
    items.forEach(t => {
      const val = (typeof t === 'string') ? t : (t.text || '');
      const dateStr = (typeof t === 'string') ? '' : (t.date || '');
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;font-size:14px;';
      const span = document.createElement('span');
      span.textContent = '• ' + val + (dateStr ? ' — ' + dateStr : '');
      row.appendChild(span);
      const copyB = document.createElement('button');
      copyB.className = 'action-btn';
      copyB.textContent = 'Kopyala';
      copyB.style.margin = '0';
      copyB.addEventListener('click', () => copyPlain(val, copyB));
      row.appendChild(copyB);
      group.appendChild(row);
    });
    depoList.appendChild(group);
  });
  if (!anyMatch) {
    depoList.innerHTML = '<div class="empty">Kayıt bulunamadı.</div>';
  }
}

async function saveToDepo(text) {
  if (!text || !auth.currentUser) return;
  const email = auth.currentUser.email;
  const dateStr = new Date().toLocaleString('tr-TR');
  try {
    await setDoc(doc(db, 'depo', email), {
      email: email,
      texts: arrayUnion({ text: text, date: dateStr })
    }, { merge: true });
  } catch (e) {
    console.error('Depo kaydedilemedi:', e.message);
  }
}

function computeStatuses() {
  // Bölüm 1
  let title;
  if (currentSupplier === 'otto') {
    title = ottoTitleInput.value.trim();
  } else {
    title = titleInput.value.trim();
  }
  const airline = extractOttoAirline();
  if (!title) setDot('1', 'red');
  else if (!airline) setDot('1', 'orange');
  else setDot('1', 'green');

// Bölüm 3
  const dahilVarSonuc = parseDahilVar(dahilVarInput.value);
  const dahilYokSonuc = parseDahilYok(dahilYokInput.value);
  if (!dahilVarSonuc.found && !dahilYokSonuc.found) setDot('3', 'red');
  else if (dahilVarSonuc.found && dahilYokSonuc.found) setDot('3', 'green');
  else setDot('3', 'orange');

  // Bölüm 4
  if (currentSupplier === 'otto') {
    setDot('4', ottoProgramInput.value.trim() ? 'green' : 'red');
  } else {
    const days = parseProgram(programInput.value);
    if (!days.length) setDot('4', 'red');
    else {
      const lastHasIcerik = days[days.length - 1].icerik.length > 0;
      setDot('4', lastHasIcerik ? 'green' : 'orange');
    }
  }
}

function updateAll() {
  renderNoteMatch();
  renderProgramDays();
  computeStatuses();
}

// ---- Form dinleyicileri ----
titleInput.addEventListener('input', updateAll);
programInput.addEventListener('input', updateAll);
lastDayExtraInput.addEventListener('input', updateAll);
dahilVarInput.addEventListener('input', updateAll);
dahilYokInput.addEventListener('input', updateAll);

// ---- Tur Başlığı / Ulaşım kopyalama ----
btnTurBasligi.addEventListener('click', () => {
  const val = currentSupplier === 'otto' ? toTitleCaseOtto(ottoTitleInput.value) : toTitleCaseStr(titleInput.value);
  copyPlain(val, btnTurBasligi);
});
btnUlasim.addEventListener('click', () => {
  const airline = extractOttoAirline();
  if (!airline) { alert('"Fiyata Dahil" kutusunda "Hava Yolu/Yolları" ifadesi bulunamadı.'); return; }
  copyPlain(airline, btnUlasim);
});

btnZiyaret.addEventListener('click', () => {
  const sourceText = currentSupplier === 'otto' ? ottoProgramInput.value : programInput.value;
  const places = extractVisitedPlaces(sourceText);
  if (!places.length) { alert('Program metninde bölge bulunamadı.'); return; }
  copyPlain(places.join(' - '), btnZiyaret);
});
btnKalkis.addEventListener('click', () => {
  const sourceText = currentSupplier === 'otto' ? ottoProgramInput.value : programInput.value;
  const city = extractDepartureCity(sourceText);
  if (!city) { alert('1. Gün metninde tanınan bir şehir bulunamadı.'); return; }
  copyPlain(city, btnKalkis);
});

btnGeceleme.addEventListener('click', () => {
  const sourceText = currentSupplier === 'otto' ? ottoProgramInput.value : programInput.value;
  const days = parseProgram(sourceText);
  if (!days.length) { alert('Program metni bulunamadı.'); return; }
  const gunSayisi = days.length;
  const geceSayisi = gunSayisi - 1;
  const text = `${geceSayisi} Gece ${gunSayisi} Gün`;
  copyPlain(text, btnGeceleme);
});

// ---- Dahil / Dahil Değil kopyalama ----
btnDahil.addEventListener('click', () => {
  const sonuc = parseDahilVar(dahilVarInput.value);
  if (!sonuc.found) { alert('"Fiyata Dahil" kutusu boş.'); return; }
  copyRich(sonuc.html, sonuc.plain, btnDahil);
});
btnDahilDegil.addEventListener('click', () => {
  const sonuc = parseDahilYok(dahilYokInput.value);
  if (!sonuc.found) { alert('"Fiyata Dahil Değil" kutusu boş.'); return; }
  copyRich(sonuc.html, sonuc.plain, btnDahilDegil);
});

// ==================== SIFIRLA ====================
resetBtn.addEventListener('click', () => {
  const kod = codeInput.value.trim();
  if (kod) saveToDepo(kod);
  codeInput.value = '';
  titleInput.value = '';
  programInput.value = '';
  lastDayExtraInput.value = '';
  dahilVarInput.value = '';
  dahilYokInput.value = '';
  ottoTitleInput.value = '';
  ottoProgramInput.value = '';
  ottoExtraCount = 1;
  renderOttoExtraFields();
  selectedStars.clear();
  starButtons.forEach(b => b.classList.remove('selected'));
  updateAll();
  // ilk bölüme dön
activeSection = '0';
  sidebar.querySelectorAll('.sec-item').forEach(i => i.classList.remove('active'));
  sidebar.querySelector('[data-sec="0"]').classList.add('active');
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-0').classList.add('active');
});

// ==================== FIRESTORE: NOTLAR ====================
function startListeningNotes() {
  const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
  unsubscribeNotes = onSnapshot(q, (snapshot) => {
    notes = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    renderNotesList();
    updateAll();
  }, (err) => {
    notesList.innerHTML = '<div class="empty">Notlar yüklenemedi: ' + err.message + '</div>';
  });
}

function renderNotesList() {
  notesList.innerHTML = '';
  const searchTerm = (noteSearchInput.value || '').toLocaleLowerCase('tr-TR').trim();
  let filtered = notes.filter(n => (n.title || '').toLocaleLowerCase('tr-TR').includes(searchTerm));
  filtered = filtered.slice().sort((a, b) => (a.title || '').localeCompare(b.title || '', 'tr-TR'));

  if (!filtered.length) {
    notesList.innerHTML = '<div class="empty">Not bulunamadı.</div>';
    return;
  }
  filtered.forEach(note => {
    const item = document.createElement('div');
    item.className = 'note-item';
    item.innerHTML = `
      <div class="note-body open">
        <span class="title">${escHtml(note.title)}</span>
        <p>${escHtml(note.content || '')}</p>
        <div class="note-actions">
          <button class="action-btn note-copy-btn" data-id="${note.id}">Kopyala</button>
          <button class="edit-btn" data-id="${note.id}">Düzenle</button>
          <button class="delete-btn" data-id="${note.id}">Sil</button>
        </div>
      </div>`;
    notesList.appendChild(item);
  });

  notesList.querySelectorAll('.note-copy-btn').forEach(b => {
    b.addEventListener('click', () => {
      const note = notes.find(n => n.id === b.dataset.id);
      copyPlain(note?.content || '', b);
    });
  });
  notesList.querySelectorAll('.edit-btn').forEach(b => {
    b.addEventListener('click', () => openNoteModal(b.dataset.id));
  });
  notesList.querySelectorAll('.delete-btn').forEach(b => {
    b.addEventListener('click', () => {
      pendingDeleteId = b.dataset.id;
      confirmOverlay.classList.add('open');
    });
  });
}

confirmYes.addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  confirmOverlay.classList.remove('open');
  try { await deleteDoc(doc(db, 'notes', pendingDeleteId)); }
  catch (e) { alert('Silinemedi: ' + e.message); }
  pendingDeleteId = null;
});
confirmNo.addEventListener('click', () => {
  confirmOverlay.classList.remove('open');
  pendingDeleteId = null;
});

function openNotesModal() {
  notesModalOverlay.classList.add('open');
  renderNotesList();
}
function closeNotesModal() {
  notesModalOverlay.classList.remove('open');
}
notesCloseBtn.addEventListener('click', closeNotesModal);
notesModalOverlay.addEventListener('click', (e) => { if (e.target === notesModalOverlay) closeNotesModal(); });
noteSearchInput.addEventListener('input', renderNotesList);

function openNoteModal(id) {
  editingId = id || null;
  if (id) {
    const note = notes.find(n => n.id === id);
    modalTitle.textContent = 'Notu Düzenle';
    noteTitleInput.value = note.title || '';
    noteContentInput.value = note.content || '';
  } else {
    modalTitle.textContent = 'Yeni Not';
    noteTitleInput.value = '';
    noteContentInput.value = '';
  }
  document.querySelectorAll('.visa-type-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.content === noteContentInput.value);
  });
  modalOverlay.classList.add('open');
  setTimeout(() => noteTitleInput.focus(), 50);
}
function closeNoteModal() { modalOverlay.classList.remove('open'); editingId = null; }

addNoteBtn.addEventListener('click', () => openNoteModal(null));
cancelModalBtn.addEventListener('click', closeNoteModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeNoteModal(); });

document.querySelectorAll('.visa-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    noteContentInput.value = btn.dataset.content;
    document.querySelectorAll('.visa-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

saveNoteBtn.addEventListener('click', async () => {
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();
  if (!title) {
    noteTitleInput.focus();
    noteTitleInput.style.borderColor = '#ef4444';
    setTimeout(() => noteTitleInput.style.borderColor = '', 1500);
    return;
  }
  if (!content) {
    alert('Lütfen bir vize tipi seçin.');
    return;
  }
  saveNoteBtn.disabled = true;
  saveNoteBtn.textContent = 'Kaydediliyor…';
  try {
    if (editingId) {
      await updateDoc(doc(db, 'notes', editingId), { title, content });
    } else {
      await addDoc(collection(db, 'notes'), { title, content, createdAt: serverTimestamp() });
    }
    closeNoteModal();
  } catch (e) {
    alert('Kaydedilemedi: ' + e.message);
  }
  saveNoteBtn.disabled = false;
  saveNoteBtn.textContent = 'Kaydet';
});

// ==================== FIRESTORE: ADMIN METİNLERİ ====================
function startListeningAdminTexts() {
  unsubscribeAdmin = onSnapshot(collection(db, 'adminTexts'), (snapshot) => {
    adminTexts = {};
    snapshot.docs.forEach(d => {
      const data = d.data();
      adminTexts[d.id] = { html: data.html || '', plain: data.text || '' };
    });
    renderUmreButtons();
    renderDahilExtraButtons();
  }, (err) => {
    console.error('adminTexts yüklenemedi:', err.message);
  });
}

function openAdminModal(key, label, currentData) {
  adminEditingKey = key;
  adminModalTitle.textContent = label + ' — Metni Düzenle';
  adminTextInput.innerHTML = (currentData && currentData.html) || '';
  adminModalOverlay.classList.add('open');
  setTimeout(() => adminTextInput.focus(), 50);
}
function closeAdminModal() { adminModalOverlay.classList.remove('open'); adminEditingKey = null; }
adminCancelBtn.addEventListener('click', closeAdminModal);
adminModalOverlay.addEventListener('click', (e) => { if (e.target === adminModalOverlay) closeAdminModal(); });

adminSaveBtn.addEventListener('click', async () => {
  if (!adminEditingKey) return;
  adminSaveBtn.disabled = true;
  adminSaveBtn.textContent = 'Kaydediliyor…';
  try {
    const html = adminTextInput.innerHTML;
    const plain = adminTextInput.innerText;
    await setDoc(doc(db, 'adminTexts', adminEditingKey), { html, text: plain });
    closeAdminModal();
  } catch (e) {
    alert('Kaydedilemedi: ' + e.message);
  }
  adminSaveBtn.disabled = false;
  adminSaveBtn.textContent = 'Kaydet';
});
