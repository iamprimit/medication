/**
 * Medication Reminder - Apple Health & Material 3 Hybrid Web App
 * Fully featured client-side app for GitHub Pages
 */

// --- Data Models & Storage Keys ---
const STORAGE_KEYS = {
  MEDICATIONS: 'apple_health_medications_v1',
  LOGS: 'apple_health_logs_v1',
  SETTINGS: 'apple_health_settings_v1',
  PROFILE: 'apple_health_profile_v1',
};

// Initial Seed Data matching user's screenshots
const DEFAULT_MEDICATIONS = [
  {
    id: 'med_levo',
    name: 'Levothyroxine',
    dosage: '200 mg',
    form: 'Tablet',
    shape: 'tablet',
    bgColor: '#EBDDF5',      // Soft mauve/purple circle
    pillColor: '#FDE0B4',    // Light tan/peach tablet
    secondaryColor: '#FDE0B4',
    frequency: 'every_day',
    times: [
      { time: '08:00', label: '8:00 AM', quantity: 1, unit: 'tablet' }
    ],
    asNeeded: false,
    nickname: 'Thyroid',
    notes: 'Take in morning on empty stomach with a full glass of water, 30 min before food.',
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
    bgColor: '#EAF2CC',      // Olive green circle
    pillColor: '#B0BD48',    // Sage olive half
    secondaryColor: '#F3E5AB', // Soft cream/amber half
    frequency: 'every_day',
    times: [
      { time: '08:00', label: '8:00 AM', quantity: 1, unit: 'capsule' }
    ],
    asNeeded: false,
    nickname: 'Fish Oil',
    notes: 'Take with morning meal to enhance absorption.',
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
    bgColor: '#FEF4CC',      // Yellow circle
    pillColor: '#FFFFFF',    // White round tablet
    secondaryColor: '#FFFFFF',
    frequency: 'every_day',
    times: [
      { time: '12:00', label: '12:00 PM', quantity: 1, unit: 'tablet' }
    ],
    asNeeded: false,
    nickname: 'Bone Health',
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
    bgColor: '#FEF4CC',      // Yellow circle
    pillColor: '#FFFFFF',    // White tablet
    secondaryColor: '#FFFFFF',
    frequency: 'cyclical',
    cycle: {
      useDays: 21,
      pauseDays: 7,
      startDate: '2026-04-01'
    },
    times: [
      { time: '08:50', label: '8:50 AM', quantity: 1, unit: 'tablet' }
    ],
    asNeeded: false,
    nickname: 'Baby Aspirin',
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
    bgColor: '#FEE2E2',      // Light coral circle
    pillColor: '#F87171',    // Red-orange oval caplet
    secondaryColor: '#F87171',
    frequency: 'as_needed',
    times: [],
    asNeeded: true,
    nickname: 'Advil',
    notes: 'Take for headache or fever as needed. Maximum 1200mg/day.',
    remainingPills: 20,
    totalPills: 30,
    startDate: '2026-04-01'
  }
];

// App State
let appState = {
  activeTab: 'browse_meds', // 'summary' | 'sharing' | 'browse_meds'
  selectedDate: new Date(),  // Current date being viewed
  medications: [],
  logs: {},                  // { 'YYYY-MM-DD': { 'medId_time': { status: 'taken'|'skipped', timestamp: '' } } }
  settings: {
    soundEnabled: true,
    hapticsEnabled: true,
    notificationsEnabled: false,
    isDesktopFrameMode: true
  },
  profile: {
    name: 'Alex Morgan',
    dob: '1990-05-14',
    bloodType: 'O+',
    allergies: 'Penicillin'
  }
};

// --- Web Audio Synthesizer (iOS Apple Health style chime) ---
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
      // Dual high melodic chime (Apple style celebratory bell)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Notes: E6 (1318 Hz) to B6 (1975 Hz)
      osc1.frequency.setValueAtTime(1046.5, now); // C6
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12); // E6

      osc2.frequency.setValueAtTime(1567.98, now + 0.08); // G6
      osc2.frequency.exponentialRampToValueAtTime(2093.0, now + 0.22); // C7

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
    } catch (e) {
      console.warn('Audio play failed', e);
    }
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
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

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

// --- Storage & Initialization ---
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

    // If logs are completely empty, pre-seed today's 8:00 AM log so it matches Screenshot 2 & 3!
    const todayStr = formatDateKey(appState.selectedDate);
    if (!appState.logs[todayStr]) {
      appState.logs[todayStr] = {
        'med_levo_08:00': { status: 'taken', timestamp: new Date().toISOString() },
        'med_omega3_08:00': { status: 'taken', timestamp: new Date().toISOString() }
      };
      saveLogs();
    }
  } catch (err) {
    console.error('Failed to load storage', err);
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

// --- Dynamic Island Banner Controller ---
function triggerDynamicIsland(title, subtitle, icon = 'pill') {
  const island = document.getElementById('dynamic-island-pill');
  const islandText = document.getElementById('dynamic-island-text');
  const islandIcon = document.getElementById('dynamic-island-icon');

  if (!island || !islandText) return;

  islandIcon.textContent = icon;
  islandText.innerHTML = `<span class="font-semibold text-white">${title}</span> <span class="text-xs text-gray-300 ml-1">${subtitle}</span>`;

  island.classList.remove('w-28', 'h-7');
  island.classList.add('w-[88%]', 'h-10', 'bg-black/95', 'px-3', 'shadow-xl');

  setTimeout(() => {
    island.classList.remove('w-[88%]', 'h-10', 'bg-black/95', 'px-3', 'shadow-xl');
    island.classList.add('w-28', 'h-7');
    islandText.innerHTML = '';
  }, 3200);
}

// --- Render 3D Pill Graphics ---
function renderPillAvatar(med, size = 'md') {
  const sizeMap = {
    sm: { container: 'w-10 h-10', pill: 'w-6 h-6', capsuleW: 'w-7 h-3.5', round: 'w-5 h-5' },
    md: { container: 'w-12 h-12', pill: 'w-7 h-7', capsuleW: 'w-8 h-4', round: 'w-6 h-6' },
    lg: { container: 'w-16 h-16', pill: 'w-10 h-10', capsuleW: 'w-12 h-6', round: 'w-9 h-9' },
    xl: { container: 'w-24 h-24', pill: 'w-14 h-14', capsuleW: 'w-16 h-8', round: 'w-12 h-12' },
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
      <span class="material-symbols-rounded text-2xl text-blue-500 drop-shadow">water_drop</span>
    `;
  } else {
    // Default Round Tablet
    pillHtml = `
      <div class="tablet-3d ${dim.round}" style="background: radial-gradient(circle at 35% 35%, #ffffff 0%, ${pillCol} 70%);"></div>
    `;
  }

  return `
    <div class="pill-avatar-container ${dim.container} rounded-full flex-shrink-0 shadow-inner" style="background-color: ${bgCol};">
      ${pillHtml}
    </div>
  `;
}

// --- Adherence Calculation ---
function getDayAdherence(date) {
  const dateStr = formatDateKey(date);
  const dayLogs = appState.logs[dateStr] || {};

  // Find all scheduled doses for this day
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
  const percent = Math.round((takenCount / totalScheduled) * 100);

  if (percent === 100) return { status: 'full', percent, taken: takenCount, total: totalScheduled };
  if (percent > 0) return { status: 'partial', percent, taken: takenCount, total: totalScheduled };
  
  // Future vs unrecorded
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) {
    return { status: 'future', percent: 0, taken: 0, total: totalScheduled };
  }
  return { status: 'empty', percent: 0, taken: 0, total: totalScheduled };
}

// --- Render Week Strip (Screenshot 3 & 4) ---
function renderWeekCalendar() {
  const weekContainer = document.getElementById('week-calendar-strip');
  if (!weekContainer) return;

  const startOfWeek = getStartOfWeek(appState.selectedDate);
  const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();

  let html = '';

  for (let i = 0; i < 7; i++) {
    const curDate = new Date(startOfWeek);
    curDate.setDate(startOfWeek.getDate() + i);

    const isSelected = formatDateKey(curDate) === formatDateKey(appState.selectedDate);
    const isCurrentToday = isToday(curDate);
    const adherence = getDayAdherence(curDate);

    // Dynamic Dot styling matching Apple Health
    let dotClass = 'day-dot';
    let dotSvg = '';

    if (adherence.status === 'full') {
      dotClass += ' full';
      dotSvg = `<span class="material-symbols-rounded text-white text-[16px]">check</span>`;
    } else if (adherence.status === 'partial') {
      // Half cyan, half gray circle SVG
      dotSvg = `
        <svg class="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.915" fill="#E5E5EA" />
          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#00C7BE" stroke-width="31.83" stroke-dasharray="${adherence.percent} 100" />
        </svg>
      `;
    } else if (adherence.status === 'future') {
      dotClass += ' future';
    } else {
      dotClass += ' empty';
    }

    html += `
      <div class="flex flex-col items-center flex-1 cursor-pointer select-none group" onclick="selectDate('${curDate.toISOString()}')">
        <div class="h-4 flex items-center justify-center mb-0.5">
          ${isSelected ? `<span class="text-[10px] text-black">▼</span>` : ''}
        </div>
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isSelected ? 'bg-black text-white' : 'text-gray-500'}">
          ${dayLetters[i]}
        </div>
        <div class="mt-2 relative w-8 h-8 flex items-center justify-center">
          ${adherence.status === 'partial' ? dotSvg : `
            <div class="${dotClass} ${adherence.status === 'full' ? 'bg-[#00C7BE]' : ''}">
              ${dotSvg}
            </div>
          `}
        </div>
      </div>
    `;
  }

  weekContainer.innerHTML = html;
  document.getElementById('header-date-title').textContent = formatDayHeader(appState.selectedDate);
}

// Change selected date
window.selectDate = function(isoStr) {
  appState.selectedDate = new Date(isoStr);
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

window.navigateWeek = function(direction) {
  const d = new Date(appState.selectedDate);
  d.setDate(d.getDate() + (direction * 7));
  appState.selectedDate = d;
  sounds.playTapSound();
  renderApp();
};

// --- Render Main Schedule / Medications View ---
function renderScheduleView() {
  const dateKey = formatDateKey(appState.selectedDate);
  const dayLogs = appState.logs[dateKey] || {};

  // Group medications by time slot
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

  // Sort time slots chronologically
  const sortedTimes = Object.keys(timeSlots).sort();

  const logUpcomingContainer = document.getElementById('log-upcoming-section');
  const loggedSection = document.getElementById('logged-section');
  const yourMedsContainer = document.getElementById('your-meds-list');

  let upcomingHtml = '';
  let loggedHtml = '';

  // Separate time slots into Upcoming (all or partially untaken) vs Logged (all recorded)
  sortedTimes.forEach(timeKey => {
    const slot = timeSlots[timeKey];
    let allTakenOrSkipped = true;
    let anyRecorded = false;
    let recordedMeds = [];

    slot.meds.forEach(med => {
      const doseId = `${med.id}_${slot.time}`;
      const log = dayLogs[doseId];
      if (log && (log.status === 'taken' || log.status === 'skipped')) {
        anyRecorded = true;
        recordedMeds.push({ med, log });
      } else {
        allTakenOrSkipped = false;
      }
    });

    // If not all taken/skipped, it belongs in "Log" (Upcoming)
    if (!allTakenOrSkipped) {
      slot.meds.forEach(med => {
        const doseId = `${med.id}_${slot.time}`;
        const log = dayLogs[doseId];
        if (!log || log.status === 'none') {
          upcomingHtml += `
            <div class="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-center justify-between mb-3 shadow-sm hover:shadow transition-all ios-touch">
              <div class="flex items-center space-x-3.5 flex-1 cursor-pointer" onclick="openRecordedSheet('${slot.time}')">
                ${renderPillAvatar(med, 'md')}
                <div>
                  <div class="text-xs font-semibold text-gray-400 tracking-wide uppercase">${slot.label}</div>
                  <div class="text-base font-bold text-gray-900 leading-tight">${med.name}</div>
                  <div class="text-xs text-gray-500">${med.dosage} • ${med.dosageQuantity || 1} ${med.form}</div>
                </div>
              </div>
              <button onclick="quickLogDose('${med.id}', '${slot.time}', 'taken')" class="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all" title="Mark as Taken">
                <span class="material-symbols-rounded text-xl">add</span>
              </button>
            </div>
          `;
        }
      });
    }

    // If any are recorded for this time slot, show under "Logged"
    if (anyRecorded) {
      loggedHtml += `
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 ios-touch cursor-pointer" onclick="openRecordedSheet('${slot.time}')">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100">
            <span class="text-sm font-bold text-gray-900">${slot.label}</span>
            <span class="text-xs text-gray-400 flex items-center font-medium">Recorded <span class="material-symbols-rounded text-sm ml-0.5">chevron_right</span></span>
          </div>
          <div class="mt-2.5 space-y-2">
            ${slot.meds.map(med => {
              const doseId = `${med.id}_${slot.time}`;
              const log = dayLogs[doseId];
              if (!log || log.status === 'none') return '';
              const isTaken = log.status === 'taken';
              return `
                <div class="flex items-center space-x-2.5">
                  <span class="material-symbols-rounded text-[20px] ${isTaken ? 'text-[#00C7BE]' : 'text-gray-400'}">
                    ${isTaken ? 'check_circle' : 'cancel'}
                  </span>
                  <span class="text-sm font-semibold text-gray-800 ${isTaken ? '' : 'line-through text-gray-400'}">${med.name}</span>
                  <span class="text-xs text-gray-400">(${isTaken ? 'Taken' : 'Skipped'})</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  });

  // Always show As Needed row under "Log"
  const asNeededCard = `
    <div class="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-center justify-between mb-3 shadow-sm hover:shadow transition-all ios-touch cursor-pointer" onclick="openAsNeededSheet()">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <span class="material-symbols-rounded text-2xl">medication</span>
        </div>
        <div>
          <div class="text-base font-bold text-gray-900">As Needed Medications</div>
          <div class="text-xs text-gray-500">Log unscheduled or PRN doses</div>
        </div>
      </div>
      <button class="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all">
        <span class="material-symbols-rounded text-xl">add</span>
      </button>
    </div>
  `;

  if (logUpcomingContainer) {
    logUpcomingContainer.innerHTML = (upcomingHtml || `<div class="bg-white rounded-2xl p-4 text-center text-sm text-gray-500 border border-gray-100 mb-3 shadow-sm">All scheduled medications logged for this day! 🎉</div>`) + asNeededCard;
  }

  if (loggedSection) {
    if (loggedHtml) {
      loggedSection.style.display = 'block';
      document.getElementById('logged-list').innerHTML = loggedHtml;
    } else {
      loggedSection.style.display = 'none';
    }
  }

  // Render "Your Medications" cards at the bottom of the browse/schedule view
  if (yourMedsContainer) {
    let medsCardsHtml = '';
    appState.medications.forEach(med => {
      const scheduleText = med.asNeeded 
        ? 'As Needed' 
        : (med.times && med.times.length > 0 ? med.times.map(t => t.label).join(', ') : 'Daily');

      medsCardsHtml += `
        <div class="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-center justify-between mb-2.5 ios-touch cursor-pointer hover:border-gray-200 transition-all" onclick="openReviewDetails('${med.id}')">
          <div class="flex items-center space-x-3.5">
            ${renderPillAvatar(med, 'md')}
            <div>
              <div class="text-base font-bold text-gray-900 leading-tight">${med.name}</div>
              <div class="text-xs text-gray-500">${med.form}, ${med.dosage}</div>
              <div class="text-xs text-blue-600 font-medium mt-0.5">${scheduleText}</div>
            </div>
          </div>
          <div class="flex items-center text-gray-400">
            <span class="material-symbols-rounded text-xl">chevron_right</span>
          </div>
        </div>
      `;
    });
    yourMedsContainer.innerHTML = medsCardsHtml;
  }
}

// Quick Log dose directly from button
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
  triggerDynamicIsland(med ? med.name : 'Medication', status === 'taken' ? 'Logged as Taken' : 'Logged as Skipped');

  renderApp();
};

// --- Recorded At Modal Sheet (Screenshot 2) ---
let currentRecordingTime = null;

window.openRecordedSheet = function(timeKey) {
  currentRecordingTime = timeKey;
  const dateKey = formatDateKey(appState.selectedDate);
  const dayLogs = appState.logs[dateKey] || {};

  // Find all meds scheduled for this time
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
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4 transition-all">
        <div class="flex items-center space-x-4 mb-3">
          ${renderPillAvatar(med, 'lg')}
          <div>
            <div class="text-lg font-bold text-gray-900">${med.name}</div>
            <div class="text-sm text-gray-500 font-medium">${med.form}, ${med.dosage}</div>
            <div class="text-xs text-blue-600 font-semibold mt-0.5 flex items-center">
              1 ${med.form.toLowerCase()} at ${timeLabel}
              <span class="material-symbols-rounded text-sm ml-0.5">chevron_right</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons (Skipped / Taken) -->
        <div class="grid grid-cols-2 gap-3 mt-4">
          <button onclick="toggleDoseStatus('${med.id}', '${timeKey}', 'skipped')" 
            class="py-3 px-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center space-x-1.5 ios-touch ${isSkipped ? 'bg-sky-200 text-sky-800 ring-2 ring-sky-400' : 'bg-sky-100/80 text-blue-600 hover:bg-sky-100'}">
            <span>${isSkipped ? '✓ Skipped' : 'Skipped'}</span>
          </button>
          
          <button onclick="toggleDoseStatus('${med.id}', '${timeKey}', 'taken')" 
            class="py-3 px-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center space-x-1.5 shadow-sm ios-touch ${isTaken ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2' : 'bg-blue-500 text-white hover:bg-blue-600'}">
            <span class="material-symbols-rounded text-base">check</span>
            <span>Taken</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Show bottom sheet
  const sheet = document.getElementById('recorded-sheet-modal');
  sheet.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.toggleDoseStatus = function(medId, timeKey, desiredStatus) {
  const dateKey = formatDateKey(appState.selectedDate);
  if (!appState.logs[dateKey]) appState.logs[dateKey] = {};

  const doseKey = `${medId}_${timeKey}`;
  const currentStatus = appState.logs[dateKey][doseKey]?.status;

  // Toggle off if already in that status
  if (currentStatus === desiredStatus) {
    appState.logs[dateKey][doseKey].status = 'none';
  } else {
    appState.logs[dateKey][doseKey] = {
      status: desiredStatus,
      timestamp: new Date().toISOString()
    };
    if (desiredStatus === 'taken') {
      sounds.playTakeChime();
    } else {
      sounds.playTapSound();
    }
  }

  saveLogs();
  openRecordedSheet(timeKey); // Re-render sheet immediately
  renderWeekCalendar();
};

window.closeRecordedSheet = function() {
  document.getElementById('recorded-sheet-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  renderApp();
};

// --- Review Details / Medication Inspector (Screenshot 5) ---
window.openReviewDetails = function(medId) {
  const med = appState.medications.find(m => m.id === medId);
  if (!med) return;

  const modal = document.getElementById('review-details-modal');
  const content = document.getElementById('review-details-content');

  const timesText = med.times && med.times.length > 0 
    ? med.times.map(t => `<div class="flex justify-between py-2 border-b border-gray-100 last:border-none"><span class="font-semibold text-gray-800">${t.label}</span><span class="text-gray-500">${t.quantity} ${t.unit}</span></div>`).join('')
    : '<div class="text-sm text-gray-500 py-2">No scheduled times</div>';

  content.innerHTML = `
    <!-- Top Bar -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200/60 sticky top-0 bg-white/95 backdrop-blur-md z-10">
      <button onclick="closeReviewDetails()" class="text-blue-500 font-medium flex items-center text-base ios-touch">
        <span class="material-symbols-rounded text-xl mr-0.5">chevron_left</span>
        Back
      </button>
      <span class="font-bold text-gray-900 text-base">Review Details</span>
      <button onclick="openEditSchedule('${med.id}')" class="text-blue-500 font-semibold text-base ios-touch">Edit</button>
    </div>

    <div class="p-6 text-center">
      <div class="flex justify-center mb-3">
        ${renderPillAvatar(med, 'xl')}
      </div>
      <h2 class="text-2xl font-extrabold text-gray-900 mb-0.5">${med.name}</h2>
      <p class="text-sm text-gray-500 font-medium mb-6">${med.form}, ${med.dosage}</p>

      <!-- Schedule Card -->
      <div class="text-left mb-6">
        <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Schedule</div>
        <div class="bg-gray-100/90 rounded-2xl p-4">
          <div class="text-sm font-semibold text-gray-500 mb-2">${med.frequency === 'cyclical' ? 'Cyclical Schedule' : (med.asNeeded ? 'As Needed' : 'Every Day')}</div>
          ${timesText}
        </div>
      </div>

      <!-- Optional Details Card -->
      <div class="text-left mb-6">
        <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Optional Details</div>
        <div class="bg-gray-100/90 rounded-2xl p-4 space-y-3">
          <div>
            <div class="text-xs text-gray-400 font-medium">Nickname</div>
            <div class="text-sm font-semibold text-gray-800">${med.nickname || 'None'}</div>
          </div>
          <div class="border-t border-gray-200/60 pt-2">
            <div class="text-xs text-gray-400 font-medium">Notes</div>
            <div class="text-sm text-gray-700">${med.notes || 'No special notes'}</div>
          </div>
          <div class="border-t border-gray-200/60 pt-2 flex justify-between items-center">
            <span class="text-xs text-gray-400 font-medium">Supply / Refill Remaining</span>
            <span class="text-sm font-bold ${med.remainingPills <= 5 ? 'text-red-500' : 'text-gray-800'}">${med.remainingPills || 0} left</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button onclick="closeReviewDetails()" class="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-md active:scale-98 transition-all">
          Done
        </button>
        <button onclick="deleteMedication('${med.id}')" class="w-full py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition-all">
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
    triggerDynamicIsland('Medication Removed', '', 'delete');
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
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
      <button onclick="closeEditSchedule()" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-all">
        <span class="material-symbols-rounded text-lg">close</span>
      </button>
      <span class="font-bold text-gray-900 text-base">Edit Schedule</span>
      <button onclick="saveScheduleChanges()" class="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-all">
        <span class="material-symbols-rounded text-lg">check</span>
      </button>
    </div>

    <div class="p-5 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar pb-16">
      
      <!-- When will you take this? -->
      <div>
        <div class="text-sm font-bold text-gray-500 mb-2">When will you take this?</div>
        <div class="bg-gray-100/90 rounded-2xl overflow-hidden divide-y divide-gray-200/60">
          <div class="p-4 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">Schedule Type</span>
            <select id="schedule-freq-select" onchange="toggleCycleSection(this.value)" class="bg-transparent text-sm font-bold text-blue-600 outline-none cursor-pointer">
              <option value="every_day" ${!isCyclical && !med?.asNeeded ? 'selected' : ''}>Every Day</option>
              <option value="cyclical" ${isCyclical ? 'selected' : ''}>On a Cyclical Schedule</option>
              <option value="as_needed" ${med?.asNeeded ? 'selected' : ''}>As Needed</option>
            </select>
          </div>
          <div class="p-4 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">Frequency Interval</span>
            <span class="text-sm font-bold text-blue-600 flex items-center cursor-pointer">
              Every Day <span class="material-symbols-rounded text-base ml-1">unfold_more</span>
            </span>
          </div>
        </div>
      </div>

      <!-- At what time? -->
      <div>
        <div class="text-sm font-bold text-gray-500 mb-2">At what time?</div>
        <div class="bg-gray-100/90 rounded-2xl p-3">
          <div id="times-list-rows" class="space-y-3">
            ${currentTimes.map((t, idx) => `
              <div class="flex items-center justify-between p-2 rounded-xl bg-white shadow-xs" data-time-row="${idx}">
                <div class="flex items-center space-x-2">
                  <button type="button" onclick="removeTimeRow(${idx})" class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-rounded text-sm">remove</span>
                  </button>
                  <input type="time" value="${t.time}" class="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="flex items-center space-x-1">
                  <input type="number" min="1" max="10" value="${t.quantity || 1}" class="w-12 py-1 px-1.5 text-center text-sm font-bold text-blue-600 bg-blue-50 rounded-lg outline-none" />
                  <span class="text-xs text-blue-600 font-semibold">${t.unit || 'dose'}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" onclick="addTimeRow()" class="mt-3 flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700 py-1 px-2">
            <span class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
              <span class="material-symbols-rounded text-sm">add</span>
            </span>
            <span>Add a Time</span>
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2 px-1">If you schedule a time, Medication Reminder will send you notifications to take your medications.</p>
      </div>

      <!-- What is the cycle? -->
      <div id="cycle-settings-box" class="${isCyclical ? 'block' : 'hidden'}">
        <div class="text-sm font-bold text-gray-500 mb-2">What is the cycle?</div>
        <div class="bg-gray-100/90 rounded-2xl overflow-hidden divide-y divide-gray-200/60">
          <div class="p-4 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">Use for</span>
            <span class="text-sm font-bold text-blue-600 flex items-center">
              21 days <span class="material-symbols-rounded text-base ml-1">unfold_more</span>
            </span>
          </div>
          <div class="p-4 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">Pause for</span>
            <span class="text-sm font-bold text-blue-600 flex items-center">
              7 days <span class="material-symbols-rounded text-base ml-1">unfold_more</span>
            </span>
          </div>
        </div>
        <div class="text-xs text-gray-400 mt-1.5 px-1 font-medium">Next Pause: May 12</div>
      </div>

      <!-- Duration -->
      <div>
        <div class="text-sm font-bold text-gray-500 mb-2">Duration</div>
        <div class="bg-gray-100/90 rounded-2xl p-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wide">START DATE</div>
              <div class="text-sm font-bold text-gray-800 mt-0.5">Today</div>
            </div>
            <div>
              <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wide">END DATE</div>
              <div class="text-sm font-semibold text-gray-500 mt-0.5">None</div>
            </div>
          </div>
          <button class="mt-3 text-xs font-bold text-blue-600">Edit</button>
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
    <div class="flex items-center space-x-2">
      <button type="button" onclick="this.parentElement.parentElement.remove()" class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-rounded text-sm">remove</span>
      </button>
      <input type="time" value="20:00" class="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div class="flex items-center space-x-1">
      <input type="number" min="1" max="10" value="1" class="w-12 py-1 px-1.5 text-center text-sm font-bold text-blue-600 bg-blue-50 rounded-lg outline-none" />
      <span class="text-xs text-blue-600 font-semibold">dose</span>
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

  // Read time rows
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
  triggerDynamicIsland('Schedule Updated', med.name);
  renderApp();
};

window.closeEditSchedule = function() {
  document.getElementById('edit-schedule-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  if (editingMedId) {
    openReviewDetails(editingMedId);
  }
};

// --- As Needed (PRN) Medications Sheet ---
window.openAsNeededSheet = function() {
  const modal = document.getElementById('as-needed-modal');
  const list = document.getElementById('as-needed-list');

  const prnMeds = appState.medications.filter(m => m.asNeeded || m.id === 'med_ibuprofen');

  list.innerHTML = prnMeds.map(med => `
    <div class="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-3 border border-gray-100 hover:border-blue-200 transition-all ios-touch">
      <div class="flex items-center space-x-3.5">
        ${renderPillAvatar(med, 'md')}
        <div>
          <div class="font-bold text-gray-900">${med.name}</div>
          <div class="text-xs text-gray-500">${med.dosage} • ${med.nickname || 'As Needed'}</div>
        </div>
      </div>
      <button onclick="logAsNeededDose('${med.id}')" class="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-sm flex items-center space-x-1">
        <span class="material-symbols-rounded text-sm">add</span>
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
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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
  triggerDynamicIsland(`${med.name} Taken`, 'PRN Dose');
  closeAsNeededSheet();
  renderApp();
};

window.closeAsNeededSheet = function() {
  document.getElementById('as-needed-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
};

// --- Add New Medication Flow (Wizard) ---
let newMedDraft = {
  name: '',
  form: 'Tablet',
  dosage: '100 mg',
  shape: 'tablet',
  bgColor: '#FEF4CC',
  pillColor: '#FACC15',
  secondaryColor: '#FFFFFF',
  frequency: 'every_day',
  times: [{ time: '08:00', label: '8:00 AM', quantity: 1, unit: 'tablet' }],
  asNeeded: false,
  nickname: '',
  notes: '',
  remainingPills: 30,
  totalPills: 30
};

window.openAddMedicationModal = function() {
  newMedDraft = {
    name: '',
    form: 'Tablet',
    dosage: '100 mg',
    shape: 'tablet',
    bgColor: '#FEF4CC',
    pillColor: '#FACC15',
    secondaryColor: '#FFFFFF',
    frequency: 'every_day',
    times: [{ time: '08:00', label: '8:00 AM', quantity: 1, unit: 'tablet' }],
    asNeeded: false,
    nickname: '',
    notes: '',
    remainingPills: 30,
    totalPills: 30
  };

  updateAddMedPreview();
  document.getElementById('add-med-modal').classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.updateAddMedPreview = function() {
  const previewBox = document.getElementById('new-med-preview-avatar');
  if (previewBox) {
    previewBox.innerHTML = renderPillAvatar(newMedDraft, 'xl');
  }
};

window.setDraftPillShape = function(shape) {
  newMedDraft.shape = shape;
  newMedDraft.form = shape === 'capsule' ? 'Capsule' : (shape === 'liquid' ? 'Liquid' : 'Tablet');
  updateAddMedPreview();
};

window.setDraftColor = function(bg, pill, sec) {
  newMedDraft.bgColor = bg;
  newMedDraft.pillColor = pill;
  newMedDraft.secondaryColor = sec || pill;
  updateAddMedPreview();
};

window.saveNewMedication = function(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('new-med-name');
  const doseInput = document.getElementById('new-med-dosage');
  const nicknameInput = document.getElementById('new-med-nickname');
  const notesInput = document.getElementById('new-med-notes');
  const freqSelect = document.getElementById('new-med-frequency');
  const timeInput = document.getElementById('new-med-time');

  if (!nameInput.value.trim()) {
    alert('Please enter medication name');
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

  const newMed = {
    ...newMedDraft,
    id,
    name: nameInput.value.trim(),
    dosage: doseInput.value.trim() || '1 dose',
    nickname: nicknameInput.value.trim(),
    notes: notesInput.value.trim(),
    frequency: freq,
    asNeeded: isPrn,
    times: times,
    startDate: formatDateKey(new Date())
  };

  appState.medications.push(newMed);
  saveMedications();
  closeAddMedicationModal();
  sounds.playTakeChime();
  triggerDynamicIsland('Medication Added', newMed.name, 'add');
  renderApp();
};

window.closeAddMedicationModal = function() {
  document.getElementById('add-med-modal').classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
};

// --- Switch Tabs (Summary / Sharing / Browse) ---
window.switchTab = function(tabName) {
  appState.activeTab = tabName;
  sounds.playTapSound();

  // Highlight bottom bar buttons
  const tabs = ['summary', 'sharing', 'browse_meds'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const view = document.getElementById(`view-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.classList.add('text-blue-600', 'font-bold');
        btn.classList.remove('text-gray-400', 'font-medium');
      } else {
        btn.classList.remove('text-blue-600', 'font-bold');
        btn.classList.add('text-gray-400', 'font-medium');
      }
    }
    if (view) {
      if (t === tabName) view.classList.remove('hidden');
      else view.classList.add('hidden');
    }
  });

  if (tabName === 'summary') renderSummaryStats();
  if (tabName === 'sharing') renderSharingView();
};

// --- Summary & Adherence Insights View ---
function renderSummaryStats() {
  const container = document.getElementById('summary-stats-content');
  if (!container) return;

  // Calculate past 7 days adherence
  let totalDoses = 0;
  let takenDoses = 0;
  const daysData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const adh = getDayAdherence(d);
    daysData.push({
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      percent: adh.percent
    });
    totalDoses += adh.total;
    takenDoses += adh.taken;
  }

  const overallRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  container.innerHTML = `
    <!-- Top Card: Overall Adherence -->
    <div class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-3xl p-6 shadow-lg mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs uppercase tracking-wider text-blue-100 font-semibold">Weekly Adherence</span>
        <span class="bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold">7-Day Streak</span>
      </div>
      <div class="flex items-baseline space-x-2">
        <span class="text-5xl font-black">${overallRate}%</span>
        <span class="text-blue-200 text-sm">on time</span>
      </div>
      <p class="text-xs text-blue-100 mt-2 font-medium">Great job! You've taken ${takenDoses} of ${totalDoses} scheduled doses this week.</p>
    </div>

    <!-- 7-Day Chart -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
      <div class="text-sm font-bold text-gray-900 mb-4">Daily Consistency</div>
      <div class="flex items-end justify-between h-28 pt-4 px-2">
        ${daysData.map(d => `
          <div class="flex flex-col items-center space-y-2 flex-1">
            <div class="w-7 bg-gray-100 rounded-full flex flex-col justify-end overflow-hidden h-20">
              <div class="w-full bg-[#00C7BE] rounded-full transition-all duration-500" style="height: ${d.percent}%;"></div>
            </div>
            <span class="text-xs font-bold text-gray-500">${d.day}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Active Medications Status -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
      <div class="text-sm font-bold text-gray-900 mb-3">Cabinet Inventory</div>
      <div class="space-y-3">
        ${appState.medications.map(m => `
          <div class="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-none">
            <div class="flex items-center space-x-3">
              ${renderPillAvatar(m, 'sm')}
              <div>
                <div class="text-sm font-bold text-gray-800">${m.name}</div>
                <div class="text-xs text-gray-400">${m.dosage}</div>
              </div>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-lg ${m.remainingPills < 10 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}">
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
    <!-- Medical ID Card -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
          <span class="material-symbols-rounded">medical_information</span>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">${appState.profile.name}</h3>
          <p class="text-xs text-gray-400">DOB: ${appState.profile.dob} • Blood: ${appState.profile.bloodType}</p>
        </div>
      </div>

      <div class="bg-red-50/70 border border-red-100 rounded-xl p-3 mb-4">
        <div class="text-xs font-bold text-red-700">Allergies & Reactions</div>
        <div class="text-sm text-red-900 font-semibold">${appState.profile.allergies}</div>
      </div>

      <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Prescriptions (${appState.medications.length})</div>
      <div class="space-y-2 mb-5">
        ${appState.medications.map(m => `
          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-none">
            <span class="font-bold text-gray-800">${m.name} (${m.dosage})</span>
            <span class="text-gray-500">${m.times?.map(t => t.label).join(', ') || 'PRN'}</span>
          </div>
        `).join('')}
      </div>

      <button onclick="exportMedicationListJSON()" class="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2">
        <span class="material-symbols-rounded text-lg">share</span>
        <span>Export Health Report (JSON)</span>
      </button>
    </div>

    <!-- Reset / Demo Data Tools -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
      <div class="text-sm font-bold text-gray-900">Data Management</div>
      <button onclick="resetToSampleData()" class="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-all">
        Reset to Apple Health Demo Data
      </button>
      <button onclick="triggerTestReminder()" class="w-full py-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs transition-all flex items-center justify-center space-x-1">
        <span class="material-symbols-rounded text-base">notifications_active</span>
        <span>Trigger Live Notification Sound</span>
      </button>
    </div>
  `;
}

// Data Export & Reset
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
  a.download = `Medication_Reminder_Backup_${formatDateKey(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
  triggerDynamicIsland('Report Exported', 'Downloaded JSON');
};

window.resetToSampleData = function() {
  if (confirm('Reset all medications and logs to Apple Health demo data?')) {
    localStorage.clear();
    loadData();
    renderApp();
    triggerDynamicIsland('Data Reset', 'Apple Health Sample Data');
  }
};

window.triggerTestReminder = function() {
  sounds.playTakeChime();
  triggerDynamicIsland('Calcium 600mg', 'Scheduled for 12:00 PM', 'alarm');
};

// --- Device Frame Toggle (for Desktop vs Fullscreen) ---
window.toggleDeviceFrame = function() {
  appState.settings.isDesktopFrameMode = !appState.settings.isDesktopFrameMode;
  saveSettings();
  applyFrameMode();
};

function applyFrameMode() {
  const container = document.getElementById('device-container');
  const bezel = document.getElementById('notch-bezel');
  const toggleBtn = document.getElementById('view-mode-toggle');

  if (!container) return;

  if (appState.settings.isDesktopFrameMode) {
    container.className = "w-full max-w-[420px] h-[860px] bg-[#F2F2F7] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_0_12px_#27272a,0_0_0_15px_#3f3f46] relative overflow-hidden flex flex-col border-[6px] border-black transition-all";
    if (bezel) bezel.style.display = 'flex';
    if (toggleBtn) toggleBtn.innerHTML = `<span class="material-symbols-rounded text-base mr-1.5">fullscreen</span> Full Screen`;
  } else {
    container.className = "w-full max-w-full h-screen bg-[#F2F2F7] rounded-none shadow-none relative overflow-hidden flex flex-col border-none transition-all";
    if (bezel) bezel.style.display = 'none';
    if (toggleBtn) toggleBtn.innerHTML = `<span class="material-symbols-rounded text-base mr-1.5">smartphone</span> iPhone Frame`;
  }
}

// --- Status Bar Clock ---
function updateLiveClock() {
  const clockEl = document.getElementById('status-bar-time');
  if (clockEl) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // Apple 12-hour or 24-hour style
    clockEl.textContent = `${hours % 12 || 12}:${minutes}`;
  }
}
setInterval(updateLiveClock, 1000);

// --- Master Render Function ---
function renderApp() {
  renderWeekCalendar();
  renderScheduleView();
  if (appState.activeTab === 'summary') renderSummaryStats();
  if (appState.activeTab === 'sharing') renderSharingView();
}

// --- App Bootstrap ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  applyFrameMode();
  updateLiveClock();
  renderApp();

  // Initialize Web Audio on first user interaction
  document.addEventListener('click', () => sounds.init(), { once: true });

  // Register Service Worker for offline capability & PWA install
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  }
});
