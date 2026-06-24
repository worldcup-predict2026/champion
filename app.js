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
    footerCredits: "© 2026 FIFA World Cup Fan Simulator. Created with real group draw data."
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
    footerCredits: "© 2026 FIFAワールドカップ ファンシミュレーター。実際のグループ抽選データに基づいています。"
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
    footerCredits: "© 2026 Simulador del Fanático de la Copa Mundial. Creado con los datos reales del sorteo."
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
    "Czechia": "Czechia", "Bosnia and Herzegovina": "Bosnia and Herzegovina", "Qatar": "Qatar", "Haiti": "Haiti",
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
    "Czechia": "チェコ", "Bosnia and Herzegovina": "ボスニア・ヘルツェゴビナ", "Qatar": "カタール", "Haiti": "ハイチ",
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
    "Czechia": "República Checa", "Bosnia and Herzegovina": "Bosnia y Herzegovina", "Qatar": "Catar", "Haiti": "Haití",
    "Curaçao": "Curazao", "Tunisia": "Túnez", "New Zealand": "Nueva Zelanda", "Cape Verde": "Cabo Verde",
    "Iraq": "Irak", "Jordan": "Jordania", "DR Congo": "RD Congo", "Ghana": "Ghana"
  }
};

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

    // 親スロットのチームが変更された場合、かつ既に選択されていた勝者と異なる場合は勝者をリセット
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

// 1つのマッチボックス要素を作成
function createMatchBox(id) {
  const match = matches[id];
  const div = document.createElement('div');
  div.className = `match-box`;
  div.id = `match-${id}`;

  const label = translations[currentLang].matchLabel;
  div.innerHTML = `
    <div class="match-id">${label} ${id}</div>
    <div class="match-info-meta">TBD</div>
  `;

  const slot1 = createTeamSlot(match.team1Name, match.team1.slot, match.winner === match.team1Name, match.winner && match.winner !== match.team1Name);
  const slot2 = createTeamSlot(match.team2Name, match.team2.slot, match.winner === match.team2Name, match.winner && match.winner !== match.team2Name);

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
  
  matches[matchId].winner = winnerName;
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

// AI自動予想の実行
function runAiSimulation() {
  // 1. まず未確定のグループスロットを、最も進出確率（prob）が高い候補に決定する
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

  // 2. ブラケットの評価をして親スロットの名前を最新化
  evaluateBracket();

  // 3. Round of 32 から Final まで順番に決定論的に勝者を決定していく
  const sortedMatchIds = Object.keys(matches).sort((a, b) => parseInt(a) - parseInt(b));

  sortedMatchIds.forEach(id => {
    const match = matches[id];
    // 最新のチーム名を取得
    match.team1Name = resolveTeamName(match.team1);
    match.team2Name = resolveTeamName(match.team2);

    const winner = getMatchWinnerDeterministic(match.team1Name, match.team2Name);
    match.winner = winner;
    
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
  groupSlots = JSON.parse(JSON.stringify(initialGroupSlots));
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

  loadFifa3rdPlaceMapping(); // FIFA 3位マッピングをロード
  setLanguage('ja'); // デフォルト日本語
  startRealtimeUpdates(); // リアルタイム確率更新タイマーの開始
});

// リアルタイム確率更新ロジック (数秒ごとに微変動をシミュレート)
function startRealtimeUpdates() {
  setInterval(() => {
    // 優勝国が決まってロックされている場合は確率の更新も一時停止
    if (isBracketLocked) return;

    Object.keys(groupSlots).forEach(key => {
      const slot = groupSlots[key];
      if (!slot.confirmed && slot.candidates.length > 1) {
        // -0.2% から +0.2% の範囲で微小に変動
        const delta = (Math.random() * 0.4 - 0.2);
        
        // 最初の候補の確率を増減
        let newProb0 = parseFloat((slot.candidates[0].prob + delta).toFixed(2));
        
        // N候補に対応した汎用ロジック
        const n = slot.candidates.length;
        const minProb = 3;
        const maxProb = 100 - (n - 1) * minProb;
        
        if (newProb0 > minProb && newProb0 < maxProb) {
          // 各候補に小さなランダム変動を適用
          const newProbs = slot.candidates.map((c, i) => {
            if (i === 0) return newProb0;
            const d = (Math.random() * 0.3 - 0.15);
            return Math.max(minProb, c.prob + d);
          });
          
          // 合計を100%に正規化
          const sum = newProbs.reduce((a, b) => a + b, 0);
          const normalized = newProbs.map(p => parseFloat((p / sum * 100).toFixed(2)));
          
          // 丸め誤差の補正（最後の候補に差分を付与）
          const normSum = normalized.reduce((a, b) => a + b, 0);
          normalized[n - 1] = parseFloat((normalized[n - 1] + (100 - normSum)).toFixed(2));
          
          // 全候補が最低確率を満たしているか検証
          const allValid = normalized.every(p => p >= minProb);
          if (allValid) {
            normalized.forEach((p, i) => {
              slot.candidates[i].prob = p;
            });
          }
        }
      }
    });

    // 画面上の数値を更新
    updateProbabilityUI();
  }, 4000); // 4秒ごとに変動
}

// 確率表示UIのみを動的かつ軽量に書き換える (ブラケット全体を再描画せず、%数値のみ更新)
function updateProbabilityUI() {
  document.querySelectorAll('.team-slot').forEach(slotEl => {
    const matchBox = slotEl.closest('.match-box');
    if (!matchBox) return;
    
    const matchId = matchBox.id.replace('match-', '');
    const match = matches[matchId];
    
    // スロットがチーム1かチーム2か判定
    const isTeam1 = slotEl.classList.contains('winner-selected') || 
                     (slotEl.nextElementSibling !== null && slotEl.nextElementSibling.classList.contains('team-slot'));
                     
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
            // 数値変化時に一瞬ネオンブルーに光らせるエフェクト
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
