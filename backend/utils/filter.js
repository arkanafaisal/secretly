import leoProfanity from 'leo-profanity'

// 1. Muat kamus bahasa Inggris bawaan (Sangat penting untuk platform global)

// 2. Curated Array: Kata Kasar & Sensitif Bahasa Indonesia
const idBadWords = [
  // --- Kategori 1: Seksual & Prostitusi (Paling cepat kena ban IG/TikTok) ---
  'ngentot', 'ngewe', 'kontol', 'memek', 'peler', 'jembut', 'kntl', 'mmk',
  'bokep', 'porno', 'bugil', 'telanjang', 'toket', 'sange', 'colmek', 'coli',
  'pelacur', 'lonte', 'jablay', 'perek', 'bisyar', 'openbo', 'vcsc', 'vcs',
  
  // --- Kategori 2: Makian Kasar & Hewan ---
  'anjing', 'asu', 'babi', 'monyet', 'kunyuk', 'bangsat', 'keparat', 'bajingan', 
  'pantek', 'pukimak', 'sundala', 'jancok', 'dancok', 'kampang',

  // --- Kategori 3: Merendahkan / Body Shaming Ekstrim ---
  'tolol', 'goblok', 'bego', 'idiot', 'cacat', 'autis',

  // --- Kategori 4: Hate Speech & SARA ---
  'teroris', 'kafir', 'pki', 'nazi', 'rudal',

  // --- Kategori 5: Leetspeak / Bypass Umum ---
  '4njing', 'b4bi', 'k0nt0l', 'm3m3k', 'b0k3p', 'j4bl4y', '10nt3'
];

// 3. Gabungkan kamus Indonesia ke dalam leo-profanity
leoProfanity.loadDictionary('en');
leoProfanity.add(idBadWords);

const ambiguousBadWords = [
  'asu', 'tit', 'ass', 'shit', 'perek', 'bego', 'tolol' // Contoh kata pendek/ambigu
];
leoProfanity.add(ambiguousBadWords);

// 2. PARTIAL MATCH ROOTS (Gunakan .includes() / .has())
// Daftar kata fatal. Jika string MENGANDUNG akar kata ini, langsung blokir!
// Menangkap trik: "assholee", "pornooo", "kontolll", "n1gg444"
const severeRoots = [
  'porno', 'bokep', 'kontol', 'ngentot', 'memek', 'jembut', 'peler',
  'asshole', 'nigga', 'nigger', 'bitch', 'pelacur', 'lonte', 'jablay',
  'goblok', 'bangsat', 'bajingan', 'jancok', 'dancok', 'colmek', 'ngewe'
];

/**
 * FUNGSI AJAIB: Text Normalizer (Versi Disempurnakan)
 */
const normalizeText = (text) => {
  if (!text) return '';
  let normalized = text.toLowerCase();

  // 1. Ubah Leetspeak dasar ke huruf asli
  normalized = normalized.replace(/@/g, 'a').replace(/4/g, 'a')
                         .replace(/1/g, 'i').replace(/0/g, 'o')
                         .replace(/3/g, 'e');

  // 2. Hapus angka & simbol (shit2 -> shit)
  // Tidak membuang huruf yang diulang, agar "asshole" tetap "asshole"
  normalized = normalized.replace(/[^a-z\s]/g, '');

  return normalized;
};

/**
 * STRICT FILTER: Digunakan untuk Username & Bio
 */
export const isStrictClean = (text) => {
  if (!text) return true;
  
  const normalized = normalizeText(text);
  const noSpaceText = normalized.replace(/\s+/g, '');

  // --- CEK LAPIS 1: PARTIAL MATCH (Ide Anda yang sangat ampuh) ---
  // Cek apakah teks yang disambung tanpa spasi MENGANDUNG akar kata fatal
  for (let root of severeRoots) {
    if (noSpaceText.includes(root)) {
      return false; // Langsung tolak jika ada unsur kata fatal!
    }
  }

  // --- CEK LAPIS 2: EXACT MATCH (leo-profanity) ---
  // Cek kata per kata untuk kata-kata pendek yang rawan salah blokir
  if (leoProfanity.check(text)) return false;
  if (leoProfanity.check(normalized)) return false;

  return true; // Lolos semua filter
};


export const censorText = (text) => {
  if (!text) return text;
  return leoProfanity.clean(text); // Defaultnya mengganti dengan bintang (*)
};
