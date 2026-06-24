// W杯 2026 トーナメント予想シミュレーター 
// 言語状態 & 翻訳
let currentLang = 'ja';
let isBracketLocked = false; // 決勝予想決定時にトーナメント全体をロックするフラグ

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
  { code: 'he', name: 'עibri' },
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
  { code: 'ca', name: 'Català' },
  { code: 'gl', name: 'Galego' },
  { code: 'eu', name: 'Euskara' },
  { code: 'is', name: 'Íslenska' },
  { code: 'ga', name: 'Gaeilge' },
  { code: 'cy', name: 'Cymraeg' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Shqip' },
  { code: 'mk', name: 'Македонски' },
  { code: 'hy', name: 'Հայերեն' },
  { code: 'ka', name: 'ქართული' },
  { code: 'az', name: 'Azərbaycanca' }
];

const translations = {
  en: {
    title: "WORLD CUP 2026",
    heroDate: "CURRENT DATE: JUNE 25, 2026",
    heroHeading: "Interactive Bracket Predictor",
    heroDesc: "The Group Stage is concluding in North America. Confirm 100% fixed slots (🔒), click adjustable slots to switch based on qualification probability, or run AI predictions to simulate the tournament!",
    scrollPrompt: "Scroll down to reveal stadium & bracket",
    controlTitle: "Simulation Control Room",
    controlDesc: "Click a match participant to advance them, or select a slot to see other qualified candidates. Use the AI tool to predict outcomes using team strengths.",
    btnAiPredict: "AI Auto Predict",
    btnReset: "Reset Bracket",
    viewAll: "Full Bracket",
    viewLeft: "Left Bracket",
    viewRight: "Right Bracket",
    viewCenter: "Finals",
    round32: "ROUND OF 32",
    round16: "ROUND OF 16",
    quarterFinals: "QUARTER-FINALS",
    semiFinals: "SEMI-FINALS",
    final: "WORLD CUP FINAL",
    thirdPlace: "THIRD PLACE PLAY-OFF",
    worldChampion: "WORLD CHAMPION",
    tbd: "TBD",
    matchLabel: "Match",
    confirmedBadge: "Confirmed",
    selectTeamTitle: "Select Qualified Team",
    finalisedBadge: "PREDICTION FINALISED",
    footerCredits: "© 2026 FIFA World Cup Fan Simulator. Created with real group draw data.",
    liveMatchesTitle: "LIVE MATCH STATION",
    liveMatchesDesc: "Real-time scores and detailed statistics from active matches.",
    btnSaveImg: "Save as Image"
  },
  ja: {
    title: "W杯 2026 予想",
    heroDate: "シミュレーション日付: 2026年6月25日",
    heroHeading: "W杯 2026 トーナメント予想",
    heroDesc: "北米で開催されるグループステージが終盤を迎えています。100%確定した枠（🔒）を確認し、未確定の枠をクリックして勝ち抜け確率別の候補チームを切り替えたり、AIによる確率シミュレーションを実行して優勝国を予想しましょう！",
    scrollPrompt: "スクロールしてスタジアムとトーナメント表を表示",
    controlTitle: "シミュレーション操作パネル",
    controlDesc: "各対戦カードのチーム名をクリックして勝ち上がらせるか、未確定スロットをクリックして別候補を選びます。AI予測機能はチーム力に基づいてシミュレートします。",
    btnAiPredict: "AI自動シミュレーション",
    btnReset: "トーナメントのリセット",
    viewAll: "ブラケット全体",
    viewLeft: "左ブロック (M73-M80)",
    viewRight: "右ブロック (M81-M88)",
    viewCenter: "決勝ラウンド",
    round32: "ラウンド 32",
    round16: "ラウンド 16",
    quarterFinals: "準々決勝",
    semiFinals: "準決勝",
    final: "ワールドカップ 決勝",
    thirdPlace: "3位決定戦",
    worldChampion: "世界王者 (優勝国)",
    tbd: "未決定",
    matchLabel: "マッチ",
    confirmedBadge: "確定",
    selectTeamTitle: "進出チームの選択",
    finalisedBadge: "予想確定（ブラケット固定）",
    footerCredits: "© 2026 FIFAワールドカップ ファンシミュレーター。実際のグループ抽選データに基づいています。",
    liveMatchesTitle: "LIVE 試合ステーション",
    liveMatchesDesc: "現在進行中のリアルタイムスコアと詳細な試合データをお届けします。",
    btnSaveImg: "画像で保存"
  },
  es: {
    title: "MUNDIAL 2026",
    heroDate: "FECHA ACTUAL: 25 DE JUNIO DE 2026",
    heroHeading: "Pronosticador del Mundial 2026",
    heroDesc: "La fase de grupos está terminando en Norteamérica. Confirma los cupos fijos (🔒), haz clic en los modificables según sus probabilidades o simula con IA los ganadores.",
    scrollPrompt: "Desliza hacia abajo para revelar el estadio y el cuadro",
    controlTitle: "Panel de Simulación",
    controlDesc: "Haz clic en un equipo para avanzar al siguiente partido o selecciona una ranura para cambiar el clasificado. Usa la IA para calcular según la fortaleza del equipo.",
    btnAiPredict: "Predicción Automática con IA",
    btnReset: "Reiniciar Bracket",
    viewAll: "Bracket Completo",
    viewLeft: "Bloque Izquierdo",
    viewRight: "Bloque Derecho",
    viewCenter: "Finales",
    round32: "DIECISEISAVOS DE FINAL",
    round16: "OCTAVOS DE FINAL",
    quarterFinals: "CUARTOS DE FINAL",
    semiFinals: "SEMIFINALES",
    final: "FINAL DEL MUNDIAL",
    thirdPlace: "TERCER PUESTO",
    worldChampion: "CAMPEÓN MUNDIAL",
    tbd: "TBD",
    matchLabel: "Partido",
    confirmedBadge: "Confirmado",
    selectTeamTitle: "Seleccionar Clasificado",
    finalisedBadge: "PRONÓSTICO FINALIZADO",
    footerCredits: "© 2026 Simulador del Fanático de la Copa Mundial. Creado con los datos reales del sorteo.",
    liveMatchesTitle: "ESTACIÓN DE PARTIDOS EN VIVO",
    liveMatchesDesc: "Marcadores en tiempo real y estadísticas detalladas de partidos activos.",
    btnSaveImg: "Guardar como imagen"
  }
};

const teamTranslations = {
  en: {
    "Mexico": "Mexico", "South Africa": "South Africa", "South Korea": "South Korea", "Sweden": "Sweden",
    "Australia": "Australia", "Türkiye": "Türkiye", "Canada": "Canada", "Switzerland": "Switzerland",
    "Brazil": "Brazil", "Morocco": "Morocco", "Scotland": "Scotland", "USA": "USA", "Paraguay": "Paraguay",
    "Germany": "Germany", "Ecuador": "Ecuador", "Ivory Coast": "Ivory Coast", "Netherlands": "Netherlands",
    "Japan": "Japan", "Belgium": "Belgium", "Egypt": "Egypt", "Iran": "Iran", "Spain": "Spain",
    "Saudi Arabia": "Saudi Arabia", "Uruguay": "Uruguay", "France": "France", "Norway": "Norway",
    "Senegal": "Senegal", "Argentina": "Argentina", "Austria": "Austria", "Algeria": "Algeria",
    "Portugal": "Portugal", "Colombia": "Colombia", "Uzbekistan": "Uzbekistan", "England": "England",
    "Croatia": "Croatia", "Panama": "Panama", "TBD": "TBD",
    "Czechia": "Czechia", "Bosnia-Herzegovina": "Bosnia-Herzegovina", "Qatar": "Qatar", "Haiti": "Haiti",
    "Curaçao": "Curaçao", "Tunisia": "Tunisia", "New Zealand": "New Zealand", "Cape Verde": "Cape Verde",
    "Iraq": "Iraq", "Jordan": "Jordan", "DR Congo": "DR Congo", "Ghana": "Ghana"
  },
  ja: {
    "Mexico": "メキシコ", "South Africa": "南アフリカ", "South Korea": "韓国", "Sweden": "スウェーデン",
    "Australia": "オーストラリア", "Türkiye": "トルコ", "Canada": "カナダ", "Switzerland": "スイス",
    "Brazil": "ブラジル", "Morocco": "モロッコ", "Scotland": "スコットランド", "USA": "アメリカ", "Paraguay": "パラグアイ",
    "Germany": "ドイツ", "Ecuador": "エクアドル", "Ivory Coast": "コートジボワール", "Netherlands": "オランダ",
    "Japan": "日本", "Belgium": "ベルギー", "Egypt": "エジプト", "Iran": "イラン", "Spain": "スペイン",
    "Saudi Arabia": "サウジアラビア", "Uruguay": "ウルグアイ", "France": "フランス", "Norway": "ノルウェー",
    "Senegal": "セネガル", "Argentina": "アルゼンチン", "Austria": "オーストリア", "Algeria": "アルジェリア",
    "Portugal": "ポルトガル", "Colombia": "コロンビア", "Uzbekistan": "ウズベキスタン", "England": "イングランド",
    "Croatia": "クロアチア", "Panama": "パナマ", "TBD": "未決定",
    "Czechia": "チェコ", "Bosnia-Herzegovina": "ボスニア・ヘルツェゴビナ", "Qatar": "カタール", "Haiti": "ハイチ",
    "Curaçao": "キュラソー", "Tunisia": "チュニジア", "New Zealand": "ニュージーランド", "Cape Verde": "カーボベルデ",
    "Iraq": "イラク", "Jordan": "ヨルダン", "DR Congo": "DRコンゴ", "Ghana": "ガーナ"
  },
  es: {
    "Mexico": "México", "South Africa": "Sudáfrica", "South Korea": "Corea del Sur", "Sweden": "Suecia",
    "Australia": "Australia", "Türkiye": "Turquía", "Canada": "Canadá", "Switzerland": "Suiza",
    "Brazil": "Brasil", "Morocco": "Marruecos", "Scotland": "Escocia", "USA": "EE. UU.", "Paraguay": "Paraguay",
    "Germany": "Alemania", "Ecuador": "Ecuador", "Ivory Coast": "Costa de Marfil", "Netherlands": "Países Bajos",
    "Japan": "Japón", "Belgium": "Bélgica", "Egypt": "Egipto", "Iran": "Irán", "Spain": "España",
    "Saudi Arabia": "Arabia Saudita", "Uruguay": "Uruguay", "France": "Francia", "Norway": "Noruega",
    "Senegal": "Senegal", "Argentina": "Argentina", "Austria": "Austria", "Algeria": "Argelia",
    "Portugal": "Portugal", "Colombia": "Colombia", "Uzbekistan": "Uzbekistán", "England": "Inglaterra",
    "Croatia": "Croacia", "Panama": "Panamá", "TBD": "Por determinar",
    "Czechia": "República Checa", "Bosnia-Herzegovina": "Bosnia y Herzegovina", "Qatar": "Catar", "Haiti": "Haití",
    "Curaçao": "Curazao", "Tunisia": "Túnez", "New Zealand": "Nueva Zelanda", "Cape Verde": "Cabo Verde",
    "Iraq": "Irak", "Jordan": "Jordania", "DR Congo": "RD Congo", "Ghana": "Ghana"
  }
};

// translations_full.js で読み込まれる完全な多言語データをマージ
const globalTrans = window.allTranslations || (typeof allTranslations !== 'undefined' ? allTranslations : null);
const globalTeamTrans = window.allTeamTranslations || (typeof allTeamTranslations !== 'undefined' ? allTeamTranslations : null);

if (globalTrans) {
  Object.assign(translations, globalTrans);
}
if (globalTeamTrans) {
  Object.assign(teamTranslations, globalTeamTrans);
}

// チームの実力（強さ）レーティング - AI予測時に使用
const teamStrengths = {
  "Argentina": 92, "France": 91, "Brazil": 90, "England": 89, "Spain": 89,
  "Portugal": 87, "Netherlands": 86, "Türkiye": 80, "Germany": 85, "Belgium": 84,
  "Uruguay": 83, "Colombia": 82, "Croatia": 82, "Japan": 79, "Morocco": 79,
  "USA": 78, "Senegal": 77, "Switzerland": 76, "Austria": 76, "South Korea": 75,
  "Sweden": 75, "Ecuador": 74, "Norway": 74, "Australia": 73, "Paraguay": 72,
  "Ivory Coast": 72, "South Africa": 68, "Egypt": 68, "Saudi Arabia": 67,
  "Scotland": 66, "Algeria": 66, "Canada": 65, "Uzbekistan": 64, "Iran": 63,
  "Panama": 61, "Ghana": 71, "DR Congo": 69, "Tunisia": 70, "Bosnia-Herzegovina": 68,
  "Cape Verde": 67, "Qatar": 65, "Iraq": 65, "Jordan": 64, "New Zealand": 63,
  "Czechia": 74, "Haiti": 60, "Curaçao": 58, "TBD": 10
};

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
  "Czechia": "CZ", "Bosnia-Herzegovina": "BA", "Qatar": "QA", "Haiti": "HT",
  "Curaçao": "CW", "Tunisia": "TN", "New Zealand": "NZ", "Cape Verde": "CV",
  "Iraq": "IQ", "Jordan": "JO", "DR Congo": "CD", "Ghana": "GH", "TBD": "?"
};

// グループステージスロットデータ（2026年6月25日現在の勝ち抜け候補と確率）
const initialGroupSlots = {
  "1A": { confirmed: true, current: "Mexico", candidates: [{ name: "Mexico", prob: 100.00 }] },
  "2A": { confirmed: false, current: "South Korea", candidates: [{ name: "South Korea", prob: 50.12 }, { name: "South Africa", prob: 28.45 }, { name: "Czechia", prob: 21.43 }] },
  "1B": { confirmed: false, current: "Canada", candidates: [{ name: "Canada", prob: 65.23 }, { name: "Switzerland", prob: 34.77 }] },
  "2B": { confirmed: false, current: "Switzerland", candidates: [{ name: "Switzerland", prob: 55.42 }, { name: "Bosnia-Herzegovina", prob: 29.84 }, { name: "Qatar", prob: 14.74 }] },
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
  
  // 3位通過候補スロット
  "3rd_A_B_C_D_F": { confirmed: false, current: "Sweden", candidates: [{ name: "Sweden", prob: 51.34 }, { name: "Australia", prob: 29.81 }, { name: "Czechia", prob: 18.85 }] },
  "3rd_C_D_F_G_H": { confirmed: false, current: "Morocco", candidates: [{ name: "Morocco", prob: 44.82 }, { name: "Scotland", prob: 34.91 }, { name: "Tunisia", prob: 20.27 }] },
  "3rd_C_E_F_H_I": { confirmed: false, current: "Ecuador", candidates: [{ name: "Ecuador", prob: 60.12 }, { name: "Cape Verde", prob: 24.63 }, { name: "Senegal", prob: 15.25 }] },
  "3rd_E_H_I_J_K": { confirmed: false, current: "Ivory Coast", candidates: [{ name: "Ivory Coast", prob: 54.78 }, { name: "Austria", prob: 29.85 }, { name: "DR Congo", prob: 15.37 }] },
  "3rd_B_E_F_I_J": { confirmed: false, current: "Switzerland", candidates: [{ name: "Switzerland", prob: 49.61 }, { name: "Norway", prob: 35.12 }, { name: "Algeria", prob: 15.27 }] },
  "3rd_A_E_H_I_J": { confirmed: false, current: "South Korea", candidates: [{ name: "South Korea", prob: 40.23 }, { name: "Bosnia-Herzegovina", prob: 34.62 }, { name: "Jordan", prob: 25.15 }] },
  "3rd_E_F_G_I_J": { confirmed: false, current: "Japan", candidates: [{ name: "Japan", prob: 64.85 }, { name: "Sweden", prob: 25.07 }, { name: "Egypt", prob: 10.08 }] },
  "3rd_D_E_I_J_L": { confirmed: false, current: "Croatia", candidates: [{ name: "Croatia", prob: 50.11 }, { name: "Ghana", prob: 30.14 }, { name: "Paraguay", prob: 19.75 }] },
};

// ディープコピー用ヘルパー
let groupSlots = JSON.parse(JSON.stringify(initialGroupSlots));

// 3位枠配置決定用 (Annex C)
const group3rdPlaceTeams = {
  A: "Czechia", B: "Bosnia-Herzegovina", C: "Scotland", D: "Australia",
  E: "Ivory Coast", F: "Sweden", G: "Egypt", H: "Cape Verde", I: "Senegal",
  J: "Algeria", K: "DR Congo", L: "Ghana"
};

// トーナメントブラケット定義 (マッチIDと入力スロット/チーム)
const initialMatches = {
  // Round of 32
  73: { round: "r32", team1: { slot: "2A" }, team2: { slot: "2B" }, winner: null, score: null },
  74: { round: "r32", team1: { slot: "1E" }, team2: { slot: "3rd_A_B_C_D_F" }, winner: null, score: null },
  75: { round: "r32", team1: { slot: "1F" }, team2: { slot: "2C" }, winner: null, score: null },
  76: { round: "r32", team1: { slot: "1C" }, team2: { slot: "2F" }, winner: null, score: null },
  77: { round: "r32", team1: { slot: "1I" }, team2: { slot: "3rd_C_D_F_G_H" }, winner: null, score: null },
  78: { round: "r32", team1: { slot: "2E" }, team2: { slot: "2I" }, winner: null, score: null },
  79: { round: "r32", team1: { slot: "1A" }, team2: { slot: "3rd_C_E_F_H_I" }, winner: null, score: null },
  80: { round: "r32", team1: { slot: "1L" }, team2: { slot: "3rd_E_H_I_J_K" }, winner: null, score: null },
  81: { round: "r32", team1: { slot: "1D" }, team2: { slot: "3rd_B_E_F_I_J" }, winner: null, score: null },
  82: { round: "r32", team1: { slot: "1G" }, team2: { slot: "3rd_A_E_H_I_J" }, winner: null, score: null },
  83: { round: "r32", team1: { slot: "2K" }, team2: { slot: "2L" }, winner: null, score: null },
  84: { round: "r32", team1: { slot: "1H" }, team2: { slot: "2J" }, winner: null, score: null },
  85: { round: "r32", team1: { slot: "1B" }, team2: { slot: "3rd_E_F_G_I_J" }, winner: null, score: null },
  86: { round: "r32", team1: { slot: "1J" }, team2: { slot: "2H" }, winner: null, score: null },
  87: { round: "r32", team1: { slot: "1K" }, team2: { slot: "3rd_D_E_I_J_L" }, winner: null, score: null },
  88: { round: "r32", team1: { slot: "2D" }, team2: { slot: "2G" }, winner: null, score: null },

  // Round of 16
  89: { round: "r16", team1: { parentMatch: 74 }, team2: { parentMatch: 77 }, winner: null, score: null },
  90: { round: "r16", team1: { parentMatch: 73 }, team2: { parentMatch: 75 }, winner: null, score: null },
  91: { round: "r16", team1: { parentMatch: 76 }, team2: { parentMatch: 78 }, winner: null, score: null },
  92: { round: "r16", team1: { parentMatch: 79 }, team2: { parentMatch: 80 }, winner: null, score: null },
  93: { round: "r16", team1: { parentMatch: 83 }, team2: { parentMatch: 84 }, winner: null, score: null },
  94: { round: "r16", team1: { parentMatch: 81 }, team2: { parentMatch: 82 }, winner: null, score: null },
  95: { round: "r16", team1: { parentMatch: 86 }, team2: { parentMatch: 88 }, winner: null, score: null },
  96: { round: "r16", team1: { parentMatch: 85 }, team2: { parentMatch: 87 }, winner: null, score: null },

  // Quarter-Finals
  97: { round: "qf", team1: { parentMatch: 89 }, team2: { parentMatch: 90 }, winner: null, score: null },
  98: { round: "qf", team1: { parentMatch: 93 }, team2: { parentMatch: 94 }, winner: null, score: null },
  99: { round: "qf", team1: { parentMatch: 91 }, team2: { parentMatch: 92 }, winner: null, score: null },
  100: { round: "qf", team1: { parentMatch: 95 }, team2: { parentMatch: 96 }, winner: null, score: null },

  // Semi-Finals
  101: { round: "sf", team1: { parentMatch: 97 }, team2: { parentMatch: 98 }, winner: null, score: null },
  102: { round: "sf", team1: { parentMatch: 99 }, team2: { parentMatch: 100 }, winner: null, score: null },

  // Finals & 3rd Place
  103: { round: "third", team1: { parentMatch: 101, loser: true }, team2: { parentMatch: 102, loser: true }, winner: null, score: null },
  104: { round: "final", team1: { parentMatch: 101 }, team2: { parentMatch: 102 }, winner: null, score: null }
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

// APIからの国名をアプリ内表記に正規化
function normalizeTeamName(name) {
  const map = {
    "Turkey": "Türkiye",
    "United States": "USA",
    "Congo DR": "DR Congo",
    "Cape Verde Islands": "Cape Verde"
  };
  return map[name] || name;
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
      tr: "İskoçya", ru: "Шотланディア"
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

// FIFA 3位通過枠のマッピング定義データをロードする
let fifa3rdPlaceMapping = {};
function loadFifa3rdPlaceMapping() {
  fetch('fifa_3rd_place_mapping.json')
    .then(res => {
      if (!res.ok) throw new Error("Mapping file load failed");
      return res.json();
    })
    .then(data => {
      fifa3rdPlaceMapping = data;
      evaluateBracket();
      renderAll();
    })
    .catch(err => {
      console.log("3rd place mapping load failed:", err.message);
    });
}

// 3位枠の配置アルゴリズム (FIFA 規定 Annex C のシミュレート)
function applyAnnexC() {
  if (!fifa3rdPlaceMapping || Object.keys(fifa3rdPlaceMapping).length === 0) return;

  const active3rdGroups = [];
  const slotsToCheck = ["3rd_A_B_C_D_F", "3rd_C_D_F_G_H", "3rd_C_E_F_H_I", "3rd_E_H_I_J_K", "3rd_B_E_F_I_J", "3rd_A_E_H_I_J", "3rd_E_F_G_I_J", "3rd_D_E_I_J_L"];
  
  const groupFinder = {
    "Sweden": "F", "Morocco": "C", "Ecuador": "E", "Ivory Coast": "E",
    "Switzerland": "B", "South Korea": "A", "Japan": "F", "Croatia": "L",
    "Czechia": "A", "Bosnia-Herzegovina": "B", "Scotland": "C", "Australia": "D",
    "Egypt": "G", "Cape Verde": "H", "Senegal": "I", "Algeria": "J",
    "DR Congo": "K", "Ghana": "L", "Tunisia": "F"
  };

  const detectedGroupsSet = new Set();
  slotsToCheck.forEach(s => {
    const team = groupSlots[s].current;
    const g = groupFinder[team];
    if (g) detectedGroupsSet.add(g);
  });

  const combinationKey = Array.from(detectedGroupsSet).sort().join("");
  const allocation = fifa3rdPlaceMapping[combinationKey];

  if (allocation) {
    Object.keys(allocation).forEach(slotName => {
      const sourceGroup = allocation[slotName];
      const team3rd = group3rdPlaceTeams[sourceGroup] || "TBD";
      
      if (groupSlots[slotName]) {
        groupSlots[slotName].current = team3rd;
      }
    });
  }
}

// すべてのマッチデータの動的なチーム名解決と勝ち上がり伝播
function evaluateBracket() {
  applyAnnexC();

  const sortedMatchIds = Object.keys(matches).sort((a, b) => parseInt(a) - parseInt(b));

  sortedMatchIds.forEach(id => {
    const match = matches[id];
    
    const prevTeam1 = match.team1Name;
    const prevTeam2 = match.team2Name;

    match.team1Name = resolveTeamName(match.team1);
    match.team2Name = resolveTeamName(match.team2);

    if (match.team1Name !== prevTeam1 && match.winner === prevTeam1) {
      match.winner = null;
    }
    if (match.team2Name !== prevTeam2 && match.winner === prevTeam2) {
      match.winner = null;
    }

    if (match.team1Name === "TBD" || match.team2Name === "TBD") {
      match.winner = null;
    }

    if (match.team1Name !== prevTeam1 || match.team2Name !== prevTeam2 || !match.winner) {
      if (!match.winner) {
        match.score = null;
      } else {
        match.score = generateMatchScore(match.team1Name, match.team2Name, match.winner);
      }
    }
  });

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
  
  const r16Left = [90, 89, 93, 94];
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

// 1つのマッチボックス要素を作成
function createMatchBox(id) {
  const match = matches[id];
  const div = document.createElement('div');
  div.className = `match-box`;
  if (match.score && match.score.includes('(LIVE)')) {
    div.classList.add('live-match-active');
  }
  div.id = `match-${id}`;

  const label = translations[currentLang].matchLabel;
  const scoreDisplay = match.score ? match.score : "TBD";
  div.innerHTML = `
    <div class="match-id">${label} ${id}</div>
    <div class="match-info-meta">${scoreDisplay}</div>
  `;

  const slot1 = createTeamSlot(match.team1Name, match.team1.slot, match.winner === match.team1Name, match.winner && match.winner !== match.team1Name);
  const slot2 = createTeamSlot(match.team2Name, match.team2.slot, match.winner === match.team2Name, match.winner && match.winner !== match.team2Name);

  if (match.team1Name !== "TBD") {
    slot1.addEventListener('click', (e) => {
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

  let isConfirmed = false;
  let probText = "";
  
  if (groupSlotKey) {
    const slotData = groupSlots[groupSlotKey];
    isConfirmed = slotData.confirmed;
    
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

  if (groupSlotKey && !isConfirmed) {
    slot.querySelectorAll('.select-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openCandidatesModal(groupSlotKey);
      });
    });
  }

  return slot;
}

// シンセサイザーによる効果音生成
function playSwooshSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.25);
    filter.Q.value = 4.0;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noise.start();
  } catch (e) {}
}

// 勝者決定時の処理（手動予想）
function selectWinner(matchId, winnerName) {
  if (isBracketLocked) return;
  if (winnerName === "TBD") return;
  
  playSwooshSound();
  
  const match = matches[matchId];
  match.winner = winnerName;
  match.score = generateMatchScore(match.team1Name, match.team2Name, winnerName);
  renderAll();

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
  if (isBracketLocked) return;
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
  playSwooshSound();
  groupSlots[slotKey].current = teamName;
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
function getMatchWinnerDeterministic(team1, team2) {
  if (team1 === "TBD" && team2 === "TBD") return "TBD";
  if (team1 === "TBD") return team2;
  if (team2 === "TBD") return team1;

  const strength1 = teamStrengths[team1] || 50;
  const strength2 = teamStrengths[team2] || 50;

  if (strength1 !== strength2) {
    return strength1 > strength2 ? team1 : team2;
  }
  return team1 < team2 ? team1 : team2;
}

// AI自動予想の実行
function runAiSimulation() {
  Object.keys(groupSlots).forEach(key => {
    const slot = groupSlots[key];
    if (!slot.confirmed) {
      let bestCandidate = slot.candidates[0];
      slot.candidates.forEach(c => {
        if (c.prob > bestCandidate.prob) {
          bestCandidate = c;
        }
      });
      slot.current = bestCandidate.name;
    }
  });

  evaluateBracket();

  const sortedMatchIds = Object.keys(matches).sort((a, b) => parseInt(a) - parseInt(b));

  sortedMatchIds.forEach(id => {
    const match = matches[id];
    match.team1Name = resolveTeamName(match.team1);
    match.team2Name = resolveTeamName(match.team2);

    const winner = getMatchWinnerDeterministic(match.team1Name, match.team2Name);
    match.winner = winner;
    match.score = generateMatchScore(match.team1Name, match.team2Name, winner);
    
    evaluateBracket();
  });

  renderAll();

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// リセット
function resetBracket() {
  isBracketLocked = false;
  groupSlots = JSON.parse(JSON.stringify(initialGroupSlots));
  matches = JSON.parse(JSON.stringify(initialMatches));
  renderAll();
}

// 汎用予想テキスト生成ヘルパー
function getPredictionText() {
  const finalMatch = matches[104];
  if (finalMatch && finalMatch.winner && finalMatch.winner !== "TBD") {
    const winnerName = getTeamName(finalMatch.winner);
    return `私のFIFAワールドカップ2026の優勝予想は【${winnerName}】！\n48カ国のチーム力とリアルタイムデータを元にシミュレートした結果はこちら：`;
  }
  return `FIFAワールドカップ2026のトーナメント予想シミュレータで優勝国を予想しよう！`;
}

// Xで予想結果をシェア
function shareOnX() {
  const text = getPredictionText();
  const shareUrl = "https://worldcup-predict2026.github.io/champion/";
  const hashtags = "WorldCup2026,ワールドカップ予想,W杯予想";
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtags)}`;
  window.open(twitterUrl, '_blank');
}

// LINEで予想結果をシェア
function shareOnLine() {
  const text = getPredictionText();
  const shareUrl = "https://worldcup-predict2026.github.io/champion/";
  const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(text + " " + shareUrl)}`;
  window.open(lineUrl, '_blank');
}

// WhatsAppで予想結果をシェア
function shareOnWhatsApp() {
  const text = getPredictionText();
  const shareUrl = "https://worldcup-predict2026.github.io/champion/";
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`;
  window.open(waUrl, '_blank');
}

// トーナメント表（ブラケット）を画像として保存
function saveBracketAsImage() {
  const element = document.getElementById("bracket-view");
  if (!element) return;

  const saveBtn = document.getElementById("save-img-btn");
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>画像生成中...</span>`;
  saveBtn.disabled = true;

  html2canvas(element, {
    backgroundColor: "#0d1117", // 背景をダークテーマに合わせる
    useCORS: true,
    scale: 2
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "worldcup-bracket-2026.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
  }).catch(err => {
    console.error("Failed to generate image:", err);
    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
  });
}

// パララックス背景スクロール効果
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

let hasScannedHologram = false;

if (parallaxContainer && layerSky && layerRoof && layerStands && layerFlares && layerPitch) {
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
    const maxScroll = 1200;
    const ratio = Math.min(scrollTop / maxScroll, 1);
    
    const skyScale = 2.0 + (ratio * 1.0);
    layerSky.style.transform = `translateZ(-10px) scale(${skyScale})`;

    const roofRatio = Math.min(scrollTop / 800, 1);
    const roofOpacity = 0.9 * (1 - roofRatio);
    const roofScale = 1.6 + (roofRatio * 2.9);
    layerRoof.style.opacity = roofOpacity;
    layerRoof.style.transform = `translateZ(-8px) scale(${roofScale})`;

    let standsOpacity = 0;
    if (scrollTop > 200 && scrollTop <= 600) {
      standsOpacity = (scrollTop - 200) / 400;
    } else if (scrollTop > 600 && scrollTop <= 1000) {
      standsOpacity = 1 - (scrollTop - 600) / 400;
    }
    const standsScale = 1.3 + (Math.min(scrollTop / 1000, 1) * 2.2);
    const standsBlur = Math.max(2 - (scrollTop / 400) * 2, 0) + (scrollTop > 800 ? (scrollTop - 800) / 50 : 0);
    layerStands.style.opacity = standsOpacity;
    layerStands.style.transform = `translateZ(-5px) scale(${standsScale})`;
    layerStands.style.filter = `brightness(0.85) blur(${standsBlur}px)`;

    let flaresOpacity = 0;
    if (scrollTop > 400 && scrollTop <= 650) {
      flaresOpacity = (scrollTop - 400) / 250;
    } else if (scrollTop > 650 && scrollTop <= 900) {
      flaresOpacity = 1 - (scrollTop - 650) / 250;
    }
    const flaresScale = 1.15 + (Math.min(scrollTop / 900, 1) * 1.35);
    layerFlares.style.opacity = flaresOpacity * 0.8;
    layerFlares.style.transform = `translateZ(-3px) scale(${flaresScale})`;

    let pitchRatio = 0;
    if (scrollTop > 600) {
      pitchRatio = Math.min((scrollTop - 600) / 400, 1);
    }
    const pitchOpacity = pitchRatio;
    const pitchScale = 1.4 - (pitchRatio * 0.4);
    const pitchBrightness = 0.6 + (pitchRatio * 0.35);
    layerPitch.style.opacity = pitchOpacity;
    layerPitch.style.transform = `translateZ(0px) scale(${pitchScale})`;
    layerPitch.style.filter = `brightness(${pitchBrightness}) contrast(1.05)`;

    if (mainGoldLogo) {
      const logoRatio = Math.min(scrollTop / 400, 1);
      mainGoldLogo.style.opacity = 1 - logoRatio;
      mainGoldLogo.style.transform = `scale(${1.0 + logoRatio * 0.8}) translateY(${-logoRatio * 50}px)`;
    }

    if (layerOverlay) {
      layerOverlay.style.opacity = 0.5 + (ratio * 0.45);
    }
    
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

      if (scrollTop > 1050 && !hasScannedHologram) {
        hasScannedHologram = true;
        bracketContainer.classList.add('laser-scanning');
        playSwooshSound();
        setTimeout(() => {
          bracketContainer.classList.remove('laser-scanning');
        }, 2500);
      } else if (scrollTop < 900) {
        hasScannedHologram = false;
      }
    }
  });
}

// ビューポート切り替え
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const view = btn.getAttribute('data-view');
    const viewContainer = document.getElementById('bracket-view');
    
    viewContainer.className = 'bracket-container';
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

  // ブラウザの言語設定を取得し、初期言語を決定（デフォルトは英語 'en'）
  let defaultLang = 'en';
  const browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
  if (browserLang && supportedLanguages.some(l => l.code === browserLang)) {
    defaultLang = browserLang;
  }

  loadFifa3rdPlaceMapping();
  setLanguage(defaultLang);
  startRealtimeUpdates();
  loadLiveFootballData();
  
  setInterval(loadLiveFootballData, 15000); 

  // 各種SNSシェア・画像保存ボタンのイベント紐づけ
  const shareXBtn = document.getElementById('share-x-btn');
  if (shareXBtn) {
    shareXBtn.addEventListener('click', shareOnX);
  }
  const shareLineBtn = document.getElementById('share-line-btn');
  if (shareLineBtn) {
    shareLineBtn.addEventListener('click', shareOnLine);
  }
  const shareWaBtn = document.getElementById('share-wa-btn');
  if (shareWaBtn) {
    shareWaBtn.addEventListener('click', shareOnWhatsApp);
  }
  const saveImgBtn = document.getElementById('save-img-btn');
  if (saveImgBtn) {
    saveImgBtn.addEventListener('click', saveBracketAsImage);
  }
});

// リアルタイム確率更新ロジック
function startRealtimeUpdates() {
  setInterval(() => {
    if (isBracketLocked) return;
    updateProbabilityUI();
  }, 4000);
}

// 確率表示UI更新
function updateProbabilityUI() {
  document.querySelectorAll('.team-slot').forEach(slotEl => {
    const matchBox = slotEl.closest('.match-box');
    if (!matchBox) return;
    
    const matchId = matchBox.id.replace('match-', '');
    const match = matches[matchId];
    
    const teamSlotsInBox = Array.from(matchBox.querySelectorAll('.team-slot'));
    const isTeam1 = teamSlotsInBox.indexOf(slotEl) === 0;
                     
    const teamName = isTeam1 ? match.team1Name : match.team2Name;
    const participant = isTeam1 ? match.team1 : match.team2;
    
    if (participant && participant.slot) {
      const slotKey = participant.slot;
      const slotData = groupSlots[slotKey];
      const candidate = slotData.candidates.find(c => c.name === teamName);
      
      if (candidate && candidate.prob < 100) {
        const probTextEl = slotEl.querySelector('.team-probability.select-trigger');
        if (probTextEl) {
          const oldVal = parseFloat(probTextEl.textContent);
          const newVal = candidate.prob;
          
          if (oldVal !== newVal) {
            probTextEl.textContent = `${newVal.toFixed(2)}%`;
            probTextEl.style.color = 'var(--color-primary)';
            probTextEl.style.transition = 'color 0.1s ease';
            setTimeout(() => {
              probTextEl.style.color = 'var(--color-secondary)';
            }, 600);
          }
        }
      }
    }
  });
}

let latestStandingsData = null;
let latestMatchesData = null;

// リアルタイムデータ同期エンジン
function loadLiveFootballData() {
  Promise.all([
    fetch('live_standings.json').then(res => {
      if (!res.ok) throw new Error("No live standings file found");
      return res.json();
    }),
    fetch('live_matches.json').then(res => {
      if (!res.ok) throw new Error("No live matches file found");
      return res.json();
    })
  ])
  .then(([standingsData, matchesData]) => {
    latestStandingsData = standingsData;
    latestMatchesData = matchesData;
    
    // ライブ試合詳細カードなどの描画処理
    applyLiveMatches(matchesData);
    
    // グループステージ順位確率シミュレーションおよびスロット更新
    runGroupStageSimulation(standingsData, matchesData);
  })
  .catch(err => {
    console.log("Live data load error:", err.message);
  });
}

function runGroupStageSimulation(standingsData, matchesData) {
  if (!standingsData || !standingsData.standings || !matchesData || !matchesData.matches) return;

  const standings = standingsData.standings;
  const matches = matchesData.matches;

  // 1. 各グループのデータをパース
  const groups = {}; // A ~ L
  standings.forEach(gs => {
    const groupChar = gs.group.replace("Group ", "").trim();
    if (!groupChar || groupChar.length !== 1) return;
    
    groups[groupChar] = {
      teams: gs.table.map(t => ({
        name: normalizeTeamName(t.team.name),
        points: t.points,
        playedGames: t.playedGames,
        goalsFor: t.goalsFor,
        goalsAgainst: t.goalsAgainst,
        goalDifference: t.goalDifference
      })),
      remainingMatches: []
    };
  });

  // 2. 未消化のグループステージ試合を抽出
  matches.forEach(m => {
    if (m.stage !== "GROUP_STAGE") return;
    const groupChar = m.group.replace("GROUP_", "").trim();
    if (!groups[groupChar]) return;

    if (m.status !== "FINISHED") {
      groups[groupChar].remainingMatches.push({
        home: normalizeTeamName(m.homeTeam.name),
        away: normalizeTeamName(m.awayTeam.name)
      });
    }
  });

  // 各試行でカウントする用
  const slotCounts = {};
  const slotKeys = [];
  for (let i = 65; i <= 76; i++) { // A to L
    const g = String.fromCharCode(i);
    slotKeys.push(`1${g}`);
    slotKeys.push(`2${g}`);
    slotCounts[`1${g}`] = {};
    slotCounts[`2${g}`] = {};
  }
  
  const slot3rdKeys = [
    "3rd_A_B_C_D_F", "3rd_C_D_F_G_H", "3rd_C_E_F_H_I", "3rd_E_H_I_J_K", 
    "3rd_B_E_F_I_J", "3rd_A_E_H_I_J", "3rd_E_F_G_I_J", "3rd_D_E_I_J_L"
  ];
  slot3rdKeys.forEach(k => {
    slotCounts[k] = {};
  });

  const group3rdPlaceCounts = {};
  for (let i = 65; i <= 76; i++) {
    const g = String.fromCharCode(i);
    group3rdPlaceCounts[g] = {};
  }

  const NUM_SIMULATIONS = 1000;

  for (let sim = 0; sim < NUM_SIMULATIONS; sim++) {
    const simGroupResults = {};

    Object.keys(groups).forEach(g => {
      const groupData = groups[g];
      const teamsCopy = groupData.teams.map(t => ({ ...t }));

      groupData.remainingMatches.forEach(match => {
        const homeTeam = teamsCopy.find(t => t.name === match.home);
        const awayTeam = teamsCopy.find(t => t.name === match.away);
        if (!homeTeam || !awayTeam) return;

        const sH = teamStrengths[match.home] || 70;
        const sA = teamStrengths[match.away] || 70;

        const wH = Math.exp((sH - sA) / 20) * 1.2;
        const wA = Math.exp((sA - sH) / 20) * 1.2;
        const wD = 1.0;
        const totalW = wH + wA + wD;

        const r = Math.random() * totalW;
        if (r < wH) {
          homeTeam.points += 3;
          homeTeam.goalsFor += 2;
          homeTeam.goalsAgainst += 1;
          homeTeam.goalDifference += 1;
          awayTeam.goalsFor += 1;
          awayTeam.goalsAgainst += 2;
          awayTeam.goalDifference -= 1;
        } else if (r < wH + wA) {
          awayTeam.points += 3;
          awayTeam.goalsFor += 2;
          awayTeam.goalsAgainst += 1;
          awayTeam.goalDifference += 1;
          homeTeam.goalsFor += 1;
          homeTeam.goalsAgainst += 2;
          homeTeam.goalDifference -= 1;
        } else {
          homeTeam.points += 1;
          homeTeam.goalsFor += 1;
          homeTeam.goalsAgainst += 1;
          awayTeam.points += 1;
          awayTeam.goalsFor += 1;
          awayTeam.goalsAgainst += 1;
        }
        homeTeam.playedGames += 1;
        awayTeam.playedGames += 1;
      });

      teamsCopy.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        const strengthA = teamStrengths[a.name] || 70;
        const strengthB = teamStrengths[b.name] || 70;
        return strengthB - strengthA;
      });

      simGroupResults[g] = teamsCopy;
    });

    Object.keys(simGroupResults).forEach(g => {
      const table = simGroupResults[g];
      const t1 = table[0].name;
      const t2 = table[1].name;
      const t3 = table[2].name;

      slotCounts[`1${g}`][t1] = (slotCounts[`1${g}`][t1] || 0) + 1;
      slotCounts[`2${g}`][t2] = (slotCounts[`2${g}`][t2] || 0) + 1;
      group3rdPlaceCounts[g][t3] = (group3rdPlaceCounts[g][t3] || 0) + 1;
    });

    const thirdPlaceTeams = [];
    Object.keys(simGroupResults).forEach(g => {
      const t3 = simGroupResults[g][2];
      thirdPlaceTeams.push({
        group: g,
        name: t3.name,
        points: t3.points,
        goalDifference: t3.goalDifference,
        goalsFor: t3.goalsFor
      });
    });

    thirdPlaceTeams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      const strengthA = teamStrengths[a.name] || 70;
      const strengthB = teamStrengths[b.name] || 70;
      return strengthB - strengthA;
    });

    const qualified3rdGroups = [];
    const qualified3rdTeamsByGroup = {};
    for (let i = 0; i < 8; i++) {
      qualified3rdGroups.push(thirdPlaceTeams[i].group);
      qualified3rdTeamsByGroup[thirdPlaceTeams[i].group] = thirdPlaceTeams[i].name;
    }

    if (fifa3rdPlaceMapping) {
      const combinationKey = qualified3rdGroups.sort().join("");
      const allocation = fifa3rdPlaceMapping[combinationKey];
      if (allocation) {
        Object.keys(allocation).forEach(slotName => {
          const sourceGroup = allocation[slotName];
          const teamName = qualified3rdTeamsByGroup[sourceGroup] || "TBD";
          slotCounts[slotName][teamName] = (slotCounts[slotName][teamName] || 0) + 1;
        });
      }
    }
  }

  let structuralChange = false;

  slotKeys.forEach(slotKey => {
    const counts = slotCounts[slotKey];
    const candidates = [];
    Object.keys(counts).forEach(teamName => {
      const prob = parseFloat(((counts[teamName] / NUM_SIMULATIONS) * 100).toFixed(2));
      if (prob >= 0.1) {
        candidates.push({ name: teamName, prob });
      }
    });

    candidates.sort((a, b) => b.prob - a.prob);

    if (candidates.length === 0) return;

    const highestCandidate = candidates[0];
    const isCompletedGroup = groups[slotKey.substring(1)].remainingMatches.length === 0;

    const oldConfirmed = groupSlots[slotKey].confirmed;
    const oldCurrent = groupSlots[slotKey].current;

    const newConfirmed = isCompletedGroup || (highestCandidate.prob >= 99.9);
    const newCurrent = highestCandidate.name;

    let newCandidates = candidates;
    if (newConfirmed) {
      newCandidates = [{ name: newCurrent, prob: 100.00 }];
    }

    if (oldConfirmed !== newConfirmed || oldCurrent !== newCurrent || JSON.stringify(groupSlots[slotKey].candidates) !== JSON.stringify(newCandidates)) {
      groupSlots[slotKey].confirmed = newConfirmed;
      groupSlots[slotKey].current = newCurrent;
      groupSlots[slotKey].candidates = newCandidates;
      structuralChange = true;
    }
  });

  slot3rdKeys.forEach(slotKey => {
    const counts = slotCounts[slotKey];
    const candidates = [];
    Object.keys(counts).forEach(teamName => {
      const prob = parseFloat(((counts[teamName] / NUM_SIMULATIONS) * 100).toFixed(2));
      if (prob >= 0.1) {
        candidates.push({ name: teamName, prob });
      }
    });

    candidates.sort((a, b) => b.prob - a.prob);

    if (candidates.length === 0) return;

    const highestCandidate = candidates[0];
    const allCompleted = Object.keys(groups).every(g => groups[g].remainingMatches.length === 0);
    const newConfirmed = allCompleted || (highestCandidate.prob >= 99.9);
    const newCurrent = highestCandidate.name;

    let newCandidates = candidates;
    if (newConfirmed) {
      newCandidates = [{ name: newCurrent, prob: 100.00 }];
    }

    const oldConfirmed = groupSlots[slotKey].confirmed;
    const oldCurrent = groupSlots[slotKey].current;

    if (oldConfirmed !== newConfirmed || oldCurrent !== newCurrent || JSON.stringify(groupSlots[slotKey].candidates) !== JSON.stringify(newCandidates)) {
      groupSlots[slotKey].confirmed = newConfirmed;
      groupSlots[slotKey].current = newCurrent;
      groupSlots[slotKey].candidates = newCandidates;
      structuralChange = true;
    }
  });

  for (let i = 65; i <= 76; i++) {
    const g = String.fromCharCode(i);
    const counts = group3rdPlaceCounts[g];
    let highestTeam = "TBD";
    let highestCount = -1;
    Object.keys(counts).forEach(teamName => {
      if (counts[teamName] > highestCount) {
        highestCount = counts[teamName];
        highestTeam = teamName;
      }
    });

    if (highestTeam !== "TBD" && group3rdPlaceTeams[g] !== highestTeam) {
      group3rdPlaceTeams[g] = highestTeam;
      structuralChange = true;
    }
  }

  if (structuralChange) {
    evaluateBracket();
    renderAll();
  }
}

function applyLiveMatches(data) {
  if (!data || !data.matches) return;
  
  let structuralChange = false;
  
  // ライブ中の試合を抽出
  const liveMatches = data.matches.filter(m => m.status === "IN_PLAY" || m.status === "PAUSED");
  
  // ライブ中がない場合は、最新の終了試合3件と、今後の試合3件を抽出
  let finishedMatches = [];
  let upcomingMatches = [];
  if (liveMatches.length === 0) {
    const allFinished = data.matches.filter(m => m.status === "FINISHED");
    finishedMatches = allFinished.slice(-3).reverse();
    upcomingMatches = data.matches.filter(m => m.status === "TIMED").slice(0, 3);
  }

  // トーナメントマッチ（GROUP_STAGE以外）の同期処理
  data.matches.forEach(apiMatch => {
    if (apiMatch.stage === "GROUP_STAGE") return;
    
    const homeTeam = normalizeTeamName(apiMatch.homeTeam.name);
    const awayTeam = normalizeTeamName(apiMatch.awayTeam.name);
    
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
      
      let scoreText = "";
      if (score.duration === "REGULAR") {
        scoreText = `${homeScore} - ${awayScore}`;
      } else if (score.duration === "EXTRA_TIME") {
        scoreText = `${homeScore} - ${awayScore} (AET)`;
      } else if (score.duration === "PENALTY_SHOOTOUT") {
        const pkHome = score.penalties ? score.penalties.home : 0;
        const pkAway = score.penalties ? score.penalties.away : 0;
        scoreText = `${homeScore} - ${awayScore} (${pkHome}-${pkAway} PK)`;
      } else {
        scoreText = `${homeScore} - ${awayScore}`;
      }

      if (apiMatch.status === "FINISHED") {
        let apiWinner = null;
        if (score.winner === "HOME_TEAM") apiWinner = homeTeam;
        else if (score.winner === "AWAY_TEAM") apiWinner = awayTeam;
        
        if (match.winner !== apiWinner || match.score !== scoreText) {
          match.winner = apiWinner;
          match.score = scoreText;
          structuralChange = true;
        }
      } 
      else if (apiMatch.status === "IN_PLAY" || apiMatch.status === "PAUSED") {
        const liveScoreText = `${scoreText} (LIVE)`;
        if (match.score !== liveScoreText || match.winner !== null) {
          match.winner = null;
          match.score = liveScoreText;
          structuralChange = true;
        }
      }
    }
  });
  
  if (structuralChange) {
    evaluateBracket();
    renderAll();
  }

  // ライブマッチセクション（トーナメント表の下）のレンダリング
  renderLiveMatchesSection(liveMatches, finishedMatches, upcomingMatches);
}

// ライブマッチセクションのレンダリング
function renderLiveMatchesSection(liveMatches, finishedMatches, upcomingMatches) {
  const container = document.getElementById("live-matches-grid");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (liveMatches.length > 0) {
    liveMatches.forEach(m => {
      const card = createLiveMatchCard(m, "LIVE");
      container.appendChild(card);
    });
  } else {
    // 終了した試合
    if (finishedMatches.length > 0) {
      const titleFinished = document.createElement("div");
      titleFinished.className = "live-section-subtitle";
      const isJa = (currentLang === 'ja');
      titleFinished.innerHTML = `<i class="fa-solid fa-square-poll-vertical"></i> <span>${isJa ? '最新の試合結果' : 'Recent Results'}</span>`;
      container.appendChild(titleFinished);
      
      const finishedGrid = document.createElement("div");
      finishedGrid.className = "live-sub-grid";
      finishedMatches.forEach(m => {
        const card = createLiveMatchCard(m, "FINISHED");
        finishedGrid.appendChild(card);
      });
      container.appendChild(finishedGrid);
    }
    
    // 今後の予定
    if (upcomingMatches.length > 0) {
      const titleUpcoming = document.createElement("div");
      titleUpcoming.className = "live-section-subtitle";
      const isJa = (currentLang === 'ja');
      titleUpcoming.innerHTML = `<i class="fa-solid fa-calendar-days"></i> <span>${isJa ? '今後の試合予定' : 'Upcoming Matches'}</span>`;
      container.appendChild(titleUpcoming);
      
      const upcomingGrid = document.createElement("div");
      upcomingGrid.className = "live-sub-grid";
      upcomingMatches.forEach(m => {
        const card = createLiveMatchCard(m, "TIMED");
        upcomingGrid.appendChild(card);
      });
      container.appendChild(upcomingGrid);
    }
  }
}

// ライブ試合カードのDOM要素作成
function createLiveMatchCard(match, type) {
  const div = document.createElement("div");
  div.className = `live-match-card ${type.toLowerCase()}`;
  
  const homeName = normalizeTeamName(match.homeTeam.name);
  const awayName = normalizeTeamName(match.awayTeam.name);
  const homeCode = teamCodes[homeName] || "?";
  const awayCode = teamCodes[awayName] || "?";
  
  let homeFlag = `<span class="flag-placeholder">${homeCode}</span>`;
  if (homeCode !== "?") {
    homeFlag = `<img src="https://flagcdn.com/w40/${homeCode.toLowerCase()}.png" class="match-card-flag" alt="${homeName}">`;
  }
  let awayFlag = `<span class="flag-placeholder">${awayCode}</span>`;
  if (awayCode !== "?") {
    awayFlag = `<img src="https://flagcdn.com/w40/${awayCode.toLowerCase()}.png" class="match-card-flag" alt="${awayName}">`;
  }

  let badgeHtml = "";
  const isJa = (currentLang === 'ja');
  if (type === "LIVE") {
    const statusLabel = match.status === "PAUSED" ? (isJa ? "ハーフタイム" : "HALF TIME") : (isJa ? "ライブ進行中" : "IN PLAY");
    badgeHtml = `<span class="live-card-badge active-live"><span class="badge-dot animate-pulse"></span> ${statusLabel}</span>`;
  } else if (type === "FINISHED") {
    badgeHtml = `<span class="live-card-badge finished-live">${isJa ? "終了" : "FINISHED"}</span>`;
  } else {
    badgeHtml = `<span class="live-card-badge upcoming-live">${isJa ? "予定" : "SCHEDULED"}</span>`;
  }

  let scoreHtml = "";
  if (type === "TIMED") {
    scoreHtml = `<div class="card-vs-label">VS</div>`;
  } else {
    const homeScore = match.score.fullTime.home !== null ? match.score.fullTime.home : 0;
    const awayScore = match.score.fullTime.away !== null ? match.score.fullTime.away : 0;
    scoreHtml = `<div class="card-score-display">${homeScore} - ${awayScore}</div>`;
  }

  const matchDate = new Date(match.utcDate);
  const formattedDate = matchDate.toLocaleString(isJa ? 'ja-JP' : 'en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const refereeNames = match.referees && match.referees.length > 0
    ? match.referees.map(r => r.name).join(", ")
    : (isJa ? '未指定' : 'Not assigned');

  let stageName = match.stage;
  if (isJa) {
    const stageMap = {
      "GROUP_STAGE": match.group ? match.group.replace("GROUP_", "グループ ") : "グループステージ",
      "LAST_32": "ラウンド32",
      "LAST_16": "ラウンド16",
      "QUARTER_FINALS": "準々決勝",
      "SEMI_FINALS": "準決勝",
      "THIRD_PLACE": "3位決定戦",
      "FINAL": "決勝戦"
    };
    stageName = stageMap[match.stage] || match.stage;
  } else {
    const stageMap = {
      "LAST_32": "ROUND OF 32",
      "LAST_16": "ROUND OF 16",
      "QUARTER_FINALS": "QUARTER-FINALS",
      "SEMI_FINALS": "SEMI-FINALS",
      "THIRD_PLACE": "THIRD PLACE",
      "FINAL": "FINAL"
    };
    stageName = stageMap[match.stage] || match.stage;
  }

  div.innerHTML = `
    <div class="card-meta">
      <span class="card-stage">${stageName}</span>
      ${badgeHtml}
    </div>
    <div class="card-teams-area">
      <div class="card-team home">
        ${homeFlag}
        <span class="card-team-name">${getTeamName(homeName)}</span>
      </div>
      ${scoreHtml}
      <div class="card-team away">
        ${awayFlag}
        <span class="card-team-name">${getTeamName(awayName)}</span>
      </div>
    </div>
    <div class="card-details-grid">
      <div class="detail-item">
        <i class="fa-regular fa-clock"></i>
        <span>${formattedDate}</span>
      </div>
      <div class="detail-item">
        <i class="fa-solid fa-user-shield"></i>
        <span>Referee: ${refereeNames}</span>
      </div>
    </div>
  `;
  
  return div;
}
