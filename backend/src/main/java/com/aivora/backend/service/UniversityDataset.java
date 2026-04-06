package com.aivora.backend.service;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class UniversityDataset {

    public record University(
            String name,
            String country,
            String city,
            List<String> specialties,
            List<String> tags,
            String description,
            String website,
            String admissionInfo,
            int minScore
    ) {}

    public List<University> getAll() {
        return List.of(
                // 🇺🇸 США
                new University("MIT", "USA", "Boston",
                        List.of("Computer Science", "AI", "Robotics", "Engineering"),
                        List.of("программирование", "технологии", "математика", "физика", "инженерия", "ai"),
                        "Один из лучших технических университетов мира.", "https://mit.edu",
                        "SAT, TOEFL, рекомендательные письма.", 95),

                new University("Stanford University", "USA", "California",
                        List.of("Computer Science", "Business", "Medicine", "AI"),
                        List.of("программирование", "бизнес", "медицина", "технологии", "стартапы", "ai"),
                        "Топ университет в Кремниевой долине, центр инноваций.", "https://stanford.edu",
                        "SAT/ACT, эссе, портфолио.", 96),

                new University("Harvard University", "USA", "Cambridge",
                        List.of("Law", "Medicine", "Business", "Economics"),
                        List.of("медицина", "право", "бизнес", "экономика", "политика"),
                        "Старейший и самый престижный университет США.", "https://harvard.edu",
                        "SAT/ACT, эссе, рекомендации, интервью.", 97),

                new University("Carnegie Mellon University", "USA", "Pittsburgh",
                        List.of("Computer Science", "AI", "Robotics", "Design"),
                        List.of("программирование", "ai", "робототехника", "дизайн", "технологии"),
                        "Лучшая программа по CS и AI в США.", "https://cmu.edu",
                        "SAT, портфолио для дизайна, TOEFL.", 92),

                new University("UC Berkeley", "USA", "California",
                        List.of("Computer Science", "Engineering", "Business", "Economics"),
                        List.of("программирование", "инженерия", "бизнес", "экономика", "технологии"),
                        "Один из лучших государственных университетов мира.", "https://berkeley.edu",
                        "SAT/ACT, эссе, внеклассные активности.", 93),

                // 🇬🇧 Великобритания
                new University("University of Oxford", "UK", "Oxford",
                        List.of("Law", "Medicine", "Philosophy", "Economics"),
                        List.of("право", "медицина", "философия", "экономика", "история"),
                        "Один из старейших университетов мира, высочайший стандарт.", "https://ox.ac.uk",
                        "A-Level или IB, IELTS 7.0+, интервью.", 96),

                new University("University of Cambridge", "UK", "Cambridge",
                        List.of("Engineering", "Mathematics", "Computer Science", "Medicine"),
                        List.of("математика", "инженерия", "программирование", "медицина", "физика"),
                        "Мировой лидер в науке и технологиях.", "https://cam.ac.uk",
                        "A-Level или IB, IELTS 7.5+, вступительные тесты.", 96),

                new University("Imperial College London", "UK", "London",
                        List.of("Engineering", "Medicine", "Business", "Computer Science"),
                        List.of("инженерия", "медицина", "бизнес", "программирование", "наука"),
                        "Ведущий технический и медицинский университет Лондона.", "https://imperial.ac.uk",
                        "A-Level, IELTS 6.5+.", 88),

                // 🇩🇪 Германия
                new University("TU Munich", "Germany", "Munich",
                        List.of("Engineering", "Computer Science", "Physics", "Mathematics"),
                        List.of("инженерия", "программирование", "физика", "математика", "технологии"),
                        "Лучший технический университет Германии, бесплатное обучение.", "https://tum.de",
                        "Аттестат, IELTS/TOEFL, немецкий язык для нем. программ.", 82),

                new University("Heidelberg University", "Germany", "Heidelberg",
                        List.of("Medicine", "Biology", "Chemistry", "Psychology"),
                        List.of("медицина", "биология", "химия", "психология", "наука"),
                        "Старейший университет Германии, сильная медицина.", "https://uni-heidelberg.de",
                        "Аттестат, немецкий язык B2+.", 80),

                // 🇨🇦 Канада
                new University("University of Toronto", "Canada", "Toronto",
                        List.of("Computer Science", "Medicine", "Engineering", "Business"),
                        List.of("программирование", "медицина", "инженерия", "бизнес", "технологии"),
                        "Лучший университет Канады, мультикультурная среда.", "https://utoronto.ca",
                        "Аттестат, IELTS 6.5+.", 85),

                new University("University of British Columbia", "Canada", "Vancouver",
                        List.of("Computer Science", "Business", "Engineering", "Forestry"),
                        List.of("программирование", "бизнес", "инженерия", "природа", "технологии"),
                        "Топ университет Канады, красивый кампус в Ванкувере.", "https://ubc.ca",
                        "Аттестат, IELTS 6.5+.", 83),

                // 🇸🇬 Сингапур
                new University("NUS Singapore", "Singapore", "Singapore",
                        List.of("Computer Science", "Engineering", "Business", "Medicine"),
                        List.of("азия", "программирование", "бизнес", "инженерия", "технологии"),
                        "Лучший университет Азии, высокий процент трудоустройства.", "https://nus.edu.sg",
                        "A-Level или IB, IELTS 6.5+.", 85),

                new University("NTU Singapore", "Singapore", "Singapore",
                        List.of("Engineering", "Business", "Computer Science", "Art"),
                        List.of("инженерия", "бизнес", "программирование", "технологии", "азия"),
                        "Второй лучший университет Сингапура, сильная инженерия.", "https://ntu.edu.sg",
                        "A-Level или IB, IELTS 6.0+.", 83),

                // 🇯🇵 Япония
                new University("University of Tokyo", "Japan", "Tokyo",
                        List.of("Engineering", "Computer Science", "Medicine", "Physics"),
                        List.of("япония", "инженерия", "технологии", "медицина", "исследования"),
                        "Лучший университет Японии, стипендии MEXT.", "https://u-tokyo.ac.jp",
                        "Стипендия MEXT, JLPT N2+ или программы на английском.", 85),

                // 🇰🇷 Корея
                new University("KAIST", "South Korea", "Daejeon",
                        List.of("Computer Science", "AI", "Engineering", "Physics"),
                        List.of("программирование", "технологии", "математика", "исследования", "азия", "ai"),
                        "Ведущий технический университет Кореи, стипендии.", "https://kaist.ac.kr",
                        "TOEFL 83+, рекомендации.", 80),

                new University("Seoul National University", "South Korea", "Seoul",
                        List.of("Medicine", "Engineering", "Business", "Law"),
                        List.of("медицина", "инженерия", "бизнес", "право", "азия"),
                        "Самый престижный университет Кореи.", "https://snu.ac.kr",
                        "TOPIK или IELTS, вступительные экзамены.", 85),

                // 🇳🇱 Нидерланды
                new University("University of Amsterdam", "Netherlands", "Amsterdam",
                        List.of("Data Science", "AI", "Business", "Economics"),
                        List.of("данные", "аналитика", "бизнес", "экономика", "европа", "ai"),
                        "Сильная программа Data Science и AI в центре Европы.", "https://uva.nl",
                        "Диплом, IELTS 6.5+.", 75),

                new University("TU Delft", "Netherlands", "Delft",
                        List.of("Engineering", "Architecture", "Computer Science", "Aerospace"),
                        List.of("инженерия", "архитектура", "программирование", "авиация", "европа"),
                        "Лучший технический университет Нидерландов.", "https://tudelft.nl",
                        "Диплом, IELTS 6.5+.", 78),

                // 🇦🇺 Австралия
                new University("University of Melbourne", "Australia", "Melbourne",
                        List.of("Medicine", "Engineering", "Business", "Law"),
                        List.of("медицина", "инженерия", "бизнес", "право", "австралия"),
                        "Лучший университет Австралии.", "https://unimelb.edu.au",
                        "IELTS 6.5+, аттестат.", 82),

                // 🇨🇭 Швейцария
                new University("ETH Zurich", "Switzerland", "Zurich",
                        List.of("Engineering", "Mathematics", "Physics", "Computer Science"),
                        List.of("инженерия", "математика", "физика", "программирование", "европа"),
                        "Лучший технический университет Европы, родина Эйнштейна.", "https://ethz.ch",
                        "Аттестат, вступительный экзамен для иностранцев.", 88),

                // 🇷🇺 Россия
                new University("ИТМО", "Russia", "Saint Petersburg",
                        List.of("Computer Science", "AI", "Photonics", "Mathematics"),
                        List.of("программирование", "олимпиады", "математика", "технологии", "россия", "ai"),
                        "Чемпион мировых олимпиад по программированию.", "https://itmo.ru",
                        "ЕГЭ по математике и информатике, олимпиады.", 85),

                new University("ВШЭ", "Russia", "Moscow",
                        List.of("Economics", "Computer Science", "Business", "Data Science"),
                        List.of("экономика", "бизнес", "данные", "аналитика", "россия", "программирование"),
                        "Ведущий экономический и IT университет России.", "https://hse.ru",
                        "ЕГЭ, олимпиады, конкурс портфолио.", 80),

                new University("МГУ", "Russia", "Moscow",
                        List.of("Mathematics", "Physics", "Medicine", "Law"),
                        List.of("математика", "физика", "медицина", "право", "россия", "наука"),
                        "Главный классический университет России.", "https://msu.ru",
                        "ЕГЭ, вступительные испытания.", 85),

                // 🇰🇿 Казахстан
                new University("Nazarbayev University", "Kazakhstan", "Astana",
                        List.of("Engineering", "Medicine", "Business", "Computer Science"),
                        List.of("казахстан", "инженерия", "медицина", "бизнес", "стипендия", "программирование"),
                        "Топ университет Казахстана, стипендии, обучение на английском.", "https://nu.edu.kz",
                        "ЕНТ или SAT, IELTS 6.0+, стипендии доступны.", 70),

                new University("КБТУ", "Kazakhstan", "Almaty",
                        List.of("Oil & Gas", "Engineering", "IT", "Business"),
                        List.of("нефть", "инженерия", "технологии", "бизнес", "казахстан"),
                        "Ведущий технический университет, партнёр BP и Chevron.", "https://kbtu.kz",
                        "ЕНТ, внутренние экзамены.", 65),

                // 🇰🇬 Кыргызстан
                new University("АУЦА", "Kyrgyzstan", "Bishkek",
                        List.of("Business", "Computer Science", "Journalism", "Psychology"),
                        List.of("кыргызстан", "бизнес", "программирование", "психология", "журналистика", "английский"),
                        "Лучший либеральный университет ЦА, обучение на английском.", "https://auca.kg",
                        "SAT или внутренний тест, IELTS 5.5+.", 60),

                new University("КТУ Манас", "Kyrgyzstan", "Bishkek",
                        List.of("Engineering", "Economics", "Law", "Medicine"),
                        List.of("кыргызстан", "инженерия", "экономика", "право", "медицина", "турция"),
                        "Кыргызско-Турецкий университет, бесплатные программы.", "https://manas.edu.kg",
                        "Вступительные экзамены, конкурс.", 55),

                new University("КГТУ им. Раззакова", "Kyrgyzstan", "Bishkek",
                        List.of("Engineering", "IT", "Architecture", "Mining"),
                        List.of("кыргызстан", "инженерия", "технологии", "архитектура", "горное дело"),
                        "Ведущий технический университет Кыргызстана.", "https://kstu.kg",
                        "ОРТ, вступительные экзамены.", 50),

                new University("КНУ им. Баласагына", "Kyrgyzstan", "Bishkek",
                        List.of("Mathematics", "Physics", "History", "Law"),
                        List.of("кыргызстан", "математика", "физика", "история", "право", "наука"),
                        "Главный классический университет Кыргызстана.", "https://university.kg",
                        "ОРТ, конкурс по специальности.", 50),

                new University("Медицинская академия КР", "Kyrgyzstan", "Bishkek",
                        List.of("Medicine", "Dentistry", "Pharmacy", "Nursing"),
                        List.of("кыргызстан", "медицина", "стоматология", "фармация", "здоровье"),
                        "Главный медицинский вуз Кыргызстана, популярен среди иностранных студентов.", "https://kgma.kg",
                        "ОРТ по биологии и химии, вступительные экзамены.", 55),

                new University("Международный университет Кыргызстана", "Kyrgyzstan", "Bishkek",
                        List.of("Business", "Economics", "Law", "Tourism"),
                        List.of("кыргызстан", "бизнес", "экономика", "право", "туризм"),
                        "Один из первых частных университетов КР.", "https://iuk.kg",
                        "ОРТ или внутренние экзамены.", 45),

                new University("Ала-Тоо Университет", "Kyrgyzstan", "Bishkek",
                        List.of("Computer Science", "Business", "Engineering", "Economics"),
                        List.of("кыргызстан", "программирование", "бизнес", "инженерия", "экономика", "технологии"),
                        "Современный частный университет Кыргызстана с сильными IT и бизнес-программами.", "https://alatoo.edu.kg",
                        "ОРТ или внутренние вступительные экзамены.", 50),

                new University("Инженерный Колледж", "Kyrgyzstan", "Bishkek",
                        List.of("Engineering", "IT", "Electronics", "Construction"),
                        List.of("кыргызстан", "инженерия", "технологии", "электроника", "строительство", "колледж"),
                        "Профессиональное техническое образование по инженерным и IT-специальностям в Кыргызстане.", "https://ic.kg",
                        "ОРТ или внутренние экзамены по техническим дисциплинам.", 40),

                // 🇺🇿 Узбекистан
                new University("Webster University Tashkent", "Uzbekistan", "Tashkent",
                        List.of("Business", "Computer Science", "Media", "Psychology"),
                        List.of("узбекистан", "бизнес", "программирование", "медиа", "психология", "английский"),
                        "Американский университет в Ташкенте, диплом США.", "https://webster.uz",
                        "SAT или ACT, IELTS 6.0+.", 65),

                new University("Turin Polytechnic University", "Uzbekistan", "Tashkent",
                        List.of("Engineering", "Architecture", "IT", "Economics"),
                        List.of("узбекистан", "инженерия", "архитектура", "технологии", "экономика"),
                        "Итальянский технический университет в Ташкенте.", "https://polito.uz",
                        "Вступительные экзамены, IELTS 5.5+.", 60)
        );
    }
}