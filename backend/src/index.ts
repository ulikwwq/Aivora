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

  // 3. Process Universities and Check Grant Eligibility
  // Simple heuristic: If user has GPA 'Отличник' and IELTS >= 6.5, they get grant almost everywhere.
  
  const gpaScore = gpa === 'Отличник (4.5 - 5.0)' ? 3 : (gpa === 'Хорошист (3.5 - 4.4)' ? 2 : 1);
  const ieltsScore = ['7.5+', '6.5 - 7.0'].includes(ielts) ? 3 : (['5.5 - 6.0'].includes(ielts) ? 2 : 1);
  const hasStrongExtras = extracurriculars && extracurriculars.length > 0 && !extracurriculars.includes('Нет');

  const processedUniversities = UNIVERSITIES.map(uni => {
    let eligibleForGrant = false;
    
    // Evaluate based on Uni requirements
    let uniReqGpaScore = uni.minGpa === 'Отличник (4.5 - 5.0)' ? 3 : (uni.minGpa === 'Хорошист (3.5 - 4.4)' ? 2 : 1);
    let uniReqIeltsScore = ['6.5 - 7.0'].includes(uni.minIelts) ? 3 : (['5.5 - 6.0'].includes(uni.minIelts) ? 2 : 1);

    if (gpaScore >= uniReqGpaScore && ieltsScore >= uniReqIeltsScore) {
      eligibleForGrant = true;
    }

    // Boost chances if they have great extracurriculars
    if (hasStrongExtras && gpaScore >= 2 && uniReqGpaScore <= 2) {
      eligibleForGrant = true;
    }

    return {
      ...uni,
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
