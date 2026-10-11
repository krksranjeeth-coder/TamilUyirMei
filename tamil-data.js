/**
 * TamilUyirMei - Animated Tamil Learning Lab Data
 * Complete definitions for 18 Mei letters x 12 Uyir letters = 216 Uyir-Mei combinations.
 * Includes formulas, child-friendly explanations, writing sequences, and rich vocabulary.
 */

const MEI_LETTERS = [
  { id: 'k', base: 'க', mei: 'க்', name: 'இக் (Ik)', english: 'k', group: 'வல்லினம்', groupType: 'vallinam', soundHint: 'கடின ஒலி (Strong)', color: '#FF6B6B' },
  { id: 'ng', base: 'ங', mei: 'ங்', name: 'இங் (Ing)', english: 'ng', group: 'மெல்லினம்', groupType: 'mellinam', soundHint: 'மெல்லிய ஒலி (Soft nasal)', color: '#1DD1A1' },
  { id: 'ch', base: 'ச', mei: 'ச்', name: 'இச் (Ich)', english: 's / ch', group: 'வல்லினம்', groupType: 'vallinam', soundHint: 'கடின ஒலி (Strong)', color: '#FF6B6B' },
  { id: 'nj', base: 'ஞ', mei: 'ஞ்', name: 'இஞ் (Inj)', english: 'ñ / nj', group: 'மெல்லினம்', groupType: 'mellinam', soundHint: 'மெல்லிய ஒலி (Soft nasal)', color: '#1DD1A1' },
  { id: 't', base: 'ட', mei: 'ட்', name: 'இட் (It)', english: 'ṭ / d', group: 'வல்லினம்', groupType: 'vallinam', soundHint: 'கடின ஒலி (Strong)', color: '#FF6B6B' },
  { id: 'N', base: 'ண', mei: 'ண்', name: 'இண் (In)', english: 'ṇ (3-loop)', group: 'மெல்லினம்', groupType: 'mellinam', soundHint: 'மெல்லிய ஒலி (Soft retroflex)', color: '#1DD1A1' },
  { id: 'th', base: 'த', mei: 'த்', name: 'இத் (Ith)', english: 'th', group: 'வல்லினம்', groupType: 'vallinam', soundHint: 'கடின ஒலி (Strong dental)', color: '#FF6B6B' },
  { id: 'n', base: 'ந', mei: 'ந்', name: 'இந் (In)', english: 'n (dental)', group: 'மெல்லினம்', groupType: 'mellinam', soundHint: 'மெல்லிய ஒலி (Soft dental)', color: '#1DD1A1' },
  { id: 'p', base: 'ப', mei: 'ப்', name: 'இப் (Ip)', english: 'p / b', group: 'வல்லினம்', groupType: 'vallinam', soundHint: 'கடின ஒலி (Strong labial)', color: '#FF6B6B' },
  { id: 'm', base: 'ம', mei: 'ம்', name: 'இம் (Im)', english: 'm', group: 'மெல்லினம்', groupType: 'mellinam', soundHint: 'மெல்லிய ஒலி (Soft labial)', color: '#1DD1A1' },
  { id: 'y', base: 'ய', mei: 'ய்', name: 'இய் (Iy)', english: 'y', group: 'இடையினம்', groupType: 'idaiyinam', soundHint: 'இடைப்பட்ட ஒலி (Gentle palatal)', color: '#54A0FF' },
  { id: 'r', base: 'ர', mei: 'ர்', name: 'இர் (Ir)', english: 'r (soft)', group: 'இடையினம்', groupType: 'idaiyinam', soundHint: 'இடைப்பட்ட ஒலி (Flap)', color: '#54A0FF' },
  { id: 'l', base: 'ல', mei: 'ல்', name: 'இல் (Il)', english: 'l (light)', group: 'இடையினம்', groupType: 'idaiyinam', soundHint: 'இடைப்பட்ட ஒலி (Alveolar lateral)', color: '#54A0FF' },
  { id: 'v', base: 'வ', mei: 'வ்', name: 'இவ் (Iv)', english: 'v', group: 'இடையினம்', groupType: 'idaiyinam', soundHint: 'இடைப்பட்ட ஒலி (Labiodental)', color: '#54A0FF' },
  { id: 'zh', base: 'ழ', mei: 'ழ்', name: 'இழ் (Izh)', english: 'ḻ (Special Retroflex)', group: 'இடையினம்', groupType: 'idaiyinam', soundHint: 'சிறப்பு ழகரம் (Special Tamil sound)', color: '#9B59B6' },
  { id: 'L', base: 'ள', mei: 'ள்', name: 'இள் (IL)', english: 'ḷ (thick L)', group: 'இடையினம்', groupType: 'idaiyinam', soundHint: 'இடைப்பட்ட ஒலி (Retroflex lateral)', color: '#54A0FF' },
  { id: 'R', base: 'ற', mei: 'ற்', name: 'இற் (IR)', english: 'ṟ (hard R / tr)', group: 'வல்லினம்', groupType: 'vallinam', soundHint: 'கடின வல்லினம் (Hard alveolar)', color: '#FF6B6B' },
  { id: 'nn', base: 'ன', mei: 'ன்', name: 'இன் (In)', english: 'ṉ (2-loop)', group: 'மெல்லினம்', groupType: 'mellinam', soundHint: 'மெல்லிய ஒலி (Alveolar nasal)', color: '#1DD1A1' }
];

// 6 Intuitive Approach Groups (வடிவக் குழுக்கள்)
const APPROACH_GROUPS = [
  {
    id: 'dot_drop',
    name: '1. புள்ளி நீங்கும் வடிவம் (Dot Disappears)',
    shortName: 'புள்ளி நீங்குதல்',
    icon: '⚪',
    color: '#FF6B6B',
    vowels: ['a'],
    ruleTitle: 'புள்ளி பறந்து போகும்!',
    desc: 'மெய் எழுத்தின் தலையில் உள்ள புள்ளி மட்டும் மாயமாய் மறையும்! அடிப்படை எழுத்து மட்டும் எஞ்சும். புதிய குறியீடு எதுவுமில்லை.',
    english: 'The pulli dot vanishes into thin air! Just the base letter remains without any extra sign.',
    writingAdvice: 'எழுத்தின் மேல் புள்ளி வைக்காமல் அடிப்படை எழுத்தை மட்டும் முழுமையாக எழுதுங்கள்.'
  },
  {
    id: 'right_side',
    name: '2. வலதுபுறக் குறியீடு (Right-Side Sign - துணைக்கால்)',
    shortName: 'வலதுபுறம் (ா)',
    icon: '➡️',
    color: '#FF9F43',
    vowels: ['aa'],
    ruleTitle: 'துணைக்கால் கை கோர்க்கும்!',
    desc: 'புள்ளி நீங்கி, எழுத்தின் வலது பக்கம் துணைக்கால் (ா) கை கோர்த்து வந்து நிற்கும்!',
    english: 'The pulli vanishes and a side-leg (Thunaikkaal ா) joins on the right side!',
    writingAdvice: 'முதலில் அடிப்படை எழுத்தை எழுதுங்கள்; அதன் பின் அதன் வலதுபுறம் துணைக்கால் (ா) சேருங்கள்.'
  },
  {
    id: 'top_roof',
    name: '3. மேல் கூரை / கொக்கிக் குழு (Roof / Hook On Top)',
    shortName: 'தலைமேல் (ி, ீ)',
    icon: '⬆️',
    color: '#10AC84',
    vowels: ['i', 'ii'],
    ruleTitle: 'தலைமேல் கொக்கியும் சுழியும்!',
    desc: 'புள்ளி நீங்கி, எழுத்தின் தலைமேல் குடை போன்ற மேல்விலங்கு (ி) அல்லது சுழியுடன் கூடிய மேல்விலங்கு (ீ) மலரும்!',
    english: 'Roof hooks (Melvilangu ி and looped ீ) curl gracefully over the head of the letter!',
    writingAdvice: 'அடிப்படை எழுத்தை எழுதிய பின் அதன் மேல்வலது முனையிலிருந்து மேல்நோக்கி வளைத்து முடியுங்கள்.'
  },
  {
    id: 'bottom_curves',
    name: '4. கீழ் வளைவுக் குழு (Bottom Foot Curves)',
    shortName: 'கீழ்ப்பகுதி (ு, ூ)',
    icon: '⬇️',
    color: '#0ABDE3',
    vowels: ['u', 'uu'],
    ruleTitle: 'பாதத்தில் வளைவும் சுழியும்!',
    desc: 'புள்ளி நீங்கி, எழுத்தின் அடிப்பகுதியில் உ-வடிவக் கீழ்வளைவு அல்லது நீள்சுழி / ள-வடிவம் (ு, ூ) பாதத்தில் சேரும்!',
    english: 'Bottom foot hooks and loops (u, uu) wrap underneath the letter base!',
    writingAdvice: 'அடிப்படை எழுத்தை முடிக்கும் போது கையை எடுக்காமல் கீழ்நோக்கி வளைத்து உ-கர/ஊ-கார வடிவத்தை அமையுங்கள்.'
  },
  {
    id: 'front_horns',
    name: '5. முன்னால் நிற்கும் கொம்புகள் (Front Horn Signs)',
    shortName: 'முன்னால் (ெ, ே, ை)',
    icon: '⬅️',
    color: '#5F27CD',
    vowels: ['e', 'ee', 'ai'],
    ruleTitle: 'முன்னால் நிற்கும் கொம்புகள்!',
    desc: 'புள்ளி நீங்கும்! ஒற்றைக் கொம்பு (ெ), இரட்டைக் கொம்பு (ே), இணைக்கொம்பு (ை) எழுத்துக்கு முன்னால் வந்து காவல் நிற்கும்!',
    english: 'Front horns (Single ெ, Double ே, Twin loop ை) stand guard BEFORE the letter!',
    writingAdvice: 'கவனிக்க: ஒலிப்பில் பின்னால் வந்தாலும் எழுதும் போது முதலில் கொம்பை எழுதிப் பிறகே எழுத்தை எழுத வேண்டும்!'
  },
  {
    id: 'surround',
    name: '6. இருபுறமும் / சாண்ட்விச் குழு (Surround Signs)',
    shortName: 'இருபுறமும் (ெ..ா, ே..ா, ெ..ள)',
    icon: '🥪',
    color: '#EA2027',
    ruleTitle: 'சாண்ட்விச் சூத்திரம் (முன்னும் பின்னும்)!',
    desc: 'முன்னால் கொம்பும், பின்னால் துணைக்காலும் / கொம்புக்காலும் நடுவில் அடிப்படை எழுத்தை அணைத்துக் கொள்ளும்!',
    english: 'Sandwich Formula! Front horn + Center letter + Back leg / Kombukkaal hugging from both sides!',
    writingAdvice: 'படி 1: முன்னால் கொம்பு, படி 2: நடுவில் எழுத்து, படி 3: பின்னால் துணைக்கால் / கொம்புக்கால்.'
  }
];

const UYIR_LETTERS = [
  {
    id: 'a',
    approachId: 'dot_drop',
    uyir: 'அ',
    sign: '',
    name: 'அ (A)',
    english: 'a',
    type: 'குறில் (Short - 1 மாத்திரை)',
    signName: 'புள்ளி நீங்குதல் (Dot flies away)',
    formulaTamil: 'புள்ளி (்) மாயமாய் மறையும்! அடிப்படை எழுத்து மட்டும் நிற்கும்.',
    formulaEnglish: 'The dot (pulli) magically disappears! Just the base letter stays.',
    position: 'none',
    positionLabel: 'புள்ளி நீங்குதல் (No extra mark)',
    color: '#FF6B6B',
    writingRule: 'அடிப்படை எழுத்தை மட்டும் எழுதுங்கள். தலைமேல் புள்ளி வைக்க வேண்டாம்!'
  },
  {
    id: 'aa',
    approachId: 'right_side',
    uyir: 'ஆ',
    sign: 'ா',
    name: 'ஆ (Aa)',
    english: 'ā',
    type: 'நெடில் (Long - 2 மாத்திரை)',
    signName: 'துணைக்கால் (ா)',
    formulaTamil: 'புள்ளி நீங்கும் + எழுத்தின் வலதுபுறம் துணைக்கால் (ா) கை கோர்த்து வரும்!',
    formulaEnglish: 'Pulli vanishes + a side-leg (Thunaikkaal ா) joins on the right side!',
    position: 'after',
    positionLabel: 'வலதுபுறம் சேரும் (Appended on Right)',
    color: '#FF9F43',
    writingRule: 'முதலில் அடிப்படை எழுத்தை எழுதுங்கள், அதன் பின் வலதுபுறம் துணைக்கால் (ா) சேருங்கள்.'
  },
  {
    id: 'i',
    approachId: 'top_roof',
    uyir: 'இ',
    sign: 'ி',
    name: 'இ (I)',
    english: 'i',
    type: 'குறில் (Short - 1 மாத்திரை)',
    signName: 'மேல்விலங்கு (ி)',
    formulaTamil: 'புள்ளி நீங்கும் + எழுத்தின் தலைமேல் கொக்கி போன்ற மேல்விலங்கு (ி) ஏறும்!',
    formulaEnglish: 'Pulli vanishes + a sleek roof curve (Melvilangu ி) curls over the head!',
    position: 'above',
    positionLabel: 'தலைமேல் ஏறும் (Sits on Top)',
    color: '#FECA57',
    writingRule: 'முதலில் அடிப்படை எழுத்தை எழுதுங்கள், பின்னர் அதன் மேல் ஒரு மெல்லிய மேல்விலங்கு கொக்கி (ி) வரையுங்கள்.'
  },
  {
    id: 'ii',
    approachId: 'top_roof',
    uyir: 'ஈ',
    sign: 'ீ',
    name: 'ஈ (Ee)',
    english: 'ī',
    type: 'நெடில் (Long - 2 மாத்திரை)',
    signName: 'மேல்விலங்கு சுழி (ீ)',
    formulaTamil: 'புள்ளி நீங்கும் + மேல்விலங்கின் நுனியில் சிறிய சுழி (ீ) அழகாய் மலரும்!',
    formulaEnglish: 'Pulli vanishes + a roof curve with a tiny loop (Melvilangu Suzhi ீ) blossoms on top!',
    position: 'above',
    positionLabel: 'தலைமேல் சுழியுடன் (Looped on Top)',
    color: '#10AC84',
    writingRule: 'அடிப்படை எழுத்தை எழுதி, அதன் தலைமேல் மேல்விலங்கு வரைந்து அதன் முனையில் ஒரு சிறிய சுழி (ீ) வையுங்கள்.'
  },
  {
    id: 'u',
    approachId: 'bottom_curves',
    uyir: 'உ',
    sign: 'ு',
    name: 'உ (U)',
    english: 'u',
    type: 'குறில் (Short - 1 மாத்திரை)',
    signName: 'கீழ் வளைவு / கால் சுழி (ு)',
    formulaTamil: 'புள்ளி நீங்கும் + எழுத்தின் கீழ்ப்பகுதியில் உ-வடிவ வளைவு அல்லது கீழ்வரிசை சேரும்!',
    formulaEnglish: 'Pulli vanishes + a bottom curve or downward hook (u-modifier) wraps under!',
    position: 'bottom',
    positionLabel: 'கீழ்ப்பகுதியில் சேரும் (Bottom Modifier)',
    color: '#48DBFB',
    writingRule: 'அடிப்படை எழுத்தின் முடிவில் இருந்து கீழ்நோக்கி வளைத்து உ-கரக் குறியீட்டை முடியுங்கள்.'
  },
  {
    id: 'uu',
    approachId: 'bottom_curves',
    uyir: 'ஊ',
    sign: 'ூ',
    name: 'ஊ (Oo)',
    english: 'ū',
    type: 'நெடில் (Long - 2 மாத்திரை)',
    signName: 'கீழ் நீள்சுழி / ள-வடிவம் (ூ)',
    formulaTamil: 'புள்ளி நீங்கும் + உ-வடிவத்தோடு நீள்சுழி சேரும் அல்லது ள-வடிவம் தோன்றும்!',
    formulaEnglish: 'Pulli vanishes + the bottom hook extends with a long loop or special "La" tail (ூ)!',
    position: 'bottom',
    positionLabel: 'கீழ்ப்பகுதியில் நீள்சுழி (Long Bottom Loop)',
    color: '#0ABDE3',
    writingRule: 'உ-கர வடிவத்தின் கீழ் முனையில் சுழியைச் சேர்த்து நீட்டி ஊ-காரக் குறியீட்டை எழுதுங்கள்.'
  },
  {
    id: 'e',
    approachId: 'front_horns',
    uyir: 'எ',
    sign: 'ெ',
    name: 'எ (E)',
    english: 'e',
    type: 'குறில் (Short - 1 மாத்திரை)',
    signName: 'ஒற்றைக் கொம்பு (ெ)',
    formulaTamil: 'புள்ளி நீங்கும்! ஆனால் ஒற்றைக் கொம்பு (ெ) எழுத்துக்கு முன்னால் வந்து காவல் நிற்கும்!',
    formulaEnglish: 'Pulli vanishes! A single front horn (Ottrai Kombu ெ) stands guard BEFORE the letter!',
    position: 'before',
    positionLabel: 'முன்னால் வரும் (Placed in Front)',
    color: '#54A0FF',
    writingRule: 'கவனம்: ஒலிப்பில் பின்னால் கேட்டாலும், எழுதும் போது 1. ஒற்றைக் கொம்பு (ெ), 2. அடிப்படை எழுத்து என எழுத வேண்டும்!'
  },
  {
    id: 'ee',
    approachId: 'front_horns',
    uyir: 'ஏ',
    sign: 'ே',
    name: 'ஏ (Ae)',
    english: 'ē',
    type: 'நெடில் (Long - 2 மாத்திரை)',
    signName: 'இரட்டைக் கொம்பு (ே)',
    formulaTamil: 'புள்ளி நீங்கும்! கம்பீரமான இரட்டைக் கொம்பு (ே) எழுத்துக்கு முன்னால் வந்து நிற்கும்!',
    formulaEnglish: 'Pulli vanishes! A majestic double-loop horn (Irattai Kombu ே) stands BEFORE the letter!',
    position: 'before',
    positionLabel: 'முன்னால் வரும் (Placed in Front)',
    color: '#5F27CD',
    writingRule: 'முதலில் இரட்டைக் கொம்பை (ே) சுழித்து எழுதுங்கள், அதன் பின் அடிப்படை எழுத்தை எழுதுங்கள்.'
  },
  {
    id: 'ai',
    approachId: 'front_horns',
    uyir: 'ஐ',
    sign: 'ை',
    name: 'ஐ (Ai)',
    english: 'ai',
    type: 'நெடில் (Long - 2 மாத்திரை)',
    signName: 'இணைக்கொம்பு / சங்கிலிக் கொம்பு (ை)',
    formulaTamil: 'புள்ளி நீங்கும்! சங்கிலி போன்ற இணைக்கொம்பு (ை) எழுத்துக்கு முன்னால் வந்து இணையும்!',
    formulaEnglish: 'Pulli vanishes! A zigzag twin loop (Inaikkombu ை) stands proudly in front!',
    position: 'before',
    positionLabel: 'முன்னால் வரும் (Placed in Front)',
    color: '#341F97',
    writingRule: 'முதலில் சங்கிலிக் கொம்பை (ை) இரு சுழிகளுடன் எழுதுங்கள், பின்னர் அடிப்படை எழுத்தை எழுதுங்கள்.'
  },
  {
    id: 'o',
    approachId: 'surround',
    uyir: 'ஒ',
    sign: 'ொ',
    name: 'ஒ (O)',
    english: 'o',
    type: 'குறில் (Short - 1 மாத்திரை)',
    signName: 'ஒற்றைக் கொம்பு + துணைக்கால் (ெ + ா)',
    formulaTamil: 'சாண்ட்விச் சூத்திரம்! முன்னால் ஒற்றைக் கொம்பு (ெ), நடுவில் நம் எழுத்து, பின்னால் துணைக்கால் (ா)!',
    formulaEnglish: 'The Sandwich Formula! Single horn (ெ) in front, base letter in middle, side-leg (ா) at the end!',
    position: 'surround',
    positionLabel: 'இருபுறமும் சூழ்ந்து வரும் (Surrounding Both Sides)',
    color: '#EE5253',
    writingRule: 'படி 1: ஒற்றைக் கொம்பு (ெ), படி 2: நடுவில் அடிப்படை எழுத்து, படி 3: துணைக்கால் (ா). மூன்று படிகள்!'
  },
  {
    id: 'oo',
    approachId: 'surround',
    uyir: 'ஓ',
    sign: 'ோ',
    name: 'ஓ (Oh)',
    english: 'ō',
    type: 'நெடில் (Long - 2 மாத்திரை)',
    signName: 'இரட்டைக் கொம்பு + துணைக்கால் (ே + ா)',
    formulaTamil: 'சாண்ட்விச் சூத்திரம்! முன்னால் இரட்டைக் கொம்பு (ே), நடுவில் நம் எழுத்து, பின்னால் துணைக்கால் (ா)!',
    formulaEnglish: 'Long Sandwich Formula! Double horn (ே) in front, base letter in middle, side-leg (ா) at the end!',
    position: 'surround',
    positionLabel: 'இருபுறமும் சூழ்ந்து வரும் (Surrounding Both Sides)',
    color: '#FF6B6B',
    writingRule: 'படி 1: இரட்டைக் கொம்பு (ே), படி 2: நடுவில் அடிப்படை எழுத்து, படி 3: துணைக்கால் (ா).'
  },
  {
    id: 'au',
    approachId: 'surround',
    uyir: 'ஔ',
    sign: 'ௌ',
    name: 'ஔ (Au)',
    english: 'au',
    type: 'நெடில் (Long - 2 மாத்திரை)',
    signName: 'ஒற்றைக் கொம்பு + கொம்புக்கால் (ெ + ள)',
    formulaTamil: 'முன்னால் ஒற்றைக் கொம்பு (ெ), நடுவில் நம் எழுத்து, பின்னால் கொம்புக்கால் / ள வடிவம்!',
    formulaEnglish: 'Front single horn (ெ), base letter in center, and comb-foot (ள) at the right!',
    position: 'surround',
    positionLabel: 'இருபுறமும் சூழ்ந்து வரும் (Surrounding Both Sides)',
    color: '#C0392B',
    writingRule: 'படி 1: ஒற்றைக் கொம்பு (ெ), படி 2: அடிப்படை எழுத்து, படி 3: கொம்புக்கால் (ள வடிவம்).'
  }
];

// Rich vocabulary & illustration dictionary for Tamil Uyirmei letters
const VOCABULARY = {
  'க': { word: 'கண்', english: 'Eye', emoji: '👁️', phonetic: 'Kaṇ', sentence: 'கண்ணால் உலகைப் பார்க்கிறோம்.', sentenceEnglish: 'We see the beautiful world with our eyes.' },
  'கா': { word: 'காக்கை', english: 'Crow', emoji: '🐦‍⬛', phonetic: 'Kākkaɪ', sentence: 'காக்கை கரையும் காக்காய்.', sentenceEnglish: 'The clever black crow caws up in the sky.' },
  'கி': { word: 'கிளி', english: 'Parrot', emoji: '🦜', phonetic: 'Kiḷi', sentence: 'கிளி பச்சை நிறத்தில் பேசும்.', sentenceEnglish: 'The friendly green parrot speaks sweet words.' },
  'கீ': { word: 'கீரி', english: 'Mongoose', emoji: '🦡', phonetic: 'Kīri', sentence: 'கீரி வேகமாக ஓடும் விலங்கு.', sentenceEnglish: 'The swift mongoose runs playfully across the field.' },
  'கு': { word: 'குடை', english: 'Umbrella', emoji: '☂️', phonetic: 'Kuḍai', sentence: 'மழைக்குக் குடை பிடிப்போம்.', sentenceEnglish: 'We open our colorful umbrella when it rains.' },
  'கூ': { word: 'கூடு', english: 'Nest', emoji: '🪺', phonetic: 'Kūḍu', sentence: 'பறவை மரத்தில் கூடு கட்டும்.', sentenceEnglish: 'Little birds build cozy nests high in trees.' },
  'கெ': { word: 'கெண்டை', english: 'Carp fish', emoji: '🐟', phonetic: 'Keṇḍai', sentence: 'கெண்டை மீன் ஆற்றில் துள்ளும்.', sentenceEnglish: 'The shiny carp fish leaps happily in the river.' },
  'கே': { word: 'கேடயம்', english: 'Shield', emoji: '🛡️', phonetic: 'Kēḍayam', sentence: 'வீரன் கையில் கேடயம் உண்டு.', sentenceEnglish: 'The brave knight carries a strong protective shield.' },
  'கை': { word: 'கை', english: 'Hand', emoji: '✋', phonetic: 'Kai', sentence: 'இரு கைகளால் வணக்கம் சொல்வோம்.', sentenceEnglish: 'We fold both hands to greet everyone with respect.' },
  'கொ': { word: 'கொடி', english: 'Flag', emoji: '🚩', phonetic: 'Koḍi', sentence: 'நம் தேசியக் கொடி பறக்கிறது.', sentenceEnglish: 'Our proud national flag flutters in the gentle breeze.' },
  'கோ': { word: 'கோபுரம்', english: 'Temple Tower', emoji: '🛕', phonetic: 'Kōpuram', sentence: 'கோபுரம் வானளவு உயர்ந்து நிற்கும்.', sentenceEnglish: 'The grand temple tower rises high toward the clouds.' },
  'கௌ': { word: 'கௌதாரி', english: 'Partridge', emoji: '🦃', phonetic: 'Kautāri', sentence: 'கௌதாரி வயலில் வாழும் பறவை.', sentenceEnglish: 'The sweet partridge bird lives peacefully in green fields.' },

  'ச': { word: 'சக்கரம்', english: 'Wheel', emoji: '🎡', phonetic: 'Chakkaram', sentence: 'வண்டியின் சக்கரம் உருளும்.', sentenceEnglish: 'The round cart wheel rolls smoothly down the path.' },
  'சா': { word: 'சாவி', english: 'Key', emoji: '🗝️', phonetic: 'Sāvi', sentence: 'பூட்டைத் திறக்க சாவி வேண்டும்.', sentenceEnglish: 'We use a golden key to unlock the treasure chest.' },
  'சி': { word: 'சிங்கம்', english: 'Lion', emoji: '🦁', phonetic: 'Singam', sentence: 'சிங்கம் காட்டுக்கு அரசன்.', sentenceEnglish: 'The mighty lion is the brave king of the jungle.' },
  'சீ': { word: 'சீப்பு', english: 'Comb', emoji: '🪮', phonetic: 'Sīppu', sentence: 'சீப்பால் தலை சீவுவோம்.', sentenceEnglish: 'We comb our hair neatly to look smart and tidy.' },
  'சு': { word: 'சுண்டல்', english: 'Sundal snack', emoji: '🥣', phonetic: 'Suṇḍal', sentence: 'சுண்டல் சுவையான சத்தான உணவு.', sentenceEnglish: 'Warm sundal is a tasty and healthy snack for kids.' },
  'சூ': { word: 'சூரியன்', english: 'Sun', emoji: '☀️', phonetic: 'Sūriyan', sentence: 'சூரியன் கிழக்கில் உதிக்கும்.', sentenceEnglish: 'The bright golden sun rises in the east every morning.' },
  'செ': { word: 'செம்பருத்தி', english: 'Hibiscus', emoji: '🌺', phonetic: 'Sembaruthi', sentence: 'செம்பருத்தி சிவந்த மலர்.', sentenceEnglish: 'The red hibiscus is a lovely, cheerful garden flower.' },
  'சே': { word: 'சேவல்', english: 'Rooster', emoji: '🐓', phonetic: 'Sēval', sentence: 'சேவல் விடியலில் கூவும்.', sentenceEnglish: 'The colorful rooster crows happily at daybreak.' },
  'சை': { word: 'சைக்கிள்', english: 'Bicycle', emoji: '🚲', phonetic: 'Saikkiḷ', sentence: 'சைக்கிள் ஓட்ட எனக்குப் பிடிக்கும்.', sentenceEnglish: 'I love riding my bicycle in the park with friends.' },
  'சொ': { word: 'சொட்டு', english: 'Drop', emoji: '💧', phonetic: 'Soṭṭu', sentence: 'மழை சொட்டு சொட்டாய் பெய்கிறது.', sentenceEnglish: 'Rain falls gently drop by drop from the sky.' },
  'சோ': { word: 'சோளம்', english: 'Corn', emoji: '🌽', phonetic: 'Sōḷam', sentence: 'சோளம் இனிப்பான தானியம்.', sentenceEnglish: 'Sweet yellow corn on the cob is delicious to munch on.' },
  'சௌ': { word: 'சௌக்கியம்', english: 'Wellness / Health', emoji: '😊', phonetic: 'Saukkriyam', sentence: 'எல்லோரும் சௌக்கியமாக இருங்கள்.', sentenceEnglish: 'Wishing everyone good health, happiness, and joy!' },

  'த': { word: 'தவளை', english: 'Frog', emoji: '🐸', phonetic: 'Thavaḷai', sentence: 'தவளை குளத்தில் குதிக்கும்.', sentenceEnglish: 'The happy green frog hops into the pond.' },
  'தா': { word: 'தாமரை', english: 'Lotus', emoji: '🪷', phonetic: 'Thāmarai', sentence: 'தாமரை நம் தேசிய மலர்.', sentenceEnglish: 'The elegant pink lotus is India’s national flower.' },
  'தி': { word: 'திமிங்கலம்', english: 'Whale', emoji: '🐋', phonetic: 'Thimiṅgalam', sentence: 'திமிங்கலம் கடலில் பெரிய விலங்கு.', sentenceEnglish: 'The giant blue whale swims gracefully in deep oceans.' },
  'தீ': { word: 'தீப்பந்தம்', english: 'Torch fire', emoji: '🔥', phonetic: 'Thee', sentence: 'தீ வெப்பமும் ஒளியும் தரும்.', sentenceEnglish: 'A warm flame brings cozy light in the dark.' },
  'து': { word: 'துளசி', english: 'Basil', emoji: '🌿', phonetic: 'Thuḷasi', sentence: 'துளசி மூலிகைச் செடி.', sentenceEnglish: 'Sacred Tulsi is a wonderful healing herb plant.' },
  'தூ': { word: 'தூண்டில்', english: 'Fishing rod', emoji: '🎣', phonetic: 'Thūṇḍil', sentence: 'தூண்டிலில் மீன் பிடிப்போம்.', sentenceEnglish: 'We hold the fishing rod patiently by the riverbank.' },
  'தெ': { word: 'தென்னை', english: 'Coconut tree', emoji: '🌴', phonetic: 'Thennai', sentence: 'தென்னை மரம் இளநீர் தரும்.', sentenceEnglish: 'Tall coconut palm trees give us refreshing coconut water.' },
  'தே': { word: 'தேனீ', english: 'Honeybee', emoji: '🐝', phonetic: 'Thēnī', sentence: 'தேனீ மலரில் தேன் எடுக்கும்.', sentenceEnglish: 'The busy little honeybee collects nectar from blossoms.' },
  'தை': { word: 'தையல்', english: 'Stitching / Tailoring', emoji: '🪡', phonetic: 'Thaiyal', sentence: 'தையல் கலை அழகானது.', sentenceEnglish: 'Stitching colorful clothes with needle and thread is fun.' },
  'தொ': { word: 'தொப்பி', english: 'Cap / Hat', emoji: '🧢', phonetic: 'Thoppi', sentence: 'வெயிலில் தொப்பி போடுவோம்.', sentenceEnglish: 'We wear a cool sun cap when playing outside.' },
  'தோ': { word: 'தோட்டம்', english: 'Garden', emoji: '🏡', phonetic: 'Thōṭṭam', sentence: 'தோட்டத்தில் வண்ணப் பூக்கள் உண்டு.', sentenceEnglish: 'Our backyard garden is filled with bright blooming flowers.' },
  'தௌ': { word: 'தௌலத்', english: 'Treasure / Wealth', emoji: '💎', phonetic: 'Thaulath', sentence: 'கல்வியே சிறந்த தௌலத் (செல்வம்).', sentenceEnglish: 'Knowledge and kindness are the greatest treasures in life.' },

  'ப': { word: 'பட்டம்', english: 'Kite', emoji: '🪁', phonetic: 'Paṭṭam', sentence: 'வானில் பட்டம் பறக்குது.', sentenceEnglish: 'The colorful kite soars high into the windy sky.' },
  'பா': { word: 'பாப்பா', english: 'Baby', emoji: '👶', phonetic: 'Pāppā', sentence: 'பாப்பா சிரித்தால் அழகு.', sentenceEnglish: 'The cute little baby has a sweet and bright smile.' },
  'பி': { word: 'பிள்ளையார்', english: 'Lord Ganesha', emoji: '🐘', phonetic: 'Piḷḷaiyār', sentence: 'பிள்ளையார் யானை முகம் கொண்டவர்.', sentenceEnglish: 'Friendly Lord Ganesha has a kind elephant face.' },
  'பீ': { word: 'பீர்க்கங்காய்', english: 'Ridge gourd', emoji: '🥒', phonetic: 'Pīrkkangāi', sentence: 'பீர்க்கங்காய் உடலுக்கு நல்லது.', sentenceEnglish: 'Crisp green ridge gourd makes healthy, tasty soup.' },
  'பு': { word: 'புறா', english: 'Pigeon / Dove', emoji: '🕊️', phonetic: 'Puṟā', sentence: 'புறா அமைதியின் அடையாளம்.', sentenceEnglish: 'The gentle white dove is a symbol of peaceful joy.' },
  'பூ': { word: 'பூனை', english: 'Cat', emoji: '🐱', phonetic: 'Pūnai', sentence: 'பூனை பால் குடிக்கும்.', sentenceEnglish: 'The playful fluffy kitten loves drinking warm milk.' },
  'பெ': { word: 'பென்சில்', english: 'Pencil', emoji: '✏️', phonetic: 'Pencil', sentence: 'பென்சிலால் படம் வரைவோம்.', sentenceEnglish: 'We draw cheerful cartoons and stars with our pencil.' },
  'பே': { word: 'பேருந்து', english: 'Bus', emoji: '🚌', phonetic: 'Pērundhu', sentence: 'பேருந்தில் பள்ளிக்குச் செல்வோம்.', sentenceEnglish: 'The cheerful yellow bus takes children to school.' },
  'பை': { word: 'பை', english: 'Bag', emoji: '🎒', phonetic: 'Pai', sentence: 'புத்தகப் பையை எடுத்துக்கொள்.', sentenceEnglish: 'Pack your colorful school backpack with storybooks.' },
  'பொ': { word: 'பொம்மை', english: 'Doll / Toy', emoji: '🧸', phonetic: 'Bommai', sentence: 'பொம்மையோடு விளையாடுவோம்.', sentenceEnglish: 'We hug our favorite soft teddy bear while playing.' },
  'போ': { word: 'போர்வீரன்', english: 'Warrior', emoji: '⚔️', phonetic: 'Pōrvīran', sentence: 'போர்வீரன் நாட்டைப் பாதுகாப்பான்.', sentenceEnglish: 'The brave soldier protects everyone with courage.' },
  'பௌ': { word: 'பௌர்ணமி', english: 'Full Moon', emoji: '🌕', phonetic: 'Paurṇami', sentence: 'பௌர்ணமியில் நிலா முழுமையாய் ஒளிரும்.', sentenceEnglish: 'On full moon night, the bright moon glows like silver.' },

  'ம': { word: 'மயில்', english: 'Peacock', emoji: '🦚', phonetic: 'Mayil', sentence: 'மயில் தோகை விரித்து ஆடும்.', sentenceEnglish: 'The royal peacock fans out its glittering feathers and dances.' },
  'மா': { word: 'மாம்பழம்', english: 'Mango', emoji: '🥭', phonetic: 'Māmbazham', sentence: 'மாம்பழம் இனிய முக்கனிகளில் ஒன்று.', sentenceEnglish: 'Juicy golden mango is the sweetest summer fruit.' },
  'மி': { word: 'மிளகாய்', english: 'Chili', emoji: '🌶️', phonetic: 'Miḷagāi', sentence: 'மிளகாய் காரமானது.', sentenceEnglish: 'Spicy little red chilies pack a fiery punch!' },
  'மீ': { word: 'மீன்', english: 'Fish', emoji: '🐠', phonetic: 'Mīn', sentence: 'மீன் தண்ணீரில் நீந்தும்.', sentenceEnglish: 'The shimmering goldfish swims joyfully through the coral.' },
  'மு': { word: 'முயல்', english: 'Rabbit', emoji: '🐇', phonetic: 'Muyal', sentence: 'முயல் துள்ளி ஓடும்.', sentenceEnglish: 'The cute bunny rabbit hops across the meadow with long ears.' },
  'மூ': { word: 'மூங்கில்', english: 'Bamboo', emoji: '🎋', phonetic: 'Mūṅgil', sentence: 'மூங்கில் புல்லாங்குழல் செய்ய உதவும்.', sentenceEnglish: 'Smooth green bamboo stems are made into musical flutes.' },
  'மெ': { word: 'மெழுகுவர்த்தி', english: 'Candle', emoji: '🕯️', phonetic: 'Mezhuguvarthi', sentence: 'மெழுகுவர்த்தி ஒளி தரும்.', sentenceEnglish: 'The birthday candle twinkles with a cozy, warm glow.' },
  'மே': { word: 'மேகம்', english: 'Cloud', emoji: '☁️', phonetic: 'Mēgham', sentence: 'கருமேகம் மழை தரும்.', sentenceEnglish: 'Fluffy white clouds float gently across the blue sky.' },
  'மை': { word: 'மைனா', english: 'Myna bird', emoji: '🐦', phonetic: 'Mainā', sentence: 'மைனா இனிமையாய் பாடும்.', sentenceEnglish: 'The cheerful myna bird whistles merry tunes in the morning.' },
  'மொ': { word: 'மொட்டு', english: 'Flower bud', emoji: '🌱', phonetic: 'Moṭṭu', sentence: 'மொட்டு மலர்ந்து பூவாகும்.', sentenceEnglish: 'A tiny green bud blossoms into a fragrant flower.' },
  'மோ': { word: 'மோர்', english: 'Buttermilk', emoji: '🥛', phonetic: 'Mōr', sentence: 'மோர் வெயிலுக்கு குளிர்ச்சி.', sentenceEnglish: 'Cool spiced buttermilk keeps us refreshed on hot sunny days.' },
  'மௌ': { word: 'மௌனம்', english: 'Silence', emoji: '🤫', phonetic: 'Maunam', sentence: 'மௌனம் அமைதி தரும்.', sentenceEnglish: 'Quiet moments bring peaceful thoughts and calm minds.' },

  'ய': { word: 'யானை', english: 'Elephant', emoji: '🐘', phonetic: 'Yānai', sentence: 'யானைக்கு நீண்ட தும்பிக்கை உண்டு.', sentenceEnglish: 'The friendly giant elephant has a long, playful trunk.' },
  'யா': { word: 'யாழ்', english: 'Tamil Harp / Yazh', emoji: '🎵', phonetic: 'Yāzh', sentence: 'யாழ் பழமையான தமிழ் இசைக்கருவி.', sentenceEnglish: 'The ancient Yazh harp produces enchanting, soothing melodies.' },
  'ர': { word: 'ரயில்', english: 'Train', emoji: '🚆', phonetic: 'Rayil', sentence: 'ரயில் கூவிக் கொண்டு ஓடும்.', sentenceEnglish: 'The express train zooms down the tracks with a whistle: Choo-choo!' },
  'ரா': { word: 'ராட்டினம்', english: 'Giant Wheel / Carousel', emoji: '🎠', phonetic: 'Rāṭṭinam', sentence: 'ராட்டினத்தில் சுற்றி மகிழ்வோம்.', sentenceEnglish: 'Kids love riding the whirling giant wheel at the fair.' },
  'ல': { word: 'லட்டு', english: 'Laddu sweet', emoji: '🟡', phonetic: 'Laṭṭu', sentence: 'லட்டு தித்திக்கும் இனிப்பு.', sentenceEnglish: 'Golden round laddus are sweet festive treats.' },
  'லா': { word: 'லாடம்', english: 'Horseshoe', emoji: '🧲', phonetic: 'Lāḍam', sentence: 'குதிரை காலில் லாடம் கட்டுவர்.', sentenceEnglish: 'Sturdy iron horseshoes protect the running pony’s hooves.' },
  'வ': { word: 'வண்டு', english: 'Beetle / Bumblebee', emoji: '🪲', phonetic: 'Vaṇḍu', sentence: 'வண்டு பூவைச் சுற்றும்.', sentenceEnglish: 'The fuzzy bumblebee buzzes happily around sweet flowers.' },
  'வா': { word: 'வாத்து', english: 'Duck', emoji: '🦆', phonetic: 'Vāthu', sentence: 'வாத்து குளத்தில் நீந்தும்.', sentenceEnglish: 'The cheerful yellow duck waddles and swims with a quack.' },
  'வி': { word: 'விசிறி', english: 'Hand fan', emoji: '🪭', phonetic: 'Visiṟi', sentence: 'விசிறி காற்று வீசும்.', sentenceEnglish: 'The decorative hand fan waves a cool, refreshing breeze.' },
  'வீ': { word: 'வீடு', english: 'Home / House', emoji: '🏠', phonetic: 'Vīḍu', sentence: 'நம் வீடு அன்பின் உறைவிடம்.', sentenceEnglish: 'Our loving home is filled with warmth, family, and hugs.' },
  'வெ': { word: 'வெள்ளரி', english: 'Cucumber', emoji: '🥒', phonetic: 'Veḷḷari', sentence: 'வெள்ளரி குளிர்ச்சி தரும் காய்.', sentenceEnglish: 'Crunchy cucumber slices make a cool, juicy afternoon snack.' },
  'வே': { word: 'வேல்', english: 'Spear', emoji: '🔱', phonetic: 'Vēl', sentence: 'முருகன் கையில் வெற்றி வேல்.', sentenceEnglish: 'The golden spear represents victory, wisdom, and strength.' },
  'வை': { word: 'வைரம்', english: 'Diamond', emoji: '💎', phonetic: 'Vairam', sentence: 'வைரம் மின்னும் ரத்தினம்.', sentenceEnglish: 'The sparkling diamond glitters brightly in the light.' },
  'ழ': { word: 'ழ பழம்', english: 'Fruit (Pazham)', emoji: '🍎', phonetic: 'Pazham', sentence: 'பழம் சாப்பிட்டால் நலம்.', sentenceEnglish: 'Eating fresh colorful fruits gives us energy to play and learn.' },
  'ள': { word: 'விளக்கு', english: 'Lamp (ViLakku)', emoji: '🪔', phonetic: 'Viḷakku', sentence: 'விளக்கு இருளை நீக்கும்.', sentenceEnglish: 'The glowing brass oil lamp brightens the house with joy.' },
  'ற': { word: 'பறவை', english: 'Bird (PaRavai)', emoji: '🕊️', phonetic: 'Paṟavai', sentence: 'பறவை வானில் பறக்கும்.', sentenceEnglish: 'Graceful birds spread their wings and glide across the skies.' },
  'ன': { word: 'அன்னம்', english: 'Swan (Annam)', emoji: '🦢', phonetic: 'Annam', sentence: 'அன்னப்பறவை நீரில் நீந்தும்.', sentenceEnglish: 'The graceful white swan glides peacefully over calm waters.' }
};

// Procedural generator to provide rich fallback metadata for all 216 combinations
function getLetterDetails(meiObj, uyirObj) {
  const combined = meiObj.base + uyirObj.sign;
  const vocab = VOCABULARY[combined] || {
    word: combined + ' வரிசை',
    english: `${meiObj.name} + ${uyirObj.name}`,
    emoji: '⭐',
    phonetic: `${meiObj.english} + ${uyirObj.english}`,
    sentence: `"${meiObj.mei}" மெய்யும் "${uyirObj.uyir}" உயிரும் கூடி "${combined}" ஆனது!`,
    sentenceEnglish: `Consonant "${meiObj.name}" and vowel "${uyirObj.name}" join hands to create "${combined}"!`
  };

  // Build writing step sequence with bilingual kid explanations
  let steps = [];
  if (uyirObj.position === 'none') {
    steps = [
      {
        step: 1,
        text: `அடிப்படை வடிவம் "${meiObj.base}" எழுதுங்கள் (தலைமேல் புள்ளி வைக்கக் கூடாது!)`,
        englishText: `Write the base shape "${meiObj.base}" (Do not place any dot on top!)`,
        part: meiObj.base
      }
    ];
  } else if (uyirObj.position === 'after') {
    steps = [
      {
        step: 1,
        text: `முதலில் அடிப்படை எழுத்து "${meiObj.base}" எழுதுங்கள்`,
        englishText: `First, write the base letter "${meiObj.base}"`,
        part: meiObj.base
      },
      {
        step: 2,
        text: `வலதுபுறம் துணைக்கால் "${uyirObj.sign}" கை கோர்த்துச் சேருங்கள்`,
        englishText: `Next, attach the side-leg "${uyirObj.sign}" right beside it on the right`,
        part: uyirObj.sign
      }
    ];
  } else if (uyirObj.position === 'above') {
    steps = [
      {
        step: 1,
        text: `முதலில் அடிப்படை எழுத்து "${meiObj.base}" எழுதுங்கள்`,
        englishText: `First, write the base letter "${meiObj.base}"`,
        part: meiObj.base
      },
      {
        step: 2,
        text: `எழுத்தின் தலைமேல் குடை போன்ற குறியீடு "${uyirObj.sign}" சேருங்கள்`,
        englishText: `Next, draw the roof hook "${uyirObj.sign}" curling over the head`,
        part: uyirObj.sign
      }
    ];
  } else if (uyirObj.position === 'bottom') {
    steps = [
      {
        step: 1,
        text: `அடிப்படை எழுத்து "${meiObj.base}" தொடங்கி கீழ்ப்பகுதிக்கு வாருங்கள்`,
        englishText: `Start with base letter "${meiObj.base}" and move your pen downward`,
        part: meiObj.base
      },
      {
        step: 2,
        text: `பாதத்தில் கீழ்வளைவு அல்லது சுழியைச் (${uyirObj.sign}) சேருங்கள்`,
        englishText: `Next, loop the bottom hook "${uyirObj.sign}" neatly under its feet`,
        part: uyirObj.sign
      }
    ];
  } else if (uyirObj.position === 'before') {
    steps = [
      {
        step: 1,
        text: `முதலில் எழுத்துக்கு முன்னால் வரும் கொம்பு "${uyirObj.sign}" எழுதுங்கள்`,
        englishText: `First, write the front horn symbol "${uyirObj.sign}" on the left`,
        part: uyirObj.sign
      },
      {
        step: 2,
        text: `அடுத்து அடிப்படை எழுத்து "${meiObj.base}" பக்கத்தில் எழுதுங்கள்`,
        englishText: `Next, write the base letter "${meiObj.base}" right next to it`,
        part: meiObj.base
      }
    ];
  } else if (uyirObj.position === 'surround') {
    if (uyirObj.id === 'o') {
      steps = [
        {
          step: 1,
          text: `முதலில் முன்னால் ஒற்றைக் கொம்பு "ெ" எழுதுங்கள்`,
          englishText: `Step 1: Write single horn "ெ" in front on the left`,
          part: 'ெ'
        },
        {
          step: 2,
          text: `நடுவில் அடிப்படை எழுத்து "${meiObj.base}" எழுதுங்கள்`,
          englishText: `Step 2: Write base letter "${meiObj.base}" in the middle`,
          part: meiObj.base
        },
        {
          step: 3,
          text: `பின்னால் துணைக்கால் "ா" சேருங்கள்`,
          englishText: `Step 3: Attach the side-leg "ா" on the right side`,
          part: 'ா'
        }
      ];
    } else if (uyirObj.id === 'oo') {
      steps = [
        {
          step: 1,
          text: `முதலில் முன்னால் இரட்டைக் கொம்பு "ே" எழுதுங்கள்`,
          englishText: `Step 1: Write double horn "ே" in front on the left`,
          part: 'ே'
        },
        {
          step: 2,
          text: `நடுவில் அடிப்படை எழுத்து "${meiObj.base}" எழுதுங்கள்`,
          englishText: `Step 2: Write base letter "${meiObj.base}" in the middle`,
          part: meiObj.base
        },
        {
          step: 3,
          text: `பின்னால் துணைக்கால் "ா" சேருங்கள்`,
          englishText: `Step 3: Attach the side-leg "ா" on the right side`,
          part: 'ா'
        }
      ];
    } else {
      steps = [
        {
          step: 1,
          text: `முதலில் முன்னால் ஒற்றைக் கொம்பு "ெ" எழுதுங்கள்`,
          englishText: `Step 1: Write single horn "ெ" in front on the left`,
          part: 'ெ'
        },
        {
          step: 2,
          text: `நடுவில் அடிப்படை எழுத்து "${meiObj.base}" எழுதுங்கள்`,
          englishText: `Step 2: Write base letter "${meiObj.base}" in the middle`,
          part: meiObj.base
        },
        {
          step: 3,
          text: `பின்னால் கொம்புக்கால் "ள" சேருங்கள்`,
          englishText: `Step 3: Attach the comb-tail "ள" on the right side`,
          part: 'ள'
        }
      ];
    }
  }

  const approach = APPROACH_GROUPS.find(g => g.id === uyirObj.approachId) || APPROACH_GROUPS[0];

  return {
    mei: meiObj,
    uyir: uyirObj,
    combined,
    vocab,
    steps,
    approach,
    formula: `${meiObj.mei} + ${uyirObj.uyir} = ${combined}`,
    phonics: `/${meiObj.english}/ + /${uyirObj.english}/ = /${combined}/`
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MEI_LETTERS, UYIR_LETTERS, APPROACH_GROUPS, VOCABULARY, getLetterDetails };
}
