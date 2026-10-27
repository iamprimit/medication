/**
 * Medication Reminder - Gabarito Font + Apple & Material 3 Web App
 * Fully responsive client-side app for Mobile & Desktop (GitHub Pages)
 */

// Storage Keys
const STORAGE_KEYS = {
  MEDICATIONS: 'apple_health_medications_v2',
  LOGS: 'apple_health_logs_v2',
  SETTINGS: 'apple_health_settings_v2',
  PROFILE: 'apple_health_profile_v2',
};

// Common Medication Presets for fast autofill
const COMMON_PRESETS = [
  { name: 'Levothyroxine', dosage: '200', unit: 'mcg', form: 'Tablet', shape: 'tablet', bg: '#EBDDF5', pill: '#FDE0B4', sec: '#FDE0B4', freq: 'every_day', time: '08:00', meal: 'empty_stomach', notes: 'Take 30-60 min before breakfast with water.' },
  { name: 'Omega-3', dosage: '1000', unit: 'mg', form: 'Capsule', shape: 'capsule', bg: '#EAF2CC', pill: '#B0BD48', sec: '#F3E5AB', freq: 'every_day', time: '08:00', meal: 'with_food', notes: 'Take with morning meal to optimize absorption.' },
  { name: 'Calcium + D3', dosage: '600', unit: 'mg', form: 'Tablet', shape: 'tablet', bg: '#FEF4CC', pill: '#FFFFFF', sec: '#FFFFFF', freq: 'every_day', time: '12:00', meal: 'with_food', notes: 'Take with lunch or dinner.' },
  { name: 'Aspirin', dosage: '81', unit: 'mg', form: 'Tablet', shape: 'tablet', bg: '#FEF4CC', pill: '#FFFFFF', sec: '#FFFFFF', freq: 'cyclical', time: '08:50', meal: 'with_food', notes: 'Low dose cardio protective. Take with food.' },
  { name: 'Metformin', dosage: '500', unit: 'mg', form: 'Tablet', shape: 'caplet', bg: '#E0F2FE', pill: '#38BDF8', sec: '#38BDF8', freq: 'every_day', time: '19:00', meal: 'with_food', notes: 'Take with evening meal.' },
  { name: 'Atorvastatin', dosage: '20', unit: 'mg', form: 'Tablet', shape: 'tablet', bg: '#F3E8FF', pill: '#C084FC', sec: '#C084FC', freq: 'every_day', time: '21:00', meal: 'none', notes: 'Take at bedtime.' },
  { name: 'Ibuprofen', dosage: '400', unit: 'mg', form: 'Tablet', shape: 'caplet', bg: '#FEE2E2', pill: '#F87171', sec: '#F87171', freq: 'as_needed', time: '', meal: 'with_food', notes: 'Take as needed for pain or fever.' }
];

// Seed medications matching Apple Health screenshots
const DEFAULT_MEDICATIONS = [
  {
    id: 'med_levo',
    name: 'Levothyroxine',
    dosage: '200 mcg',
    form: 'Tablet',
    shape: 'tablet',
    bgColor: '#EBDDF5',
    pillColor: '#FDE0B4',
    secondaryColor: '#FDE0B4',
    frequency: 'every_day',
    times: [{ time: '08:00', label: '8:00 AM', quantity: 1, unit: 'tablet' }],
    asNeeded: false,
    nickname: 'Thyroid',
    mealInstruction: 'empty_stomach',
    notes: 'Take 30-60 min before breakfast with full glass of water.',
    remainingPills: 24,
    totalPills: 30,
    startDate: '2026-04-01'
  },
  {
    id: 'med_omega3',
    name: 'Omega-3',
    dosage: '1000 mg',
    form: 'Capsule',
    shape: 'capsule',
    bgColor: '#EAF2CC',
    pillColor: '#B0BD48',
    secondaryColor: '#F3E5AB',
    frequency: 'every_day',
    times: [{ time: '08:00', label: '8:00 AM', quantity: 1, unit: 'capsule' }],
    asNeeded: false,
    nickname: 'Fish Oil',
    mealInstruction: 'with_food',
    notes: 'Take with morning meal to improve absorption.',
    remainingPills: 45,
    totalPills: 60,
    startDate: '2026-04-01'
  },
  {
    id: 'med_calcium',
    name: 'Calcium',
    dosage: '600 mg',
    form: 'Tablet',
    shape: 'tablet',
    bgColor: '#FEF4CC',
    pillColor: '#FFFFFF',
    secondaryColor: '#FFFFFF',
    frequency: 'every_day',
    times: [{ time: '12:00', label: '12:00 PM', quantity: 1, unit: 'tablet' }],
    asNeeded: false,
    nickname: 'Bone Health',
    mealInstruction: 'with_food',
    notes: 'Take with lunch or dinner.',
    remainingPills: 18,
    totalPills: 30,
    startDate: '2026-04-01'
  },
  {
    id: 'med_aspirin',
    name: 'Aspirin',
    dosage: '81 mg',
    form: 'Tablet',
    shape: 'tablet',
    bgColor: '#FEF4CC',
    pillColor: '#FFFFFF',
    secondaryColor: '#FFFFFF',
    frequency: 'cyclical',
    cycle: { useDays: 21, pauseDays: 7, startDate: '2026-04-01' },
    times: [{ time: '08:50', label: '8:50 AM', quantity: 1, unit: 'tablet' }],
    asNeeded: false,
    nickname: 'Baby Aspirin',
    mealInstruction: 'with_food',
    notes: 'Low dose cardio protective. Take with food.',
    remainingPills: 60,
    totalPills: 90,
    startDate: '2026-04-01'
  },
  {
    id: 'med_ibuprofen',
    name: 'Ibuprofen',
    dosage: '400 mg',
    form: 'Tablet',
    shape: 'caplet',
    bgColor: '#FEE2E2',
    pillColor: '#F87171',
    secondaryColor: '#F87171',
    frequency: 'as_needed',
    times: [],
    asNeeded: true,
    nickname: 'Advil',
    mealInstruction: 'with_food',
    notes: 'Take for pain or fever as needed.',
    remainingPills: 20,
    totalPills: 30,
    startDate: '2026-04-01'
  }
];

// App Global State
let appState = {
  activeTab: 'browse_meds', // 'browse_meds' | 'summary' | 'sharing'
  selectedDate: new Date(),
  medications: [],
  logs: {},
  settings: {
    soundEnabled: true,
  },
  profile: {
    name: 'Alex Morgan',
    dob: '1990-05-14',
    bloodType: 'O+',
    allergies: 'Penicillin'
  }
};

// Web Audio Chime Synthesizer
class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTakeChime() {
    if (!appState.settings.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(1046.5, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12);

      osc2.frequency.setValueAtTime(1567.98, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(2093.0, now + 0.22);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    } catch (e) {}
  }

  playTapSound() {
    if (!appState.settings.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }
}

const sounds = new SoundManager();

// --- Storage Management ---
function loadData() {
  try {
    const storedMeds = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);

    appState.medications = storedMeds ? JSON.parse(storedMeds) : [...DEFAULT_MEDICATIONS];
    appState.logs = storedLogs ? JSON.parse(storedLogs) : {};
    if (storedSettings) appState.settings = { ...appState.settings, ...JSON.parse(storedSettings) };
    if (storedProfile) appState.profile = { ...appState.profile, ...JSON.parse(storedProfile) };

    // Pre-seed today's 8:00 AM log so it immediately shows realistic sample data matching screenshots
    const todayStr = formatDateKey(appState.selectedDate);
    if (!appState.logs[todayStr]) {
      appState.logs[todayStr] = {
        'med_levo_08:00': { status: 'taken', timestamp: new Date().toISOString() },
        'med_omega3_08:00': { status: 'taken', timestamp: new Date().toISOString() }
      };
      saveLogs();
    }
  } catch (err) {
    appState.medications = [...DEFAULT_MEDICATIONS];
    appState.logs = {};
  }
}

function saveMedications() {
  localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(appState.medications));
}

function saveLogs() {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(appState.logs));
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appState.settings));
}

// --- Date Helpers ---
function formatDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isToday(d) {
  const now = new Date();
  return d.getDate() === now.getDate() &&
         d.getMonth() === now.getMonth() &&
         d.getFullYear() === now.getFullYear();
}

function formatDayHeader(d) {
  const options = { month: 'long', day: 'numeric' };
  const dateFormatted = d.toLocaleDateString('en-US', options);
  if (isToday(d)) {
    return `Today, ${dateFormatted}`;
  }
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  return `${weekday}, ${dateFormatted}`;
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

// --- Render 3D Pill Graphics ---
function renderPillAvatar(med, size = 'md') {
  const sizeMap = {
    sm: { container: 'w-11 h-11', capsuleW: 'w-7 h-4', round: 'w-6 h-6' },
    md: { container: 'w-14 h-14', capsuleW: 'w-9 h-4.5', round: 'w-7 h-7' },
    lg: { container: 'w-16 h-16', capsuleW: 'w-11 h-5.5', round: 'w-9 h-9' },
    xl: { container: 'w-24 h-24', capsuleW: 'w-16 h-8', round: 'w-13 h-13' },
  };

  const dim = sizeMap[size] || sizeMap.md;
  const bgCol = med.bgColor || '#E5E7EB';
  const pillCol = med.pillColor || '#FFFFFF';
  const secCol = med.secondaryColor || pillCol;

  let pillHtml = '';

  if (med.shape === 'capsule') {
    pillHtml = `
      <div class="capsule-3d ${dim.capsuleW} transform rotate-[-25deg]">
        <div class="capsule-half-left" style="background-color: ${pillCol};"></div>
        <div class="capsule-half-right" style="background-color: ${secCol};"></div>
        <div class="capsule-sheen"></div>
      </div>
    `;
  } else if (med.shape === 'caplet') {
    pillHtml = `
      <div class="caplet-3d ${dim.capsuleW} transform rotate-[-20deg]" style="background-color: ${pillCol};"></div>
    `;
  } else if (med.shape === 'liquid') {
    pillHtml = `
      <span class="material-symbols-rounded text-3xl text-blue-500 drop-shadow">water_drop</span>
    `;
  } else if (med.shape === 'inhaler') {
    pillHtml = `
      <span class="material-symbols-rounded text-3xl text-cyan-600 drop-shadow">air</span>
    `;
  } else {
    // Round Tablet
    pillHtml = `
      <div class="tablet-3d ${dim.round}" style="background: radial-gradient(circle at 35% 35%, #ffffff 0%, ${pillCol} 70%);"></div>
    `;
  }

  return `
    <div class="pill-avatar-container ${dim.container} rounded-full flex-shrink-0" style="background-color: ${bgCol};">
      ${pillHtml}
    </div>
  `;
}

// --- Adherence Calculation ---
function getDayAdherence(date) {
  const dateStr = formatDateKey(date);
  const dayLogs = appState.logs[dateStr] || {};

  let totalScheduled = 0;
  let takenCount = 0;

  appState.medications.forEach(med => {
    if (med.asNeeded) return;
    (med.times || []).forEach(t => {
      totalScheduled++;
      const doseKey = `${med.id}_${t.time}`;
      if (dayLogs[doseKey] && dayLogs[doseKey].status === 'taken') {
        takenCount++;
      }
    });
  });

  if (totalScheduled === 0) return { status: 'none', percent: 0, taken: 0, total: 0 };
  const percent = Math.min(100, Math.round((takenCount / totalScheduled) * 100));

  if (percent === 100) return { status: 'full', percent: 100, taken: takenCount, total: totalScheduled };
  if (percent > 0) return { status: 'partial', percent, taken: takenCount, total: totalScheduled };

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) {
    return { status: 'future', percent: 0, taken: 0, total: totalScheduled };
  }
  return { status: 'empty', percent: 0, taken: 0, total: totalScheduled };
}

// --- Render Week Strip (Completely Bug-Free Liquid Fill) ---
function renderWeekCalendar() {
  const weekContainer = document.getElementById('week-calendar-strip');
  if (!weekContainer) return;

  const startOfWeek = getStartOfWeek(appState.selectedDate);
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  let html = '';

  for (let i = 0; i < 7; i++) {
    const curDate = new Date(startOfWeek);
    curDate.setDate(startOfWeek.getDate() + i);

    const isSelected = formatDateKey(curDate) === formatDateKey(appState.selectedDate);
    const adherence = getDayAdherence(curDate);
    const fillPercent = adherence.percent;
    const isFull = fillPercent === 100;

    html += `
      <div class="flex flex-col items-center flex-1 cursor-pointer select-none group py-1" onclick="selectDate('${curDate.toISOString()}')">
        <!-- Inverted Triangle Indicator -->
        <div class="h-4 flex items-center justify-center mb-1">
          ${isSelected ? `<span class="text-xs text-black font-black">▼</span>` : '<span class="text-xs opacity-0">▼</span>'}
        </div>
        
        <!-- Day Letter Bubble -->
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isSelected ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}">
          ${dayLetters[i]}
        </div>

        <!-- Adherence Indicator Dot (Clean CSS liquid fill - zero SVG artifacts) -->
        <div class="mt-2.5 relative flex items-center justify-center">
          <div class="adherence-dot-container">
            <div class="adherence-liquid-fill" style="height: ${fillPercent}%;"></div>
            ${isFull ? `
              <div class="adherence-dot-check">
                <span class="material-symbols-rounded text-[18px]">check</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  weekContainer.innerHTML = html;
  
  const titleEl = document.getElementById('header-date-title');
  if (titleEl) titleEl.textContent = formatDayHeader(appState.selectedDate);
}

// Change selected date
window.selectDate = function(isoStr) {
  appState.selectedDate = new Date(isoStr);
  sounds.playTapSound();
  renderApp();
};

window.navigateDay = function(direction) {
  const d = new Date(appState.selectedDate);
  d.setDate(d.getDate() + direction);
  appState.selectedDate = d;
  sounds.playTapSound();
  renderApp();
};

window.onDatePicked = function(val) {
  if (!val) return;
  const [y, m, d] = val.split('-').map(Number);
  appState.selectedDate = new Date(y, m - 1, d);
  sounds.playTapSound();
  renderApp();
};

// --- Render Main Schedule View ---
function renderScheduleView() {
  const dateKey = formatDateKey(appState.selectedDate);
  const dayLogs = appState.logs[dateKey] || {};

  // Group by time
  const timeSlots = {};
  appState.medications.forEach(med => {
    if (med.asNeeded) return;
    (med.times || []).forEach(slot => {
      if (!timeSlots[slot.time]) {
        timeSlots[slot.time] = {
          time: slot.time,
          label: slot.label,
          meds: []
        };
      }
      timeSlots[slot.time].meds.push({
        ...med,
        dosageQuantity: slot.quantity,
        dosageUnit: slot.unit
      });
    });
  });

  const sortedTimes = Object.keys(timeSlots).sort();
  const logUpcomingContainer = document.getElementById('log-upcoming-section');
  const loggedSection = document.getElementById('logged-section');
  const yourMedsContainer = document.getElementById('your-meds-list');
  const desktopSidebarMeds = document.getElementById('desktop-cabinet-summary');

  let upcomingHtml = '';
  let loggedHtml = '';

  sortedTimes.forEach(timeKey => {
    const slot = timeSlots[timeKey];
    let allTakenOrSkipped = true;
    let anyRecorded = false;

    slot.meds.forEach(med => {
      const doseId = `${med.id}_${slot.time}`;
      const log = dayLogs[doseId];
      if (log && (log.status === 'taken' || log.status === 'skipped')) {
        anyRecorded = true;
      } else {
        allTakenOrSkipped = false;
      }
    });

    // Upcoming Doses
    if (!allTakenOrSkipped) {
      slot.meds.forEach(med => {
        const doseId = `${med.id}_${slot.time}`;
        const log = dayLogs[doseId];
        if (!log || log.status === 'none') {
          upcomingHtml += `
            <div class="bg-sky-50/70 border border-sky-100 rounded-2xl p-4.5 flex items-center justify-between mb-3.5 shadow-xs hover:shadow-md transition-all ios-touch">
              <div class="flex items-center space-x-4 flex-1 cursor-pointer" onclick="openRecordedSheet('${slot.time}')">
                ${renderPillAvatar(med, 'md')}
                <div>
                  <div class="text-xs font-bold text-gray-400 tracking-wider uppercase mb-0.5">${slot.label}</div>
                  <div class="text-lg font-black text-gray-900 leading-snug">${med.name}</div>
                  <div class="text-sm font-semibold text-gray-500">${med.dosage} • ${med.dosageQuantity || 1} ${med.form}</div>
                </div>
              </div>
              <button onclick="quickLogDose('${med.id}', '${slot.time}', 'taken')" class="w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all" title="Mark as Taken">
                <span class="material-symbols-rounded text-2xl font-bold">add</span>
              </button>
            </div>
          `;
        }
      });
    }

    // Logged Doses
    if (anyRecorded) {
      loggedHtml += `
        <div class="bg-white rounded-2xl p-4.5 shadow-xs border border-gray-100 mb-3.5 ios-touch cursor-pointer hover:border-blue-100 transition-all" onclick="openRecordedSheet('${slot.time}')">
          <div class="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <span class="text-base font-black text-gray-900">${slot.label}</span>
            <span class="text-xs font-bold text-gray-400 flex items-center">Recorded <span class="material-symbols-rounded text-base ml-0.5">chevron_right</span></span>
          </div>
          <div class="mt-3 space-y-2.5">
            ${slot.meds.map(med => {
              const doseId = `${med.id}_${slot.time}`;
              const log = dayLogs[doseId];
              if (!log || log.status === 'none') return '';
              const isTaken = log.status === 'taken';
              return `
                <div class="flex items-center space-x-3">
                  <span class="material-symbols-rounded text-[22px] ${isTaken ? 'text-[#00C7BE]' : 'text-gray-400'}">
                    ${isTaken ? 'check_circle' : 'cancel'}
                  </span>
                  <span class="text-base font-bold text-gray-800 ${isTaken ? '' : 'line-through text-gray-400'}">${med.name}</span>
                  <span class="text-xs font-semibold text-gray-400">(${isTaken ? 'Taken' : 'Skipped'})</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  });

  // As Needed Row
  const asNeededCard = `
    <div class="bg-sky-50/70 border border-sky-100 rounded-2xl p-4.5 flex items-center justify-between mb-3.5 shadow-xs hover:shadow-md transition-all ios-touch cursor-pointer" onclick="openAsNeededSheet()">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <span class="material-symbols-rounded text-2xl font-bold">medication</span>
        </div>
        <div>
          <div class="text-lg font-black text-gray-900">As Needed Medications</div>
          <div class="text-sm font-semibold text-gray-500">Log unscheduled doses for symptoms</div>
        </div>
      </div>
      <button class="w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all">
        <span class="material-symbols-rounded text-2xl font-bold">add</span>
      </button>
    </div>
  `;

  if (logUpcomingContainer) {
    logUpcomingContainer.innerHTML = (upcomingHtml || `<div class="bg-white rounded-2xl p-6 text-center text-base font-bold text-gray-500 border border-gray-100 mb-3.5 shadow-xs">All scheduled medications logged for this day! 🎉</div>`) + asNeededCard;
  }

  if (loggedSection) {
    if (loggedHtml) {
      loggedSection.style.display = 'block';
      document.getElementById('logged-list').innerHTML = loggedHtml;
    } else {
      loggedSection.style.display = 'none';
    }
  }

  // Your Medications Cards
  let medsCardsHtml = '';
  appState.medications.forEach(med => {
    const scheduleText = med.asNeeded 
      ? 'As Needed' 
      : (med.times && med.times.length > 0 ? med.times.map(t => t.label).join(', ') : 'Daily');

    medsCardsHtml += `
      <div class="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex items-center justify-between mb-3 ios-touch cursor-pointer hover:border-gray-200 transition-all" onclick="openReviewDetails('${med.id}')">
        <div class="flex items-center space-x-4">
          ${renderPillAvatar(med, 'md')}
          <div>
            <div class="text-lg font-black text-gray-900 leading-tight">${med.name}</div>
            <div class="text-sm font-semibold text-gray-500">${med.form}, ${med.dosage}</div>
            <div class="text-sm text-blue-600 font-bold mt-0.5">${scheduleText}</div>
          </div>
        </div>
        <div class="flex items-center text-gray-400">
          <span class="material-symbols-rounded text-2xl">chevron_right</span>
        </div>
      </div>
    `;
  });

  if (yourMedsContainer) yourMedsContainer.innerHTML = medsCardsHtml;
  if (desktopSidebarMeds) desktopSidebarMeds.innerHTML = medsCardsHtml;
}

// Quick Log dose
window.quickLogDose = function(medId, time, status = 'taken') {
  const dateKey = formatDateKey(appState.selectedDate);
  if (!appState.logs[dateKey]) appState.logs[dateKey] = {};

  const doseKey = `${medId}_${time}`;
  appState.logs[dateKey][doseKey] = {
    status: status,
    timestamp: new Date().toISOString()
  };

  saveLogs();
  sounds.playTakeChime();
  renderApp();
};

// --- Recorded At Modal Sheet (Screenshot 2) ---
window.openRecordedSheet = function(timeKey) {
  const dateKey = formatDateKey(appState.selectedDate);
  const dayLogs = appState.logs[dateKey] || {};

  const scheduledMeds = appState.medications.filter(med => 
    !med.asNeeded && med.times && med.times.some(t => t.time === timeKey)
  );

  const formattedDate = appState.selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const timeLabel = scheduledMeds[0]?.times.find(t => t.time === timeKey)?.label || timeKey;

  document.getElementById('recorded-sheet-date').textContent = formattedDate;
  document.getElementById('recorded-sheet-title').textContent = `Recorded at ${timeLabel}`;
  document.getElementById('recorded-sheet-count').textContent = `${scheduledMeds.length} Medication${scheduledMeds.length > 1 ? 's' : ''}`;

  const listContainer = document.getElementById('recorded-sheet-meds-list');
  listContainer.innerHTML = scheduledMeds.map(med => {
    const doseKey = `${med.id}_${timeKey}`;
    const curStatus = dayLogs[doseKey]?.status || 'none';
    const isTaken = curStatus === 'taken';
    const isSkipped = curStatus === 'skipped';

    return `
      <div class="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 mb-4 transition-all">
        <div class="flex items-center space-x-4 mb-3">
          ${renderPillAvatar(med, 'lg')}
          <div>
            <div class="text-xl font-black text-gray-900">${med.name}</div>
            <div class="text-base font-semibold text-gray-500">${med.form}, ${med.dosage}</div>
            <div class="text-sm text-blue-600 font-bold mt-0.5 flex items-center">
              1 ${med.form.toLowerCase()} at ${timeLabel}
              <span class="material-symbols-rounded text-base ml-0.5">chevron_right</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-4">
          <button onclick="toggleDoseStatus('${med.id}', '${timeKey}', 'skipped')" 
            class="py-3.5 px-4 rounded-full font-bold text-base transition-all flex items-center justify-center space-x-1.5 ios-touch ${isSkipped ? 'bg-sky-200 text-sky-800 ring-2 ring-sky-400' : 'bg-sky-100/80 text-blue-600 hover:bg-sky-100'}">
            <span>${isSkipped ? '✓ Skipped' : 'Skipped'}</span>
          </button>
          
          <button onclick="toggleDoseStatus('${med.id}', '${timeKey}', 'taken')" 
            class="py-3.5 px-4 rounded-full font-bold text-base transition-all flex items-center justify-center space-x-1.5 shadow-sm ios-touch ${isTaken ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2' : 'bg-blue-500 text-white hover:bg-blue-600'}">
            <span class="material-symbols-rounded text-lg">check</span>
            <span>Taken</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  const sheet = document.getElementById('recorded-sheet-modal');
  sheet.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.toggleDoseStatus = function(medId, timeKey, desiredStatus) {
  const dateKey = formatDateKey(appState.selectedDate);
  if (!appState.logs[dateKey]) appState.logs[dateKey] = {};

  const doseKey = `${medId}_${timeKey}`;
  const currentStatus = appState.logs[dateKey][doseKey]?.status;

  if (currentStatus === desiredStatus) {
    appState.logs[dateKey][doseKey].status = 'none';
  } else {
    appState.logs[dateKey][doseKey] = {
      status: desiredStatus,
      timestamp: new Date().toISOString()
    };
    if (desiredStatus === 'taken') sounds.playTakeChime();
    else sounds.playTapSound();
  }

  saveLogs();
  openRecordedSheet(timeKey);
  renderWeekCalendar();
};

window.closeRecordedSheet = function() {
  document.getElementById('recorded-sheet-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  renderApp();
};

// --- Review Details Modal (Screenshot 5) ---
window.openReviewDetails = function(medId) {
  const med = appState.medications.find(m => m.id === medId);
  if (!med) return;

  const modal = document.getElementById('review-details-modal');
  const content = document.getElementById('review-details-content');

  const timesText = med.times && med.times.length > 0 
    ? med.times.map(t => `<div class="flex justify-between py-2.5 border-b border-gray-200/50 last:border-none"><span class="font-bold text-gray-800 text-base">${t.label}</span><span class="text-gray-500 font-semibold text-base">${t.quantity} ${t.unit}</span></div>`).join('')
    : '<div class="text-base font-semibold text-gray-500 py-2">No scheduled times</div>';

  content.innerHTML = `
    <!-- Top Bar -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 sticky top-0 bg-white/95 backdrop-blur-md z-10">
      <button onclick="closeReviewDetails()" class="text-blue-600 font-bold flex items-center text-base ios-touch">
        <span class="material-symbols-rounded text-2xl mr-0.5">chevron_left</span>
        Back
      </button>
      <span class="font-black text-gray-900 text-lg">Review Details</span>
      <button onclick="openEditSchedule('${med.id}')" class="text-blue-600 font-bold text-base ios-touch">Edit</button>
    </div>

    <div class="p-6 md:p-8 text-center max-w-xl mx-auto">
      <div class="flex justify-center mb-4">
        ${renderPillAvatar(med, 'xl')}
      </div>
      <h2 class="text-3xl font-black text-gray-900 mb-1">${med.name}</h2>
      <p class="text-base text-gray-500 font-bold mb-6">${med.form}, ${med.dosage}</p>

      <!-- Schedule Card -->
      <div class="text-left mb-6">
        <div class="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Schedule</div>
        <div class="bg-gray-100 rounded-3xl p-5">
          <div class="text-base font-bold text-gray-500 mb-2">${med.frequency === 'cyclical' ? 'Cyclical Schedule' : (med.asNeeded ? 'As Needed' : 'Every Day')}</div>
          ${timesText}
        </div>
      </div>

      <!-- Optional Details Card -->
      <div class="text-left mb-6">
        <div class="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Optional Details</div>
        <div class="bg-gray-100 rounded-3xl p-5 space-y-3.5">
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase">Nickname</div>
            <div class="text-base font-bold text-gray-800">${med.nickname || 'None'}</div>
          </div>
          <div class="border-t border-gray-200/70 pt-2.5">
            <div class="text-xs font-bold text-gray-400 uppercase">Notes & Instructions</div>
            <div class="text-sm font-semibold text-gray-700 mt-0.5">${med.notes || 'No special notes'}</div>
          </div>
          <div class="border-t border-gray-200/70 pt-2.5 flex justify-between items-center">
            <span class="text-xs font-bold text-gray-400 uppercase">Remaining Supply</span>
            <span class="text-sm font-black ${med.remainingPills <= 5 ? 'text-red-500' : 'text-gray-800'}">${med.remainingPills || 0} pills left</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button onclick="closeReviewDetails()" class="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-lg shadow-md active:scale-98 transition-all">
          Done
        </button>
        <button onclick="deleteMedication('${med.id}')" class="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-base transition-all">
          Delete Medication
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.closeReviewDetails = function() {
  document.getElementById('review-details-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  renderApp();
};

window.deleteMedication = function(medId) {
  if (confirm('Are you sure you want to remove this medication from your schedule?')) {
    appState.medications = appState.medications.filter(m => m.id !== medId);
    saveMedications();
    closeReviewDetails();
    renderApp();
  }
};

// --- Edit Schedule Sheet (Screenshot 1) ---
let editingMedId = null;

window.openEditSchedule = function(medId = null) {
  editingMedId = medId;
  const med = medId ? appState.medications.find(m => m.id === medId) : null;

  const modal = document.getElementById('edit-schedule-modal');
  const sheet = document.getElementById('edit-schedule-content');

  const currentTimes = med?.times || [{ time: '08:00', label: '8:00 AM', quantity: 1, unit: med?.form?.toLowerCase() || 'tablet' }];
  const isCyclical = med?.frequency === 'cyclical';

  sheet.innerHTML = `
    <!-- Top Navigation Bar -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
      <button onclick="closeEditSchedule()" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-all">
        <span class="material-symbols-rounded text-xl">close</span>
      </button>
      <span class="font-black text-gray-900 text-lg">Edit Schedule</span>
      <button onclick="saveScheduleChanges()" class="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-all">
        <span class="material-symbols-rounded text-xl">check</span>
      </button>
    </div>

    <div class="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar max-w-xl mx-auto pb-16">
      
      <!-- When will you take this? -->
      <div>
        <div class="text-base font-black text-gray-600 mb-2">When will you take this?</div>
        <div class="bg-gray-100 rounded-3xl overflow-hidden divide-y divide-gray-200/70">
          <div class="p-4.5 flex items-center justify-between">
            <span class="text-base font-bold text-gray-800">Schedule Type</span>
            <select id="schedule-freq-select" onchange="toggleCycleSection(this.value)" class="bg-transparent text-base font-black text-blue-600 outline-none cursor-pointer">
              <option value="every_day" ${!isCyclical && !med?.asNeeded ? 'selected' : ''}>Every Day</option>
              <option value="cyclical" ${isCyclical ? 'selected' : ''}>On a Cyclical Schedule</option>
              <option value="as_needed" ${med?.asNeeded ? 'selected' : ''}>As Needed</option>
            </select>
          </div>
          <div class="p-4.5 flex items-center justify-between">
            <span class="text-base font-bold text-gray-800">Frequency Interval</span>
            <span class="text-base font-black text-blue-600 flex items-center cursor-pointer">
              Every Day <span class="material-symbols-rounded text-lg ml-1">unfold_more</span>
            </span>
          </div>
        </div>
      </div>

      <!-- At what time? -->
      <div>
        <div class="text-base font-black text-gray-600 mb-2">At what time?</div>
        <div class="bg-gray-100 rounded-3xl p-4">
          <div id="times-list-rows" class="space-y-3">
            ${currentTimes.map((t, idx) => `
              <div class="flex items-center justify-between p-3 rounded-2xl bg-white shadow-xs" data-time-row="${idx}">
                <div class="flex items-center space-x-3">
                  <button type="button" onclick="removeTimeRow(${idx})" class="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-rounded text-base">remove</span>
                  </button>
                  <input type="time" value="${t.time}" class="px-3 py-1.5 bg-gray-100 rounded-xl text-base font-black text-gray-900 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="flex items-center space-x-2">
                  <input type="number" min="1" max="10" value="${t.quantity || 1}" class="w-14 py-1.5 px-2 text-center text-base font-black text-blue-600 bg-blue-50 rounded-xl outline-none" />
                  <span class="text-sm text-blue-600 font-bold">${t.unit || 'dose'}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" onclick="addTimeRow()" class="mt-4 flex items-center space-x-2 text-base font-black text-blue-600 hover:text-blue-700 py-1.5 px-2">
            <span class="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center">
              <span class="material-symbols-rounded text-base font-bold">add</span>
            </span>
            <span>Add a Time</span>
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2.5 px-1 font-semibold">If you schedule a time, Medication Reminder will notify you when it's time to take your doses.</p>
      </div>

      <!-- What is the cycle? -->
      <div id="cycle-settings-box" class="${isCyclical ? 'block' : 'hidden'}">
        <div class="text-base font-black text-gray-600 mb-2">What is the cycle?</div>
        <div class="bg-gray-100 rounded-3xl overflow-hidden divide-y divide-gray-200/70">
          <div class="p-4.5 flex items-center justify-between">
            <span class="text-base font-bold text-gray-800">Use for</span>
            <span class="text-base font-black text-blue-600 flex items-center">
              21 days <span class="material-symbols-rounded text-lg ml-1">unfold_more</span>
            </span>
          </div>
          <div class="p-4.5 flex items-center justify-between">
            <span class="text-base font-bold text-gray-800">Pause for</span>
            <span class="text-base font-black text-blue-600 flex items-center">
              7 days <span class="material-symbols-rounded text-lg ml-1">unfold_more</span>
            </span>
          </div>
        </div>
        <div class="text-xs text-gray-400 mt-2 px-1 font-bold">Next Pause: May 12</div>
      </div>

      <!-- Duration -->
      <div>
        <div class="text-base font-black text-gray-600 mb-2">Duration</div>
        <div class="bg-gray-100 rounded-3xl p-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-xs font-black text-gray-400 uppercase tracking-wide">START DATE</div>
              <div class="text-base font-black text-gray-900 mt-1">Today</div>
            </div>
            <div>
              <div class="text-xs font-black text-gray-400 uppercase tracking-wide">END DATE</div>
              <div class="text-base font-bold text-gray-500 mt-1">None</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.toggleCycleSection = function(val) {
  const box = document.getElementById('cycle-settings-box');
  if (box) {
    if (val === 'cyclical') box.classList.remove('hidden');
    else box.classList.add('hidden');
  }
};

window.addTimeRow = function() {
  const container = document.getElementById('times-list-rows');
  const count = container.children.length;
  const newRow = document.createElement('div');
  newRow.className = 'flex items-center justify-between p-3 rounded-2xl bg-white shadow-xs';
  newRow.setAttribute('data-time-row', count);
  newRow.innerHTML = `
    <div class="flex items-center space-x-3">
      <button type="button" onclick="this.parentElement.parentElement.remove()" class="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-rounded text-base">remove</span>
      </button>
      <input type="time" value="20:00" class="px-3 py-1.5 bg-gray-100 rounded-xl text-base font-black text-gray-900 outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div class="flex items-center space-x-2">
      <input type="number" min="1" max="10" value="1" class="w-14 py-1.5 px-2 text-center text-base font-black text-blue-600 bg-blue-50 rounded-xl outline-none" />
      <span class="text-sm text-blue-600 font-bold">dose</span>
    </div>
  `;
  container.appendChild(newRow);
};

window.removeTimeRow = function(idx) {
  const row = document.querySelector(`[data-time-row="${idx}"]`);
  if (row) row.remove();
};

window.saveScheduleChanges = function() {
  if (!editingMedId) {
    closeEditSchedule();
    return;
  }
  const med = appState.medications.find(m => m.id === editingMedId);
  if (!med) return;

  const freq = document.getElementById('schedule-freq-select')?.value || 'every_day';
  med.frequency = freq;
  med.asNeeded = freq === 'as_needed';

  const timeRows = document.querySelectorAll('#times-list-rows > div');
  const parsedTimes = [];
  timeRows.forEach(row => {
    const timeInput = row.querySelector('input[type="time"]');
    const qtyInput = row.querySelector('input[type="number"]');
    if (timeInput && timeInput.value) {
      const [h, m] = timeInput.value.split(':');
      const hourNum = parseInt(h, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum % 12 || 12;
      parsedTimes.push({
        time: timeInput.value,
        label: `${displayHour}:${m} ${ampm}`,
        quantity: parseInt(qtyInput?.value || 1, 10),
        unit: med.form.toLowerCase()
      });
    }
  });

  med.times = parsedTimes;
  saveMedications();
  closeEditSchedule();
  renderApp();
};

window.closeEditSchedule = function() {
  document.getElementById('edit-schedule-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  if (editingMedId) openReviewDetails(editingMedId);
};

// --- As Needed (PRN) Medications Sheet ---
window.openAsNeededSheet = function() {
  const modal = document.getElementById('as-needed-modal');
  const list = document.getElementById('as-needed-list');

  const prnMeds = appState.medications.filter(m => m.asNeeded || m.id === 'med_ibuprofen');

  list.innerHTML = prnMeds.map(med => `
    <div class="bg-gray-50 rounded-2xl p-4.5 flex items-center justify-between mb-3 border border-gray-100 hover:border-blue-200 transition-all ios-touch">
      <div class="flex items-center space-x-4">
        ${renderPillAvatar(med, 'md')}
        <div>
          <div class="text-lg font-black text-gray-900">${med.name}</div>
          <div class="text-sm font-semibold text-gray-500">${med.dosage} • ${med.nickname || 'As Needed'}</div>
        </div>
      </div>
      <button onclick="logAsNeededDose('${med.id}')" class="px-5 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-black text-sm shadow-sm flex items-center space-x-1.5">
        <span class="material-symbols-rounded text-base font-bold">add</span>
        <span>Take Now</span>
      </button>
    </div>
  `).join('');

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.logAsNeededDose = function(medId) {
  const med = appState.medications.find(m => m.id === medId);
  if (!med) return;

  const now = new Date();
  const dateKey = formatDateKey(now);

  if (!appState.logs[dateKey]) appState.logs[dateKey] = {};

  const doseKey = `${med.id}_prn_${Date.now()}`;
  appState.logs[dateKey][doseKey] = {
    status: 'taken',
    timestamp: now.toISOString(),
    isPrn: true
  };

  saveLogs();
  sounds.playTakeChime();
  closeAsNeededSheet();
  renderApp();
};

window.closeAsNeededSheet = function() {
  document.getElementById('as-needed-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
};

// --- REDESIGNED: Add New Medication Experience ---
let newMedDraft = {
  name: '',
  form: 'Tablet',
  dosage: '50',
  unit: 'mg',
  shape: 'tablet',
  bgColor: '#FEF4CC',
  pillColor: '#FACC15',
  secondaryColor: '#FFFFFF',
  frequency: 'every_day',
  times: [{ time: '08:00', label: '8:00 AM', quantity: 1, unit: 'tablet' }],
  asNeeded: false,
  mealInstruction: 'with_food',
  nickname: '',
  notes: '',
  remainingPills: 30,
  totalPills: 30
};

window.openAddMedicationModal = function() {
  newMedDraft = {
    name: '',
    form: 'Tablet',
    dosage: '50',
    unit: 'mg',
    shape: 'tablet',
    bgColor: '#FEF4CC',
    pillColor: '#FACC15',
    secondaryColor: '#FFFFFF',
    frequency: 'every_day',
    times: [{ time: '08:00', label: '8:00 AM', quantity: 1, unit: 'tablet' }],
    asNeeded: false,
    mealInstruction: 'with_food',
    nickname: '',
    notes: '',
    remainingPills: 30,
    totalPills: 30
  };

  // Render presets
  renderAddMedPresets();
  updateAddMedPreview();

  // Reset form inputs
  document.getElementById('new-med-name').value = '';
  document.getElementById('new-med-dosage').value = '50';
  document.getElementById('new-med-unit').value = 'mg';
  document.getElementById('new-med-nickname').value = '';
  document.getElementById('new-med-notes').value = '';
  document.getElementById('new-med-frequency').value = 'every_day';
  document.getElementById('new-med-time').value = '08:00';
  document.getElementById('new-med-supply').value = '30';

  document.getElementById('add-med-modal').classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

function renderAddMedPresets() {
  const container = document.getElementById('add-med-preset-chips');
  if (!container) return;

  container.innerHTML = COMMON_PRESETS.map((p, idx) => `
    <button type="button" onclick="applyMedPreset(${idx})" class="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-sm font-bold text-gray-700 transition-all border border-gray-200/60 flex-shrink-0 active:scale-95">
      ${p.name}
    </button>
  `).join('');
}

window.applyMedPreset = function(idx) {
  const p = COMMON_PRESETS[idx];
  if (!p) return;

  newMedDraft.name = p.name;
  newMedDraft.dosage = p.dosage;
  newMedDraft.unit = p.unit;
  newMedDraft.form = p.form;
  newMedDraft.shape = p.shape;
  newMedDraft.bgColor = p.bg;
  newMedDraft.pillColor = p.pill;
  newMedDraft.secondaryColor = p.sec;
  newMedDraft.frequency = p.freq;
  newMedDraft.notes = p.notes;
  newMedDraft.mealInstruction = p.meal;

  document.getElementById('new-med-name').value = p.name;
  document.getElementById('new-med-dosage').value = p.dosage;
  document.getElementById('new-med-unit').value = p.unit;
  document.getElementById('new-med-frequency').value = p.freq;
  if (p.time) document.getElementById('new-med-time').value = p.time;
  document.getElementById('new-med-notes').value = p.notes;

  updateAddMedPreview();
  sounds.playTapSound();
};

window.updateAddMedPreview = function() {
  const previewBox = document.getElementById('new-med-preview-avatar');
  if (previewBox) {
    previewBox.innerHTML = renderPillAvatar(newMedDraft, 'xl');
  }
};

window.setDraftPillShape = function(shape) {
  newMedDraft.shape = shape;
  newMedDraft.form = shape === 'capsule' ? 'Capsule' : (shape === 'liquid' ? 'Liquid' : (shape === 'inhaler' ? 'Inhaler' : 'Tablet'));
  
  // Highlight shape buttons
  document.querySelectorAll('.shape-btn').forEach(b => {
    b.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
  });
  const activeBtn = document.getElementById(`shape-btn-${shape}`);
  if (activeBtn) activeBtn.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');

  updateAddMedPreview();
};

window.setDraftColor = function(bg, pill, sec) {
  newMedDraft.bgColor = bg;
  newMedDraft.pillColor = pill;
  newMedDraft.secondaryColor = sec || pill;
  updateAddMedPreview();
};

window.setMealInstruction = function(meal) {
  newMedDraft.mealInstruction = meal;
  document.querySelectorAll('.meal-btn').forEach(b => {
    b.classList.remove('bg-blue-500', 'text-white');
    b.classList.add('bg-gray-100', 'text-gray-700');
  });
  const activeBtn = document.getElementById(`meal-btn-${meal}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
    activeBtn.classList.add('bg-blue-500', 'text-white');
  }
};

window.saveNewMedication = function(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('new-med-name');
  const doseInput = document.getElementById('new-med-dosage');
  const unitSelect = document.getElementById('new-med-unit');
  const nicknameInput = document.getElementById('new-med-nickname');
  const notesInput = document.getElementById('new-med-notes');
  const freqSelect = document.getElementById('new-med-frequency');
  const timeInput = document.getElementById('new-med-time');
  const supplyInput = document.getElementById('new-med-supply');

  if (!nameInput.value.trim()) {
    alert('Please enter medication name');
    nameInput.focus();
    return;
  }

  const id = `med_${Date.now()}`;
  const freq = freqSelect.value;
  const isPrn = freq === 'as_needed';

  let times = [];
  if (!isPrn && timeInput.value) {
    const [h, m] = timeInput.value.split(':');
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    times.push({
      time: timeInput.value,
      label: `${displayHour}:${m} ${ampm}`,
      quantity: 1,
      unit: newMedDraft.form.toLowerCase()
    });
  }

  const fullDosage = `${doseInput.value.trim()} ${unitSelect.value}`;

  const newMed = {
    ...newMedDraft,
    id,
    name: nameInput.value.trim(),
    dosage: fullDosage,
    nickname: nicknameInput.value.trim(),
    notes: notesInput.value.trim(),
    frequency: freq,
    asNeeded: isPrn,
    times: times,
    remainingPills: parseInt(supplyInput.value || 30, 10),
    totalPills: parseInt(supplyInput.value || 30, 10),
    startDate: formatDateKey(new Date())
  };

  appState.medications.push(newMed);
  saveMedications();
  closeAddMedicationModal();
  sounds.playTakeChime();
  renderApp();
};

window.closeAddMedicationModal = function() {
  document.getElementById('add-med-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
};

// --- Switch Tabs (Schedule / Summary / Sharing) ---
window.switchTab = function(tabName) {
  appState.activeTab = tabName;
  sounds.playTapSound();

  const tabs = ['browse_meds', 'summary', 'sharing'];
  tabs.forEach(t => {
    // Mobile bottom bar buttons
    const mBtn = document.getElementById(`tab-btn-${t}`);
    // Desktop top nav buttons
    const dBtn = document.getElementById(`dtab-btn-${t}`);
    const view = document.getElementById(`view-${t}`);

    const isActive = t === tabName;

    if (mBtn) {
      if (isActive) {
        mBtn.classList.add('text-blue-600', 'font-black');
        mBtn.classList.remove('text-gray-400', 'font-bold');
      } else {
        mBtn.classList.remove('text-blue-600', 'font-black');
        mBtn.classList.add('text-gray-400', 'font-bold');
      }
    }

    if (dBtn) {
      if (isActive) {
        dBtn.classList.add('bg-white', 'text-blue-600', 'shadow-xs');
        dBtn.classList.remove('text-gray-600', 'hover:bg-gray-100');
      } else {
        dBtn.classList.remove('bg-white', 'text-blue-600', 'shadow-xs');
        dBtn.classList.add('text-gray-600', 'hover:bg-gray-100');
      }
    }

    if (view) {
      if (isActive) view.classList.remove('hidden');
      else view.classList.add('hidden');
    }
  });

  if (tabName === 'summary') renderSummaryStats();
  if (tabName === 'sharing') renderSharingView();
};

// --- Summary & Fixed Weekly Consistency Report ---
function renderSummaryStats() {
  const container = document.getElementById('summary-stats-content');
  if (!container) return;

  // Calculate past 7 days adherence accurately
  let totalDosesPast7Days = 0;
  let takenDosesPast7Days = 0;
  const daysData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const adh = getDayAdherence(d);
    daysData.push({
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percent: adh.percent,
      taken: adh.taken,
      total: adh.total
    });
    totalDosesPast7Days += adh.total;
    takenDosesPast7Days += adh.taken;
  }

  const overallRate = totalDosesPast7Days > 0 
    ? Math.round((takenDosesPast7Days / totalDosesPast7Days) * 100) 
    : 100;

  container.innerHTML = `
    <!-- Top Overall Adherence Banner -->
    <div class="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white rounded-3xl p-7 shadow-lg mb-8">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm uppercase tracking-wider text-blue-100 font-black">7-Day Adherence</span>
        <span class="bg-white/25 backdrop-blur px-3 py-1 rounded-full text-xs font-black">Streak Active</span>
      </div>
      <div class="flex items-baseline space-x-3">
        <span class="text-6xl font-black">${overallRate}%</span>
        <span class="text-blue-100 text-lg font-bold">compliance</span>
      </div>
      <p class="text-base text-blue-50 mt-3 font-semibold leading-relaxed">You've logged ${takenDosesPast7Days} of ${totalDosesPast7Days} scheduled doses across the past 7 days.</p>
    </div>

    <!-- Fixed Weekly Consistency Chart (No SVG overflow glitches) -->
    <div class="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-black text-gray-900">Weekly Adherence Breakdown</h3>
          <p class="text-sm font-semibold text-gray-400">Daily dose completion percentage</p>
        </div>
        <span class="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Target: 80%+</span>
      </div>

      <!-- Bar Chart -->
      <div class="grid grid-cols-7 gap-2 md:gap-4 items-end h-48 pt-6 pb-2 border-b border-gray-100">
        ${daysData.map(d => {
          const heightPercent = Math.max(12, d.percent);
          const barColor = d.percent >= 80 ? 'bg-[#00C7BE]' : (d.percent > 0 ? 'bg-amber-400' : 'bg-gray-200');
          return `
            <div class="flex flex-col items-center h-full justify-end group cursor-pointer">
              <span class="text-xs font-black text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">${d.percent}%</span>
              <div class="w-full max-w-[42px] bg-gray-100 rounded-2xl flex flex-col justify-end overflow-hidden h-36">
                <div class="w-full ${barColor} rounded-2xl transition-all duration-500" style="height: ${heightPercent}%;"></div>
              </div>
              <span class="text-xs md:text-sm font-bold text-gray-600 mt-2">${d.dayName}</span>
            </div>
          `;
        }).join('')}
      </div>
      <div class="flex items-center justify-center space-x-6 mt-4 text-xs font-bold text-gray-500">
        <span class="flex items-center"><span class="w-3 h-3 rounded-full bg-[#00C7BE] mr-1.5"></span> 100% Completed</span>
        <span class="flex items-center"><span class="w-3 h-3 rounded-full bg-amber-400 mr-1.5"></span> Partial</span>
        <span class="flex items-center"><span class="w-3 h-3 rounded-full bg-gray-200 mr-1.5"></span> Missed / Empty</span>
      </div>
    </div>

    <!-- Active Medications & Refill Inventory -->
    <div class="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 mb-8">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-black text-gray-900">Cabinet & Refill Tracker</h3>
        <span class="text-xs font-bold text-gray-400">${appState.medications.length} Prescriptions</span>
      </div>
      <div class="space-y-4">
        ${appState.medications.map(m => `
          <div class="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div class="flex items-center space-x-4">
              ${renderPillAvatar(m, 'sm')}
              <div>
                <div class="text-base font-black text-gray-800">${m.name}</div>
                <div class="text-sm font-semibold text-gray-500">${m.dosage} • ${m.form}</div>
              </div>
            </div>
            <span class="text-sm font-black px-3 py-1.5 rounded-xl ${m.remainingPills <= 7 ? 'bg-red-100 text-red-600' : 'bg-white border border-gray-200 text-gray-700'}">
              ${m.remainingPills || 0} pills left
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --- Sharing / Medical ID View ---
function renderSharingView() {
  const container = document.getElementById('sharing-view-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Medical ID Card -->
      <div class="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-2xl">
            <span class="material-symbols-rounded">medical_information</span>
          </div>
          <div>
            <h3 class="text-2xl font-black text-gray-900">${appState.profile.name}</h3>
            <p class="text-sm font-bold text-gray-400">DOB: ${appState.profile.dob} • Blood Type: ${appState.profile.bloodType}</p>
          </div>
        </div>

        <div class="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
          <div class="text-xs font-black text-red-700 uppercase tracking-wide">Known Allergies & Adverse Reactions</div>
          <div class="text-base text-red-950 font-bold mt-1">${appState.profile.allergies}</div>
        </div>

        <div class="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Active Medications Schedule (${appState.medications.length})</div>
        <div class="space-y-3 mb-6">
          ${appState.medications.map(m => `
            <div class="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-none">
              <span class="font-black text-gray-800 text-base">${m.name} (${m.dosage})</span>
              <span class="text-gray-500 font-bold">${m.times?.map(t => t.label).join(', ') || 'PRN / As Needed'}</span>
            </div>
          `).join('')}
        </div>

        <button onclick="exportMedicationListJSON()" class="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-base shadow-md transition-all flex items-center justify-center space-x-2">
          <span class="material-symbols-rounded text-xl">share</span>
          <span>Export Medical Report (JSON)</span>
        </button>
      </div>

      <!-- Data Reset & Demo Tools -->
      <div class="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div class="text-base font-black text-gray-900">Application Data Management</div>
        <button onclick="resetToSampleData()" class="w-full py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-all">
          Reset to Apple Health Demo Data
        </button>
      </div>
    </div>
  `;
}

// Export & Reset
window.exportMedicationListJSON = function() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    profile: appState.profile,
    medications: appState.medications,
    logs: appState.logs
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Medication_Reminder_Export_${formatDateKey(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.resetToSampleData = function() {
  if (confirm('Reset all medications and logs to Apple Health demo data?')) {
    localStorage.clear();
    loadData();
    renderApp();
  }
};

// --- Master Render Function ---
function renderApp() {
  renderWeekCalendar();
  renderScheduleView();
  if (appState.activeTab === 'summary') renderSummaryStats();
  if (appState.activeTab === 'sharing') renderSharingView();
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderApp();

  document.addEventListener('click', () => sounds.init(), { once: true });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
