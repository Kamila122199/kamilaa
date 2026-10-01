import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported as analyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD12XXvB_eV2ZenEdK3y9RTHFR5XEa3b80",
    authDomain: "newapp-987f5.firebaseapp.com",
    projectId: "newapp-987f5",
    storageBucket: "newapp-987f5.firebasestorage.app",
    messagingSenderId: "767716237777",
    appId: "1:767716237777:web:0df0bcd83547393c0e40f0",
    measurementId: "G-SRSYJFZMXL"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const initialSessionReset = Promise.resolve();
analyticsSupported().then(supported => { if (supported) getAnalytics(firebaseApp); }).catch(() => {});

const APP_DATA = {
    auth: false,
    students: {
        '301': ["Аманбаев Ернур","Ахмадинова Мерей","Дарханов Шынгыс","Досанова Аянат","Елубаев Бегарыс","Жаксылыкoва Жанерке","Жубаныш Раушан","Кобейсин Анель","Марат Абдiрахман","Мергенбай Мержан","Микишев Артур","Мухитова Лунара","Нагашыбаев Асылжан","Нуржанов Максат","Сапарова Көркем","Сактаган Гулерке","Султанова Камила","Турсынбаева Гулназ","Тугелбаев Нурали","Хасанов Бек"],
        '302': ["Белан Иван","Белоусова Елизавета","Гриценюк Руслан","Кучминский Герман","Ледакова Екатирина","Лилова Елена","Ломовцев Илья","Мыц Ринат","Рахимова Фатима","Сергеев Антон","Сиротенко Егор","Скалацкий Богдан","Таласов Руслан","Лаптеева Кристина"],
        '303': ["Айбеккызы Аружан","Амангазы Жансерик","Абилкасынкызы Нурсезим","Багонбай Аягуль","Батырханкызы Аяулым","Бахитова Дана","Боранбай Данабек","Дайынов Дамир","Дуйсенбай Марал","Елемесов Жадигер","Жакенов Ерсин","Жалгас Жанас"],
        '201':["Адилова Жібек Тоқсанбайқызы","Алдабергенұлы Тілеген","Байғожаев Жандаулет Ердәулетұлы","Бақытжанова Назерке","Днимова Асем Куандыковна","Жаназарова Дильназ Азаматовна","Кондрат Аманай Назарұлы","Көшекбаев Нұрбек Батыржанұлы","Қалмұхан Ұлжан Сәкенқызы","Құрманғали Гүлдәурен Жасұланқызы","Бақытжан Әбубәкір Бақытжанұлы","Мырзабай Махаббат Мейіржанқызы","Өмірбек Әділет Ерболұлы","Рахымжанқызы Жаннұр","Самалқызы Балерке","Сансызбаев Құрмаш Самғатұлы","Серіков Жанболат Сағынайұлы","Сқақ Сабина Сәбиділдақызы","Қылышбай Әнуар Нұрболұлы","Ұлықпан Ислам Ержанұлы","Шаудыров Жалгас Санибекулы","Шырақбай Асылмұрат Асылбекұлы"]
    }
};

const ADMIN_DEFAULTS = {
    users: [
        { name: 'Серік Кемал', login: 'kemal.s', password: 'Kemal2026!', subject: 'КМ03', role: 'Мұғалім', status: 'Белсенді' },
        { name: 'Аманжолов Б. Т.', login: 'amanzholov.b', password: 'Aktobe2026', subject: 'КМ03', role: 'Мұғалім', status: 'Белсенді' },
        { name: 'Нұрғалиева А.', login: 'nurgalieva.a', password: 'Teacher2026', subject: 'КМ03', role: 'Мұғалім', status: 'Белсенді' },
        { name: 'Алдариза Ж.Ғ.', login: 'aldariza', password: 'Aldariza2026!', subject: 'КМ03', role: 'Мұғалім', status: 'Белсенді' }
    ],
    settings: { school: 'КМ03 колледжі', language: 'Қазақша', notifications: true },
    activity: [{ text: 'Жүйе іске қосылды', time: 'Бүгін' }],
    schedule: [
        { id: 'aldariza-201-km06-2026-09-14', group: '201', day: 'Дүйсенбі', date: '2026-09-14', start: '13:00', end: '14:40', subject: 'КМ06', teacher: 'Алдариза Ж.Ғ.', room: '48' },
        { id: 'aldariza-203-2026-09-16', group: '203', day: 'Сәрсенбі', date: '2026-09-16', start: '15:40', end: '17:10', subject: 'КМ03', teacher: 'Алдариза Ж.Ғ.', room: '207' },
        { id: 'aldariza-201-km06-2026-09-10-0800', group: '201', day: 'Бейсенбі', date: '2026-09-10', start: '08:00', end: '09:30', subject: 'КМ06', teacher: 'Алдариза Ж.Ғ.', room: '48' },
        { id: 'aldariza-201-km06-2026-09-10-0940', group: '201', day: 'Бейсенбі', date: '2026-09-10', start: '09:40', end: '11:10', subject: 'КМ06', teacher: 'Алдариза Ж.Ғ.', room: '48' },
        { id: 'aldariza-201-km06-2026-09-11', group: '201', day: 'Жұма', date: '2026-09-11', start: '11:25', end: '12:55', subject: 'КМ06', teacher: 'Алдариза Ж.Ғ.', room: '48' }
    ]
};

const DEFAULT_GROUP_SPECIALTIES = {
    '201': 'РПО',
    '301': 'РПО'
};
const SPECIALTY_OPTIONS = ['РПО', 'ИС', 'ТМ', 'ТС', 'ЭЛ'];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = new Date().getDate(); // Әдепкі бойынша бүгінгі күн
let currentGroup = '';
let currentManagedGroup = Object.keys(APP_DATA.students)[0] || '201';

function getSelectedManagedGroup() {
    const selected = document.getElementById('managedGroup')?.value;
    if (selected && APP_DATA.students[selected]) {
        currentManagedGroup = selected;
        return selected;
    }
    if (APP_DATA.students[currentManagedGroup]) {
        return currentManagedGroup;
    }
    const firstGroup = Object.keys(APP_DATA.students)[0] || '201';
    currentManagedGroup = firstGroup;
    return firstGroup;
}

function firebaseSave(collection, value) {
    return setDoc(doc(db, 'site', collection), { value, updatedAt: serverTimestamp() }, { merge: true }).catch(error => {
        console.warn(`Firebase save failed for ${collection}:`, error.message);
    });
}
async function firebaseLoad(collection) {
    try {
        const snapshot = await getDoc(doc(db, 'site', collection));
        return snapshot.exists() ? snapshot.data().value : null;
    } catch (error) {
        console.warn(`Firebase load failed for ${collection}:`, error.message);
        return null;
    }
}
async function hydrateFirebaseData() {
    const [students, users, settings, activity, schedule, studentAccounts, groupSpecialties] = await Promise.all([
        firebaseLoad('students'), firebaseLoad('users'), firebaseLoad('settings'), firebaseLoad('activity'), firebaseLoad('schedule'), firebaseLoad('student_accounts'), firebaseLoad('group_specialties')
    ]);
    if (students) { APP_DATA.students = students; localStorage.setItem('admin_students', JSON.stringify(students)); }
    if (users) {
        localStorage.setItem('admin_users', JSON.stringify(users));
        firebaseSave('users', adminData('users'));
    }
    if (settings) localStorage.setItem('admin_settings', JSON.stringify(settings));
    if (activity) localStorage.setItem('admin_activity', JSON.stringify(activity));
    if (schedule) {
        localStorage.setItem('admin_schedule', JSON.stringify(schedule));
        adminData('schedule');
    }
    if (studentAccounts) localStorage.setItem('student_accounts', JSON.stringify(studentAccounts));
    if (groupSpecialties) localStorage.setItem('group_specialties', JSON.stringify(groupSpecialties));
    if (students || users || settings || activity || schedule || studentAccounts) {
        firebaseSave('students', APP_DATA.students);
        if (document.getElementById('adminScreen')?.classList.contains('active')) renderAdminView('overview');
    }
    cleanupRemovedGroups();
}
let currentFirebaseUser = null;
let currentTeacher = null;
const LANGUAGE_KEY = 'app_language';

const DAY_NAMES = {
    'Дүйсенбі': { ru: 'Понедельник', en: 'Monday' },
    'Сейсенбі': { ru: 'Вторник', en: 'Tuesday' },
    'Сәрсенбі': { ru: 'Среда', en: 'Wednesday' },
    'Бейсенбі': { ru: 'Четверг', en: 'Thursday' },
    'Жұма': { ru: 'Пятница', en: 'Friday' },
    'Сенбі': { ru: 'Суббота', en: 'Saturday' },
    'Жексенбі': { ru: 'Воскресенье', en: 'Sunday' }
};

const MONTH_NAMES = { 
    'Қаңтар': { ru: 'Январь', en: 'January' },
    'Ақпан': { ru: 'Февраль', en: 'February' },
    'Наурыз': { ru: 'Март', en: 'March' },
    'Сәуір': { ru: 'Апрель', en: 'April' },
    'Мамыр': { ru: 'Май', en: 'May' },
    'Маусым': { ru: 'Июнь', en: 'June' },
    'Шілде': { ru: 'Июль', en: 'July' },
    'Тамыз': { ru: 'Август', en: 'August' },
    'Қыркүйек': { ru: 'Сентябрь', en: 'September' },
    'Қазан': { ru: 'Октябрь', en: 'October' },
    'Қараша': { ru: 'Ноябрь', en: 'November' },
    'Желтоқсан': { ru: 'Декабрь', en: 'December' }
};

const KK_TO_RU = {
    'Ә': 'Э', 'ә': 'э', 'Ғ': 'Г', 'ғ': 'г', 'Қ': 'К', 'қ': 'к', 'Ө': 'О', 'ө': 'о',
    'Ұ': 'У', 'ұ': 'у', 'Ү': 'У', 'ү': 'у', 'Һ': 'Х', 'һ': 'х', 'І': 'И', 'і': 'и',
    'Ң': 'Н', 'ң': 'н', 'Ш': 'Ш', 'ш': 'ш', 'Ж': 'Ж', 'ж': 'ж', 'Щ': 'Щ', 'щ': 'щ'
};

const KK_TO_EN = {
    'А': 'A', 'а': 'a', 'Ә': 'A', 'ә': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v',
    'Г': 'G', 'г': 'g', 'Ғ': 'G', 'ғ': 'g', 'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e',
    'Ё': 'Yo', 'ё': 'yo', 'Ж': 'J', 'ж': 'j', 'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i',
    'І': 'I', 'і': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k', 'Қ': 'Q', 'қ': 'q',
    'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'Ң': 'N', 'ң': 'n',
    'О': 'O', 'о': 'o', 'Ө': 'O', 'ө': 'o', 'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's', 'Т': 'T', 'т': 't', 'У': 'U', 'у': 'u', 'Ұ': 'U', 'ұ': 'u',
    'Ф': 'F', 'ф': 'f', 'Х': 'H', 'х': 'h', 'Һ': 'H', 'һ': 'h', 'Ц': 'C', 'ц': 'c',
    'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sh', 'щ': 'sh', 'Ъ': '', 'ъ': '',
    'Ы': 'Y', 'ы': 'y', 'І': 'I', 'і': 'i', 'Ь': '', 'ь': '', 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu',
    'Я': 'Ya', 'я': 'ya'
};

function translateKazakhName(name, language = getLanguage()) {
    if (!name || language === 'kk') return name;
    if (language === 'ru') {
        return name.split('').map(ch => KK_TO_RU[ch] || ch).join('');
    }
    if (language === 'en') {
        return name.split('').map(ch => KK_TO_EN[ch] || ch).join('');
    }
    return name;
}

function translateCalendarMonth(monthName, language = getLanguage()) {
    if (!monthName) return monthName;
    if (language === 'kk') return monthName;
    return MONTH_NAMES[monthName]?.[language] || monthName;
}

function translateCalendarDay(dayName, language = getLanguage()) {
    if (!dayName) return dayName;
    if (language === 'kk') return dayName;
    return DAY_NAMES[dayName]?.[language] || dayName;
}

function translateLanguageControlLabel(language = getLanguage()) {
    return language === 'ru' ? 'Язык' : language === 'en' ? 'Language' : 'Тіл';
}

function translateVisibilityText(value, language = getLanguage()) {
    if (!value) return value;
    if (language === 'kk') return value;
    return UI_TEXT[value]?.[language] || value;
}

function translatePairLabel(count, language = getLanguage()) {
    if (language === 'ru') return `${count} пара`;
    if (language === 'en') return `${count} pair${count === 1 ? '' : 's'}`;
    return `${count} пара`;
}

function translateMoreLabel(language = getLanguage()) {
    if (language === 'ru') return 'Подробнее →';
    if (language === 'en') return 'More →';
    return 'Көбірек →';
}

const TRANSLATIONS = {
    kk: { loginTitle: 'Электронды журнал', loginTagline: 'Білім - болашақтың кілті', loginMotto: '«Сапалы білім -\nжарқын болашақ!»', loginHeading: 'Жүйеге кіру', loginInstruction: 'Өзіңіздің логин және құпиясөз арқылы кіріңіз', credentialsTitle: 'Кіруге арналған деректер', roleAdmin: 'Әкімші', roleTeacher: 'Оқытушы', roleStudent: 'Оқушы', roleAdminFull: 'Әкімші', roleTeacherFull: 'Оқытушы', roleStudentFull: 'Оқушы', registrationHeading: 'Оқушыны тіркеу', registrationInstruction: 'Жеке кабинетке кіру үшін деректерді толтырыңыз', registrationSubmit: 'Тіркелу', registrationCancel: 'Бас тарту', loginSubtitle: 'Кемал С. (КМ03)', loginButton: 'Кіру', registerButton: 'Оқушыны тіркеу', loginPlaceholder: 'Логин', passwordPlaceholder: 'Құпиясөз', adminManagement: 'Басқару', teacherJournal: 'Мұғалім журналы', teachers: 'Оқытушылар', groupsStudents: 'Топтар мен студенттер', schedule: 'Сабақ кестесі', users: 'Пайдаланушылар', settings: 'Баптаулар', activityLog: 'Әрекеттер журналы', logout: 'Шығу', teacherLabel: 'Оқытушы:', journalSystem: 'Электронды журнал жүйесі', teacher: 'Оқытушы', institution: 'Ақтөбе құрылыс-техникалық колледжі' },
    ru: { loginTitle: 'Электронный журнал', loginTagline: 'Образование - ключ к будущему', loginMotto: '«Качественное образование -\nсветлое будущее!»', loginHeading: 'Вход в систему', loginInstruction: 'Войдите с помощью логина и пароля', credentialsTitle: 'Данные для входа', roleAdmin: 'Админ', roleTeacher: 'Преподаватель', roleStudent: 'Ученик', roleAdminFull: 'Администратор', roleTeacherFull: 'Преподаватель', roleStudentFull: 'Ученик', registrationHeading: 'Регистрация ученика', registrationInstruction: 'Заполните данные для входа в личный кабинет', registrationSubmit: 'Зарегистрироваться', registrationCancel: 'Отмена', loginSubtitle: 'Кемал С. (КМ03)', loginButton: 'Войти', registerButton: 'Регистрация ученика', loginPlaceholder: 'Логин', passwordPlaceholder: 'Пароль', adminManagement: 'Управление', teacherJournal: 'Журнал преподавателя', teachers: 'Преподаватели', groupsStudents: 'Группы и студенты', schedule: 'Расписание', users: 'Пользователи', settings: 'Настройки', activityLog: 'Журнал действий', logout: 'Выйти', teacherLabel: 'Преподаватель:', journalSystem: 'Система электронного журнала', teacher: 'Преподаватель', institution: 'Актюбинский строительно-технический колледж' },
    en: { loginTitle: 'Electronic journal', loginTagline: 'Education is the key to the future', loginMotto: '"Quality education -\na bright future!"', loginHeading: 'Sign in', loginInstruction: 'Sign in with your login and password', credentialsTitle: 'Login details', roleAdmin: 'Admin', roleTeacher: 'Teacher', roleStudent: 'Student', roleAdminFull: 'Administrator', roleTeacherFull: 'Teacher', roleStudentFull: 'Student', registrationHeading: 'Student registration', registrationInstruction: 'Fill in the details to access your account', registrationSubmit: 'Register', registrationCancel: 'Cancel', loginSubtitle: 'Kemal S. (KM03)', loginButton: 'Sign in', registerButton: 'Student registration', loginPlaceholder: 'Login', passwordPlaceholder: 'Password', adminManagement: 'Management', teacherJournal: 'Teacher journal', teachers: 'Teachers', groupsStudents: 'Groups and students', schedule: 'Schedule', users: 'Users', settings: 'Settings', activityLog: 'Activity log', logout: 'Sign out', teacherLabel: 'Teacher:', journalSystem: 'Electronic journal system', teacher: 'Teacher', institution: 'Aktobe Construction and Technical College' }
};
Object.assign(TRANSLATIONS.kk, {
    registrationHide: 'Тіркеуді жасыру', collegePrompt: 'Колледжді таңдаңыз',
    collegeConstruction: 'Ақтөбе құрылыс-техникалық колледжі', collegeHumanities: 'Ақтөбе гуманитарлық колледжі',
    collegeOilGas: 'Мұнай-газ колледжі', groupPrompt: 'Топты таңдаңыз',
    collegeSystem: 'КОЛЛЕДЖ ЖҮЙЕСІ', eJournal: 'ЭЛЕКТРОНДЫ ЖУРНАЛ',
    collegeLogoAlt: 'Ақтөбе құрылыс-техникалық колледжінің логотипі'
});
Object.assign(TRANSLATIONS.ru, {
    registrationHide: 'Скрыть регистрацию', collegePrompt: 'Выберите колледж',
    collegeConstruction: 'Актюбинский строительно-технический колледж', collegeHumanities: 'Актюбинский гуманитарный колледж',
    collegeOilGas: 'Нефтегазовый колледж', groupPrompt: 'Выберите группу',
    collegeSystem: 'СИСТЕМА КОЛЛЕДЖА', eJournal: 'ЭЛЕКТРОННЫЙ ЖУРНАЛ',
    collegeLogoAlt: 'Логотип Актюбинского строительно-технического колледжа'
});
Object.assign(TRANSLATIONS.en, {
    registrationHide: 'Hide registration', collegePrompt: 'Select a college',
    collegeConstruction: 'Aktobe Construction and Technical College', collegeHumanities: 'Aktobe Humanities College',
    collegeOilGas: 'Oil and Gas College', groupPrompt: 'Select a group',
    collegeSystem: 'COLLEGE SYSTEM', eJournal: 'E-JOURNAL',
    collegeLogoAlt: 'Aktobe Construction and Technical College logo'
});
const UI_TEXT = {
    'Басты бет': { ru: 'Главная', en: 'Home' }, 'Кесте': { ru: 'Расписание', en: 'Schedule' }, 'Бағалар': { ru: 'Оценки', en: 'Grades' }, 'Қатысу': { ru: 'Посещаемость', en: 'Attendance' }, 'КБ / Практика': { ru: 'КБ / Практика', en: 'Assessment / Practice' }, 'Профиль': { ru: 'Профиль', en: 'Profile' }, 'Шығу': { ru: 'Выйти', en: 'Sign out' }, 'Сабақ кестесі': { ru: 'Расписание', en: 'Schedule' }, 'Бағаларым': { ru: 'Мои оценки', en: 'My grades' }, 'Қатысуым': { ru: 'Посещаемость', en: 'Attendance' }, 'Келесі КБ': { ru: 'Следующая КБ', en: 'Next assessment' }, 'Оқушы профилі': { ru: 'Профиль ученика', en: 'Student profile' }, 'Оқушы': { ru: 'Ученик', en: 'Student' }, 'ЖСН': { ru: 'ИИН', en: 'National ID' }, 'Топ': { ru: 'Группа', en: 'Group' }, 'Желіде': { ru: 'Онлайн', en: 'Online' }, 'Маңызды': { ru: 'Важно', en: 'Important' }, 'Орташа балл': { ru: 'Средний балл', en: 'Average grade' }, 'Қатысу': { ru: 'Посещаемость', en: 'Attendance' }, 'Кім қойды': { ru: 'Кто поставил', en: 'Assigned by' }, 'БҮГІНГІ БАҒДАР': { ru: 'СЕГОДНЯ', en: 'TODAY' }, 'БӨЛІМ': { ru: 'РАЗДЕЛ', en: 'SECTION' }, 'НӘТИЖЕ': { ru: 'РЕЗУЛЬТАТ', en: 'RESULT' }, 'МӘРТЕБЕ': { ru: 'СТАТУС', en: 'STATUS' }, 'БҮГІН': { ru: 'СЕГОДНЯ', en: 'TODAY' }, 'ЖЕКЕ ДЕРЕКТЕР': { ru: 'ЛИЧНЫЕ ДАННЫЕ', en: 'PERSONAL DATA' }, 'САБАҚТАР': { ru: 'ЗАНЯТИЯ', en: 'LESSONS' }, 'НАЗАР АУДАРЫҢЫЗ': { ru: 'ОБРАТИТЕ ВНИМАНИЕ', en: 'NOTICE' }, 'МӘРТЕБЕ': { ru: 'СТАТУС', en: 'STATUS' }, 'КЕЛЕСІ КБ': { ru: 'СЛЕДУЮЩАЯ КБ', en: 'NEXT ASSESSMENT' }, 'БАҒАЛАР': { ru: 'ОЦЕНКИ', en: 'GRADES' }, 'КБ-ға дайындалыңыз': { ru: 'Подготовьтесь к КБ', en: 'Prepare for assessment' }, 'Профиль белсенді': { ru: 'Профиль активен', en: 'Profile is active' }, 'Сабақ кестесі әлі толтырылмаған.': { ru: 'Расписание пока не заполнено.', en: 'The schedule is not available yet.' }, 'Жоспарланған КБ жоқ': { ru: 'Нет запланированной КБ', en: 'No assessment planned' }, 'Кесте жаңартылады': { ru: 'Расписание будет обновлено', en: 'The schedule will be updated' }, 'Іздеу...': { ru: 'Поиск...', en: 'Search...' }, 'Тіл': { ru: 'Язык', en: 'Language' }
};
Object.assign(UI_TEXT, {
    'Рөлді таңдау': { kk: 'Рөлді таңдау', ru: 'Выбор роли', en: 'Choose a role' },
    'Құпиясөзді көрсету': { kk: 'Құпиясөзді көрсету', ru: 'Показать пароль', en: 'Show password' },
    'Мұғалім панелі': { kk: 'Мұғалім панелі', ru: 'Панель преподавателя', en: 'Teacher panel' },
    'Excel жүктеу': { kk: 'Excel жүктеу', ru: 'Скачать Excel', en: 'Download Excel' },
    'Хабарламалар': { kk: 'Хабарламалар', ru: 'Уведомления', en: 'Notifications' },
    'Оқытушыларға арналған аккаунттарды басқару (Серік Кемал панелі)': { kk: 'Оқытушыларға арналған аккаунттарды басқару (Серік Кемал панелі)', ru: 'Управление аккаунтами преподавателей (панель Серика Кемаля)', en: 'Teacher account management (Serik Kemal panel)' },
    'Оқытушылар': { kk: 'Оқытушылар', ru: 'Преподаватели', en: 'Teachers' },
    'Топтар мен студенттер': { kk: 'Топтар мен студенттер', ru: 'Группы и студенты', en: 'Groups and students' },
    'Расписание': { kk: 'Сабақ кестесі', ru: 'Расписание', en: 'Schedule' },
    'Сабақ кестесі': { kk: 'Сабақ кестесі', ru: 'Расписание занятий', en: 'Class schedule' },
    'Пайдаланушылар': { kk: 'Пайдаланушылар', ru: 'Пользователи', en: 'Users' },
    'Баптаулар': { kk: 'Баптаулар', ru: 'Настройки', en: 'Settings' },
    'Әрекеттер журналы': { kk: 'Әрекеттер журналы', ru: 'Журнал действий', en: 'Activity log' },
    'Басқару': { kk: 'Басқару', ru: 'Управление', en: 'Management' },
    'Мұғалім журналы': { kk: 'Мұғалім журналы', ru: 'Журнал преподавателя', en: 'Teacher journal' },
    'Әкімші бөлімдері': { kk: 'Әкімші бөлімдері', ru: 'Разделы администратора', en: 'Administrator sections' },
    'Оқытушы:': { kk: 'Оқытушы:', ru: 'Преподаватель:', en: 'Teacher:' },
    'Электронды журнал жүйесі': { kk: 'Электронды журнал жүйесі', ru: 'Система электронного журнала', en: 'Electronic journal system' },
    'Қосу': { kk: 'Қосу', ru: 'Добавить', en: 'Add' },
    'Өңдеу': { kk: 'Өңдеу', ru: 'Редактировать', en: 'Edit' },
    'Жою': { kk: 'Жою', ru: 'Удалить', en: 'Delete' },
    'Әрекет': { kk: 'Әрекет', ru: 'Действие', en: 'Action' },
    'Оқытушылар тізімі': { kk: 'Оқытушылар тізімі', ru: 'Список преподавателей', en: 'Teacher list' },
    'Предмет': { kk: 'Предмет', ru: 'Предмет', en: 'Subject' },
    'Логин': { kk: 'Логин', ru: 'Логин', en: 'Login' },
    'Құпия сөз': { kk: 'Құпия сөз', ru: 'Пароль', en: 'Password' },
    'Рөлі': { kk: 'Рөлі', ru: 'Роль', en: 'Role' },
    'Мәртебесі': { kk: 'Мәртебесі', ru: 'Статус', en: 'Status' },
    'Студенттерді басқару': { kk: 'Студенттерді басқару', ru: 'Управление студентами', en: 'Student management' },
    'Студент қосу': { kk: 'Студент қосу', ru: 'Добавить студента', en: 'Add student' },
    'Топты таңдау': { kk: 'Топты таңдау', ru: 'Выберите группу', en: 'Choose group' },
    'Жаңа топ нөмірі': { kk: 'Жаңа топ нөмірі', ru: 'Номер новой группы', en: 'New group number' },
    'Топ қосу': { kk: 'Топ қосу', ru: 'Добавить группу', en: 'Add group' },
    'Студенттің аты-жөні': { kk: 'Студенттің аты-жөні', ru: 'ФИО студента', en: 'Student full name' },
    'Қолжетімділік': { kk: 'Қолжетімділік', ru: 'Доступ', en: 'Access' },
    'Студент': { kk: 'Студент', ru: 'Студент', en: 'Student' },
    'Пайдаланушы қосу': { kk: 'Пайдаланушы қосу', ru: 'Добавить пользователя', en: 'Add user' },
    'Аты': { kk: 'Аты', ru: 'Имя', en: 'Name' },
    'ҚОЛ ЖЕТІМДІЛІК': { kk: 'ҚОЛ ЖЕТІМДІЛІК', ru: 'ДОСТУП', en: 'ACCESS' },
    'ЖҮЙЕ': { kk: 'ЖҮЙЕ', ru: 'СИСТЕМА', en: 'SYSTEM' },
    'Оқу орнының атауы': { kk: 'Оқу орнының атауы', ru: 'Название учебного заведения', en: 'Institution name' },
    'Интерфейс тілі': { kk: 'Интерфейс тілі', ru: 'Язык интерфейса', en: 'Interface language' },
    'Баға сақталған кезде хабарлама көрсету': { kk: 'Баға сақталған кезде хабарлама көрсету', ru: 'Показывать уведомление при сохранении оценки', en: 'Show notification when a grade is saved' },
    'Баптауларды сақтау': { kk: 'Баптауларды сақтау', ru: 'Сохранить настройки', en: 'Save settings' },
    'AUDIT TRAIL': { kk: 'AUDIT TRAIL', ru: 'ЖУРНАЛ ДЕЙСТВИЙ', en: 'AUDIT TRAIL' },
    'Тазалау': { kk: 'Тазалау', ru: 'Очистить', en: 'Clear' },
    'Мұғалім': { kk: 'Мұғалім', ru: 'Преподаватель', en: 'Teacher' },
    'Белсенді': { kk: 'Белсенді', ru: 'Активен', en: 'Active' },
    'Арнайы пәндер': { kk: 'Арнайы пәндер', ru: 'Специальные дисциплины', en: 'Special subjects' },
    'Жүйе іске қосылды': { kk: 'Жүйе іске қосылды', ru: 'Система запущена', en: 'System started' },
    'Жүйе баптаулары жаңартылды': { kk: 'Жүйе баптаулары жаңартылды', ru: 'Настройки системы обновлены', en: 'System settings updated' },
    'Бүгін': { kk: 'Бүгін', ru: 'Сегодня', en: 'Today' },
    'Оқытушыларға логин мен құпия сөзді жүйе әкімшісі (немесе бас оқытушы) өз қолымен тағайындайды және береді.': { kk: 'Оқытушыларға логин мен құпия сөзді жүйе әкімшісі (немесе бас оқытушы) өз қолымен тағайындайды және береді.', ru: 'Логин и пароль преподавателям назначает и выдаёт администратор системы (или старший преподаватель).', en: 'The system administrator (or senior teacher) assigns and provides teacher logins and passwords.' },
    'САБАҚ КЕСТЕСІ': { kk: 'САБАҚ КЕСТЕСІ', ru: 'РАСПИСАНИЕ ЗАНЯТИЙ', en: 'CLASS SCHEDULE' },
    'Сабақ қосу': { kk: 'Сабақ қосу', ru: 'Добавить занятие', en: 'Add lesson' },
    'Сабақты редакциялау': { kk: 'Сабақты редакциялау', ru: 'Редактировать занятие', en: 'Edit lesson' },
    'Күн аптасы': { kk: 'Күн аптасы', ru: 'День недели', en: 'Day of week' },
    'Күні': { kk: 'Күні', ru: 'Дата', en: 'Date' },
    'Басталуы': { kk: 'Басталуы', ru: 'Начало', en: 'Start' },
    'Аяқталуы': { kk: 'Аяқталуы', ru: 'Окончание', en: 'End' },
    'Пән': { kk: 'Пән', ru: 'Предмет', en: 'Subject' },
    'Кабинет': { kk: 'Кабинет', ru: 'Кабинет', en: 'Room' },
    'Сақтау': { kk: 'Сақтау', ru: 'Сохранить', en: 'Save' },
    'Болдырмау': { kk: 'Болдырмау', ru: 'Отмена', en: 'Cancel' },
    'Оқытушы': { kk: 'Оқытушы', ru: 'Преподаватель', en: 'Teacher' },
    'Топ': { kk: 'Топ', ru: 'Группа', en: 'Group' },
    'САБАҚ КЕСТЕСІ': { kk: 'САБАҚ КЕСТЕСІ', ru: 'РАСПИСАНИЕ ЗАНЯТИЙ', en: 'CLASS SCHEDULE' },
    'Т.И.Ә. / Оқытушы': { kk: 'Т.И.Ә. / Оқытушы', ru: 'Ф.И.О. / Преподаватель', en: 'Full name / Teacher' },
    'Password': { kk: 'Құпия сөз', ru: 'Пароль', en: 'Password' },
    'Күн': { kk: 'Күн', ru: 'День', en: 'Day' },
    'Уақыты': { kk: 'Уақыты', ru: 'Время', en: 'Time' },
    'Әзірге сабақтар қосылмаған': { kk: 'Әзірге сабақтар қосылмаған', ru: 'Занятия пока не добавлены', en: 'No lessons have been added yet' },
    'Студент Қосу Беті': { kk: 'Студент Қосу Беті', ru: 'Страница добавления студента', en: 'Add student page' },
    'Басылды! Келесі бетке өту сәтті орындалды': { kk: 'Басылды! Келесі бетке өту сәтті орындалды', ru: 'Готово! Переход на следующую страницу выполнен', en: 'Done! The next page opened successfully' },
    'Жалпы студент саны:': { kk: 'Жалпы студент саны:', ru: 'Всего студентов:', en: 'Total students:' },
    'Студентті сақтау': { kk: 'Студентті сақтау', ru: 'Сохранить студента', en: 'Save student' },
    'Артқа': { kk: 'Артқа', ru: 'Назад', en: 'Back' },
    'Жаңа топ нөмірі:': { kk: 'Жаңа топ нөмірі:', ru: 'Номер новой группы:', en: 'New group number:' },
    'Студент аты:': { kk: 'Студент аты:', ru: 'Имя студента:', en: 'Student name:' },
    'Студенттің аты-жөні:': { kk: 'Студенттің аты-жөні:', ru: 'ФИО студента:', en: 'Student full name:' },
    'Құпиясөз': { kk: 'Құпиясөз', ru: 'Пароль', en: 'Password' },
    'Предмет (например, КМ03):': { kk: 'Предмет (мысалы, КМ03):', ru: 'Предмет (например, КМ03):', en: 'Subject (for example, KM03):' },
    'Кем дегенде бір оқытушы қалуы керек.': { kk: 'Кем дегенде бір оқытушы қалуы керек.', ru: 'Должен остаться хотя бы один преподаватель.', en: 'At least one teacher must remain.' },
    'Пайдаланушыны жою керек пе?': { kk: 'Пайдаланушыны жою керек пе?', ru: 'Удалить пользователя?', en: 'Delete this user?' },
    'Баптаулар сақталды': { kk: 'Баптаулар сақталды', ru: 'Настройки сохранены', en: 'Settings saved' },
    'Аяқталу уақыты басталу уақытынан кейін болуы керек.': { kk: 'Аяқталу уақыты басталу уақытынан кейін болуы керек.', ru: 'Время окончания должно быть позже времени начала.', en: 'The end time must be later than the start time.' },
    'Оқытушының аты-жөні:': { kk: 'Оқытушының аты-жөні:', ru: 'ФИО преподавателя:', en: 'Teacher full name:' },
    'Логин:': { kk: 'Логин:', ru: 'Логин:', en: 'Login:' },
    'Предмет:': { kk: 'Предмет:', ru: 'Предмет:', en: 'Subject:' },
    'Мәртебесі:': { kk: 'Мәртебесі:', ru: 'Статус:', en: 'Status:' },
    'Рөлі:': { kk: 'Рөлі:', ru: 'Роль:', en: 'Role:' },
    'Оқытушысы жойылды': { kk: 'Оқытушысы жойылды', ru: 'Преподаватель удалён', en: 'Teacher deleted' }
});

const TEXT_TRANSLATIONS = (() => {
    const map = {};

    const register = (value, language, translated) => {
        if (typeof value !== 'string' || !value.trim()) return;
        if (!map[value]) map[value] = {};
        map[value][language] = translated;
    };

    Object.keys(TRANSLATIONS.kk || {}).forEach(key => {
        const source = TRANSLATIONS.kk[key];
        ['kk', 'ru', 'en'].forEach(language => {
            const translated = TRANSLATIONS[language]?.[key];
            if (typeof source === 'string' && typeof translated === 'string') register(source, language, translated);
        });
    });

    Object.entries(UI_TEXT).forEach(([value, labels]) => {
        Object.entries(labels || {}).forEach(([language, translated]) => {
            if (typeof translated === 'string') register(value, language, translated);
        });
    });

    return map;
})();

function applyAutomaticTextTranslations(language = getLanguage()) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes = [];

    while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        if (!node.nodeValue || !node.nodeValue.trim()) continue;
        if (!parent || parent.closest('script, style, noscript')) continue;
        if (parent.matches('input, textarea, select')) continue;
        nodes.push(node);
    }

    nodes.forEach(node => {
        const original = node.nodeValue.trim();
        const translated = TEXT_TRANSLATIONS[original]?.[language];
        if (translated) node.nodeValue = translated;
    });
}

function getLanguage() { return localStorage.getItem(LANGUAGE_KEY) || 'kk'; }
function translateText(value, language = getLanguage()) { return UI_TEXT[value]?.[language] || value; }
function adminText(value, language = getLanguage()) { return translateText(value, language); }
function getGroupSpecialties() {
    const stored = JSON.parse(localStorage.getItem('group_specialties') || '{}');
    return { ...DEFAULT_GROUP_SPECIALTIES, ...stored };
}
function getGroupSpecialty(group) {
    const specialties = getGroupSpecialties();
    if (specialties[group]) return specialties[group];
    const suffix = String(group).match(/\b(РПО|ИС|ТМ)$/i)?.[1];
    return suffix ? suffix.toUpperCase() : 'РПО';
}
function saveGroupSpecialty(group, specialty) {
    const specialties = getGroupSpecialties();
    specialties[group] = specialty;
    localStorage.setItem('group_specialties', JSON.stringify(specialties));
    firebaseSave('group_specialties', specialties);
}
function normalizeSpecialty(value, fallback = 'РПО') {
    const normalized = String(value || '').trim().toUpperCase();
    return /^\p{L}{2,12}$/u.test(normalized) ? normalized : fallback;
}
function resolveSpecialtyChoice(value, fallback = 'РПО') {
    if (value === 'custom') return normalizeSpecialty(prompt(adminText('Введите аббревиатуру специальности:')), fallback);
    return normalizeSpecialty(value, fallback);
}
function adminGroupLabel(group, language = getLanguage()) {
    const specialty = getGroupSpecialty(group);
    const baseGroup = String(group).replace(new RegExp(`\\s+(?:${SPECIALTY_OPTIONS.join('|')})$`, 'i'), '');
    return language === 'ru' ? `${baseGroup} группа ${specialty}` : language === 'en' ? `${baseGroup} ${specialty} group` : `${baseGroup} ${specialty}`;
}
function setLanguage(language) {
    if (!TRANSLATIONS[language]) return;
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
    document.querySelectorAll('#languageSelect, #teacherLanguageSelect, #adminLanguageSelect, .student-language-select').forEach(select => { select.value = language; });
    const languageLabel = document.getElementById('languageSelectLabel');
    if (languageLabel) {
        const languageDisplay = {
            kk: 'Қазір: Қазақ тілі',
            ru: 'Сейчас: Русский язык',
            en: 'Current: English'
        };
        languageLabel.textContent = languageDisplay[language] || languageDisplay.kk;
    }
    ensureLanguageControls();
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = TRANSLATIONS[language][element.dataset.i18n] || element.textContent; });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => { element.setAttribute('aria-label', translateText(element.dataset.i18nAriaLabel, language)); });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => { element.setAttribute('alt', TRANSLATIONS[language][element.dataset.i18nAlt] || element.getAttribute('alt')); });
    const loginMotto = document.querySelector('.login-motto');
    if (loginMotto) loginMotto.innerHTML = TRANSLATIONS[language].loginMotto.replace(/\n/g, '<br>');
    const registrationForm = document.getElementById('studentRegistrationForm');
    const registrationTrigger = document.querySelector('.registration-trigger');
    if (registrationForm && !registrationForm.hidden && registrationTrigger) registrationTrigger.textContent = TRANSLATIONS[language].registrationHide;
    translateStudentInterface(document.body, language);

    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    if (loginInput) loginInput.placeholder = TRANSLATIONS[language].loginPlaceholder;
    if (passwordInput) passwordInput.placeholder = TRANSLATIONS[language].passwordPlaceholder;

    const registrationPlaceholders = {
        registrationIin: { kk: 'ЖСН (12 сан)', ru: 'ИИН (12 цифр)', en: 'National ID (12 digits)' },
        registrationLogin: { kk: 'Өз логиніңіз', ru: 'Ваш логин', en: 'Your login' },
        registrationPassword: { kk: 'Өз құпиясөзіңіз (кемінде 6 таңба)', ru: 'Ваш пароль (минимум 6 символов)', en: 'Your password (at least 6 characters)' }
    };
    Object.entries(registrationPlaceholders).forEach(([id, labels]) => { const input = document.getElementById(id); if (input) input.placeholder = labels[language]; });

    const journalSearch = document.getElementById('studentSearch');
    if (journalSearch) journalSearch.placeholder = translateText('Оқушыны іздеу...', language);

    const journalAddButton = document.querySelector('#journalScreen .add-btn');
    if (journalAddButton) journalAddButton.textContent = `+ ${translateText('Студенттерді қосу', language)}`;

    applyAutomaticTextTranslations(language);

    const activeScreen = document.querySelector('.screen.active')?.id;
    if (activeScreen === 'scheduleScreen') {
        renderSchedule();
    }
    if (activeScreen === 'journalScreen') {
        renderCalendar();
        loadStudentsTable();
    }
    if (activeScreen === 'adminScreen') {
        const activeAdminView = document.querySelector('.admin-nav-item.active')?.dataset.adminView || 'overview';
        if (activeAdminView === 'content' && window.adminSubView === 'student-add') showStudentAddPage();
        else renderAdminView(activeAdminView);
    }

    const root = document.querySelector('.student-dashboard');
    if (root && window.currentStudent) {
        const view = root.dataset.studentView || 'home';
        renderStudentDashboard(window.currentStudent);
        openStudentSection(view);
    }
}
function translateStudentInterface(root, language = getLanguage()) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
        const value = node.nodeValue.trim();
        const entry = Object.entries(UI_TEXT).find(([source, labels]) => source === value || labels.ru === value || labels.en === value);
        if (value.startsWith('Сәлем, ')) {
            const name = value.slice(7).replace(/!$/, '');
            const greeting = language === 'ru' ? `Привет, ${name}!` : language === 'en' ? `Hello, ${name}!` : `Сәлем, ${name}!`;
            node.nodeValue = node.nodeValue.replace(value, greeting);
            return;
        }
        if (value.includes('РПО тобы')) {
            const groupText = language === 'ru' ? value.replace('РПО тобы', 'группа РПО') : language === 'en' ? value.replace('РПО тобы', 'RPO group') : value;
            node.nodeValue = node.nodeValue.replace(value, groupText);
            return;
        }
        const lessonCount = value.match(/^(\d+) сабақ$/);
        if (lessonCount) {
            const countText = language === 'ru' ? `${lessonCount[1]} занятий` : language === 'en' ? `${lessonCount[1]} lessons` : value;
            node.nodeValue = node.nodeValue.replace(value, countText);
            return;
        }
        if (entry) node.nodeValue = node.nodeValue.replace(value, entry[0] === value ? (entry[1][language] || value) : (entry[0] === value ? value : entry[1][language] || entry[0]));
    });
}

function ensureLanguageControls() {
    const language = getLanguage();
    document.querySelectorAll('.global-language-control select').forEach(select => { select.value = language; });
}

function getAllStudentAccounts() {
    return Object.keys(APP_DATA.students).flatMap(group => getStudentAccounts(group).map(account => ({ ...account, group })));
}

function findStudentAccount(loginName) {
    const stored = JSON.parse(localStorage.getItem('student_accounts') || '{}');
    for (const [group, accounts] of Object.entries(stored)) {
        const account = Array.isArray(accounts) ? accounts.find(item => item?.login === loginName) : null;
        if (account) return { ...account, group };
    }
    return getAllStudentAccounts().find(account => account.login === loginName) || null;
}

function saveAppSession(session) {
    localStorage.setItem('app_session', JSON.stringify(session));
}

function getAppSession() {
    try {
        return JSON.parse(localStorage.getItem('app_session') || 'null');
    } catch {
        return null;
    }
}

async function hydrateStudentAccounts() {
    const accounts = await firebaseLoad('student_accounts');
    if (accounts && typeof accounts === 'object') {
        localStorage.setItem('student_accounts', JSON.stringify(accounts));
    }
    return accounts;
}

function toggleStudentRegistration(forceState) {
    const form = document.getElementById('studentRegistrationForm');
    const trigger = document.querySelector('.registration-trigger');
    if (!form) return;
    const shouldShow = typeof forceState === 'boolean' ? forceState : form.hidden;
    form.hidden = !shouldShow;
    if (trigger) trigger.textContent = TRANSLATIONS[getLanguage()][shouldShow ? 'registrationHide' : 'registerButton'];
    if (shouldShow) {
        const groupSelect = document.getElementById('registrationGroup');
        if (groupSelect) groupSelect.innerHTML = `<option value="" data-i18n="groupPrompt">${TRANSLATIONS[getLanguage()].groupPrompt}</option>` + Object.keys(APP_DATA.students).map(group => `<option value="${group}">${adminGroupLabel(group)}</option>`).join('');
        document.getElementById('registrationIin')?.focus();
    }
}

function registerStudent() {
    const iin = document.getElementById('registrationIin')?.value.trim() || '';
    const college = document.getElementById('registrationCollege')?.value || '';
    const group = document.getElementById('registrationGroup')?.value || '';
    const loginName = document.getElementById('registrationLogin')?.value || '';
    const password = document.getElementById('registrationPassword')?.value || '';
    const result = document.getElementById('registrationResult');
    if (!/^\d{12}$/.test(iin)) {
        if (result) result.innerHTML = '<span class="registration-error">ЖСН дәл 12 саннан тұруы керек.</span>';
        return;
    }
    if (!college || !group) {
        if (result) result.innerHTML = '<span class="registration-error">Колледж бен топты таңдаңыз.</span>';
        return;
    }
    if (!/^[\w.-]{3,30}$/i.test(loginName)) {
        if (result) result.innerHTML = '<span class="registration-error">Логин 3–30 таңбадан тұруы керек.</span>';
        return;
    }
    if (password.length < 6) {
        if (result) result.innerHTML = '<span class="registration-error">Құпиясөз кемінде 6 таңбадан тұруы керек.</span>';
        return;
    }
    if (getAllStudentAccounts().some(account => account.iin === iin)) {
        if (result) result.innerHTML = '<span class="registration-error">Бұл ЖСН бұрын тіркелген.</span>';
        return;
    }
    if (getAllStudentAccounts().some(account => account.login.toLowerCase() === loginName.toLowerCase())) {
        if (result) result.innerHTML = '<span class="registration-error">Бұл логин бос емес. Басқа логин таңдаңыз.</span>';
        return;
    }
    const existingAccounts = getStudentAccounts(group);
    const account = { name: `Оқушы ${iin.slice(-4)}`, login: loginName, password, iin, college, registered: true };
    APP_DATA.students[group] = Array.isArray(APP_DATA.students[group]) ? APP_DATA.students[group] : [];
    APP_DATA.students[group].push(account.name);
    saveStudentAccounts(group, [...existingAccounts, account]);
    saveStudents();
    if (result) result.innerHTML = `<div class="registration-success"><strong>Тіркелу аяқталды</strong><span>Жеке кабинетке кіру деректері:</span><b>Логин: ${account.login}</b><b>Құпиясөз: ${account.password}</b><button type="button" onclick="useRegisteredStudent('${account.login}', '${account.password}')">Панельге кіру</button></div>`;
}

function useRegisteredStudent(loginName, password) {
    document.getElementById('login').value = loginName;
    document.getElementById('password').value = password;
    toggleStudentRegistration(false);
    login();
}

// --- КІРУ ЖӘНЕ ЭКРАНДАР ---
async function login() {
    await initialSessionReset;
    const user = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const accounts = {
        admin: { email: 'admin@newapp-987f5.firebaseapp.com', name: 'Әкімші', role: 'admin' },
        kemal: { email: 'kemal@newapp-987f5.firebaseapp.com', name: 'Кемал С.', role: 'teacher' },
        aldariza: { email: 'aldariza@newapp-987f5.firebaseapp.com', name: 'Алдариза Ж.Ғ.', role: 'teacher' }
    };
    let studentAccount = findStudentAccount(user);
    if (!studentAccount || /^student_/i.test(user)) {
        await hydrateStudentAccounts();
        studentAccount = findStudentAccount(user);
    }
    const isStudentLogin = Boolean(studentAccount) || user === '201' || /^\d{3}_\d{2}$/.test(user);
    if (isStudentLogin) {
        const account = studentAccount || getStudentAccounts('201')[0];
        if (!password || (studentAccount && account.password !== password) || (!studentAccount && password !== '201')) {
            alert('Логин немесе құпиясөз қате!');
            return;
        }
        window.currentStudent = { ...account, group: studentAccount?.group || Object.keys(APP_DATA.students).find(group => APP_DATA.students[group].includes(account.name)) || '201' };
        saveAppSession({ type: 'student', login: user, view: 'home' });
        showScreen('studentAccess');
        renderStudentDashboard(window.currentStudent);
        return;
    }
    const account = accounts[user];
    if (!account || !password) { alert('Логин немесе құпиясөз қате!'); return; }
    try {
        let credential;
        try {
            credential = await signInWithEmailAndPassword(auth, account.email, password);
        } catch (signInError) {
            if (signInError.code !== 'auth/user-not-found' && signInError.code !== 'auth/invalid-credential') throw signInError;
            credential = await createUserWithEmailAndPassword(auth, account.email, password);
        }
        currentFirebaseUser = credential.user;
        currentTeacher = account.role === 'teacher'
            ? { login: user, name: account.name, displayName: user === 'aldariza' ? 'Алдариза Ж.' : 'Кемал С.' }
            : null;
        saveAppSession({ type: account.role, login: user, view: account.role === 'admin' ? 'overview' : 'schedule' });
        await setDoc(doc(db, 'users', currentFirebaseUser.uid), { name: account.name, login: user, email: account.email, role: account.role, status: 'Белсенді' }, { merge: true });
        await seedDatabase();
        await hydrateFirebaseData();
        if (user === 'admin') { showScreen('admin'); renderAdminView('overview'); }
        else showScreen('schedule');
    } catch (error) {
        console.error('Firebase authentication failed:', error);
        const messages = {
            'auth/weak-password': 'Құпиясөз кемінде 6 таңбадан тұруы керек.',
            'auth/operation-not-allowed': 'Firebase Console ішінде Email/Password кіруін қосыңыз.',
            'auth/invalid-credential': 'Логин немесе құпиясөз қате.',
            'auth/email-already-in-use': 'Бұл аккаунт бұрын тіркелген. Оның нақты құпиясөзін енгізіңіз.'
        };
        alert(messages[error.code] || 'Firebase кіру қатесі: ' + error.message);
    }
}

    function getStudentAccounts(group) {
        if (!group) return [];
        const stored = JSON.parse(localStorage.getItem('student_accounts') || '{}');
        const groupKey = String(group);
        const baseGroupStudents = Array.isArray(APP_DATA.students[group]) ? APP_DATA.students[group] : [];

        if (!stored[groupKey] || !Array.isArray(stored[groupKey])) {
            const generated = baseGroupStudents.map((name, index) => ({
                name,
                login: `${groupKey}_${String(index + 1).padStart(2, '0')}`,
                password: `stu${groupKey}_${String(index + 1).padStart(2, '0')}`
            }));
            stored[groupKey] = generated;
            localStorage.setItem('student_accounts', JSON.stringify(stored));
            return generated;
        }

        const groupAccounts = stored[groupKey].filter(Boolean);
        if (groupAccounts.length !== baseGroupStudents.length && baseGroupStudents.length > 0) {
            const synced = baseGroupStudents.map((name, index) => {
                const existing = groupAccounts.find(account => account && account.name === name);
                if (existing) return existing;
                return {
                    name,
                    login: `${groupKey}_${String(index + 1).padStart(2, '0')}`,
                    password: `stu${groupKey}_${String(index + 1).padStart(2, '0')}`
                };
            });
            stored[groupKey] = synced;
            localStorage.setItem('student_accounts', JSON.stringify(stored));
            return synced;
        }

        return groupAccounts;
    }

    function saveStudentAccounts(group, accounts) {
        const stored = JSON.parse(localStorage.getItem('student_accounts') || '{}');
        const safeAccounts = Array.isArray(accounts) ? accounts : [];
        stored[String(group)] = safeAccounts;
        localStorage.setItem('student_accounts', JSON.stringify(stored));
        firebaseSave('student_accounts', stored);
    }

function renderStudentAccess(group) {
    const account = getStudentAccounts(group)[0];
    if (account) renderStudentDashboard({ ...account, group });
}

function getStudentGradeRows(student) {
    const rows = [];
    const teacherBySubject = subject => adminData('schedule').find(entry => entry.group === student.group && entry.subject === subject)?.teacher || 'Серік Кемал';
    Object.keys(localStorage).filter(key => key.endsWith(`-${student.group}`)).forEach(key => {
        const values = JSON.parse(localStorage.getItem(key) || '{}');
        const value = values[student.name];
        if (!value || value.toUpperCase() === 'НБ') return;
        const parts = key.split('-');
        rows.push({ date: `${parts[1]}.${String(Number(parts[2]) + 1).padStart(2, '0')}.${parts[3]}`, subject: 'КМ03', value: Number(value), teacher: teacherBySubject('КМ03') });
    });
    if (!rows.length) return [
        { date: '10.09.2026', subject: 'КМ03', value: 86, teacher: 'Серік Кемал' },
        { date: '08.09.2026', subject: 'КМ06', value: 92, teacher: 'Алдариза Ж.Ғ.' }
    ];
    return rows.sort((a, b) => b.date.localeCompare(a.date));
}

function renderStudentDashboard(student) {
    const root = document.getElementById('studentAccessView');
    const schedule = adminData('schedule').filter(entry => entry.group === student.group).sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
    const grades = getStudentGradeRows(student);
    const average = grades.length ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1) : '—';
    const attendance = Math.max(0, 100 - grades.filter(grade => grade.value < 50).length * 5);
    const todayKey = new Date().toISOString().slice(0, 10);
    const upcoming = schedule.find(entry => entry.date >= todayKey) || schedule[0];
    const language = getLanguage();
    const translatedStudentName = translateKazakhName(student.name, language);
    const translatedStudentGroup = adminGroupLabel(student.group, language);
    const translatedStudentLogin = student.login;
    const translatedScheduleCount = `${schedule.length} ${language === 'en' ? 'lessons' : language === 'ru' ? 'занятий' : 'сабақ'}`;
    const translatedStudentDashboard = `<div class="student-dashboard" data-student-view="home">
        <aside class="student-sidebar"><div class="student-brand"><span class="brand-book">▣</span><div><strong>Electronic journal</strong><small>College system</small></div></div><nav class="student-side-nav"><button class="active" onclick="openStudentSection('home', this)"><span>⌂</span>Home</button><button onclick="openStudentSection('schedule', this)"><span>▦</span>Schedule</button><button onclick="openStudentSection('grades', this)"><span>☆</span>Grades</button><button onclick="openStudentSection('attendance', this)"><span>◉</span>Attendance</button><button onclick="openStudentSection('practice', this)"><span>▣</span>Assessment / Practice</button><button onclick="openStudentSection('profile', this)"><span>♙</span>Profile</button></nav><div class="student-sidebar-note"><strong>Education —</strong><span>bright future!</span><b>✦</b></div><button class="student-side-logout" onclick="logout()"><span>↪</span>Exit</button></aside>
        <main class="student-main">
        <div class="student-topbar"><div class="student-search">⌕ <span>Search...</span></div><div class="student-top-actions"><label class="student-language-label">Language<select class="student-language-select" onchange="setLanguage(this.value)"><option value="kk">Қазақша</option><option value="ru">Русский</option><option value="en">English</option></select></label><button class="student-bell" aria-label="Notifications">♧<i></i></button><button class="student-avatar-button" onclick="openStudentSection('profile')"><span class="student-avatar">${translatedStudentName.charAt(0)}</span><span class="avatar-chevron">⌄</span></button></div></div>
        <header class="student-dashboard-header"><div><span class="student-kicker">STUDENT PORTAL</span><h1>Hello, ${translatedStudentName.split(' ')[0]}!</h1><p>${translatedStudentGroup} · ${translatedStudentLogin}</p></div><button onclick="logout()" class="student-logout">Exit</button></header>
        <nav class="student-nav" aria-label="Student panel sections"><button class="active" onclick="openStudentSection('profile', this)">Profile</button><button onclick="openStudentSection('schedule', this)">Schedule</button><button onclick="openStudentSection('grades', this)">My grades</button><button onclick="openStudentSection('attendance', this)">Attendance</button><button onclick="openStudentSection('practice', this)">Next assessment</button></nav>
        <div class="student-quick-grid"><button class="student-quick-card quick-schedule" onclick="openStudentSection('schedule')"><span class="quick-icon">▦</span><span><small>SECTION</small><strong>Schedule</strong><em>${translatedScheduleCount}</em></span><b>↗</b></button><button class="student-quick-card quick-grades" onclick="openStudentSection('grades')"><span class="quick-icon">↗</span><span><small>SECTION</small><strong>Grades</strong><em>${grades.length} results</em></span><b>↗</b></button><button class="student-quick-card quick-average" onclick="openStudentSection('grades')"><span class="quick-icon">★</span><span><small>RESULT</small><strong>Average score</strong><em>From 100 ${average}</em></span><b>↗</b></button><button class="student-quick-card quick-attendance" onclick="openStudentSection('attendance')"><span class="quick-icon">✓</span><span><small>STATUS</small><strong>Attendance</strong><em>${attendance}% attendance</em></span><b>↗</b></button><button class="student-quick-card quick-destination" onclick="openStudentSection('practice')"><span class="quick-icon">⌖</span><span><small>TODAY</small><strong>Where to go today</strong><em>${upcoming ? `${upcoming.room}-room · ${upcoming.subject}` : 'No lesson'}</em></span><b>↗</b></button></div>
        <section class="student-hero"><div><span class="student-kicker">TODAY'S PLAN</span><h2>${upcoming ? `${translateCalendarDay(upcoming.day, language)}, ${upcoming.date}` : 'No lessons yet'}</h2><p>${upcoming ? `${upcoming.start}–${upcoming.end} · ${upcoming.subject} · ${upcoming.room}-room` : 'The schedule will be updated here'}</p></div><div class="hero-mark">${student.group}</div></section>
        <div class="student-stat-grid"><div class="student-stat"><span>Average score</span><strong>${average}</strong><small>100-point system</small></div><div class="student-stat"><span>Attendance</span><strong>${attendance}%</strong><small>For the study period</small></div><div class="student-stat"><span>Next assessment</span><strong>${upcoming?.subject || '—'}</strong><small>${upcoming ? `${upcoming.date}, ${upcoming.room}-room` : 'Not scheduled'}</small></div></div>
        <section id="studentProfilePanel" class="student-panel student-profile-panel"><div class="student-panel-heading"><div><span class="student-kicker">PERSONAL DATA</span><h3>Student profile</h3></div><span class="profile-status">● Online</span></div><div class="profile-details"><div><span>Student</span><strong>${translatedStudentName}</strong></div><div><span>Login</span><strong>${translatedStudentLogin}</strong></div><div><span>National ID</span><strong>${student.iin || 'Not specified'}</strong></div><div><span>College</span><strong>${student.college || 'Aktobe Construction and Technical College'}</strong></div><div><span>Group</span><strong>${translatedStudentGroup}</strong></div></div></section>
        <div class="student-content-grid"><section id="studentSchedulePanel" class="student-panel schedule-panel"><div class="student-panel-heading"><div><span class="student-kicker">LESSONS</span><h3>Schedule</h3></div><span class="panel-count">${schedule.length} lessons</span></div>${schedule.length ? schedule.map(entry => `<button class="student-lesson" onclick="showStudentLessonInfo(${JSON.stringify(entry).replace(/"/g, '&quot;')})"><span class="lesson-date"><strong>${entry.date.slice(8, 10)}</strong><small>${translateCalendarDay(entry.day, language).slice(0, 3)}</small></span><span class="lesson-main"><strong>${entry.subject}</strong><span>${entry.start}–${entry.end} · ${entry.room}-room</span><small>${translateKazakhName(entry.teacher, language)}</small></span><span class="lesson-arrow">›</span></button>`).join('') : '<div class="student-empty">Schedule is not filled yet.</div>'}</section><section id="studentNoticePanel" class="student-panel notice-panel"><div class="student-panel-heading"><div><span class="student-kicker">NOTICE</span><h3>Important</h3></div></div><div class="notice-item"><span class="notice-icon">!</span><div><strong>Prepare for assessment</strong><p>${upcoming ? `${upcoming.date} ${upcoming.subject} assessment is due.` : 'No new notifications.'}</p></div></div><div class="notice-item"><span class="notice-icon calm">✓</span><div><strong>Profile active</strong><p>Grades and attendance are updated automatically.</p></div></div></section></div>
        <section id="studentAttendancePanel" class="student-panel attendance-panel"><div class="student-panel-heading"><div><span class="student-kicker">ATTENDANCE</span><h3>My attendance</h3></div><strong class="attendance-value">${attendance}%</strong></div><div class="attendance-bar"><span style="width:${attendance}%"></span></div><p>Attendance for the study period. Data updates after the journal is saved.</p></section>
        <section id="studentNextPanel" class="student-panel next-panel"><div class="student-panel-heading"><div><span class="student-kicker">NEXT ASSESSMENT</span><h3>Next assessment</h3></div><span class="next-badge">KB</span></div><div class="next-details"><strong>${upcoming ? upcoming.subject : 'No assessment scheduled'}</strong><span>${upcoming ? `${upcoming.date} · ${upcoming.start}–${upcoming.end} · ${upcoming.room}-room` : 'Schedule will update'}</span><small>${upcoming ? `${translateKazakhName(upcoming.teacher, language)}` : ''}</small></div></section>
        <section id="studentGradesPanel" class="student-panel grades-panel"><div class="student-panel-heading"><div><span class="student-kicker">GRADES</span><h3>My grades</h3></div><span class="average-badge">Average: ${average}</span></div><div class="student-table-wrap"><table class="student-grades"><thead><tr><th>Date</th><th>Subject</th><th>Grade</th><th>Who set</th></tr></thead><tbody>${grades.map(grade => `<tr><td>${grade.date}</td><td><strong>${grade.subject}</strong></td><td><span class="grade-badge ${grade.value >= 90 ? 'excellent' : grade.value >= 70 ? 'good' : 'warning'}">${grade.value}</span></td><td>${translateKazakhName(grade.teacher, language)}</td></tr>`).join('')}</tbody></table></div></section>
        </main>
    </div>`;
    root.innerHTML = translatedStudentDashboard;
    root.querySelector('#studentSchedulePanel h3').textContent = 'Schedule';
    root.querySelector('#studentSchedulePanel .panel-count').textContent = `${schedule.length} ${language === 'en' ? 'lessons' : language === 'ru' ? 'занятий' : 'сабақ'}`;
    root.querySelector('#studentNoticePanel h3').textContent = 'Important';
    translateStudentInterface(root, getLanguage());
    root.querySelector('.student-language-select').value = getLanguage();
}

function openStudentSection(view, button) {
    const dashboard = document.querySelector('.student-dashboard');
    if (!dashboard) return;
    const views = ['home', 'schedule', 'grades', 'attendance', 'practice', 'profile'];
    const nextView = views.includes(view) ? view : 'profile';
    dashboard.dataset.studentView = nextView;
    const session = getAppSession();
    if (session?.type === 'student') saveAppSession({ ...session, view: nextView });
    const activeIndex = { home: 0, schedule: 1, grades: 2, attendance: 3, practice: 4, profile: 5 }[nextView];
    document.querySelectorAll('.student-side-nav button, .student-nav button').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.student-side-nav button')[activeIndex]?.classList.add('active');
    const compactIndex = Math.min(activeIndex, 4);
    document.querySelectorAll('.student-nav button')[compactIndex]?.classList.add('active');
    dashboard.classList.remove('student-view-change');
    void dashboard.offsetWidth;
    dashboard.classList.add('student-view-change');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showAdminLogin() {
    document.getElementById('login').value = 'admin';
    document.getElementById('password').value = 'admin123';
}
function selectLoginRole(role) {
    const credentials = {
        admin: ['admin', 'admin123'],
        teacher: ['kemal', '123456'],
        student: ['201', '201']
    };
    const [loginName, password] = credentials[role] || credentials.teacher;
    document.getElementById('login').value = loginName;
    document.getElementById('password').value = password;
    document.querySelectorAll('.role-quick').forEach(button => {
        const isSelected = button.getAttribute('onclick') === `selectLoginRole('${role}')`;
        button.classList.toggle('active', isSelected);
        const roleColor = isSelected ? '#286be2' : '#f1f3f6';
        button.style.setProperty('background-image', `linear-gradient(${roleColor}, ${roleColor})`, 'important');
        button.style.setProperty('border-color', isSelected ? '#286be2' : '#e2e6ec', 'important');
        button.style.setProperty('color', isSelected ? '#fff' : '#64748b', 'important');
        const icon = button.querySelector('span');
        if (icon) icon.style.setProperty('color', isSelected ? '#fff' : '#64748b', 'important');
    });
}
function togglePasswordVisibility() {
    const password = document.getElementById('password');
    if (!password) return;
    password.type = password.type === 'password' ? 'text' : 'password';
}
async function logout() {
    await signOut(auth).catch(error => {
        console.warn('Logout failed:', error.message);
    });
    currentTeacher = null;
    currentFirebaseUser = null;
    window.currentStudent = null;
    localStorage.removeItem('app_session');
    sessionStorage.clear();
    showScreen('login');

    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.value = '';
    const registrationForm = document.getElementById('studentRegistrationForm');
    if (registrationForm) registrationForm.hidden = true;
}
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id + 'Screen').classList.add('active');
    if (id === 'schedule') {
        const userName = document.getElementById('userName');
        if (userName) userName.textContent = currentTeacher?.displayName || 'Кемал С.';
    }
    if (id === 'schedule') renderSchedule();
    ensureLanguageControls();
    translateStudentInterface(document.body, getLanguage());
}


function adminData(key) {
    const stored = localStorage.getItem(`admin_${key}`);
    if (!stored) return ADMIN_DEFAULTS[key];
    const value = JSON.parse(stored);
    if (key === 'schedule') {
        const normalizedSchedule = value.map(entry => entry.teacher === 'Алдариза Ж.F.' ? { ...entry, teacher: 'Алдариза Ж.Ғ.' } : entry);
        if (JSON.stringify(normalizedSchedule) !== JSON.stringify(value)) saveAdminData('schedule', normalizedSchedule);
        return normalizedSchedule;
    }
    if (key !== 'users') return value;
    const knownLogins = new Set(value.map(user => user.login));
    const mergedUsers = [...value, ...ADMIN_DEFAULTS.users.filter(user => !knownLogins.has(user.login))];
    const normalizedUsers = mergedUsers.map(user => ({
        ...user,
        name: user.login === 'aldariza' ? 'Алдариза Ж.Ғ.' : user.name,
        subject: user.subject || 'КМ03'
    }));
    if (JSON.stringify(normalizedUsers) !== JSON.stringify(value)) localStorage.setItem('admin_users', JSON.stringify(normalizedUsers));
    return normalizedUsers;
}
function saveAdminData(key, value) { localStorage.setItem(`admin_${key}`, JSON.stringify(value)); firebaseSave(key, value); }
function adminAddActivity(text) {
    const activity = adminData('activity');
    activity.unshift({ text, time: new Date().toLocaleString('kk-KZ') });
    saveAdminData('activity', activity.slice(0, 20));
}
function switchAdminView(view) {
    document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.toggle('active', item.dataset.adminView === view));
    renderAdminView(view);
}
function renderAdminView(view) {
    const titles = { overview: 'Оқытушыларға арналған аккаунттарды басқару (Серік Кемал панелі)', content: 'Топтар мен студенттер', schedule: 'Сабақ кестесі', users: 'Пайдаланушылар', settings: 'Баптаулар', activity: 'Әрекеттер журналы' };
    window.adminSubView = '';
    const lang = getLanguage();
    const t = value => translateVisibilityText(value, lang);
    const title = translateVisibilityText(titles[view], lang) || titles[view];
    document.getElementById('adminViewTitle').textContent = title;
    const root = document.getElementById('adminView');
    const users = adminData('users');
    if (view === 'overview') {
        root.innerHTML = `
            <section class="account-page">
                <div class="account-intro">${t('Оқытушыларға логин мен құпия сөзді жүйе әкімшісі (немесе бас оқытушы) өз қолымен тағайындайды және береді.')}</div>
                <div class="admin-toolbar">
                    <div class="toolbar-text">${t('Оқытушылар тізімі')}</div>
                    <button class="primary-btn" onclick="addTeacherUser()">+ ${t('Қосу')}</button>
                </div>
                <div class="account-table-wrap">
                    <table class="account-table">
                        <thead>
                            <tr>
                                <th>${t('Т.И.Ә. / Оқытушы')}</th>
                                <th>${t('Предмет')}</th>
                                <th>${t('Логин')}</th>
                                <th>${t('Құпия сөз')}<br>(${t('Password')})</th>
                                <th>${t('Рөлі')}</th>
                                <th>${t('Мәртебесі')}</th>
                                <th>${t('Әрекет')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map((user, index) => `
                                <tr>
                                    <td><strong>${user.name}</strong></td>
                                    <td>${user.subject || 'Не указан'}</td>
                                    <td>${user.login}</td>
                                    <td>${user.password || 'Teacher2026'}</td>
                                    <td>${t(user.role)}<br><span>(${lang === 'ru' ? 'Специальные дисциплины' : lang === 'en' ? 'Special subjects' : 'Арнайы пәндер'})</span></td>
                                    <td><span class="account-status">${t(user.status)}</span></td>
                                    <td>
                                        <div class="row-actions">
                                            <button class="small-btn edit-btn" onclick="editTeacherUser(${index})">${t('Өңдеу')}</button>
                                            <button class="small-btn delete-btn" onclick="deleteTeacherUser(${index})">${t('Жою')}</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    } else if (view === 'content') {
        const selectedGroup = getSelectedManagedGroup();
        const groupAccounts = getStudentAccounts(selectedGroup);
        root.innerHTML = `<section class="admin-section account-manager">
            <div class="section-heading">
                <div><span class="eyebrow">${t('Топтар мен студенттер')}</span><h2>${t('Топтар мен студенттер')}</h2></div>
            </div>
            <div class="student-management-card">
                <div>
                    <span class="eyebrow">${adminGroupLabel(selectedGroup, lang)}</span>
                    <h3>${t('Студенттерді басқару')}</h3>
                </div>
                <div class="row-actions"><button class="primary-btn" onclick="showStudentAddPage()">${t('Студент қосу')}</button><button class="small-btn edit-btn" onclick="editGroup('${selectedGroup}')">${t('Өңдеу')}</button><button class="small-btn delete-btn" onclick="removeGroup('${selectedGroup}')">${t('Жою')}</button></div>
            </div>
            <div class="manager-toolbar">
                <label>${t('Топты таңдау')}<select id="managedGroup" onchange="currentManagedGroup = this.value; renderAdminView('content')">${Object.keys(APP_DATA.students).map(group => `<option value="${group}" ${group === selectedGroup ? 'selected' : ''}>${adminGroupLabel(group, lang)}</option>`).join('')}</select></label>
                <label>${t('Аббревиатура')}<select id="newGroupSpecialty">${SPECIALTY_OPTIONS.map(option => `<option value="${option}">${option}</option>`).join('')}</select></label>
                <label id="customGroupNameField">${t('Жаңа топ атауы')}<input id="newGroupCustomName" placeholder="Мысалы: 204 немесе ТС" required></label>
                <button class="primary-btn" onclick="addGroupFromPanel()">+ ${t('Топ қосу')}</button>
            </div>
            <div class="table-wrap"><table class="admin-table student-manager-table"><thead><tr><th>№</th><th>${t('Студенттің аты-жөні')}</th><th>${t('Логин')}</th><th>${t('Құпия сөз')}</th><th>${t('Қолжетімділік')}</th><th>${t('Әрекет')}</th></tr></thead><tbody>${groupAccounts.map((student, index) => `<tr><td>${index + 1}</td><td><strong>${translateKazakhName(student.name, lang)}</strong></td><td>${student.login}</td><td>${student.password}</td><td>${t('Студент')}</td><td><div class="row-actions"><button class="small-btn edit-btn" onclick="editStudentAccount('${selectedGroup}', ${index})">${t('Өңдеу')}</button><button class="small-btn delete-btn" onclick="deleteStudentAccount('${selectedGroup}', ${index})">${t('Жою')}</button></div></td></tr>`).join('')}</tbody></table></div>
        </section>`;
    } else if (view === 'schedule') {
        renderScheduleAdmin(root);
    } else if (view === 'users') {
        root.innerHTML = `<section class="admin-section"><div class="section-heading"><div><span class="eyebrow">${t('ҚОЛ ЖЕТІМДІЛІК')}</span><h2>${t('Пайдаланушылар')}</h2></div><button class="primary-btn" onclick="addUser()">+ ${t('Пайдаланушы қосу')}</button></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>${t('Аты')}</th><th>${t('Логин')}</th><th>${t('Рөлі')}</th><th>${t('Мәртебесі')}</th><th></th></tr></thead><tbody>${users.map((user, index) => `<tr><td><strong>${user.name}</strong></td><td>${user.login}</td><td>${t(user.role)}</td><td><span class="status-pill">${t(user.status)}</span></td><td><button class="delete-btn" onclick="removeUser(${index})">${t('Жою')}</button></td></tr>`).join('')}</tbody></table></div></section>`;
    } else if (view === 'settings') {
        const settings = adminData('settings');
        root.innerHTML = `<section class="admin-section settings-section"><div class="section-heading"><div><span class="eyebrow">${t('ЖҮЙЕ')}</span><h2>${t('Баптаулар')}</h2></div></div><label>${t('Оқу орнының атауы')}<input id="schoolName" value="${settings.school}"></label><label>${t('Интерфейс тілі')}<select id="language"><option ${settings.language === 'Қазақша' ? 'selected' : ''}>Қазақша</option><option ${settings.language === 'Русский' ? 'selected' : ''}>Русский</option><option ${settings.language === 'English' ? 'selected' : ''}>English</option></select></label><label class="toggle-label"><input type="checkbox" id="notifications" ${settings.notifications ? 'checked' : ''}> ${t('Баға сақталған кезде хабарлама көрсету')}</label><button class="primary-btn" onclick="saveSettings()">${t('Баптауларды сақтау')}</button></section>`;
    } else {
        root.innerHTML = `<section class="admin-section"><div class="section-heading"><div><span class="eyebrow">${t('AUDIT TRAIL')}</span><h2>${t('Әрекеттер журналы')}</h2></div><button class="text-btn" onclick="clearActivity()">${t('Тазалау')}</button></div>${renderActivity(20)}</section>`;
    }
}

function renderScheduleAdmin(root) {
    const entries = adminData('schedule').slice().sort((first, second) => `${first.date} ${first.start}`.localeCompare(`${second.date} ${second.start}`));
    const users = adminData('users');
    const editingId = window.scheduleEditingId || '';
    const editing = entries.find(entry => String(entry.id) === String(editingId));
    const language = getLanguage();
    const dayOptions = ['Дүйсенбі', 'Сейсенбі', 'Сәрсенбі', 'Бейсенбі', 'Жұма', 'Сенбі', 'Жексенбі'];
    const translatedDayOptions = dayOptions.map(day => translateCalendarDay(day, language));
    const groupOptions = Object.keys(APP_DATA.students).map(group => `<option value="${group}" ${editing?.group === group ? 'selected' : ''}>${adminGroupLabel(group, language)}</option>`).join('');
    const teacherOptions = users.map(user => `<option value="${user.name}" ${editing?.teacher === user.name ? 'selected' : ''}>${user.name}</option>`).join('');
    const daySelectOptions = dayOptions.map(day => `<option value="${day}" ${editing?.day === day ? 'selected' : ''}>${translateCalendarDay(day, language)}</option>`).join('');

    root.innerHTML = `<section class="admin-section schedule-manager">
        <div class="section-heading"><div><span class="eyebrow">${translateVisibilityText('САБАҚ КЕСТЕСІ', language)}</span><h2>${editing ? translateVisibilityText('Сабақты редакциялау', language) : translateVisibilityText('Сабақ қосу', language)}</h2></div></div>
        <form class="schedule-form" onsubmit="event.preventDefault(); saveScheduleEntry(event);">
            <input type="hidden" id="scheduleId" value="${editing?.id || ''}">
            <label>${translateVisibilityText('Топ', language)}<select id="scheduleGroup" required>${groupOptions}</select></label>
            <label>${translateVisibilityText('Күн аптасы', language)}<select id="scheduleDay" required>${daySelectOptions}</select></label>
            <label>${translateVisibilityText('Күні', language)}<input id="scheduleDate" type="date" value="${editing?.date || ''}" required></label>
            <label>${translateVisibilityText('Басталуы', language)}<input id="scheduleStart" type="time" value="${editing?.start || '08:00'}" required></label>
            <label>${translateVisibilityText('Аяқталуы', language)}<input id="scheduleEnd" type="time" value="${editing?.end || '09:30'}" required></label>
            <label>${translateVisibilityText('Пән', language)}<input id="scheduleSubject" value="${editing?.subject || ''}" placeholder="КМ03" required></label>
            <label>${translateVisibilityText('Оқытушы', language)}<select id="scheduleTeacher" required>${teacherOptions}</select></label>
                <label>${translateVisibilityText('Кабинет', language)}<input id="scheduleRoom" value="${editing?.room || ''}" placeholder="205" required></label>
            <div class="schedule-form-actions"><button class="primary-btn" type="submit">${editing ? translateVisibilityText('Сақтау', language) : translateVisibilityText('Сабақты қосу', language)}</button>${editing ? `<button class="secondary-btn" type="button" onclick="cancelScheduleEdit()">${translateVisibilityText('Болдырмау', language)}</button><button class="delete-btn" type="button" onclick="deleteScheduleEntry('${editing.id}')">${translateVisibilityText('Сабақты жою', language)}</button>` : ''}</div>
        </form>
        <div class="schedule-table-wrap"><table class="admin-table schedule-admin-table"><thead><tr><th>${translateVisibilityText('Топ', language)}</th><th>${translateVisibilityText('Күн', language)}</th><th>${translateVisibilityText('Күні', language)}</th><th>${translateVisibilityText('Уақыты', language)}</th><th>${translateVisibilityText('Пән', language)}</th><th>${translateVisibilityText('Оқытушы', language)}</th><th>${translateVisibilityText('Кабинет', language)}</th><th>${translateVisibilityText('Әрекет', language)}</th></tr></thead><tbody>${entries.length ? entries.map(entry => `<tr><td>${adminGroupLabel(entry.group, language)}</td><td>${translateCalendarDay(entry.day, language)}</td><td>${entry.date}</td><td>${entry.start}–${entry.end}</td><td><strong>${entry.subject}</strong></td><td>${translateKazakhName(entry.teacher, language)}</td><td>${entry.room}</td><td><div class="row-actions"><button class="small-btn edit-btn" onclick="editScheduleEntry('${entry.id}')">${translateVisibilityText('Өңдеу', language)}</button><button class="small-btn delete-btn" onclick="deleteScheduleEntry('${entry.id}')">${translateVisibilityText('Жою', language)}</button></div></td></tr>`).join('') : `<tr><td colspan="8" class="empty-schedule">${translateVisibilityText('Әзірге сабақтар қосылмаған', language)}</td></tr>`}</tbody></table></div>
    </section>`;
}

function saveScheduleEntry(event) {
    const form = event.target;
    const entry = {
        id: document.getElementById('scheduleId').value || String(Date.now()),
        group: document.getElementById('scheduleGroup').value,
        day: document.getElementById('scheduleDay').value,
        date: document.getElementById('scheduleDate').value,
        start: document.getElementById('scheduleStart').value,
        end: document.getElementById('scheduleEnd').value,
        subject: document.getElementById('scheduleSubject').value.trim(),
        teacher: document.getElementById('scheduleTeacher').value,
        room: document.getElementById('scheduleRoom').value.trim()
    };
    if (entry.start >= entry.end) {
        alert(adminText('Аяқталу уақыты басталу уақытынан кейін болуы керек.'));
        return;
    }
    const entries = adminData('schedule');
    const existingIndex = entries.findIndex(item => String(item.id) === String(entry.id));
    if (existingIndex >= 0) entries[existingIndex] = entry;
    else entries.push(entry);
    saveAdminData('schedule', entries);
    adminAddActivity(`${entry.group} тобының сабақ кестесі жаңартылды`);
    window.scheduleEditingId = '';
    renderScheduleAdmin(document.getElementById('adminView'));
    form.reset();
}

function editScheduleEntry(id) {
    window.scheduleEditingId = id;
    renderAdminView('schedule');
}

function cancelScheduleEdit() {
    window.scheduleEditingId = '';
    renderAdminView('schedule');
}

function deleteScheduleEntry(id) {
    const entries = adminData('schedule');
    const entry = entries.find(item => String(item.id) === String(id));
    if (!entry || !confirm(getLanguage() === 'ru' ? `Удалить занятие группы ${entry.group}?` : getLanguage() === 'en' ? `Delete the lesson for group ${entry.group}?` : `${entry.group} тобындағы сабақты жою керек пе?`)) return;
    saveAdminData('schedule', entries.filter(item => String(item.id) !== String(id)));
    adminAddActivity(`${entry.group} тобының сабағы жойылды`);
    renderAdminView('schedule');
}

function showStudentAddPage() {
    const group = getSelectedManagedGroup();
    const groupAccounts = getStudentAccounts(group);
    const language = getLanguage();
    const t = value => adminText(value, language);
    window.adminSubView = 'student-add';
    const root = document.getElementById('adminView');
    root.innerHTML = `<section class="admin-section add-student-page">
        <div class="section-heading">
            <div><span class="eyebrow">${t('Студент Қосу Беті')}</span><h2>${t('Студент Қосу Беті')}</h2></div>
        </div>
        <div class="success-banner">${t('Басылды! Келесі бетке өту сәтті орындалды')}</div>
        <div class="group-summary-box">
            <strong>${adminGroupLabel(group, language)}</strong>
            <span>${t('Жалпы студент саны:')} ${groupAccounts.length}</span>
        </div>
        <div class="add-student-form-wrap">
            <form class="student-add-form" onsubmit="event.preventDefault(); addStudentFromPanel(event);">
                <input id="studentAddName" placeholder="${t('Студенттің аты-жөні')}" required>
                <input id="studentAddLogin" placeholder="${t('Логин')}" required>
                <input id="studentAddPassword" placeholder="${t('Құпия сөз')}" required>
                <button class="primary-btn" type="submit">${t('Студентті сақтау')}</button>
            </form>
        </div>
        <div class="page-actions">
            <button class="secondary-btn" onclick="renderAdminView('content')">${t('Артқа')}</button>
        </div>
    </section>`;
}
function translateAdminActivity(text, language = getLanguage()) {
    if (!text || language === 'kk') return text;
    const scheduleUpdated = text.match(/^(\d+) тобының сабақ кестесі жаңартылды$/);
    if (scheduleUpdated) return language === 'ru' ? `Расписание занятий группы ${scheduleUpdated[1]} обновлено` : `Class schedule for group ${scheduleUpdated[1]} updated`;
    const lessonRemoved = text.match(/^(\d+) тобының сабағы жойылды$/);
    if (lessonRemoved) return language === 'ru' ? `Занятие группы ${lessonRemoved[1]} удалено` : `Lesson for group ${lessonRemoved[1]} deleted`;
    const groupAdded = text.match(/^(\d+) тобы қосылды$/);
    if (groupAdded) return language === 'ru' ? `Группа ${groupAdded[1]} добавлена` : `Group ${groupAdded[1]} added`;
    const studentAdded = text.match(/^(\d+) тобына (.+) қосылды$/);
    if (studentAdded) return language === 'ru' ? `Студент ${studentAdded[2]} добавлен в группу ${studentAdded[1]}` : `Student ${studentAdded[2]} added to group ${studentAdded[1]}`;
    const teacherAdded = text.match(/^(.+) оқытушысы қосылды$/);
    if (teacherAdded) return language === 'ru' ? `Преподаватель ${teacherAdded[1]} добавлен` : `Teacher ${teacherAdded[1]} added`;
    const teacherUpdated = text.match(/^(.+) оқытушысының мәліметі жаңартылды$/);
    if (teacherUpdated) return language === 'ru' ? `Данные преподавателя ${teacherUpdated[1]} обновлены` : `Teacher ${teacherUpdated[1]} updated`;
    const teacherRemoved = text.match(/^(.+) оқытушысы жойылды$/);
    if (teacherRemoved) return language === 'ru' ? `Преподаватель ${teacherRemoved[1]} удалён` : `Teacher ${teacherRemoved[1]} deleted`;
    const userAdded = text.match(/^(.+) пайдаланушысы қосылды$/);
    if (userAdded) return language === 'ru' ? `Пользователь ${userAdded[1]} добавлен` : `User ${userAdded[1]} added`;
    const groupRemoved = text.match(/^(.+) тобы жойылды$/);
    if (groupRemoved) return language === 'ru' ? `Группа ${groupRemoved[1]} удалена` : `Group ${groupRemoved[1]} deleted`;
    const userRemoved = text.match(/^(.+) жойылды$/);
    if (userRemoved) return language === 'ru' ? `${userRemoved[1]} удалён` : `${userRemoved[1]} deleted`;
    if (text === 'Жүйе баптаулары жаңартылды') return translateText(text, language);
    return translateText(text, language);
}
function renderActivity(limit) {
    const language = getLanguage();
    return `<div class="activity-list">${adminData('activity').slice(0, limit).map(item => `<div class="activity-item"><span class="activity-dot"></span><div><strong>${translateAdminActivity(item.text, language)}</strong><small>${translateText(item.time, language)}</small></div></div>`).join('')}</div>`;
}
function saveStudents() { localStorage.setItem('admin_students', JSON.stringify(APP_DATA.students)); firebaseSave('students', APP_DATA.students); }
function cleanupRemovedGroups() {
    const removedGroups = new Set(['302', '303', '401']);
    const forbiddenGroupVariants = new Set([
        '201ис', '202рпо', '202исис', 'исрпо', '202is',
        '201 ИС', '202 РПО', '202ИС ИС', 'ИС РПО', '202 IS',
        '201ИС', '202РПО', '202ИСИС', 'ИСРПО', '202IS'
    ]);
    const groupAliases = ['301 РПО', '301 РПО РПО'];
    const storedStudents = JSON.parse(localStorage.getItem('admin_students') || 'null');
    const students = storedStudents && typeof storedStudents === 'object' ? storedStudents : APP_DATA.students;
    let studentsChanged = false;

    Object.keys(students).forEach(group => {
        const normalized = String(group).trim().toLowerCase().replace(/[\s_\-]+/g, '');
        if (removedGroups.has(String(group)) || forbiddenGroupVariants.has(String(group).trim()) || forbiddenGroupVariants.has(normalized)) {
            delete students[group];
            studentsChanged = true;
        }
    });

    groupAliases.forEach(alias => {
        if (Object.prototype.hasOwnProperty.call(students, alias)) {
            if (!students['301']) students['301'] = students[alias];
            delete students[alias];
            studentsChanged = true;
        }
    });
    if (studentsChanged || storedStudents) {
        APP_DATA.students = students;
        saveStudents();
    }

    const storedAccounts = JSON.parse(localStorage.getItem('student_accounts') || '{}');
    let accountsChanged = false;
    Object.keys(storedAccounts).forEach(group => {
        const normalized = String(group).trim().toLowerCase().replace(/[\s_\-]+/g, '');
        if (removedGroups.has(String(group)) || forbiddenGroupVariants.has(String(group).trim()) || forbiddenGroupVariants.has(normalized)) {
            delete storedAccounts[group];
            accountsChanged = true;
        }
    });
    groupAliases.forEach(alias => {
        if (Object.prototype.hasOwnProperty.call(storedAccounts, alias)) {
            if (!storedAccounts['301']) storedAccounts['301'] = storedAccounts[alias];
            delete storedAccounts[alias];
            accountsChanged = true;
        }
    });
    if (accountsChanged) {
        localStorage.setItem('student_accounts', JSON.stringify(storedAccounts));
        firebaseSave('student_accounts', storedAccounts);
    }

    const storedSchedule = JSON.parse(localStorage.getItem('admin_schedule') || 'null');
    if (Array.isArray(storedSchedule)) {
        const cleanedSchedule = storedSchedule
            .filter(entry => !removedGroups.has(String(entry.group)) && !forbiddenGroupVariants.has(String(entry.group).trim()) && !forbiddenGroupVariants.has(String(entry.group).trim().toLowerCase().replace(/[\s_\-]+/g, '')))
            .map(entry => groupAliases.includes(String(entry.group)) ? { ...entry, group: '301' } : entry);
        if (JSON.stringify(cleanedSchedule) !== JSON.stringify(storedSchedule)) saveAdminData('schedule', cleanedSchedule);
    }
    currentManagedGroup = APP_DATA.students[currentManagedGroup] ? currentManagedGroup : Object.keys(APP_DATA.students)[0] || '';
}
function addGroup() { const group = prompt(adminText('Жаңа топ нөмірі:')); if (!group || APP_DATA.students[group]) return; const specialty = normalizeSpecialty(prompt(adminText('Аббревиатура (РПО, ИС, ТМ):'), 'РПО')); APP_DATA.students[group] = []; saveGroupSpecialty(group, specialty); saveStudents(); adminAddActivity(`${group} тобы қосылды`); renderAdminView('content'); }
function addGroupFromPanel() {
    const group = document.getElementById('newGroupCustomName')?.value.trim();
    const specialty = document.getElementById('newGroupSpecialty')?.value || SPECIALTY_OPTIONS[0];
    if (group && !APP_DATA.students[group]) {
        APP_DATA.students[group] = [];
        saveGroupSpecialty(group, specialty);
        saveStudentAccounts(group, []);
        saveStudents();
        adminAddActivity(`${group} тобы қосылды`);
        renderAdminView('content');
    }
}

function toggleCustomGroupName(value) {
    const field = document.getElementById('customGroupNameField');
    const input = document.getElementById('newGroupCustomName');
    if (field) field.hidden = false;
    if (input) input.required = true;
}
function addStudentFromPanel(event) {
    event.preventDefault();
    const group = getSelectedManagedGroup();
    const name = document.getElementById('newStudentName')?.value.trim() || document.getElementById('studentAddName')?.value.trim();
    const loginName = document.getElementById('newStudentLogin')?.value || document.getElementById('studentAddLogin')?.value || '';
    const password = document.getElementById('newStudentPassword')?.value || document.getElementById('studentAddPassword')?.value || '';
    if (!name || !loginName.trim() || !password.trim()) return;
    if (!APP_DATA.students[group]) APP_DATA.students[group] = [];
    const existingAccounts = getStudentAccounts(group);
    if (!existingAccounts.some(account => account && account.name === name && account.login === loginName)) {
        APP_DATA.students[group].push(name);
    }

    const accounts = getStudentAccounts(group);
    const exists = accounts.some(account => account && account.name === name && account.login === loginName);
    if (!exists) {
        accounts.push({ name, login: loginName, password });
    }
    saveStudentAccounts(group, accounts);
    saveStudents();
    adminAddActivity(`${group} тобына ${name} қосылды`);
    renderAdminView('content');
}
function editGroup(group) {
    if (!APP_DATA.students[group]) return;
    const nextGroup = prompt(adminText('Жаңа топ нөмірі:'), group);
    if (nextGroup === null) return;
    const normalizedGroup = nextGroup.trim();
    if (!normalizedGroup || normalizedGroup === group) return;
    if (APP_DATA.students[normalizedGroup]) {
        alert(adminText('Бұл топ бұрыннан бар.'));
        return;
    }

    const specialty = prompt(adminText('Аббревиатура (РПО, ИС, ТМ):'), getGroupSpecialty(group));
    if (specialty === null) return;
    const normalizedSpecialty = normalizeSpecialty(specialty, getGroupSpecialty(group));
    APP_DATA.students[normalizedGroup] = APP_DATA.students[group];
    delete APP_DATA.students[group];
    const specialties = getGroupSpecialties();
    delete specialties[group];
    specialties[normalizedGroup] = normalizedSpecialty;
    localStorage.setItem('group_specialties', JSON.stringify(specialties));
    firebaseSave('group_specialties', specialties);
    const storedAccounts = JSON.parse(localStorage.getItem('student_accounts') || '{}');
    if (storedAccounts[group]) {
        storedAccounts[normalizedGroup] = storedAccounts[group];
        delete storedAccounts[group];
        localStorage.setItem('student_accounts', JSON.stringify(storedAccounts));
        firebaseSave('student_accounts', storedAccounts);
    }
    const schedule = adminData('schedule').map(entry => entry.group === group ? { ...entry, group: normalizedGroup } : entry);
    saveAdminData('schedule', schedule);
    currentManagedGroup = normalizedGroup;
    saveStudents();
    adminAddActivity(`${group} тобы ${normalizedGroup} болып өзгертілді`);
    renderAdminView('content');
}

function removeGroup(group) {
    const language = getLanguage();
    const groups = Object.keys(APP_DATA.students);
    if (groups.length <= 1) {
        alert(adminText('Кем дегенде бір топ қалуы керек.'));
        return;
    }
    if (!confirm(language === 'ru' ? `Удалить группу ${group} и её занятия?` : language === 'en' ? `Delete group ${group} and its lessons?` : `${group} тобын және оның сабақтарын жою керек пе?`)) return;
    delete APP_DATA.students[group];
    const specialties = getGroupSpecialties();
    delete specialties[group];
    localStorage.setItem('group_specialties', JSON.stringify(specialties));
    firebaseSave('group_specialties', specialties);
    const storedAccounts = JSON.parse(localStorage.getItem('student_accounts') || '{}');
    delete storedAccounts[group];
    localStorage.setItem('student_accounts', JSON.stringify(storedAccounts));
    firebaseSave('student_accounts', storedAccounts);
    saveAdminData('schedule', adminData('schedule').filter(entry => entry.group !== group));
    currentManagedGroup = Object.keys(APP_DATA.students)[0] || '';
    saveStudents();
    adminAddActivity(`${group} тобы жойылды`);
    renderAdminView('content');
}

function editStudentAccount(group, index) {
    const accounts = getStudentAccounts(group);
    const current = accounts[index];
    if (!current) return;
    const name = prompt(adminText('Студенттің аты-жөні:'), current.name);
    if (name === null) return;
    const login = prompt(adminText('Логин:'), current.login);
    if (login === null) return;
    const password = prompt(adminText('Құпиясөз:'), current.password);
    if (password === null) return;
    const normalizedName = name.trim();
    const enteredLogin = login;
    const enteredPassword = password;
    if (!normalizedName || !enteredLogin.trim() || !enteredPassword.trim()) return;
    if (accounts.some((account, accountIndex) => accountIndex !== index && account.login === enteredLogin)) {
        alert(adminText('Бұл логин бұрыннан бар.'));
        return;
    }

    const studentIndex = APP_DATA.students[group]?.indexOf(current.name);
    accounts[index] = { ...current, name: normalizedName, login: enteredLogin, password: enteredPassword };
    if (studentIndex >= 0) APP_DATA.students[group][studentIndex] = normalizedName;
    saveStudentAccounts(group, accounts);
    saveStudents();
    adminAddActivity(`${normalizedName} студентінің мәліметі жаңартылды`);
    renderAdminView('content');
}

function deleteStudentAccount(group, index) {
    const accounts = getStudentAccounts(group);
    const removed = accounts[index];
    if (!removed) return;
    const language = getLanguage();
    if (!confirm(language === 'ru' ? `Удалить студента ${removed.name}?` : language === 'en' ? `Delete student ${removed.name}?` : `${removed.name} студентін жою керек пе?`)) return;
    accounts.splice(index, 1);
    const studentIndex = APP_DATA.students[group]?.indexOf(removed.name);
    if (studentIndex >= 0) APP_DATA.students[group].splice(studentIndex, 1);
    saveStudentAccounts(group, accounts);
    saveStudents();
    adminAddActivity(`${removed.name} студенті жойылды`);
    renderAdminView('content');
}

function manageStudents(group) { const student = prompt(getLanguage() === 'ru' ? `Добавить студента в группу ${group}:` : getLanguage() === 'en' ? `Add a student to group ${group}:` : `${group} тобына студент қосу:`); if (student) { APP_DATA.students[group].push(student); saveStudents(); adminAddActivity(`${group} тобына ${student} қосылды`); renderAdminView('content'); } }
function addNewStudent() { const student = prompt(adminText('Студент аты:')); if (student && currentGroup) { APP_DATA.students[currentGroup].push(student); saveStudents(); loadStudentsTable(); } }
    async function seedDatabase() {
        const seed = {
            students: APP_DATA.students,
            users: ADMIN_DEFAULTS.users,
            settings: ADMIN_DEFAULTS.settings,
                activity: ADMIN_DEFAULTS.activity,
                schedule: ADMIN_DEFAULTS.schedule
        };
        await Promise.all(Object.entries(seed).map(async ([collection, value]) => {
            const existing = await firebaseLoad(collection);
            if (!existing) await firebaseSave(collection, value);
        }));
    }
function filterStudents() { const query = document.getElementById('studentSearch').value.toLowerCase(); document.querySelectorAll('#studentsTable tr').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); }); }
function addTeacherUser() {
    const name = prompt(adminText('Оқытушының аты-жөні:'));
    if (!name) return;
    const login = prompt(adminText('Логин:'));
    if (!login) return;
    const password = prompt(adminText('Құпиясөз:'));
    if (!password) return;
    const subject = prompt(adminText('Предмет (например, КМ03):'));
    if (subject === null) return;
    const role = prompt(adminText('Рөлі:'), 'Мұғалім') || 'Мұғалім';
    const status = prompt(adminText('Мәртебесі:'), 'Белсенді') || 'Белсенді';

    const users = adminData('users');
    users.push({ name, login, password, subject: subject.trim() || 'Не указан', role, status });
    saveAdminData('users', users);
    adminAddActivity(`${name} оқытушысы қосылды`);
    renderAdminView('overview');
}

function editTeacherUser(index) {
    const users = adminData('users');
    const current = users[index];
    if (!current) return;

    const name = prompt(adminText('Оқытушының аты-жөні:'), current.name);
    if (name === null) return;
    const login = prompt(adminText('Логин:'), current.login);
    if (login === null) return;
    const password = prompt(adminText('Құпиясөз:'), current.password);
    if (password === null) return;
    const subject = prompt(adminText('Предмет:'), current.subject || '');
    if (subject === null) return;
    const role = prompt(adminText('Рөлі:'), current.role || 'Мұғалім');
    if (role === null) return;
    const status = prompt(adminText('Мәртебесі:'), current.status || 'Белсенді');
    if (status === null) return;

    users[index] = { ...current, name, login, password, subject: subject.trim() || 'Не указан', role, status };
    saveAdminData('users', users);
    if (current.name !== name) {
        saveAdminData('schedule', adminData('schedule').map(entry => entry.teacher === current.name ? { ...entry, teacher: name } : entry));
    }
    adminAddActivity(`${name} оқытушысының мәліметі жаңартылды`);
    renderAdminView('overview');
}

function deleteTeacherUser(index) {
    const users = adminData('users');
    if (users.length <= 1) {
        alert(adminText('Кем дегенде бір оқытушы қалуы керек.'));
        return;
    }
    const removed = users[index];
    if (!removed) return;
    if (adminData('schedule').some(entry => entry.teacher === removed.name)) {
        alert(adminText('Алдымен осы оқытушыға бекітілген сабақтарды басқа оқытушыға ауыстырыңыз.'));
        return;
    }
    const language = getLanguage();
    if (!confirm(language === 'ru' ? `Удалить преподавателя ${removed.name}?` : language === 'en' ? `Delete teacher ${removed.name}?` : `${removed.name} оқытушысын жою керек пе?`)) return;
    users.splice(index, 1);
    saveAdminData('users', users);
    adminAddActivity(`${removed.name} оқытушысы жойылды`);
    renderAdminView('overview');
}

function addUser() { const name = prompt(getLanguage() === 'ru' ? 'Имя пользователя:' : getLanguage() === 'en' ? 'User name:' : 'Пайдаланушы аты:'); const loginName = name && prompt(adminText('Логин:')); if (name && loginName) { const users = adminData('users'); users.push({ name, login: loginName, role: 'Мұғалім', status: 'Белсенді' }); saveAdminData('users', users); adminAddActivity(`${name} пайдаланушысы қосылды`); renderAdminView('users'); } }
function removeUser(index) { const users = adminData('users'); const language = getLanguage(); if (users.length > 1 && confirm(language === 'ru' ? 'Удалить пользователя?' : language === 'en' ? 'Delete this user?' : 'Пайдаланушыны жою керек пе?')) { const removed = users.splice(index, 1)[0]; saveAdminData('users', users); adminAddActivity(`${removed.name} жойылды`); renderAdminView('users'); } }
function saveSettings() { saveAdminData('settings', { school: document.getElementById('schoolName').value, language: document.getElementById('language').value, notifications: document.getElementById('notifications').checked }); adminAddActivity('Жүйе баптаулары жаңартылды'); alert(adminText('Баптаулар сақталды')); }
function clearActivity() { saveAdminData('activity', []); renderAdminView('activity'); }

// --- УАҚЫТТЫ БАСҚАРУ ---
function isCurrentLesson(dayIndex, startTimeStr, endTimeStr, lessonDate = '') {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const getMinutes = (timeStr) => {
        const [h, m] = timeStr.trim().split(':').map(Number);
        return h * 60 + m;
    };

    return (!lessonDate || lessonDate === today) && (currentDay === dayIndex + 1) && (currentTime >= getMinutes(startTimeStr) && currentTime < getMinutes(endTimeStr));
}

function currentLessonLabel(language = getLanguage()) {
    return language === 'ru' ? 'Сейчас' : language === 'en' ? 'Now' : 'Қазір';
}

function renderSchedule() {
    const grid = document.getElementById('scheduleGrid');
    const dashboard = document.getElementById('teacherDashboard');
    if (dashboard) {
        renderTeacherDashboard(dashboard);
        return;
    }
    const language = getLanguage();
    const teacherEntries = currentTeacher ? adminData('schedule').filter(entry => entry.teacher === currentTeacher.name) : adminData('schedule');

    const T1 = { 1: "08:00-09:30", 2: "09:40-11:10", 3: "11:25-12:55", 4: "13:00-14:30" };
    const T2 = { 1: "13:00-14:30", 2: "15:40-16:10", 3: "16:25-17:55", 4: "18:00-19:30" };
    const days = ['Дүйсенбі','Сейсенбі','Сәрсенбі','Бейсенбі','Жұма'];
    const translatedDays = days.map(day => translateCalendarDay(day, language));
    const dayHeaderText = language === 'ru' ? 'Группа / День' : language === 'en' ? 'Group / Day' : 'Топ / Күн';

    grid.innerHTML = `<div class="day-header">${dayHeaderText}</div>` + translatedDays.map(d => `<div class="day-header">${d}</div>`).join('');

    const scheduleConfig = [
        { name: '201', subject: 'КМ03', lessons: [T1[2], T1[1], T1[1], T1[1], T1[2]] },
        { name: '203', subject: 'КМ03', lessons: [T1[3], T1[4], T1[1], T1[2], T1[3]] },
        // 301 тобы үшін КМ06 және КМ07 кезектесіп келеді (мысалы ретінде):
        { name: '301', subject: 'КМ06/07', lessons: [T2[3], T2[4], T2[1], T2[2], T2[4]] }
    ];
    Object.keys(APP_DATA.students).forEach(group => {
        if (!scheduleConfig.some(item => item.name === group)) {
            scheduleConfig.push({ name: group, subject: '', lessons: ['', '', '', '', ''] });
        }
    });
    const visibleScheduleConfig = currentTeacher?.login === 'aldariza'
        ? scheduleConfig.filter(group => ['201', '203'].includes(group.name))
        : scheduleConfig;
    const allSchedule = adminData('schedule');
    const savedSchedule = currentTeacher
        ? allSchedule.filter(entry => entry.teacher === currentTeacher.name)
        : allSchedule;

    visibleScheduleConfig.forEach(g => {
        grid.innerHTML += `<div class="group-label">${adminGroupLabel(g.name, language)}</div>`;
        const customEntries = savedSchedule.filter(entry => entry.group === g.name);
        const dayCounts = translatedDays.map(day => customEntries.filter(entry => translateCalendarDay(entry.day, language) === day).length);
        const maxEntryCount = Math.max(...dayCounts, 0);

        translatedDays.forEach((day, idx) => {
            const dayEntries = customEntries.filter(entry => translateCalendarDay(entry.day, language) === day);
            if (dayEntries.length) {
                const lessonCount = dayEntries.length;
                const sizeClass = lessonCount >= 4 ? 'compact-day' : lessonCount === 3 ? 'medium-day' : '';
                const entrySizeClass = lessonCount >= 4 ? 'compact-entry' : lessonCount === 3 ? 'medium-entry' : '';
                const renderScheduleItem = (entry, isExtra = false) => {
                    const time = `${entry.start}-${entry.end}`;
                    const translatedTeacher = translateKazakhName(entry.teacher, language);
                    const translatedRoom = entry.room === '—' ? '—' : entry.room;
                    return `<div class="schedule-item${isExtra ? ' extra-item' : ''}" onclick="showLessonInfo(${JSON.stringify(entry).replace(/"/g, '&quot;')})"><div class="card-title">${entry.subject}</div><div class="card-time">${time}</div><div class="card-info">${translatedTeacher} | room ${translatedRoom}</div><div class="card-date">${entry.date || ''}</div><a href="#" class="more-link" onclick="event.stopPropagation(); return false;">${translateMoreLabel(language)}</a></div>`;
                };

                if (dayEntries.length === 2) {
                    const extraMarkup = dayEntries.slice(1).map(entry => renderScheduleItem(entry, true)).join('');
                    const extraCount = dayEntries.length - 1;
                    const extraButtonText = language === 'ru' ? `+${extraCount} пара` : language === 'en' ? `+${extraCount} pair${extraCount === 1 ? '' : 's'}` : `+${extraCount} пара`;
                    grid.innerHTML += `<div class="lesson schedule-day-cell ${sizeClass}"><div class="schedule-card has-multiple"><button type="button" class="multi-toggle-btn" data-count="${extraCount}" onclick="toggleCard(this)">${extraButtonText} <span class="arrow">▼</span></button>${renderScheduleItem(dayEntries[0])}<div class="extra-items-wrap is-hidden">${extraMarkup}</div></div></div>`;
                    return;
                }

                const entriesMarkup = dayEntries.map((entry, entryIndex) => {
                    const time = `${entry.start}-${entry.end}`;
                    const translatedTeacher = translateKazakhName(entry.teacher, language);
                    const translatedRoom = entry.room === '—' ? '—' : entry.room;
                    const isActive = isCurrentLesson(idx, entry.start, entry.end, entry.date);
                    const activeClass = isActive ? 'active-lesson' : '';
                    const currentLabel = isActive ? `<span class="current-lesson-label">${currentLessonLabel(language)}</span>` : '';
                    const moreText = translateMoreLabel(language);

                    if (entrySizeClass) {
                        return `<div class="schedule-entry ${activeClass} ${entrySizeClass}" onclick="showLessonInfo(${JSON.stringify(entry).replace(/"/g, '&quot;')})"><span class="pair-index">${entryIndex + 1} пар</span><span class="pair-time">${time}</span></div>`;
                    }

                    return `<div class="schedule-entry ${activeClass} ${entrySizeClass}" onclick="showLessonInfo(${JSON.stringify(entry).replace(/"/g, '&quot;')})">${currentLabel}<strong>${entry.subject}</strong><small>${time}</small><small>${translatedTeacher} | room ${translatedRoom}</small><small>${entry.date}</small><span class="lesson-click-hint">${moreText}</span></div>`;
                }).join('');
                grid.innerHTML += `<div class="lesson schedule-day-cell ${sizeClass}">${entriesMarkup}</div>`;
                return;
            }

            if (currentTeacher && currentTeacher.login !== 'kemal') {
                grid.innerHTML += '<div class="lesson schedule-empty-cell"><small>—</small></div>';
                return;
            }

            const time = g.lessons[idx];
            if (!time) {
                grid.innerHTML += '<div class="lesson schedule-empty-cell"><small>—</small></div>';
                return;
            }
            const [start, end] = time.split('-').map(s => s.trim());
            const isActive = isCurrentLesson(idx, start, end);
            const activeClass = isActive ? 'active-lesson' : '';
            let currentSubject = g.subject;
            if (g.name === '301') currentSubject = (idx === 0 || idx === 2) ? 'КМ 06' : 'КМ 07';
            const basicEntry = { group: g.name, day, start, end, subject: currentSubject, teacher: currentTeacher?.name || 'Серік Кемал', room: '—', date: '' };
            const moreText = translateText('More →', language);
            const currentLabel = isActive ? `<span class="current-lesson-label">${currentLessonLabel(language)}</span>` : '';
            grid.innerHTML += `<div class="lesson ${activeClass}" onclick="showLessonInfo(${JSON.stringify(basicEntry).replace(/"/g, '&quot;')})">${currentLabel}<strong>${currentSubject}</strong><small>${time}</small><span class="lesson-click-hint">${moreText}</span></div>`;
        });
    });
}

function toggleCard(button) {
    const card = button.closest('.schedule-card');
    const extraItems = card?.querySelector('.extra-items-wrap');
    const arrow = button.querySelector('.arrow');
    if (!extraItems) return;

    extraItems.classList.toggle('is-hidden');
    const isHidden = extraItems.classList.contains('is-hidden');
    const count = Number(button.dataset.count || '0');
    const language = getLanguage();
    const hiddenText = language === 'ru' ? `+${count} пара` : language === 'en' ? `+${count} pair${count === 1 ? '' : 's'}` : `+${count} пара`;
    const visibleText = language === 'ru' ? `${count} пары скрыть` : language === 'en' ? `Hide ${count} pair${count === 1 ? '' : 's'}` : `${count} параны жасыру`;
    button.firstChild.textContent = isHidden ? hiddenText + ' ' : visibleText + ' ';
    if (arrow) arrow.textContent = isHidden ? '▼' : '▲';
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const extraScheduleItem = document.getElementById('extraScheduleItem');
    if (!toggleBtn || !extraScheduleItem) return;

    toggleBtn.addEventListener('click', () => {
        extraScheduleItem.classList.toggle('is-hidden');
        toggleBtn.textContent = extraScheduleItem.classList.contains('is-hidden')
            ? 'Екінші бөлікті көрсету'
            : 'Екінші бөлікті жасыру';
    });
});

function renderTeacherDashboard(root) {
    const language = getLanguage();
    const allSchedule = adminData('schedule').slice().sort((first, second) => `${first.date} ${first.start}`.localeCompare(`${second.date} ${second.start}`));
    const teacherSchedule = currentTeacher ? allSchedule.filter(entry => entry.teacher === currentTeacher.name) : allSchedule;
    const groups = [...new Set(teacherSchedule.map(entry => entry.group))];
    const todayLessons = teacherSchedule.slice(0, 4);
    const totalStudents = groups.reduce((sum, group) => sum + (APP_DATA.students[group]?.length || 0), 0);
    const teacherName = currentTeacher?.displayName || currentTeacher?.name || 'Кемал С.';
    const greeting = language === 'ru' ? `Добро пожаловать, ${teacherName}!` : language === 'en' ? `Welcome, ${teacherName}!` : `Қош келдіңіз, ${teacherName}!`;
    const labels = language === 'ru'
        ? { groups: 'Мои группы', lessons: 'Сегодня занятий', grades: 'Нужно поставить оценку', notices: 'Новые уведомления', today: 'Сегодняшние занятия', all: 'Все занятия', group: 'Мои группы', students: 'учеников', time: 'Время', subject: 'Предмет', room: 'Кабинет', recent: 'Последние действия', noLessons: 'Занятия пока не добавлены', assistant: 'AI помощник', assistantText: 'Спросите о расписании или попросите подготовить материалы.', open: 'Открыть', dashboard: 'Панель преподавателя', topLabel: 'ПАНЕЛЬ ПРЕПОДАВАТЕЛЯ', todayShort: 'Сегодня', groupLabel: 'Группа', updated: 'Данные обновлены', ready: 'Система готова к работе' }
        : language === 'en'
            ? { groups: 'My groups', lessons: 'Lessons today', grades: 'Grades to enter', notices: 'New notifications', today: "Today's lessons", all: 'All lessons', group: 'My groups', students: 'students', time: 'Time', subject: 'Subject', room: 'Room', recent: 'Recent activity', noLessons: 'No lessons have been added yet', assistant: 'AI assistant', assistantText: 'Ask about the schedule or request prepared materials.', open: 'Open', dashboard: 'Teacher dashboard', topLabel: 'TEACHER DASHBOARD', todayShort: 'Today', groupLabel: 'Group', updated: 'Group data updated', ready: 'System is ready' }
            : { groups: 'Менің топтарым', lessons: 'Бүгінгі сабақтар', grades: 'Баға қою керек', notices: 'Жаңа хабарламалар', today: 'Бүгінгі сабақтар', all: 'Барлық сабақтар', group: 'Топтарым', students: 'оқушы', time: 'Уақыты', subject: 'Пән', room: 'Кабинет', recent: 'Соңғы әрекеттер', noLessons: 'Әзірге сабақтар қосылмаған', assistant: 'AI көмекшісі', assistantText: 'Сабақ кестесі туралы сұраңыз немесе материал дайындауды сұраңыз.', open: 'Ашу', dashboard: 'Мұғалім панелі', topLabel: 'МҰҒАЛІМ ПАНЕЛІ', todayShort: 'Бүгін', groupLabel: 'Топ', updated: 'Топ деректері жаңартылды', ready: 'Жүйе жұмысқа дайын' };
    root.innerHTML = `<section class="teacher-welcome"><div><span class="teacher-eyebrow">${labels.topLabel}</span><h1>${greeting}</h1><p>${new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'kk-KZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div><div class="teacher-welcome-mark">${groups.length || 0}</div></section>
        <section class="teacher-stat-grid"><article class="teacher-stat-card stat-blue"><span>▣</span><small>${labels.groups}</small><strong>${groups.length}</strong></article><article class="teacher-stat-card stat-purple"><span>▦</span><small>${labels.lessons}</small><strong>${todayLessons.length}</strong></article><article class="teacher-stat-card stat-green"><span>☑</span><small>${labels.grades}</small><strong>${totalStudents}</strong></article><article class="teacher-stat-card stat-pink"><span>♧</span><small>${labels.notices}</small><strong>2</strong></article></section>
        <section class="teacher-dashboard-grid"><article class="teacher-panel teacher-lessons-panel"><div class="teacher-panel-heading"><h2>${labels.today}</h2><button type="button" onclick="showTeacherDashboardSection('schedule')">${labels.all} →</button></div><div class="teacher-lesson-table"><div class="teacher-table-head"><span>${labels.time}</span><span>${labels.subject}</span><span>${labels.groupLabel}</span><span>${labels.room}</span></div>${todayLessons.length ? todayLessons.map(entry => `<button class="teacher-lesson-row" type="button" data-search="${entry.subject} ${entry.group} ${entry.room}" onclick="showLessonInfo(${JSON.stringify(entry).replace(/"/g, '&quot;')})"><span>${entry.start} – ${entry.end}</span><strong>${entry.subject}</strong><span>${adminGroupLabel(entry.group, language)}</span><span>${entry.room}</span></button>`).join('') : `<p class="teacher-empty">${labels.noLessons}</p>`}</div></article><article class="teacher-panel teacher-groups-panel"><div class="teacher-panel-heading"><h2>${labels.group}</h2><button type="button" onclick="showTeacherDashboardSection('groups')">${labels.all} →</button></div><div class="teacher-group-list">${groups.length ? groups.map((group, index) => `<button type="button" class="teacher-group-row" onclick="showTeacherGroup('${group}')"><span class="teacher-group-badge badge-${index % 3}">${adminGroupLabel(group, language)}</span><strong>${adminGroupLabel(group, language)}</strong><small>${APP_DATA.students[group]?.length || 0} ${labels.students}</small></button>`).join('') : `<p class="teacher-empty">${labels.noLessons}</p>`}</div></article></section>
        <section class="teacher-bottom-grid"><article class="teacher-assistant"><div class="assistant-icon">✦</div><div><h2>${labels.assistant}</h2><p>${labels.assistantText}</p><button type="button" onclick="showTeacherDashboardSection('journal')">${labels.open}</button></div></article><article class="teacher-panel teacher-activity"><h2>${labels.recent}</h2><div class="teacher-activity-row"><span>✓</span><strong>${labels.ready}</strong><small>${labels.todayShort}</small></div><div class="teacher-activity-row"><span>♙</span><strong>${labels.updated}</strong><small>${labels.todayShort}</small></div></article></section>`;
}

function showTeacherDashboardSection(section, button) {
    const language = getLanguage();
    document.querySelectorAll('.teacher-nav button').forEach(item => item.classList.remove('active'));
    button?.classList.add('active');
    const dashboard = document.getElementById('teacherDashboard');
    if (!dashboard) return;
    if (section === 'schedule') {
        const heading = language === 'ru' ? 'Расписание' : language === 'en' ? 'Schedule' : 'Сабақ кестесі';
        const emptyText = language === 'ru' ? 'Занятий нет' : language === 'en' ? 'No lessons' : 'Сабақтар жоқ';
        dashboard.innerHTML = `<section class="teacher-panel teacher-full-panel"><div class="teacher-panel-heading"><h2>${heading}</h2></div><div id="teacherScheduleList"></div></section>`;
        const list = document.getElementById('teacherScheduleList');
        const entries = adminData('schedule').filter(entry => !currentTeacher || entry.teacher === currentTeacher.name);
        list.innerHTML = entries.map(entry => `<button class="teacher-lesson-row" type="button" onclick="showLessonInfo(${JSON.stringify(entry).replace(/"/g, '&quot;')})"><span>${translateCalendarDay(entry.day, language)} • ${entry.date} ${entry.start}–${entry.end}</span><strong>${entry.subject}</strong><span>${adminGroupLabel(entry.group, language)}</span><span>${entry.room}</span></button>`).join('') || `<p class="teacher-empty">${emptyText}</p>`;
        return;
    }
    renderTeacherDashboard(dashboard);
}
function filterTeacherDashboard(query) { const value = query.trim().toLowerCase(); document.querySelectorAll('.teacher-lesson-row').forEach(row => { row.hidden = value && !(`${row.textContent} ${row.dataset.search || ''}`.toLowerCase().includes(value)); }); }
function showTeacherGroup(group) { const entry = adminData('schedule').find(item => item.group === group); if (entry) openJournal(entry.group, entry.day, `${entry.start}-${entry.end}`); }
// --- ЖУРНАЛ ЖӘНЕ КАЛЕНДАРЬ ---
function openJournal(group, day, time) {
    if (currentTeacher?.login === 'aldariza' && !['201', '203'].includes(group)) {
        alert('This group is not in your schedule.');
        return;
    }
    currentGroup = group;
    const language = getLanguage();
    const translatedDay = translateCalendarDay(day, language);
    document.getElementById('journalTitle').textContent = `${adminGroupLabel(group, 'en')} | Journal`;
    document.getElementById('currentGroupInfo').innerHTML = `<h3>${adminGroupLabel(group, getLanguage())}</h3><p>${translatedDay} | ${time}</p>`;
    showScreen('journal');
    renderCalendar();
    loadStudentsTable();
}

function renderCalendar() {
    const monthYearText = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarDays');
    const language = getLanguage();
    const months = ["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"];
    const translatedMonth = translateCalendarMonth(months[currentMonth], language);
    
    monthYearText.textContent = `${translatedMonth} ${currentYear}`;
    calendarGrid.innerHTML = '';

    // Айдың бірінші күні аптаның қай күні екенін анықтау (0-Жексенбі, 1-Дүйсенбі...)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Қазақша күнтізбе үшін (Дүйсенбіден бастау)
    const startingPoint = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Бос ұяшықтар (ай басталғанға дейінгі күндер)
    for (let i = 0; i < startingPoint; i++) {
        calendarGrid.innerHTML += `<div></div>`;
    }

    // Күндерді шығару
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
        const isSelected = selectedDate === d;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`;
        dayDiv.textContent = d;
        
        dayDiv.onclick = () => {
            selectedDate = d;
            renderCalendar();
            loadStudentsTable(); // Күн өзгергенде тізімді жаңарту
        };
        calendarGrid.appendChild(dayDiv);
    }
}

// --- СТУДЕНТТЕР КЕСТЕСІН ЖҮКТЕУ ---
async function loadStudentsTable() {
    const tbody = document.getElementById('studentsTable');
    tbody.innerHTML = '';
    const language = getLanguage();
    
    const dateKey = `${selectedDate}-${currentMonth}-${currentYear}-${currentGroup}`;
    let savedGrades = JSON.parse(localStorage.getItem(dateKey)) || {};
    const cloudGrades = await firebaseLoadGrade(dateKey);
    if (cloudGrades) {
        savedGrades = cloudGrades;
        localStorage.setItem(dateKey, JSON.stringify(savedGrades));
    }

    APP_DATA.students[currentGroup].forEach((student, index) => {
        const grade = savedGrades[student] || '';
        const translatedStudent = translateKazakhName(student, language);
        
        // Түс класын анықтау
        let colorClass = '';
        let n = parseInt(grade);
        if (grade.toUpperCase() === 'НБ') colorClass = 'grade-nb';
        else if (n < 70) colorClass = 'grade-low';
        else if (n >= 70 && n <= 89) colorClass = 'grade-mid';
        else if (n >= 90) colorClass = 'grade-high';

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td style="text-align:left;">${translatedStudent}</td>
                <td>
                    <input type="text" class="mark-input ${colorClass}" 
                        value="${grade}" 
                        oninput="updateGradeColor(this)"
                        data-student="${student}">
                </td>
                <td><input type="text" class="note-input"></td>
            </tr>`;
    });
}

// Жаңа жазғанда түсті бірден өзгерту үшін көмекші функция
function updateGradeColor(input) {
    input.value = input.value.toUpperCase();
    if(input.value === 'Н') input.value = 'НБ';
    
    // Ескі кластарды өшіру
    input.classList.remove('grade-nb', 'grade-low', 'grade-mid', 'grade-high');
    
    let val = input.value;
    let n = parseInt(val);
    
    if (val === 'НБ') input.classList.add('grade-nb');
    else if (n < 70) input.classList.add('grade-low');
    else if (n >= 70 && n <= 89) input.classList.add('grade-mid');
    else if (n >= 90) input.classList.add('grade-high');
}

// --- САҚТАУ ФУНКЦИЯСЫ ---
function saveJournal() {
    const dateKey = `${selectedDate}-${currentMonth}-${currentYear}-${currentGroup}`;
    const grades = {};
    
    document.querySelectorAll('.mark-input').forEach(input => {
        grades[input.dataset.student] = input.value;
    });

    localStorage.setItem(dateKey, JSON.stringify(grades));
    firebaseSaveGrade(dateKey, grades);
    alert('Бағалар сақталды!');
}

function prevMonth() { currentMonth--; if(currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); }
function nextMonth() { currentMonth++; if(currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); }
function goBack() { showScreen('schedule'); }
function exportExcel() {
    const students = APP_DATA.students[currentGroup] || [];
    const language = getLanguage();
    const dateKey = `${selectedDate}-${currentMonth}-${currentYear}-${currentGroup}`;
    const savedGrades = JSON.parse(localStorage.getItem(dateKey)) || {};

    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8">
        <style>
            .nb { background: #ff0000; color: white; } /* НБ - Қызыл */
            .low { background: #ffff00; }             /* <70 - Сары */
            .mid { background: #0000ff; color: white; } /* 70-89 - Көк */
            .high { background: #00ff00; }            /* 90-100 - Жасыл */
            td { border: 1px solid #000; padding: 5px; }
        </style>
        </head>
        <body>
            <table>
                <tr><th colspan="3">Топ: ${currentGroup} | Күні: ${selectedDate}.${currentMonth+1}</th></tr>
                <tr><th>#</th><th>Студент аты</th><th>Баға</th></tr>
    `;

    students.forEach((s, i) => {
        let val = savedGrades[s] || "";
        let styleClass = "";
        
        // Түстерді анықтау логикасы
        let n = parseInt(val);
        if (val.toUpperCase() === 'НБ') styleClass = 'class="nb"';
        else if (n < 70) styleClass = 'class="low"';
        else if (n >= 70 && n <= 89) styleClass = 'class="mid"';
        else if (n >= 90) styleClass = 'class="high"';

        html += `<tr><td>${i+1}</td><td>${translateKazakhName(s, language)}</td><td ${styleClass}>${val}</td></tr>`;
    });

    html += `</table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Журнал_${currentGroup}.xls`;
    link.click();
}

window.APP_DATA = APP_DATA;
window.currentGroup = currentGroup;
window.currentManagedGroup = currentManagedGroup;
window.getSelectedManagedGroup = getSelectedManagedGroup;
window.getStudentAccounts = getStudentAccounts;
window.saveStudentAccounts = saveStudentAccounts;
window.login = login;
window.toggleStudentRegistration = toggleStudentRegistration;
window.registerStudent = registerStudent;
window.useRegisteredStudent = useRegisteredStudent;
window.showAdminLogin = showAdminLogin;
window.selectLoginRole = selectLoginRole;
window.togglePasswordVisibility = togglePasswordVisibility;
window.logout = logout;
window.showScreen = showScreen;
window.renderAdminView = renderAdminView;
window.switchAdminView = switchAdminView;
window.saveSettings = saveSettings;
window.clearActivity = clearActivity;
window.addGroup = addGroup;
window.editGroup = editGroup;
window.removeGroup = removeGroup;
window.manageStudents = manageStudents;
window.editStudentAccount = editStudentAccount;
window.deleteStudentAccount = deleteStudentAccount;
window.addTeacherUser = addTeacherUser;
window.editTeacherUser = editTeacherUser;
window.deleteTeacherUser = deleteTeacherUser;
window.addUser = addUser;
window.removeUser = removeUser;
window.saveJournal = saveJournal;
window.updateGradeColor = updateGradeColor;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.goBack = goBack;
window.exportExcel = exportExcel;
window.openJournal = openJournal;
window.loadStudentsTable = loadStudentsTable;
window.addNewStudent = addNewStudent;
window.filterStudents = filterStudents;
window.addGroupFromPanel = addGroupFromPanel;
window.toggleCustomGroupName = toggleCustomGroupName;
window.addStudentFromPanel = addStudentFromPanel;
window.showStudentAddPage = showStudentAddPage;
window.renderScheduleAdmin = renderScheduleAdmin;
window.saveScheduleEntry = saveScheduleEntry;
window.editScheduleEntry = editScheduleEntry;
window.cancelScheduleEdit = cancelScheduleEdit;
window.deleteScheduleEntry = deleteScheduleEntry;
window.toggleCard = toggleCard;
window.showLessonInfo = showLessonInfo;
window.showStudentLessonInfo = showStudentLessonInfo;
window.renderScoresModal = renderScoresModal;
window.closeLessonModal = closeLessonModal;
window.openStudentSection = openStudentSection;
window.setLanguage = setLanguage;
window.showTeacherDashboardSection = showTeacherDashboardSection;
window.filterTeacherDashboard = filterTeacherDashboard;
window.showTeacherGroup = showTeacherGroup;

function ensureSeparateGroupStorage() {
    const stored = JSON.parse(localStorage.getItem('student_accounts') || '{}');
    Object.keys(APP_DATA.students).forEach(group => {
        const groupKey = String(group);
        if (!stored[groupKey] || !Array.isArray(stored[groupKey])) {
            stored[groupKey] = (APP_DATA.students[groupKey] || []).map((name, index) => ({
                name,
                login: `${groupKey}_${String(index + 1).padStart(2, '0')}`,
                password: `stu${groupKey}_${String(index + 1).padStart(2, '0')}`
            }));
        }
    });
    localStorage.setItem('student_accounts', JSON.stringify(stored));
    firebaseSave('student_accounts', stored);
}

cleanupRemovedGroups();
ensureSeparateGroupStorage();
restoreAppSession();
setLanguage(getLanguage());
selectLoginRole('teacher');

function firebaseSaveGrade(dateKey, values) {
    return setDoc(doc(db, 'grades', dateKey), { values, updatedAt: serverTimestamp() }, { merge: true }).catch(error => console.warn('Firebase grade save failed:', error.message));
}
async function firebaseLoadGrade(dateKey) {
    try {
        const snapshot = await getDoc(doc(db, 'grades', dateKey));
        return snapshot.exists() ? snapshot.data().values : null;
    } catch (error) {
        console.warn('Firebase grade load failed:', error.message);
        return null;
    }
}

function showLessonInfo(entry) {
    const modal = document.getElementById('lessonModal');
    const content = document.getElementById('lessonModalContent');
    if (!modal || !content) return;
    const language = getLanguage();
    const gradeCount = Object.keys(localStorage).filter(key => key.endsWith(`-${entry.group}`)).reduce((count, key) => {
        const values = JSON.parse(localStorage.getItem(key) || '{}');
        return count + Object.values(values).filter(value => value && value !== 'НБ').length;
    }, 0);
    const translatedDay = translateCalendarDay(entry.day, language);
    const translatedTeacher = translateKazakhName(entry.teacher, language);
    const translatedGroup = adminGroupLabel(entry.group, language);
    const translatedRoom = entry.room === '—' ? (language === 'en' ? 'Not specified' : language === 'ru' ? 'Не указан' : 'Көрсетілмеген') : entry.room;
    const lessonLabel = translateText('LESSON', language);
    const dayLabel = translateText('Day', language);
    const timeLabel = translateText('Time', language);
    const roomLabel = translateText('Room', language);
    const teacherLabel = translateText('Teacher', language);
    const openJournalLabel = translateText('Open journal', language);
    const gradesLabel = translateText('Grades', language);
    content.innerHTML = `<span class="student-kicker">${lessonLabel}</span><h2 id="lessonModalTitle">${entry.subject} · ${translatedGroup}</h2><div class="lesson-modal-details"><div><span>${dayLabel}</span><strong>${translatedDay}${entry.date ? `, ${entry.date}` : ''}</strong></div><div><span>${timeLabel}</span><strong>${entry.start}–${entry.end}</strong></div><div><span>${roomLabel}</span><strong>${translatedRoom}</strong></div><div><span>${teacherLabel}</span><strong>${translatedTeacher}</strong></div></div><div class="lesson-modal-actions"><button class="primary-btn" onclick="closeLessonModal(); openJournal('${entry.group}','${entry.day}','${entry.start}-${entry.end}')">${openJournalLabel}</button><button class="secondary-btn" onclick="renderScoresModal('${entry.group}','${entry.subject}')">${gradesLabel} <span>${gradeCount}</span></button></div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function showStudentLessonInfo(entry) {
    const modal = document.getElementById('lessonModal');
    const content = document.getElementById('lessonModalContent');
    if (!modal || !content) return;
    const language = getLanguage();
    const translatedDay = translateCalendarDay(entry.day, language);
    const translatedTeacher = translateKazakhName(entry.teacher, language);
    const myLessonLabel = translateText('MY LESSON', language);
    const dayLabel = translateText('Day', language);
    const timeLabel = translateText('Time', language);
    const roomLabel = translateText('Room', language);
    const teacherLabel = translateText('Teacher', language);
    const roomText = language === 'ru' ? `${entry.room}-кабинет` : language === 'en' ? `${entry.room}-room` : `${entry.room}-кабинет`;
    const checkRoomText = translateText('Check your room before the lesson starts.', language);
    content.innerHTML = `<span class="student-kicker">${myLessonLabel}</span><h2 id="lessonModalTitle">${entry.subject}</h2><div class="lesson-modal-details"><div><span>${dayLabel}</span><strong>${translatedDay}, ${entry.date}</strong></div><div><span>${timeLabel}</span><strong>${entry.start}–${entry.end}</strong></div><div><span>${roomLabel}</span><strong>${roomText}</strong></div><div><span>${teacherLabel}</span><strong>${translatedTeacher}</strong></div></div><div class="student-modal-note"><span>⌁</span><p>${checkRoomText}</p></div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function renderScoresModal(group, subject, studentName = '') {
    const modal = document.getElementById('lessonModal');
    const content = document.getElementById('lessonModalContent');
    const language = getLanguage();
    const students = studentName ? [studentName] : (APP_DATA.students[group] || []);
    const rows = [];
    Object.keys(localStorage).filter(key => key.endsWith(`-${group}`)).forEach(key => {
        const values = JSON.parse(localStorage.getItem(key) || '{}');
        students.forEach(student => { if (values[student] && values[student] !== 'НБ') rows.push({ student, value: values[student], date: key.split('-').slice(0, 3).reverse().join('.') }); });
    });
    content.innerHTML = `<span class="student-kicker">БАЛЛЫ</span><h2 id="lessonModalTitle">Оценки · ${subject}</h2><p class="scores-subtitle">${adminGroupLabel(group, language)}${studentName ? ` · ${translateKazakhName(studentName, language)}` : ''}</p><div class="scores-list">${rows.length ? rows.map(row => `<div class="score-row"><span>${translateKazakhName(row.student, language)}</span><strong>${row.value}</strong><small>${row.date}</small></div>`).join('') : '<div class="student-empty">Оценки пока не добавлены.</div>'}</div><button class="secondary-btn modal-back" onclick="showLessonInfo({group:'${group}',subject:'${subject}',day:'Расписание',start:'—',end:'—',teacher:'',room:'—',date:''})">← К информации об уроке</button>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeLessonModal() {
    const modal = document.getElementById('lessonModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
}

async function restoreAppSession() {
    const session = getAppSession();
    if (!session) return;
    if (session.type === 'student') {
        let studentAccount = findStudentAccount(session.login);
        if (!studentAccount) {
            await hydrateStudentAccounts();
            studentAccount = findStudentAccount(session.login);
        }
        if (!studentAccount) {
            localStorage.removeItem('app_session');
            return;
        }
        window.currentStudent = { ...studentAccount, group: studentAccount.group || '201' };
        showScreen('studentAccess');
        renderStudentDashboard(window.currentStudent);
        openStudentSection(session.view || 'home');
        return;
    }
    if (session.type === 'teacher') {
        const teacher = { kemal: { name: 'Кемал С.', displayName: 'Кемал С.' }, aldariza: { name: 'Алдариза Ж.Ғ.', displayName: 'Алдариза Ж.' } }[session.login];
        if (!teacher) return;
        currentTeacher = { ...teacher, login: session.login };
        showScreen('schedule');
        return;
    }
    if (session.type === 'admin') {
        showScreen('admin');
        renderAdminView('overview');
    }
}
