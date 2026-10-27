/**
 * Medication Reminder - Apple HIG & Material 3 Hybrid
 * Client-Side Application for GitHub Pages with Smooth Transitions
 */

const STORAGE_KEYS = {
  MEDICATIONS: 'apple_health_medications_v3',
  LOGS: 'apple_health_logs_v3',
  SETTINGS: 'apple_health_settings_v3',
  PROFILE: 'apple_health_profile_v3',
};

// Common Presets for fast autofill
const COMMON_PRESETS = [
  { name: 'Levothyroxine', dosage: '200', unit: 'mcg', form: 'Tablet', shape: 'tablet', bg: '#EBDDF5', pill: '#FDE0B4', sec: '#FDE0B4', freq: 'every_day', time: '08:00', meal: 'empty_stomach', notes: 'Take 30-60 min before breakfast with water.' },
  { name: 'Omega-3', dosage: '1000', unit: 'mg', form: 'Capsule', shape: 'capsule', bg: '#EAF2CC', pill: '#B0BD48', sec: '#F3E5AB', freq: 'every_day', time: '08:00', meal: 'with_food', notes: 'Take with morning meal.' },
  { name: 'Calcium + D3', dosage: '600', unit: 'mg', form: 'Tablet', shape: 'tablet', bg: '#FEF4CC', pill: '#FFFFFF', sec: '#FFFFFF', freq: 'every_day', time: '12:00', meal: 'with_food', notes: 'Take with lunch.' },
  { name: 'Aspirin', dosage: '81', unit: 'mg', form: 'Tablet', shape: 'tablet', bg: '#FEF4CC', pill: '#FFFFFF', sec: '#FFFFFF', freq: 'cyclical', time: '08:50', meal: 'with_food', notes: 'Low dose cardio protective.' },
  { name: 'Metformin', dosage: '500', unit: 'mg', form: 'Tablet', shape: 'caplet', bg: '#E0F2FE', pill: '#38BDF8', sec: '#38BDF8', freq: 'every_day', time: '19:00', meal: 'with_food', notes: 'Take with dinner.' },
  { name: 'Ibuprofen', dosage: '400', unit: 'mg', form: 'Tablet', shape: 'caplet', bg: '#FEE2E2', pill: '#F87171', sec: '#F87171', freq: 'as_needed', time: '', meal: 'with_food', notes: 'Take as needed for pain.' }
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
    notes: 'Take 30 min before food on an empty stomach.',
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
    notes: 'Take with a meal.',
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
    notes: 'Take with food.',
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
    notes: 'Take with food.',
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
    notes: 'Take as needed for symptoms.',
    remainingPills: 20,
    totalPills: 30,
    startDate: '2026-04-01'
  }
];

// App State
let appState = {
  activeTab: 'browse_meds',
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

// Sound Manager (Completely disabled as requested)
class SoundManager {
  init() {}
  playTakeChime() {}
  playTapSound() {}
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
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

// --- Floating Toast Pill Notification ---
function showToast(message, subtitle = '', icon = 'check_circle') {
  const toast = document.getElementById('ios-toast-pill');
  if (!toast) return;

  const iconEl = toast.querySelector('.toast-icon');
  const textEl = toast.querySelector('.toast-text');

  if (iconEl) iconEl.textContent = icon;
  if (textEl) {
    const action = subtitle ? ` ${subtitle.toLowerCase()}` : ' recorded';
    textEl.textContent = `${message}${action}`;
  }

  toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
  }, 2200);
}

// --- Render 3D Pill Graphics ---
function renderPillAvatar(med, size = 'md') {
  const sizeMap = {
    sm: { container: 'w-10 h-10', capsuleW: 'w-7 h-3.5', round: 'w-5 h-5' },
    md: { container: 'w-12 h-12', capsuleW: 'w-8 h-4', round: 'w-6 h-6' },
    lg: { container: 'w-14 h-14', capsuleW: 'w-10 h-5', round: 'w-8 h-8' },
    xl: { container: 'w-20 h-20', capsuleW: 'w-14 h-7', round: 'w-11 h-11' },
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
      <span class="material-symbols-rounded text-2xl text-blue-500 drop-shadow-sm">water_drop</span>
    `;
  } else {
    pillHtml = `
      <div class="tablet-3d ${dim.round}" style="background: radial-gradient(circle at 35% 35%, #ffffff 0%, ${pillCol} 70%);"></div>
    `;
  }

  return `
    <div class="pill-avatar-container ${dim.container}" style="background-color: ${bgCol};">
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

// --- Render Week Strip ---
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
      <div class="flex flex-col items-center flex-1 cursor-pointer select-none group py-0.5" onclick="selectDate('${curDate.toISOString()}')">
        <div class="h-3 flex items-center justify-center mb-1">
          ${isSelected ? `<span class="text-[9px] text-[#1C1C1E] transition-transform duration-200">▼</span>` : '<span class="text-[9px] opacity-0">▼</span>'}
        </div>
        
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium transition-all duration-200 ${isSelected ? 'bg-black text-white font-semibold shadow-xs scale-105' : 'text-[#8E8E93] group-hover:text-black'}">
          ${dayLetters[i]}
        </div>

        <div class="mt-2 relative flex items-center justify-center">
          <div class="adherence-dot-container">
            <div class="adherence-liquid-fill" style="height: ${fillPercent}%;"></div>
            ${isFull ? `
              <div class="adherence-dot-check">
                <span class="material-symbols-rounded text-[16px]">check</span>
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

// Date selection with smooth refresh animation
window.selectDate = function(isoStr) {
  appState.selectedDate = new Date(isoStr);
  sounds.playTapSound();
  animateScheduleRefresh();
  renderApp();
};

window.navigateDay = function(direction) {
  const d = new Date(appState.selectedDate);
  d.setDate(d.getDate() + direction);
  appState.selectedDate = d;
  sounds.playTapSound();
  animateScheduleRefresh();
  renderApp();
};

window.onDatePicked = function(val) {
  if (!val) return;
  const [y, m, d] = val.split('-').map(Number);
  appState.selectedDate = new Date(y, m - 1, d);
  sounds.playTapSound();
  animateScheduleRefresh();
  renderApp();
};

function animateScheduleRefresh() {
  const col = document.querySelector('.schedule-column-transition');
  if (col) {
    col.classList.remove('animate-date-refresh');
    void col.offsetWidth; // trigger reflow
    col.classList.add('animate-date-refresh');
  }
}

// --- Render Main Schedule View ---
function renderScheduleView() {
  const dateKey = formatDateKey(appState.selectedDate);
  const dayLogs = appState.logs[dateKey] || {};

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

    if (!allTakenOrSkipped) {
      slot.meds.forEach(med => {
        const doseId = `${med.id}_${slot.time}`;
        const log = dayLogs[doseId];
        if (!log || log.status === 'none') {
          upcomingHtml += `
            <div class="ios-card-blue p-4 flex items-center justify-between mb-3 hover:border-blue-300 transition-all ios-touch">
              <div class="flex items-center space-x-3.5 flex-1 cursor-pointer" onclick="openRecordedSheet('${slot.time}')">
                ${renderPillAvatar(med, 'md')}
                <div>
                  <div class="text-[15px] font-semibold text-[#1C1C1E] leading-snug">${slot.label}</div>
                  <div class="text-[17px] font-medium text-[#1C1C1E] mt-0.5">${med.name}</div>
                  <div class="text-[14px] font-normal text-[#8E8E93]">${med.dosage} • ${med.dosageQuantity || 1} ${med.form}</div>
                </div>
              </div>
              <button onclick="quickLogDose('${med.id}', '${slot.time}', 'taken')" class="w-9 h-9 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white flex items-center justify-center shadow-xs active:scale-95 transition-all" title="Mark as Taken">
                <span class="material-symbols-rounded text-xl">add</span>
              </button>
            </div>
          `;
        }
      });
    }

    if (anyRecorded) {
      loggedHtml += `
        <div class="ios-card p-4 mb-3 ios-touch cursor-pointer hover:border-gray-300 transition-all" onclick="openRecordedSheet('${slot.time}')">
          <div class="flex items-center justify-between pb-2.5 border-b border-[#E5E5EA]">
            <span class="text-[16px] font-semibold text-[#1C1C1E]">${slot.label}</span>
            <span class="text-[14px] font-normal text-[#8E8E93] flex items-center">
              Recorded
              <span class="material-symbols-rounded text-base text-[#C7C7CC] ml-0.5">chevron_right</span>
            </span>
          </div>
          <div class="mt-2.5 space-y-2.5">
            ${slot.meds.map(med => {
              const doseId = `${med.id}_${slot.time}`;
              const log = dayLogs[doseId];
              if (!log || log.status === 'none') return '';
              const isTaken = log.status === 'taken';
              return `
                <div class="flex items-center space-x-3">
                  <div class="w-5 h-5 rounded-full ${isTaken ? 'bg-[#00C7BE] animate-pop-check' : 'bg-[#8E8E93]'} text-white flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-rounded text-[13px] font-bold">${isTaken ? 'check' : 'close'}</span>
                  </div>
                  <span class="text-[16px] font-medium ${isTaken ? 'text-[#1C1C1E]' : 'line-through text-[#8E8E93]'}">${med.name}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  });

  const asNeededCard = `
    <div class="ios-card-blue p-4 flex items-center justify-between mb-3 hover:border-blue-300 transition-all ios-touch cursor-pointer" onclick="openAsNeededSheet()">
      <div class="flex items-center space-x-3.5">
        <div class="w-10 h-10 rounded-full bg-blue-100/70 flex items-center justify-center text-[#007AFF]">
          <span class="material-symbols-rounded text-xl">medication</span>
        </div>
        <div>
          <div class="text-[16px] font-semibold text-[#1C1C1E]">As Needed Medications</div>
          <div class="text-[13px] font-normal text-[#6C6C70]">Log unscheduled doses</div>
        </div>
      </div>
      <button class="w-9 h-9 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white flex items-center justify-center shadow-xs active:scale-95 transition-all">
        <span class="material-symbols-rounded text-xl">add</span>
      </button>
    </div>
  `;

  if (logUpcomingContainer) {
    logUpcomingContainer.innerHTML = (upcomingHtml || `<div class="ios-card p-5 text-center text-[15px] font-medium text-[#8E8E93] mb-3">All scheduled medications logged for this day 🎉</div>`) + asNeededCard;
  }

  if (loggedSection) {
    if (loggedHtml) {
      loggedSection.style.display = 'block';
      document.getElementById('logged-list').innerHTML = loggedHtml;
    } else {
      loggedSection.style.display = 'none';
    }
  }

  let medsCardsHtml = '';
  appState.medications.forEach(med => {
    const scheduleText = med.asNeeded 
      ? 'As Needed' 
      : (med.times && med.times.length > 0 ? med.times.map(t => t.label).join(', ') : 'Daily');

    medsCardsHtml += `
      <div class="ios-card p-3.5 flex items-center justify-between mb-2.5 ios-touch cursor-pointer hover:border-gray-300 transition-all" onclick="openReviewDetails('${med.id}')">
        <div class="flex items-center space-x-3.5">
          ${renderPillAvatar(med, 'md')}
          <div>
            <div class="text-[16px] font-semibold text-[#1C1C1E] leading-snug">${med.name}</div>
            <div class="text-[14px] font-normal text-[#8E8E93]">${med.form}, ${med.dosage}</div>
            <div class="text-[13px] font-medium text-[#007AFF] mt-0.5">${scheduleText}</div>
          </div>
        </div>
        <div class="flex items-center text-[#C7C7CC]">
          <span class="material-symbols-rounded text-xl">chevron_right</span>
        </div>
      </div>
    `;
  });

  if (yourMedsContainer) yourMedsContainer.innerHTML = medsCardsHtml;
}

// Quick Log dose with toast & sound
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

  const med = appState.medications.find(m => m.id === medId);
  showToast(med ? med.name : 'Medication', status === 'taken' ? 'Logged as Taken' : 'Logged as Skipped');

  renderApp();
};

// --- Smooth Modal Close Helper ---
function dismissModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const sheet = modal.firstElementChild;
  if (sheet) {
    sheet.classList.add('sheet-closing');
  }
  modal.classList.add('backdrop-closing');

  setTimeout(() => {
    modal.classList.add('hidden');
    if (sheet) sheet.classList.remove('sheet-closing');
    modal.classList.remove('backdrop-closing');
    document.body.classList.remove('overflow-hidden');
  }, 200);
}

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
      <div class="ios-card p-3.5 sm:p-4 mb-3 border border-black/[0.04]">
        <div class="flex items-center space-x-3 mb-2.5">
          ${renderPillAvatar(med, 'md')}
          <div class="flex-1 min-w-0">
            <div class="text-[16px] font-semibold text-[#1C1C1E] leading-snug truncate">${med.name}</div>
            <div class="text-[13px] font-normal text-[#8E8E93] truncate">${med.form}, ${med.dosage}</div>
            <div class="text-[12px] font-medium text-[#007AFF] mt-0.5 flex items-center">
              1 ${med.form.toLowerCase()} at ${timeLabel}
              <span class="material-symbols-rounded text-sm ml-0.5">chevron_right</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#E5E5EA]/60">
          <button type="button" onclick="toggleDoseStatus('${med.id}', '${timeKey}', 'skipped')" 
            class="h-9 px-3 rounded-full font-medium text-[13px] sm:text-[14px] transition-all flex items-center justify-center space-x-1 ios-touch ${isSkipped ? 'bg-[#CCE4F8] text-[#007AFF] font-semibold ring-2 ring-[#007AFF]/60' : 'bg-[#E5F1FC] text-[#007AFF] hover:bg-[#D5E8FD]'}">
            <span>${isSkipped ? '✓ Skipped' : 'Skipped'}</span>
          </button>
          
          <button type="button" onclick="toggleDoseStatus('${med.id}', '${timeKey}', 'taken')" 
            class="h-9 px-3 rounded-full font-medium text-[13px] sm:text-[14px] transition-all flex items-center justify-center space-x-1 shadow-xs ios-touch ${isTaken ? 'bg-[#007AFF] text-white font-semibold ring-2 ring-blue-300' : 'bg-[#007AFF] text-white hover:bg-[#0066D6]'}">
            <span class="material-symbols-rounded text-[16px]">check</span>
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
    if (desiredStatus === 'taken') {
      const med = appState.medications.find(m => m.id === medId);
      showToast(med ? med.name : 'Medication', 'Logged as Taken');
    }
  }

  saveLogs();
  openRecordedSheet(timeKey);
  renderWeekCalendar();
};

window.closeRecordedSheet = function(e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const modal = document.getElementById('recorded-sheet-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('backdrop-closing');
    const sheet = modal.firstElementChild;
    if (sheet) sheet.classList.remove('sheet-closing');
  }
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
    ? med.times.map(t => `<div class="flex justify-between py-2 border-b border-[#E5E5EA] last:border-none"><span class="font-medium text-[#1C1C1E] text-[15px]">${t.label}</span><span class="text-[#8E8E93] text-[15px]">${t.quantity} ${t.unit}</span></div>`).join('')
    : '<div class="text-[14px] text-[#8E8E93] py-2">No scheduled times</div>';

  content.innerHTML = `
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E5EA] sticky top-0 bg-white/95 backdrop-blur-md z-10">
      <button onclick="closeReviewDetails()" class="text-[#007AFF] font-medium flex items-center text-[16px] ios-touch">
        <span class="material-symbols-rounded text-xl mr-0.5">chevron_left</span>
        Back
      </button>
      <span class="font-semibold text-[#1C1C1E] text-[17px]">Review Details</span>
      <button onclick="openEditSchedule('${med.id}')" class="text-[#007AFF] font-medium text-[16px] ios-touch">Edit</button>
    </div>

    <div class="p-6 text-center max-w-lg mx-auto">
      <div class="flex justify-center mb-3">
        ${renderPillAvatar(med, 'xl')}
      </div>
      <h2 class="text-[26px] font-bold text-[#1C1C1E] mb-0.5">${med.name}</h2>
      <p class="text-[15px] text-[#8E8E93] font-normal mb-5">${med.form}, ${med.dosage}</p>

      <div class="text-left mb-5">
        <div class="text-[12px] font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5 ml-1">Schedule</div>
        <div class="bg-[#F2F2F7] rounded-[16px] p-4">
          <div class="text-[15px] font-medium text-[#8E8E93] mb-2">${med.frequency === 'cyclical' ? 'Cyclical Schedule' : (med.asNeeded ? 'As Needed' : 'Every Day')}</div>
          ${timesText}
        </div>
      </div>

      <div class="text-left mb-6">
        <div class="text-[12px] font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5 ml-1">Optional Details</div>
        <div class="bg-[#F2F2F7] rounded-[16px] p-4 space-y-3">
          <div>
            <div class="text-[12px] text-[#8E8E93]">Nickname</div>
            <div class="text-[15px] font-medium text-[#1C1C1E] mt-0.5">${med.nickname || 'None'}</div>
          </div>
          <div class="border-t border-[#E5E5EA] pt-2">
            <div class="text-[12px] text-[#8E8E93]">Notes & Instructions</div>
            <div class="text-[14px] text-[#1C1C1E] mt-0.5">${med.notes || 'No special notes'}</div>
          </div>
          <div class="border-t border-[#E5E5EA] pt-2 flex justify-between items-center">
            <span class="text-[12px] text-[#8E8E93]">Supply Remaining</span>
            <span class="text-[14px] font-semibold ${med.remainingPills <= 5 ? 'text-red-500' : 'text-[#1C1C1E]'}">${med.remainingPills || 0} pills left</span>
          </div>
        </div>
      </div>

      <div class="space-y-2.5">
        <button onclick="closeReviewDetails()" class="w-full py-3.5 rounded-[14px] bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-[16px] shadow-sm active:scale-98 transition-all">
          Done
        </button>
        <button onclick="deleteMedication('${med.id}')" class="w-full py-2.5 rounded-[14px] text-red-500 font-medium text-[15px] hover:bg-red-50 transition-all">
          Delete Medication
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.closeReviewDetails = function() {
  dismissModal('review-details-modal');
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
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E5EA] sticky top-0 bg-white/95 backdrop-blur z-10">
      <button onclick="closeEditSchedule()" class="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] hover:bg-gray-300 transition-all">
        <span class="material-symbols-rounded text-lg">close</span>
      </button>
      <span class="font-semibold text-[#1C1C1E] text-[17px]">Edit Schedule</span>
      <button onclick="saveScheduleChanges()" class="w-8 h-8 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white flex items-center justify-center shadow-xs transition-all">
        <span class="material-symbols-rounded text-lg">check</span>
      </button>
    </div>

    <div class="p-5 space-y-5 max-h-[85vh] overflow-y-auto no-scrollbar max-w-lg mx-auto pb-14">
      <div>
        <div class="text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">When will you take this?</div>
        <div class="bg-[#F2F2F7] rounded-[16px] overflow-hidden divide-y divide-[#E5E5EA]">
          <div class="p-3.5 flex items-center justify-between">
            <span class="text-[15px] font-normal text-[#1C1C1E]">Schedule Type</span>
            <select id="schedule-freq-select" onchange="toggleCycleSection(this.value)" class="bg-transparent text-[15px] font-medium text-[#007AFF] outline-none cursor-pointer">
              <option value="every_day" ${!isCyclical && !med?.asNeeded ? 'selected' : ''}>Every Day</option>
              <option value="cyclical" ${isCyclical ? 'selected' : ''}>On a Cyclical Schedule</option>
              <option value="as_needed" ${med?.asNeeded ? 'selected' : ''}>As Needed</option>
            </select>
          </div>
          <div class="p-3.5 flex items-center justify-between">
            <span class="text-[15px] font-normal text-[#1C1C1E]">Frequency</span>
            <span class="text-[15px] font-medium text-[#007AFF] flex items-center cursor-pointer">
              Day <span class="material-symbols-rounded text-base ml-0.5">unfold_more</span>
            </span>
          </div>
        </div>
      </div>

      <div>
        <div class="text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">At what time?</div>
        <div class="bg-[#F2F2F7] rounded-[16px] p-3">
          <div id="times-list-rows" class="space-y-2">
            ${currentTimes.map((t, idx) => `
              <div class="flex items-center justify-between p-2 rounded-xl bg-white shadow-xs" data-time-row="${idx}">
                <div class="flex items-center space-x-2.5">
                  <button type="button" onclick="removeTimeRow(${idx})" class="w-6 h-6 rounded-full bg-[#FF3B30] text-white flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-rounded text-sm">remove</span>
                  </button>
                  <input type="time" value="${t.time}" class="px-2.5 py-1 bg-gray-100 rounded-lg text-[15px] font-medium text-[#1C1C1E] outline-none" />
                </div>
                <div class="flex items-center space-x-1.5">
                  <input type="number" min="1" max="10" value="${t.quantity || 1}" class="w-10 py-1 text-center text-[14px] font-semibold text-[#007AFF] bg-blue-50 rounded-lg outline-none" />
                  <span class="text-[13px] text-[#007AFF] font-medium">${t.unit || 'capsules'}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" onclick="addTimeRow()" class="mt-3 flex items-center space-x-2 text-[15px] font-medium text-[#007AFF] hover:opacity-80 py-1 px-1">
            <span class="w-6 h-6 rounded-full bg-[#34C759] text-white flex items-center justify-center">
              <span class="material-symbols-rounded text-sm">add</span>
            </span>
            <span>Add a Time</span>
          </button>
        </div>
        <p class="text-[12px] text-[#8E8E93] mt-2 px-1">If you schedule a time, Health will send you a notification to take your medications.</p>
      </div>

      <div id="cycle-settings-box" class="${isCyclical ? 'block' : 'hidden'}">
        <div class="text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">What is the cycle?</div>
        <div class="bg-[#F2F2F7] rounded-[16px] overflow-hidden divide-y divide-[#E5E5EA]">
          <div class="p-3.5 flex items-center justify-between">
            <span class="text-[15px] font-normal text-[#1C1C1E]">Use for</span>
            <span class="text-[15px] font-medium text-[#007AFF] flex items-center">
              21 days <span class="material-symbols-rounded text-base ml-0.5">unfold_more</span>
            </span>
          </div>
          <div class="p-3.5 flex items-center justify-between">
            <span class="text-[15px] font-normal text-[#1C1C1E]">Pause for</span>
            <span class="text-[15px] font-medium text-[#007AFF] flex items-center">
              7 days <span class="material-symbols-rounded text-base ml-0.5">unfold_more</span>
            </span>
          </div>
        </div>
        <div class="text-[12px] text-[#8E8E93] mt-1.5 px-1 font-normal">Next Pause: April 22</div>
      </div>

      <div>
        <div class="text-[13px] font-medium text-[#8E8E93] mb-1.5 ml-1">Duration</div>
        <div class="bg-[#F2F2F7] rounded-[16px] p-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wide">START DATE</div>
              <div class="text-[15px] font-medium text-[#1C1C1E] mt-0.5">April 1 (Today)</div>
            </div>
            <div>
              <div class="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wide">END DATE</div>
              <div class="text-[15px] font-normal text-[#8E8E93] mt-0.5">None</div>
            </div>
          </div>
          <button class="mt-2.5 text-[14px] font-medium text-[#007AFF]">Edit</button>
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
  newRow.className = 'flex items-center justify-between p-2 rounded-xl bg-white shadow-xs';
  newRow.setAttribute('data-time-row', count);
  newRow.innerHTML = `
    <div class="flex items-center space-x-2.5">
      <button type="button" onclick="this.parentElement.parentElement.remove()" class="w-6 h-6 rounded-full bg-[#FF3B30] text-white flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-rounded text-sm">remove</span>
      </button>
      <input type="time" value="20:00" class="px-2.5 py-1 bg-gray-100 rounded-lg text-[15px] font-medium text-[#1C1C1E] outline-none" />
    </div>
    <div class="flex items-center space-x-1.5">
      <input type="number" min="1" max="10" value="1" class="w-10 py-1 text-center text-[14px] font-semibold text-[#007AFF] bg-blue-50 rounded-lg outline-none" />
      <span class="text-[13px] text-[#007AFF] font-medium">dose</span>
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
  dismissModal('edit-schedule-modal');
  if (editingMedId) openReviewDetails(editingMedId);
};

// --- As Needed Sheet ---
window.openAsNeededSheet = function() {
  const modal = document.getElementById('as-needed-modal');
  const list = document.getElementById('as-needed-list');

  const prnMeds = appState.medications.filter(m => m.asNeeded || m.id === 'med_ibuprofen');

  list.innerHTML = prnMeds.map(med => `
    <div class="ios-card p-3.5 flex items-center justify-between mb-2.5 border border-black/[0.04] hover:border-blue-200 transition-all ios-touch">
      <div class="flex items-center space-x-3.5">
        ${renderPillAvatar(med, 'md')}
        <div>
          <div class="text-[16px] font-semibold text-[#1C1C1E]">${med.name}</div>
          <div class="text-[13px] font-normal text-[#8E8E93]">${med.dosage} • ${med.nickname || 'As Needed'}</div>
        </div>
      </div>
      <button onclick="logAsNeededDose('${med.id}')" class="px-4 py-2 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-medium text-[14px] shadow-xs flex items-center space-x-1">
        <span class="material-symbols-rounded text-base">add</span>
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
  showToast(med.name, 'PRN Dose Taken');
  closeAsNeededSheet();
  renderApp();
};

window.closeAsNeededSheet = function() {
  dismissModal('as-needed-modal');
};

// --- Add New Medication ---
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

  renderAddMedPresets();
  updateAddMedPreview();

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
    <button type="button" onclick="applyMedPreset(${idx})" class="px-3 py-1 rounded-full bg-gray-100 hover:bg-blue-50 text-[13px] font-medium text-gray-700 transition-all border border-gray-200/50 flex-shrink-0 active:scale-95">
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
    previewBox.classList.remove('animate-pill-morph');
    void previewBox.offsetWidth;
    previewBox.classList.add('animate-pill-morph');
  }
};

window.setDraftPillShape = function(shape) {
  newMedDraft.shape = shape;
  newMedDraft.form = shape === 'capsule' ? 'Capsule' : (shape === 'liquid' ? 'Liquid' : 'Tablet');
  
  document.querySelectorAll('.shape-btn').forEach(b => {
    b.classList.remove('ring-2', 'ring-[#007AFF]', 'bg-blue-50');
  });
  const activeBtn = document.getElementById(`shape-btn-${shape}`);
  if (activeBtn) activeBtn.classList.add('ring-2', 'ring-[#007AFF]', 'bg-blue-50');

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
    b.classList.remove('bg-[#007AFF]', 'text-white');
    b.classList.add('bg-gray-100', 'text-gray-700');
  });
  const activeBtn = document.getElementById(`meal-btn-${meal}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
    activeBtn.classList.add('bg-[#007AFF]', 'text-white');
  }
};

window.saveNewMedication = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const nameInput = document.getElementById('new-med-name');
  const doseInput = document.getElementById('new-med-dosage');
  const unitSelect = document.getElementById('new-med-unit');
  const nicknameInput = document.getElementById('new-med-nickname');
  const notesInput = document.getElementById('new-med-notes');
  const freqSelect = document.getElementById('new-med-frequency');
  const timeInput = document.getElementById('new-med-time');
  const supplyInput = document.getElementById('new-med-supply');

  if (!nameInput || !nameInput.value.trim()) {
    alert('Please enter a medication name');
    if (nameInput) nameInput.focus();
    return;
  }

  const id = `med_${Date.now()}`;
  const freq = freqSelect ? freqSelect.value : 'every_day';
  const isPrn = freq === 'as_needed';

  let times = [];
  if (!isPrn && timeInput && timeInput.value) {
    const [h, m] = timeInput.value.split(':');
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    times.push({
      time: timeInput.value,
      label: `${displayHour}:${m} ${ampm}`,
      quantity: 1,
      unit: (newMedDraft.form || 'tablet').toLowerCase()
    });
  } else if (!isPrn) {
    times.push({
      time: '08:00',
      label: '8:00 AM',
      quantity: 1,
      unit: (newMedDraft.form || 'tablet').toLowerCase()
    });
  }

  const doseStr = doseInput ? doseInput.value.trim() : '50';
  const unitStr = unitSelect ? unitSelect.value : 'mg';
  const fullDosage = `${doseStr} ${unitStr}`;

  const newMed = {
    ...newMedDraft,
    id,
    name: nameInput.value.trim(),
    dosage: fullDosage,
    nickname: nicknameInput ? nicknameInput.value.trim() : '',
    notes: notesInput ? notesInput.value.trim() : '',
    frequency: freq,
    asNeeded: isPrn,
    times: times,
    remainingPills: parseInt(supplyInput ? supplyInput.value : 30, 10) || 30,
    totalPills: parseInt(supplyInput ? supplyInput.value : 30, 10) || 30,
    startDate: formatDateKey(new Date())
  };

  appState.medications.push(newMed);
  saveMedications();
  closeAddMedicationModal();
  sounds.playTakeChime();
  showToast(newMed.name, 'Added to Medications', 'add_circle');
  renderApp();
};

window.closeAddMedicationModal = function() {
  dismissModal('add-med-modal');
};

// --- Smooth Page Transition Tab Switching ---
window.switchTab = function(tabName) {
  appState.activeTab = tabName;
  sounds.playTapSound();

  const tabs = ['browse_meds', 'summary', 'sharing'];
  tabs.forEach(t => {
    const mBtn = document.getElementById(`tab-btn-${t}`);
    const dBtn = document.getElementById(`dtab-btn-${t}`);
    const view = document.getElementById(`view-${t}`);
    const isActive = t === tabName;

    if (mBtn) {
      if (isActive) {
        mBtn.classList.add('text-[#007AFF]', 'font-semibold');
        mBtn.classList.remove('text-[#8E8E93]', 'font-normal');
      } else {
        mBtn.classList.remove('text-[#007AFF]', 'font-semibold');
        mBtn.classList.add('text-[#8E8E93]', 'font-normal');
      }
    }

    if (dBtn) {
      if (isActive) {
        dBtn.classList.add('bg-white', 'text-[#007AFF]', 'shadow-xs');
        dBtn.classList.remove('text-[#8E8E93]', 'hover:text-black');
      } else {
        dBtn.classList.remove('bg-white', 'text-[#007AFF]', 'shadow-xs');
        dBtn.classList.add('text-[#8E8E93]', 'hover:text-black');
      }
    }

    if (view) {
      if (isActive) {
        view.classList.remove('hidden');
        view.classList.remove('tab-view-page');
        void view.offsetWidth; // trigger reflow
        view.classList.add('tab-view-page');
      } else {
        view.classList.add('hidden');
      }
    }
  });

  if (tabName === 'summary') renderSummaryStats();
  if (tabName === 'sharing') renderSharingView();
};

// --- Summary Stats ---
function renderSummaryStats() {
  const container = document.getElementById('summary-stats-content');
  if (!container) return;

  let totalDosesPast7Days = 0;
  let takenDosesPast7Days = 0;
  const daysData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const adh = getDayAdherence(d);
    daysData.push({
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percent: adh.percent
    });
    totalDosesPast7Days += adh.total;
    takenDosesPast7Days += adh.taken;
  }

  const overallRate = totalDosesPast7Days > 0 
    ? Math.round((takenDosesPast7Days / totalDosesPast7Days) * 100) 
    : 100;

  container.innerHTML = `
    <div class="ios-card p-6 mb-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-[12px] uppercase tracking-wider text-[#8E8E93] font-semibold">Weekly Adherence</span>
        <span class="bg-[#EEF7FE] text-[#007AFF] px-2.5 py-0.5 rounded-full text-[12px] font-semibold">Active Streak</span>
      </div>
      <div class="flex items-baseline space-x-2">
        <span class="text-[44px] font-bold text-[#1C1C1E] leading-none">${overallRate}%</span>
        <span class="text-[#8E8E93] text-[15px] font-normal">on time</span>
      </div>
      <p class="text-[14px] text-[#8E8E93] mt-2 font-normal">You've logged ${takenDosesPast7Days} of ${totalDosesPast7Days} scheduled doses this week.</p>
    </div>

    <div class="ios-card p-6 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-[18px] font-semibold text-[#1C1C1E]">Daily Consistency</h3>
        <span class="text-[12px] font-medium text-[#007AFF]">Past 7 Days</span>
      </div>

      <div class="flex items-end justify-between h-36 pt-4 pb-2 border-b border-[#E5E5EA]">
        ${daysData.map(d => {
          const heightPercent = Math.max(10, d.percent);
          const barColor = d.percent >= 80 ? 'bg-[#00C7BE]' : (d.percent > 0 ? 'bg-[#FF9500]' : 'bg-[#E5E5EA]');
          return `
            <div class="flex flex-col items-center flex-1 h-full justify-end group">
              <div class="w-7 bg-[#F2F2F7] rounded-full flex flex-col justify-end overflow-hidden h-24">
                <div class="w-full ${barColor} rounded-full transition-all duration-500" style="height: ${heightPercent}%;"></div>
              </div>
              <span class="text-[12px] font-medium text-[#8E8E93] mt-2">${d.dayName}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="ios-card p-6">
      <div class="flex items-center justify-between mb-3.5">
        <h3 class="text-[18px] font-semibold text-[#1C1C1E]">Cabinet Supply</h3>
        <span class="text-[13px] text-[#8E8E93]">${appState.medications.length} Prescriptions</span>
      </div>
      <div class="space-y-3">
        ${appState.medications.map(m => `
          <div class="flex items-center justify-between py-2 border-b border-[#E5E5EA] last:border-none">
            <div class="flex items-center space-x-3">
              ${renderPillAvatar(m, 'sm')}
              <div>
                <div class="text-[15px] font-medium text-[#1C1C1E]">${m.name}</div>
                <div class="text-[13px] text-[#8E8E93]">${m.dosage} • ${m.form}</div>
              </div>
            </div>
            <span class="text-[13px] font-semibold px-2.5 py-1 rounded-lg ${m.remainingPills <= 7 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-[#1C1C1E]'}">
              ${m.remainingPills || 0} pills left
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --- Sharing View ---
function renderSharingView() {
  const container = document.getElementById('sharing-view-content');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-5 max-w-lg mx-auto">
      <div class="ios-card p-6">
        <div class="flex items-center space-x-3.5 mb-5">
          <div class="w-12 h-12 rounded-full bg-red-100 text-[#FF3B30] flex items-center justify-center font-bold text-xl">
            <span class="material-symbols-rounded">medical_information</span>
          </div>
          <div>
            <h3 class="text-[20px] font-bold text-[#1C1C1E] leading-tight">${appState.profile.name}</h3>
            <p class="text-[13px] text-[#8E8E93]">DOB: ${appState.profile.dob} • Blood: ${appState.profile.bloodType}</p>
          </div>
        </div>

        <div class="bg-[#FFF2F2] border border-[#FFD8D8] rounded-[14px] p-3.5 mb-5">
          <div class="text-[11px] font-semibold text-[#FF3B30] uppercase tracking-wide">Allergies</div>
          <div class="text-[14px] text-[#1C1C1E] font-medium mt-0.5">${appState.profile.allergies}</div>
        </div>

        <div class="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2">Prescriptions (${appState.medications.length})</div>
        <div class="space-y-2 mb-5">
          ${appState.medications.map(m => `
            <div class="flex items-center justify-between text-[14px] py-1.5 border-b border-[#E5E5EA] last:border-none">
              <span class="font-medium text-[#1C1C1E]">${m.name} (${m.dosage})</span>
              <span class="text-[#8E8E93]">${m.times?.map(t => t.label).join(', ') || 'PRN'}</span>
            </div>
          `).join('')}
        </div>

        <button onclick="exportMedicationListJSON()" class="w-full py-3.5 rounded-[14px] bg-[#007AFF] hover:bg-[#0066D6] text-white font-medium text-[15px] shadow-xs flex items-center justify-center space-x-2 transition-all">
          <span class="material-symbols-rounded text-lg">share</span>
          <span>Export Medical Report (JSON)</span>
        </button>
      </div>

      <div class="ios-card p-5 space-y-3">
        <div class="text-[15px] font-semibold text-[#1C1C1E]">Data Tools</div>
        <button onclick="resetToSampleData()" class="w-full py-2.5 rounded-[12px] bg-[#F2F2F7] hover:bg-gray-200 text-[#1C1C1E] font-medium text-[14px] transition-all">
          Reset to Apple Health Demo Data
        </button>
      </div>
    </div>
  `;
}

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
  a.download = `Medication_Reminder_${formatDateKey(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.resetToSampleData = function() {
  if (confirm('Reset all medications and logs to Apple Health demo data?')) {
    localStorage.clear();
    loadData();
    renderApp();
    showToast('Reset Complete', 'Default Sample Data Restored', 'refresh');
  }
};

function renderApp() {
  renderWeekCalendar();
  renderScheduleView();
  if (appState.activeTab === 'summary') renderSummaryStats();
  if (appState.activeTab === 'sharing') renderSharingView();
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderApp();

  document.addEventListener('click', () => sounds.init(), { once: true });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
