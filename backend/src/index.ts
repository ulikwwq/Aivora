import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const PROFESSIONS = [
  { id: 'p1', title: 'Frontend-разработчик', category: 'IT', description: 'Разработка интерактивной части сайтов. Большой спрос на удаленке.', matchScore: 95, skills: ['React', 'CSS', 'JavaScript'], plan: { week1: 'Изучение адаптивной верстки (CSS Grid/Flexbox)', week2: 'Основы JavaScript и работы с DOM', week3: 'Введение в React.js', week4: 'Публикация первого проекта' } },
  { id: 'p2', title: 'Data-аналитик', category: 'Данные', description: 'Анализ данных для бизнеса.', matchScore: 92, skills: ['Python', 'SQL', 'Статистика'], plan: { week1: 'Основы SQL', week2: 'Продвинутый Excel', week3: 'Основы Python', week4: 'Визуализация данных' } },
  { id: 'p3', title: 'UI/UX Дизайнер', category: 'Дизайн', description: 'Проектирование логики и визуальной части приложений.', matchScore: 88, skills: ['Figma', 'UX Research', 'Дизайн-системы'], plan: { week1: 'Основы Figma', week2: 'Теория цвета и композиции', week3: 'Проектирование Wireframes', week4: 'Полноценный прототип' } },
  { id: 'p4', title: 'SMM-специалист', category: 'Творчество', description: 'Продвижение брендов в социальных сетях.', matchScore: 85, skills: ['Копирайтинг', 'Маркетинг', 'Аналитика'], plan: { week1: 'Анализ конкурентов', week2: 'Основы копирайтинга', week3: 'Контент-план', week4: 'Таргетированная реклама' } },
  { id: 'p5', title: 'Менеджер проектов (Project Manager)', category: 'Управление', description: 'Управление командой и процессами.', matchScore: 82, skills: ['Scrum/Agile', 'Коммуникация', 'Лидерство'], plan: { week1: 'Методология Agile', week2: 'Основы Scrum', week3: 'Работа в Jira/Trello', week4: 'Управление рисками' } },
  { id: 'p6', title: 'Финансовый консультант', category: 'Финансы', description: 'Помощь компаниям с инвестициями.', matchScore: 80, skills: ['Экономика', 'Excel', 'Анализ рынков'], plan: { week1: 'Основы личных финансов', week2: 'Юнит-экономика', week3: 'Фондовый рынок', week4: 'Составление портфеля' } },
  { id: 'p7', title: 'Врач-телемедицины', category: 'Медицина', description: 'Удаленное консультирование пациентов.', matchScore: 75, skills: ['Медицина', 'Коммуникация', 'Диагностика'], plan: { week1: 'Основы телемедицины', week2: 'Этика общения', week3: 'Работа с мед. системами', week4: 'Практика консультаций' } }
];

const UNIVERSITIES = [
  { id: 'u1', name: 'Американский Университет (АУЦА)', location: 'Бишкек', description: 'Лучший IT и бизнес ВУЗ региона. Полное обучение на английском языке.', tags: ['Международный', 'IT', 'Бизнес'], hasGrant: true, minGpa: 'Отличник (4.5 - 5.0)', minIelts: '6.5 - 7.0' },
  { id: 'u2', name: 'Университет Ала-Тоо (Ala-Too)', location: 'Бишкек', description: 'Фокус на компьютерные науки и медицину на английском.', tags: ['IT', 'Медицина', 'Английский'], hasGrant: true, minGpa: 'Хорошист (3.5 - 4.4)', minIelts: '5.5 - 6.0' },
  { id: 'u3', name: 'КГТУ им. Раззакова (Политех)', location: 'Бишкек', description: 'Главный технический университет страны. Много бюджетных мест.', tags: ['Инженерия', 'Бюджет', 'IT'], hasGrant: true, minGpa: 'Хорошист (3.5 - 4.4)', minIelts: 'Нет IELTS' },
  { id: 'u4', name: 'КНУ им. Баласагына', location: 'Бишкек', description: 'Национальный университет. Широчайший профиль специальностей.', tags: ['Гуманитарный', 'Бюджет', 'Фундаментальный'], hasGrant: true, minGpa: 'Средний (2.5 - 3.4)', minIelts: 'Нет IELTS' },
  { id: 'u5', name: 'КРСУ', location: 'Бишкек', description: 'Кыргызско-Российский ВУЗ. Сильная медицина и инженерия.', tags: ['Медицина', 'РФ гранты'], hasGrant: true, minGpa: 'Хорошист (3.5 - 4.4)', minIelts: 'Нет IELTS' },
  { id: 'u6', name: 'ОшГУ', location: 'Ош', description: 'Крупнейший региональный ВУЗ, отличная медицинская база.', tags: ['Регион', 'Медицина'], hasGrant: true, minGpa: 'Средний (2.5 - 3.4)', minIelts: 'Нет IELTS' },
  { id: 'u7', name: 'УЦА (UCA)', location: 'Нарын', description: 'Университет Центральной Азии. Мощные стипендии для талантливых.', tags: ['Международный', 'Гранты 100%'], hasGrant: true, minGpa: 'Отличник (4.5 - 5.0)', minIelts: '6.5 - 7.0' }
];

app.post('/api/analyze', (req, res) => {
  const { userProfile } = req.body;
  const { gpa, ielts, extracurriculars, profession } = userProfile;

  // 1. Calculate Strengths based on extracurriculars and profession
  let strengths = ['Ответственность', 'Быстрая обучаемость'];
  if (extracurriculars?.includes('Волонтерство') || extracurriculars?.includes('Школьное самоуправление')) strengths.push('Лидерство', 'Эмпатия');
  if (extracurriculars?.includes('Олимпиады')) strengths.push('Аналитическое мышление', 'Целеустремленность');
  if (extracurriculars?.includes('Спорт')) strengths.push('Дисциплина', 'Командная работа');
  
  if (profession && profession !== 'undecided') {
    if (profession.includes('Разработчик') || profession.includes('Data')) strengths.push('Технический склад ума');
    if (profession.includes('Дизайнер') || profession.includes('SMM')) strengths.push('Креативность');
  }

  // 2. Determine targeted professions
  let recommendedProfessions = [];
  if (profession && profession !== 'undecided') {
    const directMatch = PROFESSIONS.find(p => p.title === profession);
    if (directMatch) {
      recommendedProfessions = [directMatch];
    } else {
      recommendedProfessions = PROFESSIONS.slice(0, 3);
    }
  } else {
    // If undecided, return random top 5 pseudo-matched professions for the diagnostic chat
    recommendedProfessions = PROFESSIONS.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  // 3. Process Universities and Calculate Probabilities
  const processedUniversities = UNIVERSITIES.map(uni => {
    // Determine user's base numeric representation
    let userBaseGpa = 0;
    if (gpa === 'Отличник (4.5 - 5.0)') userBaseGpa = 4.8;
    else if (gpa === 'Хорошист (3.5 - 4.4)') userBaseGpa = 4.0;
    else if (gpa === 'Средний (2.5 - 3.4)') userBaseGpa = 3.0;

    let uniBaseGpa = 0;
    if (uni.minGpa === 'Отличник (4.5 - 5.0)') uniBaseGpa = 4.5;
    else if (uni.minGpa === 'Хорошист (3.5 - 4.4)') uniBaseGpa = 3.5;
    else uniBaseGpa = 2.5;

    // Calculate base admission probability based on GPA delta
    let admissionProbability = 50 + (userBaseGpa - uniBaseGpa) * 20;

    // Extracurriculars boost probability
    let extraBonus = 0;
    if (extracurriculars && !extracurriculars.includes('Нет')) {
      const valuableExtras = extracurriculars.filter((e: string) => ['Олимпиады', 'Научные проекты'].includes(e));
      const standardExtras = extracurriculars.filter((e: string) => ['Волонтерство', 'Спорт', 'Школьное самоуправление'].includes(e));
      extraBonus = (valuableExtras.length * 10) + (standardExtras.length * 5);
    }
    
    admissionProbability += extraBonus;

    // Cap admission between 5 and 99%
    admissionProbability = Math.max(5, Math.min(99, Math.round(admissionProbability)));

    // For grant probability, IELTS and GPA are critical.
    let userIeltsScore = 0;
    if (ielts === '7.5+') userIeltsScore = 8;
    else if (ielts === '6.5 - 7.0') userIeltsScore = 6.5;
    else if (ielts === '5.5 - 6.0') userIeltsScore = 5.5;
    else if (ielts === '4.0 - 5.0') userIeltsScore = 4.5;
    
    let uniReqIelts = 0;
    if (uni.minIelts === '6.5 - 7.0') uniReqIelts = 6.5;
    else if (uni.minIelts === '5.5 - 6.0') uniReqIelts = 5.5;

    let grantProbability = 0;
    if (uni.hasGrant) {
      let gpaMatchGrant = (userBaseGpa - uniBaseGpa) * 25; // needs higher gpa for grant
      let ieltsMatchGrant = uniReqIelts > 0 ? (userIeltsScore - uniReqIelts) * 20 : 10;
      grantProbability = 30 + gpaMatchGrant + ieltsMatchGrant + extraBonus;
      grantProbability = Math.max(1, Math.min(99, Math.round(grantProbability)));
      
      // If they clearly don't meet minimums
      if (userBaseGpa <= uniBaseGpa || (uniReqIelts > 0 && userIeltsScore < uniReqIelts - 0.5)) {
        grantProbability = Math.min(grantProbability, 25);
      }
    }

    let eligibleForGrant = grantProbability >= 40;

    return {
      ...uni,
      admissionProbability,
      grantProbability,
      eligibleForGrant
    };
  });

  setTimeout(() => {
    res.json({
      strengths: Array.from(new Set(strengths)),
      recommendedProfessions,
      recommendedUniversities: processedUniversities
    });
  }, 1000); 
});

app.listen(PORT, () => {
  console.log(`🚀 Aivora Backend running on http://localhost:${PORT}`);
});
