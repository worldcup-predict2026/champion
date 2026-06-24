// W杯 2026 トーナメント予想シミュレーター 
// 言語状態 & 翻訳
let currentLang = 'ja';
let isBracketLocked = false; // 決勝予想決定時にトーナメント全体をロックするフラグ
let fifa3rdPlaceAllocationTable = null; // FIFA 3位割り当てマッピング

// チームの所属グループとデフォルト順位のマッピング
const teamGroupsAndRanks = {
  "Mexico": { group: "A", rank: 1 },
  "South Korea": { group: "A", rank: 2 },
  "Czechia": { group: "A", rank: 3 },
  "South Africa": { group: "A", rank: 4 },
  "Canada": { group: "B", rank: 1 },
  "Switzerland": { group: "B", rank: 2 },
  "Bosnia and Herzegovina": { group: "B", rank: 3 },
  "Qatar": { group: "B", rank: 4 },
  "Brazil": { group: "C", rank: 1 },
  "Morocco": { group: "C", rank: 2 },
  "Scotland": { group: "C", rank: 3 },
  "Haiti": { group: "C", rank: 4 },
  "USA": { group: "D", rank: 1 },
  "Türkiye": { group: "D", rank: 2 },
  "Paraguay": { group: "D", rank: 3 },
  "Australia": { group: "D", rank: 4 },
  "Germany": { group: "E", rank: 1 },
  "Ivory Coast": { group: "E", rank: 2 },
  "Ecuador": { group: "E", rank: 3 },
  "Curaçao": { group: "E", rank: 4 },
  "Netherlands": { group: "F", rank: 1 },
  "Japan": { group: "F", rank: 2 },
  "Sweden": { group: "F", rank: 3 },
  "Tunisia": { group: "F", rank: 4 },
  "Belgium": { group: "G", rank: 1 },
  "Egypt": { group: "G", rank: 2 },
  "Iran": { group: "G", rank: 3 },
  "New Zealand": { group: "G", rank: 4 },
  "Spain": { group: "H", rank: 1 },
  "Uruguay": { group: "H", rank: 2 },
  "Cape Verde": { group: "H", rank: 3 },
  "Saudi Arabia": { group: "H", rank: 4 },
  "France": { group: "I", rank: 1 },
  "Norway": { group: "I", rank: 2 },
  "Senegal": { group: "I", rank: 3 },
  "Iraq": { group: "I", rank: 4 },
  "Argentina": { group: "J", rank: 1 },
  "Austria": { group: "J", rank: 2 },
  "Algeria": { group: "J", rank: 3 },
  "Jordan": { group: "J", rank: 4 },
  "Portugal": { group: "K", rank: 1 },
  "Colombia": { group: "K", rank: 2 },
  "DR Congo": { group: "K", rank: 3 },
  "Uzbekistan": { group: "K", rank: 4 },
  "England": { group: "L", rank: 1 },
  "Croatia": { group: "L", rank: 2 },
  "Ghana": { group: "L", rank: 3 },
  "Panama": { group: "L", rank: 4 }
};

// 各グループの3位通過チーム（固定）
const group3rdPlaceTeams = {
  "A": "Czechia",
  "B": "Bosnia and Herzegovina",
  "C": "Scotland",
  "D": "Paraguay",
  "E": "Ecuador",
  "F": "Sweden",
  "G": "Iran",
  "H": "Cape Verde",
  "I": "Senegal",
  "J": "Algeria",
  "K": "DR Congo",
  "L": "Ghana"
};

// 主要60言語のリスト (ISO 639-1 コードと現地語表記)
const supportedLanguages = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'pl', name: 'Polski' },
  { code: 'sv', name: 'Svenska' },
  { code: 'no', name: 'Norsk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'da', name: 'Dansk' },
  { code: 'cs', name: 'Čeština' },
  { code: 'hu', name: 'Magyar' },
  { code: 'ro', name: 'Română' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'he', name: 'עברית' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'uk', name: 'Українська' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'sr', name: 'Srpski' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'bg', name: 'Български' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'et', name: 'Eesti' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'fa', name: 'فارسی' },
  { code: 'ur', name: 'اردو' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'ca', name: 'Català' }
];

// 外部ファイル (translations_full.js) の翻訳データを参照。対応外の言語は英語 (en) にフォールバックする
const translations = new Proxy(allTranslations, {
  get: function(target, prop) {
    return prop in target ? target[prop] : target['en'];
  }
});

const teamTranslations = new Proxy(allTeamTranslations, {
  get: function(target, prop) {
    return prop in target ? target[prop] : target['en'];
  }
});

// チームの実力（強さ）レーティング - AI予測時に使用
const teamStrengths = {
  "Argentina": 92, "France": 91, "Brazil": 90, "England": 89, "Spain": 89,
  "Portugal": 87, "Netherlands": 86, "Türkiye": 80, "Germany": 85, "Belgium": 84,
  "Uruguay": 83, "Colombia": 82, "Croatia": 82, "Japan": 79, "Morocco": 79,
  "USA": 78, "Senegal": 77, "Switzerland": 76, "Austria": 76, "South Korea": 75,
  "Sweden": 75, "Ecuador": 74, "Norway": 74, "Australia": 73, "Paraguay": 72,
  "Ivory Coast": 72, "South Africa": 68, "Egypt": 68, "Saudi Arabia": 67,
  "Scotland": 66, "Algeria": 66, "Canada": 65, "Uzbekistan": 64, "Iran": 63,
  "Panama": 61, "Ghana": 71, "DR Congo": 69, "Tunisia": 70, "Bosnia and Herzegovina": 68,
  "Cape Verde": 67, "Qatar": 65, "Iraq": 65, "Jordan": 64, "New Zealand": 63,
  "Czechia": 74, "Haiti": 60, "Curaçao": 58, "TBD": 10
};

/* =====================================================================
   確率エンジン (Probability Engine)
   グループ順位（どのノックアウト枠に入るか）の確率を、手打ちの固定値では
   なくチーム強度から導出する。順位付けの標準モデルである Plackett–Luce を
   各グループに適用して 1位 / 2位 / 3位 の確率を厳密列挙で算出する。
   - 重み w_i = exp(strength_i / STRENGTH_TEMP)
   - P(順位列) = ∏ w_i / (残りチームの w 合計)   ← softmax の順位拡張
   試合の勝敗は Elo 型勝率で確率的に扱う（AI予想・ライブ更新で共用）。
   ===================================================================== */
const STRENGTH_TEMP = 7.0;   // 小さいほど強さ差が結果に効く
const ELO_SCALE = 16;        // 小さいほど番狂わせが減る

function strengthOf(team) { return teamStrengths[team] != null ? teamStrengths[team] : 50; }

// 配列の全順列を返す（4チームなら24通り、十分軽量）
function permute(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  arr.forEach((v, i) => {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    permute(rest).forEach(p => out.push([v].concat(p)));
  });
  return out;
}

// Plackett–Luce による各チームの 1位/2位/3位 確率（0〜1）
function groupOrderProbs(teamList) {
  const w = {};
  teamList.forEach(t => { w[t] = Math.exp(strengthOf(t) / STRENGTH_TEMP); });
  const res = {};
  teamList.forEach(t => { res[t] = { p1: 0, p2: 0, p3: 0 }; });

  permute(teamList).forEach(order => {
    let prob = 1, sumAvail = teamList.reduce((s, t) => s + w[t], 0);
    for (const t of order) { prob *= w[t] / sumAvail; sumAvail -= w[t]; }
    if (order[0]) res[order[0]].p1 += prob;
    if (order[1]) res[order[1]].p2 += prob;
    if (order[2]) res[order[2]].p3 += prob;
  });
  return res;
}

// グループ字 → 所属4チーム
function teamsByGroup() {
  const groups = {};
  Object.keys(teamGroupsAndRanks).forEach(t => {
    const g = teamGroupsAndRanks[t].group;
    (groups[g] = groups[g] || []).push(t);
  });
  return groups;
}

// 候補配列を 0.5% 以上で絞り、合計100%へ正規化してスロットへ書き込む
function writeSlotCandidates(slot, cands) {
  if (!slot || slot.confirmed) return;
  let list = cands.filter(c => c.prob >= 0.005);
  if (list.length === 0) list = cands.slice(0, 1);
  const sum = list.reduce((s, c) => s + c.prob, 0) || 1;
  list = list.map(c => ({ name: c.name, prob: parseFloat((c.prob / sum * 100).toFixed(2)) }));
  const s2 = list.reduce((a, c) => a + c.prob, 0);
  list[list.length - 1].prob = parseFloat((list[list.length - 1].prob + (100 - s2)).toFixed(2));
  slot.candidates = list;
  slot.current = list[0].name;
}

// 全グループの 1位/2位 スロット確率をモデルから再計算する
function recomputeGroupSlots() {
  const groups = teamsByGroup();
  "ABCDEFGHIJKL".split("").forEach(g => {
    const teams = groups[g];
    if (!teams) return;
    const winnerSlot = groupSlots["1" + g];
    const runnerSlot = groupSlots["2" + g];

    if (winnerSlot && winnerSlot.confirmed) {
      // 1位が確定済み → 残り3チームで2位（=残りの中の1位）を計算
      const champ = winnerSlot.current;
      const rest = teams.filter(t => t !== champ);
      const pr = groupOrderProbs(rest);
      const runnerCands = rest.map(t => ({ name: t, prob: pr[t].p1 })).sort((a, b) => b.prob - a.prob);
      writeSlotCandidates(runnerSlot, runnerCands);
    } else {
      const pr = groupOrderProbs(teams);
      const winCands = teams.map(t => ({ name: t, prob: pr[t].p1 })).sort((a, b) => b.prob - a.prob);
      const runCands = teams.map(t => ({ name: t, prob: pr[t].p2 })).sort((a, b) => b.prob - a.prob);
      writeSlotCandidates(winnerSlot, winCands);
      writeSlotCandidates(runnerSlot, runCands);
    }
  });
}

// Elo 型の勝率（strength 差を勝敗確率へ）
function eloWinProb(s1, s2) { return 1 / (1 + Math.pow(10, (s2 - s1) / ELO_SCALE)); }

// 確率的に試合の勝者を抽選（番狂わせあり）
function sampleMatchWinner(team1, team2) {
  if (team1 === "TBD" && team2 === "TBD") return "TBD";
  if (team1 === "TBD") return team2;
  if (team2 === "TBD") return team1;
  const p = eloWinProb(strengthOf(team1), strengthOf(team2));
  return Math.random() < p ? team1 : team2;
}

// 試合のスコアを確率的（チーム強度ベース）にシミュレートして生成
function generateMatchScore(team1, team2, winner) {
  if (team1 === "TBD" || team2 === "TBD" || !winner) return null;
  
  const s1 = teamStrengths[team1] || 70;
  const s2 = teamStrengths[team2] || 70;
  const winnerIsTeam1 = (winner === team1);
  
  const strengthDiff = Math.abs(s1 - s2);
  const baseGoalExpected = 1.1;
  const bonusGoal = Math.min(1.8, strengthDiff / 12.0);
  
  const rollGoals = (lambda) => {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1.0;
    do {
      k++;
      p *= Math.random();
    } while (p > L && k < 10);
    return k - 1;
  };
  
  let gWin = 0;
  let gLose = 0;
  
  const r = Math.random();
  if (r < 0.75) {
    // 90分決着
    gLose = rollGoals(baseGoalExpected);
    gWin = gLose + 1 + rollGoals(0.7 + bonusGoal);
    return winnerIsTeam1 ? `${gWin} - ${gLose}` : `${gLose} - ${gWin}`;
  } else if (r < 0.92) {
    // 延長戦決着 (AET)
    const normalGoals = rollGoals(baseGoalExpected);
    gLose = normalGoals;
    gWin = normalGoals + 1;
    return winnerIsTeam1 ? `${gWin} - ${gLose} (AET)` : `${gLose} - ${gWin} (AET)`;
  } else {
    // PK戦決着 (PK)
    const finalGoals = rollGoals(baseGoalExpected + 0.3);
    const pkWin = 3 + Math.floor(Math.random() * 3);
    const pkLose = pkWin - 1 - (Math.random() < 0.25 ? 1 : 0);
    return winnerIsTeam1 
      ? `${finalGoals} - ${finalGoals} (${pkWin}-${pkLose} PK)` 
      : `${finalGoals} - ${finalGoals} (${pkLose}-${pkWin} PK)`;
  }
}

// 候補の確率分布に従って1チームを抽選
function weightedSampleCandidate(candidates) {
  const sum = candidates.reduce((s, c) => s + c.prob, 0) || 1;
  let r = Math.random() * sum;
  for (const c of candidates) { r -= c.prob; if (r <= 0) return c.name; }
  return candidates[candidates.length - 1].name;
}

// 各国固有の2文字国コード (旗のプレースホルダーや装飾用)
const teamCodes = {
  "Mexico": "MX", "South Africa": "ZA", "South Korea": "KR", "Sweden": "SE",
  "Australia": "AU", "Türkiye": "TR", "Canada": "CA", "Switzerland": "CH",
  "Brazil": "BR", "Morocco": "MA", "Scotland": "GB-SCT", "USA": "US", "Paraguay": "PY",
  "Germany": "DE", "Ecuador": "EC", "Ivory Coast": "CI", "Netherlands": "NL",
  "Japan": "JP", "Belgium": "BE", "Egypt": "EG", "Iran": "IR", "Spain": "ES",
  "Saudi Arabia": "SA", "Uruguay": "UY", "France": "FR", "Norway": "NO",
  "Senegal": "SN", "Argentina": "AR", "Austria": "AT", "Algeria": "DZ",
  "Portugal": "PT", "Colombia": "CO", "Uzbekistan": "UZ", "England": "GB-ENG",
  "Croatia": "HR", "Panama": "PA",
  "Czechia": "CZ", "Bosnia and Herzegovina": "BA", "Qatar": "QA", "Haiti": "HT",
  "Curaçao": "CW", "Tunisia": "TN", "New Zealand": "NZ", "Cape Verde": "CV",
  "Iraq": "IQ", "Jordan": "JO", "DR Congo": "CD", "Ghana": "GH", "TBD": "?"
};

// グループステージスロットデータ（2026年6月25日現在の勝ち抜け候補と確率）
const initialGroupSlots = {
  "1A": { confirmed: true, current: "Mexico", candidates: [{ name: "Mexico", prob: 100.00 }] },
  "2A": { confirmed: false, current: "South Korea", candidates: [{ name: "South Korea", prob: 50.12 }, { name: "South Africa", prob: 28.45 }, { name: "Czechia", prob: 21.43 }] },
  "1B": { confirmed: false, current: "Canada", candidates: [{ name: "Canada", prob: 65.23 }, { name: "Switzerland", prob: 34.77 }] },
  "2B": { confirmed: false, current: "Switzerland", candidates: [{ name: "Switzerland", prob: 55.42 }, { name: "Bosnia and Herzegovina", prob: 29.84 }, { name: "Qatar", prob: 14.74 }] },
  "1C": { confirmed: false, current: "Brazil", candidates: [{ name: "Brazil", prob: 75.42 }, { name: "Morocco", prob: 24.58 }] },
  "2C": { confirmed: false, current: "Morocco", candidates: [{ name: "Morocco", prob: 58.34 }, { name: "Scotland", prob: 31.42 }, { name: "Haiti", prob: 10.24 }] },
  "1D": { confirmed: true, current: "USA", candidates: [{ name: "USA", prob: 100.00 }] },
  "2D": { confirmed: false, current: "Türkiye", candidates: [{ name: "Türkiye", prob: 48.52 }, { name: "Paraguay", prob: 30.25 }, { name: "Australia", prob: 21.23 }] },
  "1E": { confirmed: true, current: "Germany", candidates: [{ name: "Germany", prob: 100.00 }] },
  "2E": { confirmed: false, current: "Ecuador", candidates: [{ name: "Ecuador", prob: 68.42 }, { name: "Ivory Coast", prob: 25.13 }, { name: "Curaçao", prob: 6.45 }] },
  "1F": { confirmed: false, current: "Netherlands", candidates: [{ name: "Netherlands", prob: 58.32 }, { name: "Japan", prob: 41.68 }] },
  "2F": { confirmed: false, current: "Japan", candidates: [{ name: "Japan", prob: 55.43 }, { name: "Sweden", prob: 30.12 }, { name: "Tunisia", prob: 14.45 }] },
  "1G": { confirmed: false, current: "Belgium", candidates: [{ name: "Belgium", prob: 85.23 }, { name: "Egypt", prob: 14.77 }] },
  "2G": { confirmed: false, current: "Egypt", candidates: [{ name: "Egypt", prob: 60.12 }, { name: "Iran", prob: 28.45 }, { name: "New Zealand", prob: 11.43 }] },
  "1H": { confirmed: true, current: "Spain", candidates: [{ name: "Spain", prob: 100.00 }] },
  "2H": { confirmed: false, current: "Uruguay", candidates: [{ name: "Uruguay", prob: 68.52 }, { name: "Saudi Arabia", prob: 20.23 }, { name: "Cape Verde", prob: 11.25 }] },
  "1I": { confirmed: true, current: "France", candidates: [{ name: "France", prob: 100.00 }] },
  "2I": { confirmed: false, current: "Norway", candidates: [{ name: "Norway", prob: 60.24 }, { name: "Senegal", prob: 30.13 }, { name: "Iraq", prob: 9.63 }] },
  "1J": { confirmed: true, current: "Argentina", candidates: [{ name: "Argentina", prob: 100.00 }] },
  "2J": { confirmed: false, current: "Austria", candidates: [{ name: "Austria", prob: 75.42 }, { name: "Algeria", prob: 18.15 }, { name: "Jordan", prob: 6.43 }] },
  "1K": { confirmed: true, current: "Portugal", candidates: [{ name: "Portugal", prob: 100.00 }] },
  "2K": { confirmed: false, current: "Colombia", candidates: [{ name: "Colombia", prob: 75.42 }, { name: "Uzbekistan", prob: 18.15 }, { name: "DR Congo", prob: 6.43 }] },
  "1L": { confirmed: true, current: "England", candidates: [{ name: "England", prob: 100.00 }] },
  "2L": { confirmed: false, current: "Croatia", candidates: [{ name: "Croatia", prob: 70.24 }, { name: "Ghana", prob: 20.13 }, { name: "Panama", prob: 9.63 }] },
  
  // 3位通過候補スロット（FIFA Annex C 495通りの組み合わせから算出した正確な確率）
  // 各スロットの確率 = そのグループの3位がそのスロットに入る組み合わせ数 / 495
  "3rd_A_B_C_D_F": { confirmed: false, current: "Scotland", candidates: [
    { name: "Scotland", prob: 46.67 },
    { name: "Paraguay", prob: 42.83 },
    { name: "Sweden", prob: 7.07 },
    { name: "Czechia", prob: 3.23 },
    { name: "Bosnia and Herzegovina", prob: 0.20 }
  ]},
  "3rd_C_D_F_G_H": { confirmed: false, current: "Sweden", candidates: [
    { name: "Sweden", prob: 55.76 },
    { name: "Paraguay", prob: 20.00 },
    { name: "Iran", prob: 14.14 },
    { name: "Cape Verde", prob: 9.70 },
    { name: "Scotland", prob: 0.40 }
  ]},
  "3rd_C_E_F_H_I": { confirmed: false, current: "Cape Verde", candidates: [
    { name: "Cape Verde", prob: 39.19 },
    { name: "Ecuador", prob: 36.77 },
    { name: "Scotland", prob: 19.60 },
    { name: "Senegal", prob: 3.84 },
    { name: "Sweden", prob: 0.61 }
  ]},
  "3rd_E_H_I_J_K": { confirmed: false, current: "DR Congo", candidates: [
    { name: "DR Congo", prob: 66.67 },
    { name: "Senegal", prob: 22.83 },
    { name: "Ecuador", prob: 5.86 },
    { name: "Algeria", prob: 4.04 },
    { name: "Cape Verde", prob: 0.61 }
  ]},
  "3rd_B_E_F_I_J": { confirmed: false, current: "Bosnia and Herzegovina", candidates: [
    { name: "Bosnia and Herzegovina", prob: 66.46 },
    { name: "Algeria", prob: 12.93 },
    { name: "Senegal", prob: 10.51 },
    { name: "Ecuador", prob: 7.88 },
    { name: "Sweden", prob: 2.22 }
  ]},
  "3rd_A_E_H_I_J": { confirmed: false, current: "Czechia", candidates: [
    { name: "Czechia", prob: 63.43 },
    { name: "Cape Verde", prob: 17.17 },
    { name: "Algeria", prob: 9.90 },
    { name: "Senegal", prob: 8.28 },
    { name: "Ecuador", prob: 1.21 }
  ]},
  "3rd_E_F_G_I_J": { confirmed: false, current: "Iran", candidates: [
    { name: "Iran", prob: 52.53 },
    { name: "Algeria", prob: 38.38 },
    { name: "Ecuador", prob: 5.25 },
    { name: "Senegal", prob: 2.83 },
    { name: "Sweden", prob: 1.01 }
  ]},
  "3rd_D_E_I_J_L": { confirmed: false, current: "Ghana", candidates: [
    { name: "Ghana", prob: 66.67 },
    { name: "Senegal", prob: 18.38 },
    { name: "Ecuador", prob: 9.70 },
    { name: "Paraguay", prob: 3.84 },
    { name: "Algeria", prob: 1.41 }
  ]},
};

// ディープコピー用ヘルパー
let groupSlots = JSON.parse(JSON.stringify(initialGroupSlots));

// トーナメントブラケット定義 (マッチIDと入力スロット/チーム)
const initialMatches = {
  // Round of 32
  73: { round: "r32", team1: { slot: "2A" }, team2: { slot: "2B" }, winner: null },
  74: { round: "r32", team1: { slot: "1E" }, team2: { slot: "3rd_A_B_C_D_F" }, winner: null },
  75: { round: "r32", team1: { slot: "1F" }, team2: { slot: "2C" }, winner: null },
  76: { round: "r32", team1: { slot: "1C" }, team2: { slot: "2F" }, winner: null },
  77: { round: "r32", team1: { slot: "1I" }, team2: { slot: "3rd_C_D_F_G_H" }, winner: null },
  78: { round: "r32", team1: { slot: "2E" }, team2: { slot: "2I" }, winner: null },
  79: { round: "r32", team1: { slot: "1A" }, team2: { slot: "3rd_C_E_F_H_I" }, winner: null },
  80: { round: "r32", team1: { slot: "1L" }, team2: { slot: "3rd_E_H_I_J_K" }, winner: null },
  81: { round: "r32", team1: { slot: "1D" }, team2: { slot: "3rd_B_E_F_I_J" }, winner: null },
  82: { round: "r32", team1: { slot: "1G" }, team2: { slot: "3rd_A_E_H_I_J" }, winner: null },
  83: { round: "r32", team1: { slot: "2K" }, team2: { slot: "2L" }, winner: null },
  84: { round: "r32", team1: { slot: "1H" }, team2: { slot: "2J" }, winner: null },
  85: { round: "r32", team1: { slot: "1B" }, team2: { slot: "3rd_E_F_G_I_J" }, winner: null },
  86: { round: "r32", team1: { slot: "1J" }, team2: { slot: "2H" }, winner: null },
  87: { round: "r32", team1: { slot: "1K" }, team2: { slot: "3rd_D_E_I_J_L" }, winner: null },
  88: { round: "r32", team1: { slot: "2D" }, team2: { slot: "2G" }, winner: null },

  // Round of 16
  89: { round: "r16", team1: { parentMatch: 74 }, team2: { parentMatch: 77 }, winner: null },
  90: { round: "r16", team1: { parentMatch: 73 }, team2: { parentMatch: 75 }, winner: null },
  91: { round: "r16", team1: { parentMatch: 76 }, team2: { parentMatch: 78 }, winner: null },
  92: { round: "r16", team1: { parentMatch: 79 }, team2: { parentMatch: 80 }, winner: null },
  93: { round: "r16", team1: { parentMatch: 83 }, team2: { parentMatch: 84 }, winner: null },
  94: { round: "r16", team1: { parentMatch: 81 }, team2: { parentMatch: 82 }, winner: null },
  95: { round: "r16", team1: { parentMatch: 86 }, team2: { parentMatch: 88 }, winner: null },
  96: { round: "r16", team1: { parentMatch: 85 }, team2: { parentMatch: 87 }, winner: null },

  // Quarter-Finals
  97: { round: "qf", team1: { parentMatch: 89 }, team2: { parentMatch: 90 }, winner: null },
  98: { round: "qf", team1: { parentMatch: 93 }, team2: { parentMatch: 94 }, winner: null },
  99: { round: "qf", team1: { parentMatch: 91 }, team2: { parentMatch: 92 }, winner: null },
  100: { round: "qf", team1: { parentMatch: 95 }, team2: { parentMatch: 96 }, winner: null },

  // Semi-Finals
  101: { round: "sf", team1: { parentMatch: 97 }, team2: { parentMatch: 98 }, winner: null },
  102: { round: "sf", team1: { parentMatch: 99 }, team2: { parentMatch: 100 }, winner: null },

  // Finals & 3rd Place
  103: { round: "third", team1: { parentMatch: 101, loser: true }, team2: { parentMatch: 102, loser: true }, winner: null },
  104: { round: "final", team1: { parentMatch: 101 }, team2: { parentMatch: 102 }, winner: null }
};

let matches = JSON.parse(JSON.stringify(initialMatches));

// 言語スイッチとUIの初期化
function setLanguage(lang) {
  currentLang = lang;
  
  // セレクトボックスの選択状態を同期
  const langSelect = document.getElementById('lang-select');
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }
  
  // UI翻訳の適用
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    const translation = (translations[lang] && translations[lang][key]) || (translations['en'] && translations['en'][key]);
    if (translation) {
      el.textContent = translation;
    }
  });

  renderAll();
}

// チーム翻訳ヘルパー (Intl.DisplayNames による主要60言語への完全対応)
function getTeamName(team) {
  if (!team || team === "TBD") {
    return (translations[currentLang] && translations[currentLang].tbd) || translations['en'].tbd || "TBD";
  }
  
  const code = teamCodes[team];
  
  // イギリス地方区分の特別フォールバック対応
  if (code === "GB-ENG") {
    const engTranslations = {
      ja: "イングランド", en: "England", es: "Inglaterra", fr: "Angleterre", de: "England",
      it: "Inghilterra", pt: "Inglaterra", zh: "英格兰", ko: "잉글랜드", ar: "إنجلترا",
      tr: "İngiltere", ru: "Англия"
    };
    return engTranslations[currentLang] || engTranslations['en'];
  }
  if (code === "GB-SCT") {
    const sctTranslations = {
      ja: "スコットランド", en: "Scotland", es: "Escocia", fr: "Écosse", de: "Schottland",
      it: "Scozia", pt: "Escócia", zh: "苏格兰", ko: "スコットランド", ar: "اسكتلندا",
      tr: "İskoçya", ru: "Шотландия"
    };
    return sctTranslations[currentLang] || sctTranslations['en'];
  }

  // 一般的な国コードはブラウザ内蔵のローカライズエンジン (Intl) で動的ローカライズ
  if (code && code !== "?") {
    try {
      const displayNames = new Intl.DisplayNames([currentLang], { type: 'region' });
      const localized = displayNames.of(code);
      if (localized) return localized;
    } catch (e) {
      // 非サポートロケール時はフォールバックへ
    }
  }

  // 静的辞書に定義がある場合はそれを使用
  if (teamTranslations[currentLang] && teamTranslations[currentLang][team]) {
    return teamTranslations[currentLang][team];
  }
  return teamTranslations['en'][team] || team;
}

// マッチデータから各枠のチーム名を決定する
function resolveTeamName(participant) {
  if (participant.slot) {
    return groupSlots[participant.slot].current;
  }
  if (participant.parentMatch) {
    const parent = matches[participant.parentMatch];
    if (participant.loser) {
      if (!parent.winner) return "TBD";
      return parent.winner === parent.team1Name ? parent.team2Name : parent.team1Name;
    }
    return parent.winner || "TBD";
  }
  return "TBD";
}

// FIFA 3位マッピングJSONの非同期ロード
async function loadFifa3rdPlaceMapping() {
  try {
    const response = await fetch('fifa_3rd_place_mapping.json');
    fifa3rdPlaceAllocationTable = await response.json();
    console.log("FIFA 3rd place mapping table loaded successfully.");
    renderAll();
  } catch (error) {
    console.error("Failed to load FIFA 3rd place mapping table:", error);
  }
}

// 勝ち抜いた3位チームの組み合わせに応じたAnnex C動的割り当て
function applyAnnexC() {
  if (!fifa3rdPlaceAllocationTable) return;

  const thirdPlaceSlots = [
    "3rd_A_B_C_D_F", "3rd_C_D_F_G_H", "3rd_C_E_F_H_I", "3rd_E_H_I_J_K",
    "3rd_B_E_F_I_J", "3rd_A_E_H_I_J", "3rd_E_F_G_I_J", "3rd_D_E_I_J_L"
  ];

  // 1. 現在の3位スロットに入っているチームのグループを取得
  let qualifiedGroups = [];
  thirdPlaceSlots.forEach(slotKey => {
    const team = groupSlots[slotKey].current;
    const info = teamGroupsAndRanks[team];
    if (info) {
      const groupLetter = info.group;
      if (!qualifiedGroups.includes(groupLetter)) {
        qualifiedGroups.push(groupLetter);
      }
    }
  });

  // 2. 万が一、重複などにより8グループ未満の場合は、A~Lから自動補填して常にユニークな8個にする
  const allGroups = "ABCDEFGHIJKL";
  for (let i = 0; i < allGroups.length; i++) {
    if (qualifiedGroups.length >= 8) break;
    const g = allGroups[i];
    if (!qualifiedGroups.includes(g)) {
      qualifiedGroups.push(g);
    }
  }

  // 3. アルファベット順にソートしてキーを作成
  qualifiedGroups.sort();
  const combinationKey = qualifiedGroups.join("");

  // 4. マッピングテーブルから対戦相手の配置を取得
  const allocation = fifa3rdPlaceAllocationTable[combinationKey];
  if (allocation) {
    Object.keys(allocation).forEach(slotKey => {
      const targetGroup = allocation[slotKey];
      const team3rd = group3rdPlaceTeams[targetGroup] || "TBD";
      
      if (groupSlots[slotKey].current !== team3rd) {
        groupSlots[slotKey].current = team3rd;
      }
    });
  }
}

// すべてのマッチデータの動的なチーム名解決と勝ち上がり伝播
function evaluateBracket() {
  // 決勝トーナメント評価の前に、3位チームの配置を動的にリバランスする
  applyAnnexC();

  // マッチ依存関係順に解決 (R32 -> R16 -> QF -> SF -> Final)
  const sortedMatchIds = Object.keys(matches).sort((a, b) => parseInt(a) - parseInt(b));

  sortedMatchIds.forEach(id => {
    const match = matches[id];
    
    const prevTeam1 = match.team1Name;
    const prevTeam2 = match.team2Name;

    match.team1Name = resolveTeamName(match.team1);
    match.team2Name = resolveTeamName(match.team2);

    // 親スロット of チームが変更された場合、かつ既に選択されていた勝者と異なる場合は勝者をリセット
    if (match.team1Name !== prevTeam1 && match.winner === prevTeam1) {
      match.winner = null;
    }
    if (match.team2Name !== prevTeam2 && match.winner === prevTeam2) {
      match.winner = null;
    }

    // 両チーム決定済かつ勝者が未設定の場合は、手動予想用に状態を保ち、AI用にはTBDのまま
    if (match.team1Name === "TBD" || match.team2Name === "TBD") {
      match.winner = null;
    }

    // チームが変わった、または勝者がリセットされたらスコアをリセット/再シミュレート
    if (match.team1Name !== prevTeam1 || match.team2Name !== prevTeam2 || !match.winner) {
      if (!match.winner) {
        match.score = null;
      } else {
        match.score = generateMatchScore(match.team1Name, match.team2Name, match.winner);
      }
    }
  });

  // チャンピオン決定＆ロック判定
  const finalMatch = matches[104];
  const championTeamEl = document.getElementById('champion-team');
  const finalisedBadge = document.getElementById('finalised-badge');
  const bracketView = document.getElementById('bracket-view');
  
  if (finalMatch.winner && finalMatch.winner !== "TBD") {
    championTeamEl.innerHTML = `<span>${getTeamName(finalMatch.winner)}</span>`;
    championTeamEl.classList.add('winning-animation');
    isBracketLocked = true;
    if (finalisedBadge) finalisedBadge.style.display = 'inline-flex';
    if (bracketView) bracketView.classList.add('bracket-locked');
  } else {
    championTeamEl.innerHTML = `<span class="placeholder-text">?</span>`;
    championTeamEl.classList.remove('winning-animation');
    isBracketLocked = false;
    if (finalisedBadge) finalisedBadge.style.display = 'none';
    if (bracketView) bracketView.classList.remove('bracket-locked');
  }
}

// トーナメントブラケットHTMLのレンダリング
function renderAll() {
  evaluateBracket();

  const r32Left = [74, 77, 73, 75, 83, 84, 81, 82];
  const r32Right = [76, 78, 79, 80, 86, 88, 85, 87];
  
  const r16Left = [89, 90, 93, 94];
  const r16Right = [91, 92, 95, 96];

  const qfLeft = [97, 98];
  const qfRight = [99, 100];

  const sfLeft = [101];
  const sfRight = [102];

  renderMatchList('r32-left-matches', r32Left);
  renderMatchList('r32-right-matches', r32Right);
  renderMatchList('r16-left-matches', r16Left);
  renderMatchList('r16-right-matches', r16Right);
  renderMatchList('qf-left-matches', qfLeft);
  renderMatchList('qf-right-matches', qfRight);
  renderMatchList('sf-left-matches', sfLeft);
  renderMatchList('sf-right-matches', sfRight);

  renderSingleMatch('final-match', 104);
  renderSingleMatch('third-place-match', 103);
}

function renderMatchList(containerId, matchIds) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  matchIds.forEach(id => {
    const matchEl = createMatchBox(id);
    container.appendChild(matchEl);
  });
}

function renderSingleMatch(containerId, matchId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const matchEl = createMatchBox(matchId);
  container.appendChild(matchEl);
}

// 1つのマッチボックス要素を作成
function createMatchBox(id) {
  const match = matches[id];
  const div = document.createElement('div');
  div.className = `match-box`;
  div.id = `match-${id}`;

  const label = translations[currentLang].matchLabel;
  const scoreDisplay = match.score ? match.score : "TBD";
  div.innerHTML = `
    <div class="match-id">${label} ${id}</div>
    <div class="match-info-meta">${scoreDisplay}</div>
  `;

  const slot1 = createTeamSlot(match.team1Name, match.team1.slot, match.winner === match.team1Name, match.winner && match.winner !== match.team1Name);
  const slot2 = createTeamSlot(match.team2Name, match.team2.slot, match.winner === match.team2Name, match.winner && match.winner !== match.team2Name);

  // ライブ更新時に確率テキストを確実に特定するためのデータ属性
  slot1.dataset.matchId = id; slot1.dataset.teamIndex = '1';
  slot2.dataset.matchId = id; slot2.dataset.teamIndex = '2';

  // マッチ内でチームをクリックして勝ち上がらせる（手動予想モード）
  if (match.team1Name !== "TBD") {
    slot1.addEventListener('click', (e) => {
      // 確定スロットの鍵マークをクリックしたときは何もしない
      if (e.target.closest('.team-lock-icon')) return;
      selectWinner(id, match.team1Name);
    });
  }
  if (match.team2Name !== "TBD") {
    slot2.addEventListener('click', (e) => {
      if (e.target.closest('.team-lock-icon')) return;
      selectWinner(id, match.team2Name);
    });
  }

  div.appendChild(slot1);
  div.appendChild(slot2);
  return div;
}

// チームスロットの作成
function createTeamSlot(teamName, groupSlotKey, isWinner, isLoser) {
  const slot = document.createElement('div');
  slot.className = 'team-slot';

  if (isWinner) slot.classList.add('winner-selected');
  if (isLoser) slot.classList.add('loser-deselected');

  // グループスロットが確定しているか
  let isConfirmed = false;
  let probText = "";
  
  if (groupSlotKey) {
    const slotData = groupSlots[groupSlotKey];
    isConfirmed = slotData.confirmed;
    
    // スロットの現在のチームの確率を探す
    const currentCandidate = slotData.candidates.find(c => c.name === teamName);
    if (currentCandidate && currentCandidate.prob < 100) {
      probText = `${currentCandidate.prob}%`;
    }
  }

  if (isConfirmed) {
    slot.classList.add('slot-confirmed');
  }

  const code = teamCodes[teamName] || "?";
  
  let flagHtml = `<span class="flag-placeholder">${code}</span>`;
  if (teamName !== "TBD" && code !== "?") {
    flagHtml = `<img src="https://flagcdn.com/w40/${code.toLowerCase()}.png" class="team-flag-img" alt="${teamName}">`;
  }
  
  slot.innerHTML = `
    <div class="team-slot-left">
      ${flagHtml}
      <span class="team-name" title="${teamName}">${getTeamName(teamName)}</span>
    </div>
    <div class="team-slot-right">
      ${probText ? `<span class="team-probability select-trigger">${probText}</span>` : ''}
      ${isConfirmed ? `<i class="fa-solid fa-lock team-lock-icon" title="${translations[currentLang].confirmedBadge}"></i>` : ''}
      ${groupSlotKey && !isConfirmed ? `<i class="fa-solid fa-chevron-down team-probability select-trigger" style="background: transparent; color: var(--color-text-muted)"></i>` : ''}
    </div>
  `;

  // 確定していない親スロットで確率バッジや矢印をクリックすると、他の候補を切り替えるポップアップを表示する
  if (groupSlotKey && !isConfirmed) {
    slot.querySelectorAll('.select-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // 勝者選択のバブルを防ぎ、モーダルのみを開く
        openCandidatesModal(groupSlotKey);
      });
    });
  }

  return slot;
}

// シンセサイザーによる「シュッ」というスウッシュ効果音の動的生成
function playSwooshSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = audioCtx.sampleRate * 0.25; // 0.25秒
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // ホワイトノイズの生成
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    // スウッシュ（風切り音）用のバンドパスフィルター
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    // 周波数を時間経過で下降させてスウッシュ感を強める
    filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.25);
    filter.Q.value = 4.0;
    
    // 音量エンベロープ (フェードイン & 指数減衰フェードアウト)
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noise.start();
  } catch (e) {
    // ユーザーインタラクション制限などで再生が拒否された場合のセーフティ
  }
}

// 勝者決定時の処理（手動予想）
function selectWinner(matchId, winnerName) {
  if (isBracketLocked) return; // ロック時は操作不可
  if (winnerName === "TBD") return;
  
  // 効果音の再生
  playSwooshSound();
  
  const match = matches[matchId];
  match.winner = winnerName;
  match.score = generateMatchScore(match.team1Name, match.team2Name, winnerName);
  renderAll();

  // 決勝マッチ (104) の勝者が決定したら紙吹雪
  if (parseInt(matchId) === 104) {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

// 候補切り替えモーダル
let activeSlotKeyForModal = null;

function openCandidatesModal(slotKey) {
  if (isBracketLocked) return; // ロック時はモーダルを開かない
  activeSlotKeyForModal = slotKey;
  const slotData = groupSlots[slotKey];
  const modal = document.getElementById('candidates-modal');
  const title = document.getElementById('modal-title');
  const list = document.getElementById('modal-candidates-list');

  title.textContent = `${translations[currentLang].selectTeamTitle} (${slotKey})`;
  list.innerHTML = "";

  slotData.candidates.forEach(c => {
    const item = document.createElement('div');
    item.className = 'candidate-item';
    
    const code = teamCodes[c.name] || "?";
    let flagHtml = `<span class="flag-placeholder">${code}</span>`;
    if (c.name !== "TBD" && code !== "?") {
      flagHtml = `<img src="https://flagcdn.com/w40/${code.toLowerCase()}.png" class="team-flag-img" alt="${c.name}">`;
    }

    item.innerHTML = `
      <div class="candidate-name-group">
        ${flagHtml}
        <span class="candidate-name">${getTeamName(c.name)}</span>
      </div>
      <span class="candidate-prob">${c.prob}%</span>
    `;

    item.addEventListener('click', () => {
      selectCandidate(slotKey, c.name);
      closeCandidatesModal();
    });

    list.appendChild(item);
  });

  modal.classList.add('active');
}

function closeCandidatesModal() {
  document.getElementById('candidates-modal').classList.remove('active');
  activeSlotKeyForModal = null;
}

function selectCandidate(slotKey, teamName) {
  playSwooshSound(); // 効果音の再生
  groupSlots[slotKey].current = teamName;
  
  // 依存する下流の勝者予想をクリアするために再計算する
  renderAll();
}

// モーダルクローズイベント
document.getElementById('modal-close-btn').addEventListener('click', closeCandidatesModal);
document.getElementById('candidates-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('candidates-modal')) {
    closeCandidatesModal();
  }
});

// AIシミュレーション予想ロジック
// 強さに基づいた決定論的（固定）勝敗判定
function getMatchWinnerDeterministic(team1, team2) {
  if (team1 === "TBD" && team2 === "TBD") return "TBD";
  if (team1 === "TBD") return team2;
  if (team2 === "TBD") return team1;

  const strength1 = teamStrengths[team1] || 50;
  const strength2 = teamStrengths[team2] || 50;

  if (strength1 !== strength2) {
    return strength1 > strength2 ? team1 : team2;
  }
  // 実力値が完全に同じ場合は、アルファベット順で一貫性を持たせる
  return team1 < team2 ? team1 : team2;
}

// AI自動予想の実行（確率的シミュレーション）
// グループ枠は確率分布から抽選し、各試合は Elo 勝率＋乱数で勝者を抽選する。
// このため強豪が有利でありつつ、実行のたびに優勝国を含む結果が変わる。
function runAiSimulation() {
  // 1. 未確定のグループスロットを「確率に比例した抽選」で決定（最大値固定ではない）
  Object.keys(groupSlots).forEach(key => {
    const slot = groupSlots[key];
    if (!slot.confirmed && slot.candidates.length > 0) {
      slot.current = weightedSampleCandidate(slot.candidates);
    }
  });

  // 2. ブラケットの評価をして親スロットの名前を最新化
  evaluateBracket();

  // 3. Round of 32 から Final まで順番に、確率的に勝者を抽選していく
  const sortedMatchIds = Object.keys(matches).sort((a, b) => parseInt(a) - parseInt(b));

  sortedMatchIds.forEach(id => {
    const match = matches[id];
    match.team1Name = resolveTeamName(match.team1);
    match.team2Name = resolveTeamName(match.team2);

    match.winner = sampleMatchWinner(match.team1Name, match.team2Name);
    match.score = generateMatchScore(match.team1Name, match.team2Name, match.winner);

    // 下流へ反映するため即時評価
    evaluateBracket();
  });

  renderAll();

  // シミュレーション完了時に紙吹雪
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// リセット
function resetBracket() {
  isBracketLocked = false; // ロック解除
  liveTickCount = 0;
  groupSlots = JSON.parse(JSON.stringify(initialGroupSlots));
  recomputeGroupSlots();   // モデル確率を再適用
  matches = JSON.parse(JSON.stringify(initialMatches));
  renderAll();
}

// パララックス背景スクロール効果（5レイヤー急降下ダイブ＆ホログラム展開演出）
const layerSky = document.querySelector('.layer-sky');
const layerRoof = document.querySelector('.layer-roof');
const layerStands = document.querySelector('.layer-stands');
const layerFlares = document.querySelector('.layer-flares');
const layerPitch = document.querySelector('.layer-pitch');
const layerOverlay = document.querySelector('.layer-overlay');
const mainGoldLogo = document.getElementById('main-gold-logo');

const controlCenter = document.querySelector('.control-center');
const bracketContainer = document.querySelector('.bracket-container');
const parallaxContainer = document.querySelector('.parallax-container');

let hasScannedHologram = false; // レーザースキャンの多重発火防止フラグ

if (parallaxContainer && layerSky && layerRoof && layerStands && layerFlares && layerPitch) {
  // 初期化時のスタイル適用
  layerSky.style.opacity = 1;
  layerSky.style.transform = 'translateZ(-10px) scale(2.0)';
  
  layerRoof.style.opacity = 0.9;
  layerRoof.style.transform = 'translateZ(-8px) scale(1.6)';
  
  layerStands.style.opacity = 0;
  layerStands.style.transform = 'translateZ(-5px) scale(1.3)';
  
  layerFlares.style.opacity = 0;
  layerFlares.style.transform = 'translateZ(-3px) scale(1.15)';

  layerPitch.style.opacity = 0;
  layerPitch.style.transform = 'translateZ(0px) scale(1.4)';

  if (controlCenter && bracketContainer) {
    controlCenter.style.opacity = 0;
    controlCenter.style.transform = 'translateY(50px)';
    bracketContainer.style.opacity = 0;
    bracketContainer.style.transform = 'translateY(50px)';
  }

  parallaxContainer.addEventListener('scroll', () => {
    const scrollTop = parallaxContainer.scrollTop;
    
    // スコア駆動アニメーションのフェーズ定義
    // 全体スクロールレンジ: 0px 〜 1200px でズーム＆着地
    const maxScroll = 1200;
    const ratio = Math.min(scrollTop / maxScroll, 1);
    
    // 1. Layer 1: Sky (常時表示、ゆっくりスケール)
    const skyScale = 2.0 + (ratio * 1.0);
    layerSky.style.transform = `translateZ(-10px) scale(${skyScale})`;

    // 2. Layer 2: Stadium Roof (急接近して通り抜け)
    // 0pxで不透明度0.9、800pxで完全に通り抜けて不透明度0に
    const roofRatio = Math.min(scrollTop / 800, 1);
    const roofOpacity = 0.9 * (1 - roofRatio);
    const roofScale = 1.6 + (roofRatio * 2.9); // 1.6 -> 4.5
    layerRoof.style.opacity = roofOpacity;
    layerRoof.style.transform = `translateZ(-8px) scale(${roofScale})`;

    // 3. Layer 3: Spectator Stands & Girders (鉄骨と観客席)
    // 200pxから出現開始、600pxでピーク、1000pxで後ろに通り抜けて消滅
    let standsOpacity = 0;
    if (scrollTop > 200 && scrollTop <= 600) {
      standsOpacity = (scrollTop - 200) / 400;
    } else if (scrollTop > 600 && scrollTop <= 1000) {
      standsOpacity = 1 - (scrollTop - 600) / 400;
    }
    const standsScale = 1.3 + (Math.min(scrollTop / 1000, 1) * 2.2); // 1.3 -> 3.5
    const standsBlur = Math.max(2 - (scrollTop / 400) * 2, 0) + (scrollTop > 800 ? (scrollTop - 800) / 50 : 0);
    layerStands.style.opacity = standsOpacity;
    layerStands.style.transform = `translateZ(-5px) scale(${standsScale})`;
    layerStands.style.filter = `brightness(0.85) blur(${standsBlur}px)`;

    // 4. Layer 4: Light Flares (カクテル照明の閃光)
    // 400px〜900pxの間で光る
    let flaresOpacity = 0;
    if (scrollTop > 400 && scrollTop <= 650) {
      flaresOpacity = (scrollTop - 400) / 250;
    } else if (scrollTop > 650 && scrollTop <= 900) {
      flaresOpacity = 1 - (scrollTop - 650) / 250;
    }
    const flaresScale = 1.15 + (Math.min(scrollTop / 900, 1) * 1.35); // 1.15 -> 2.5
    layerFlares.style.opacity = flaresOpacity * 0.8;
    layerFlares.style.transform = `translateZ(-3px) scale(${flaresScale})`;

    // 5. Layer 5: Grass Pitch (ピッチに着地)
    // 600pxから出現、1000pxで完全にピッチレベルへ
    let pitchRatio = 0;
    if (scrollTop > 600) {
      pitchRatio = Math.min((scrollTop - 600) / 400, 1);
    }
    const pitchOpacity = pitchRatio;
    const pitchScale = 1.4 - (pitchRatio * 0.4); // 1.4 -> 1.0 (ベッドに見えないようズーム倍率を抑制)
    const pitchBrightness = 0.6 + (pitchRatio * 0.35); // 0.6 -> 0.95 (夢の世界のように白く発光させる明るさ)
    layerPitch.style.opacity = pitchOpacity;
    layerPitch.style.transform = `translateZ(0px) scale(${pitchScale})`;
    layerPitch.style.filter = `brightness(${pitchBrightness}) contrast(1.05)`;

    // 6. Gold Hero Logo (奥へ通り抜けフェードアウト)
    if (mainGoldLogo) {
      const logoRatio = Math.min(scrollTop / 400, 1);
      mainGoldLogo.style.opacity = 1 - logoRatio;
      mainGoldLogo.style.transform = `scale(${1.0 + logoRatio * 0.8}) translateY(${-logoRatio * 50}px)`;
    }

    // 7. Overlay Gradient (暗さの調整)
    if (layerOverlay) {
      layerOverlay.style.opacity = 0.5 + (ratio * 0.45);
    }
    
    // 8. Content (ホログラムパネル & トーナメント表)
    // 950pxから出現開始、1150pxで展開（着地演出の同期）
    if (controlCenter && bracketContainer) {
      let contentRatio = 0;
      if (scrollTop > 950) {
        contentRatio = Math.min((scrollTop - 950) / 200, 1);
        
        controlCenter.style.visibility = 'visible';
        controlCenter.style.pointerEvents = 'auto';
        bracketContainer.style.visibility = 'visible';
        bracketContainer.style.pointerEvents = 'auto';
      } else {
        controlCenter.style.visibility = 'hidden';
        controlCenter.style.pointerEvents = 'none';
        bracketContainer.style.visibility = 'hidden';
        bracketContainer.style.pointerEvents = 'none';
      }
      
      controlCenter.style.opacity = contentRatio;
      controlCenter.style.transform = `translateY(${50 - (contentRatio * 50)}px)`;
      
      bracketContainer.style.opacity = contentRatio;
      bracketContainer.style.transform = `translateY(${50 - (contentRatio * 50)}px)`;

      // ホログラム着地展開トリガー (一度だけレーザースキャンを発火)
      if (scrollTop > 1050 && !hasScannedHologram) {
        hasScannedHologram = true;
        bracketContainer.classList.add('laser-scanning');
        // 効果音も動的に合成して鳴らす
        playSwooshSound();
        setTimeout(() => {
          bracketContainer.classList.remove('laser-scanning');
        }, 2500); // アニメーション終了後にクラスを外す
      } else if (scrollTop < 900) {
        // スクリプトで再度上に戻ったらフラグをリセットして再スキャン可能に
        hasScannedHologram = false;
      }
    }
  });
}

// ビューポート切り替え（モバイル対応）
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const view = btn.getAttribute('data-view');
    const viewContainer = document.getElementById('bracket-view');
    
    viewContainer.className = 'bracket-container'; // クラスリセット
    if (view !== 'all') {
      viewContainer.classList.add(`view-${view}`);
    }
  });
});

// 言語セレクトボックスの変更イベント
const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });
}

// コントロールボタンイベント
document.getElementById('ai-predict-btn').addEventListener('click', runAiSimulation);
document.getElementById('reset-btn').addEventListener('click', resetBracket);

// 初期ロード時に起動
window.addEventListener('DOMContentLoaded', () => {
  // 言語セレクトボックスのオプション動的生成 (主要60言語)
  const selectEl = document.getElementById('lang-select');
  if (selectEl) {
    selectEl.innerHTML = "";
    supportedLanguages.forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = lang.name;
      selectEl.appendChild(opt);
    });
  }

  recomputeGroupSlots();     // グループ順位確率をモデルから算出（手打ち値を置換）
  loadFifa3rdPlaceMapping(); // FIFA 3位マッピングをロード
  setLanguage('ja');         // デフォルト日本語
  setupLiveToggle();         // LIVE トグルの配線
  startRealtimeUpdates();    // ライブ更新エンジンの開始
  loadLiveFootballData();    // 実際のリアルタイム試合結果・スタンドデータをロード
});

/* =====================================================================
   ライブ更新エンジン (Live Match Engine)
   - 試合中: 未確定グループ枠の確率がモメンタム付き乱数歩行で揺れ動く。
     リードが一定差で入れ替われば「current」を更新し即ブラケットへ反映。
   - 試合後: 一定間隔で最も大勢の決した枠の順位が「確定」し、スロットが
     ロック → R32 の対戦カードが即更新される（Annex C も再計算）。
   LIVE トグルで停止可能。優勝確定（ロック）中・モーダル表示中は自動停止。
   ===================================================================== */
let liveEnabled = true;
let liveTickCount = 0;

// ライブ対象 = 未確定のグループ1位/2位枠（3位枠は Annex C 管理のため除外）
function getLiveGroupSlots() {
  return Object.keys(groupSlots).filter(k =>
    /^[12][A-L]$/.test(k) && !groupSlots[k].confirmed && groupSlots[k].candidates.length > 1
  );
}

// モメンタム付き乱数歩行で候補確率を更新し、合計100%へ正規化
function driftCandidates(slot) {
  const n = slot.candidates.length;
  slot.candidates.forEach(c => {
    if (typeof c._mom !== 'number') c._mom = 0;
    c._mom = c._mom * 0.6 + (Math.random() * 2 - 1) * 0.9; // 慣性 + ランダム
    c.prob = Math.max(0.5, c.prob + c._mom);
  });
  const sum = slot.candidates.reduce((s, c) => s + c.prob, 0) || 1;
  slot.candidates.forEach(c => { c.prob = parseFloat((c.prob / sum * 100).toFixed(2)); });
  const s2 = slot.candidates.reduce((a, c) => a + c.prob, 0);
  slot.candidates[n - 1].prob = parseFloat((slot.candidates[n - 1].prob + (100 - s2)).toFixed(2));
}

// 1枠を確定（順位決定）させてロックする
function finalizeGroupSlot(key) {
  const slot = groupSlots[key];
  if (!slot) return;
  const leader = slot.candidates.reduce((a, b) => (b.prob > a.prob ? b : a));
  slot.confirmed = true;
  slot.current = leader.name;
  slot.candidates = [{ name: leader.name, prob: 100 }];
  showLiveToast(key, leader.name);
}

function startRealtimeUpdates() {
  setInterval(liveTick, 3000); // 3秒ごと
}

function liveTick() {
  if (isBracketLocked || !liveEnabled) return;
  const modal = document.getElementById('candidates-modal');
  if (modal && modal.classList.contains('active')) return; // モーダル操作中は触らない

  liveTickCount++;
  let structuralChange = false;

  // 15秒（5回に1回）ごとにローカルのライブデータをリロード
  if (liveTickCount % 5 === 0) {
    loadLiveFootballData();
  }

  // 1) 試合中の確率変動（リード逆転は即反映）
  getLiveGroupSlots().forEach(key => {
    const slot = groupSlots[key];
    driftCandidates(slot);
    const leader = slot.candidates.reduce((a, b) => (b.prob > a.prob ? b : a));
    if (leader.name !== slot.current) {
      const cur = slot.candidates.find(c => c.name === slot.current);
      const curProb = cur ? cur.prob : 0;
      if (leader.prob - curProb > 2) { slot.current = leader.name; structuralChange = true; } // ヒステリシス
    }
  });

  // 2) 一定間隔で順位確定イベント（最も大勢の決した枠から）
  if (liveTickCount % 4 === 0) {
    const slots = getLiveGroupSlots();
    if (slots.length) {
      let pick = null, best = -1;
      slots.forEach(k => {
        const lead = Math.max.apply(null, groupSlots[k].candidates.map(c => c.prob));
        if (lead > best) { best = lead; pick = k; }
      });
      if (pick) { finalizeGroupSlot(pick); structuralChange = true; }
    }
  }

  if (structuralChange) renderAll();      // 構造が変わったら全体再描画（R32 等を即更新）
  else updateProbabilityUI();             // 数値だけなら軽量更新
}

// 順位確定トースト通知
function showLiveToast(key, team) {
  const host = document.getElementById('live-toasts');
  if (!host) return;
  const ja = currentLang === 'ja';
  const g = key[1];
  const pos = key[0] === '1' ? (ja ? '1位通過' : 'Winner') : (ja ? '2位通過' : 'Runner-up');
  const t = document.createElement('div');
  t.className = 'live-toast';
  t.innerHTML = `<span class="lt-dot"></span><span class="lt-text">${ja ? 'グループ' : 'Group '}${g} ${pos} ${ja ? '確定' : 'confirmed'} — <b>${getTeamName(team)}</b></span>`;
  host.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 4200);
}

// LIVE トグルの配線
function setupLiveToggle() {
  const btn = document.getElementById('live-toggle');
  if (!btn) return;
  const sync = () => {
    btn.classList.toggle('active', liveEnabled);
    const label = btn.querySelector('.live-label');
    if (label) label.textContent = liveEnabled ? (currentLang === 'ja' ? 'LIVE 自動進行 ON' : 'LIVE ON') : (currentLang === 'ja' ? 'LIVE 停止中' : 'LIVE OFF');
  };
  btn.addEventListener('click', () => { liveEnabled = !liveEnabled; sync(); });
  sync();
}

// 確率表示UIのみを軽量に書き換える（ブラケット全体を再描画せず%数値のみ更新）
function updateProbabilityUI() {
  document.querySelectorAll('.team-slot[data-match-id]').forEach(slotEl => {
    const match = matches[slotEl.dataset.matchId];
    if (!match) return;

    const isTeam1 = slotEl.dataset.teamIndex === '1';
    const teamName = isTeam1 ? match.team1Name : match.team2Name;
    const participant = isTeam1 ? match.team1 : match.team2;

    if (participant && participant.slot) {
      const slotData = groupSlots[participant.slot];
      const candidate = slotData.candidates.find(c => c.name === teamName);
      if (candidate && candidate.prob < 100) {
        const probTextEl = slotEl.querySelector('span.team-probability');
        if (probTextEl) {
          const oldVal = parseFloat(probTextEl.textContent);
          const newVal = candidate.prob;
          if (Math.abs(oldVal - newVal) > 0.001) {
            probTextEl.textContent = `${newVal.toFixed(2)}%`;
            // 変化を一瞬光らせる
            probTextEl.classList.remove('prob-flash');
            void probTextEl.offsetWidth; // reflow でアニメ再始動
            probTextEl.classList.add('prob-flash');
          }
        }
      }
    }
  });
}

// =====================================================================
// リアルタイムデータ同期エンジン (football-data.org 連携)
// =====================================================================
function loadLiveFootballData() {
  fetch('live_standings.json')
    .then(res => {
      if (!res.ok) throw new Error("No live standings file found");
      return res.json();
    })
    .then(data => {
      applyLiveStandings(data);
    })
    .catch(err => console.log("Live standings load error:", err.message));

  fetch('live_matches.json')
    .then(res => {
      if (!res.ok) throw new Error("No live matches file found");
      return res.json();
    })
    .then(data => {
      applyLiveMatches(data);
    })
    .catch(err => console.log("Live matches load error:", err.message));
}

function applyLiveStandings(data) {
  if (!data || !data.standings) return;
  
  let structuralChange = false;
  
  data.standings.forEach(groupStanding => {
    const groupChar = groupStanding.group.replace("Group ", "").trim();
    if (!groupChar || groupChar.length !== 1) return;
    
    const table = groupStanding.table;
    if (!table || table.length < 4) return;
    
    const isCompleted = table.every(t => t.playedGames >= 3);
    
    const team3rd = table[2].team.name;
    if (group3rdPlaceTeams[groupChar] !== team3rd) {
      group3rdPlaceTeams[groupChar] = team3rd;
      structuralChange = true;
    }
    
    const firstPlaceTeam = table[0].team.name;
    const secondPlaceTeam = table[1].team.name;
    
    const slot1 = groupSlots["1" + groupChar];
    const slot2 = groupSlots["2" + groupChar];
    
    if (slot1) {
      if (isCompleted) {
        if (!slot1.confirmed || slot1.current !== firstPlaceTeam) {
          slot1.confirmed = true;
          slot1.current = firstPlaceTeam;
          slot1.candidates = [{ name: firstPlaceTeam, prob: 100 }];
          structuralChange = true;
        }
      } else {
        if (slot1.current !== firstPlaceTeam) {
          slot1.current = firstPlaceTeam;
          structuralChange = true;
        }
      }
    }
    
    if (slot2) {
      if (isCompleted) {
        if (!slot2.confirmed || slot2.current !== secondPlaceTeam) {
          slot2.confirmed = true;
          slot2.current = secondPlaceTeam;
          slot2.candidates = [{ name: secondPlaceTeam, prob: 100 }];
          structuralChange = true;
        }
      } else {
        if (slot2.current !== secondPlaceTeam) {
          slot2.current = secondPlaceTeam;
          structuralChange = true;
        }
        
        // 敗退が数学的に確定しているチームを除外
        const teamMaxPoints = {};
        table.forEach(t => {
          const remainingGames = 3 - t.playedGames;
          teamMaxPoints[t.team.name] = t.points + (remainingGames * 3);
        });
        
        const currentPoints = table.map(t => t.points).sort((a, b) => b - a);
        const cutoffPoints = currentPoints[1] || 0;
        
        const activeCandidates = slot2.candidates.filter(c => {
          const teamName = c.name;
          const tableEntry = table.find(t => t.team.name === teamName);
          if (!tableEntry) return true;
          if (teamMaxPoints[teamName] < cutoffPoints) {
            return false;
          }
          return true;
        });
        
        if (activeCandidates.length !== slot2.candidates.length) {
          slot2.candidates = activeCandidates;
          structuralChange = true;
        }
      }
    }
  });
  
  if (structuralChange) {
    recomputeGroupSlots();
    evaluateBracket();
    renderAll();
  }
}

function applyLiveMatches(data) {
  if (!data || !data.matches) return;
  
  let structuralChange = false;
  
  data.matches.forEach(apiMatch => {
    if (apiMatch.stage === "GROUP_STAGE") return;
    if (apiMatch.status !== "FINISHED") return;
    
    const homeTeam = apiMatch.homeTeam.name;
    const awayTeam = apiMatch.awayTeam.name;
    
    const matchId = Object.keys(matches).find(id => {
      const m = matches[id];
      return (
        (m.team1Name === homeTeam && m.team2Name === awayTeam) ||
        (m.team1Name === awayTeam && m.team2Name === homeTeam)
      );
    });
    
    if (matchId) {
      const match = matches[matchId];
      const score = apiMatch.score;
      if (!score || !score.fullTime) return;
      
      const homeScore = score.fullTime.home;
      const awayScore = score.fullTime.away;
      
      let apiWinner = null;
      if (score.winner === "HOME_TEAM") apiWinner = homeTeam;
      else if (score.winner === "AWAY_TEAM") apiWinner = awayTeam;
      
      let scoreText = "";
      const isHomeWinner = (apiWinner === homeTeam);
      const winScore = isHomeWinner ? homeScore : awayScore;
      const loseScore = isHomeWinner ? awayScore : homeScore;
      
      if (score.duration === "REGULAR") {
        scoreText = isHomeWinner ? `${winScore} - ${loseScore}` : `${loseScore} - ${winScore}`;
      } else if (score.duration === "EXTRA_TIME") {
        scoreText = isHomeWinner ? `${winScore} - ${loseScore} (AET)` : `${loseScore} - ${winScore} (AET)`;
      } else if (score.duration === "PENALTY_SHOOTOUT") {
        const pkHome = score.penalties ? score.penalties.home : 0;
        const pkAway = score.penalties ? score.penalties.away : 0;
        const pkText = isHomeWinner ? `(${pkHome}-${pkAway} PK)` : `(${pkAway}-${pkHome} PK)`;
        scoreText = `${homeScore} - ${awayScore} ${pkText}`;
      } else {
        scoreText = `${homeScore} - ${awayScore}`;
      }
      
      if (match.winner !== apiWinner || match.score !== scoreText) {
        match.winner = apiWinner;
        match.score = scoreText;
        structuralChange = true;
      }
    }
  });
  
  if (structuralChange) {
    evaluateBracket();
    renderAll();
  }
}
