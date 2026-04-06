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
                new University(
                        "MIT", "USA", "Boston",
                        List.of("Computer Science", "AI", "Robotics", "Engineering"),
                        List.of("программирование", "технологии", "математика", "физика", "инженерия"),
                        "Один из лучших технических университетов мира.",
                        "https://mit.edu", "Требуется SAT, TOEFL, рекомендательные письма.", 95
                ),
                new University(
                        "Stanford University", "USA", "California",
                        List.of("Computer Science", "Business", "Medicine", "AI"),
                        List.of("программирование", "бизнес", "медицина", "технологии", "стартапы"),
                        "Топ университет в Кремниевой долине, центр инноваций.",
                        "https://stanford.edu", "Требуется SAT/ACT, эссе, портфолио.", 96
                ),
                new University(
                        "NUS Singapore", "Singapore", "Singapore",
                        List.of("Computer Science", "Engineering", "Business", "Medicine"),
                        List.of("азия", "программирование", "бизнес", "инженерия", "технологии"),
                        "Лучший университет Азии, высокий процент трудоустройства.",
                        "https://nus.edu.sg", "Требуется A-Level или IB, IELTS 6.5+.", 85
                ),
                new University(
                        "KAIST", "South Korea", "Daejeon",
                        List.of("Computer Science", "AI", "Engineering", "Physics"),
                        List.of("программирование", "технологии", "математика", "исследования", "азия"),
                        "Ведущий технический университет Кореи, стипендии для иностранцев.",
                        "https://kaist.ac.kr", "Требуется TOEFL 83+, рекомендации.", 80
                ),
                new University(
                        "University of Amsterdam", "Netherlands", "Amsterdam",
                        List.of("Data Science", "AI", "Business", "Economics"),
                        List.of("данные", "аналитика", "бизнес", "экономика", "европа"),
                        "Сильная программа по Data Science и AI в центре Европы.",
                        "https://uva.nl", "Требуется диплом, IELTS 6.5+.", 75
                ),
                new University(
                        "ИТМО", "Russia", "Saint Petersburg",
                        List.of("Computer Science", "AI", "Photonics", "Mathematics"),
                        List.of("программирование", "олимпиады", "математика", "технологии", "россия"),
                        "Чемпион мировых олимпиад по программированию, сильная IT школа.",
                        "https://itmo.ru", "ЕГЭ по математике и информатике, олимпиады.", 85
                ),
                new University(
                        "ВШЭ", "Russia", "Moscow",
                        List.of("Economics", "Computer Science", "Business", "Data Science"),
                        List.of("экономика", "бизнес", "данные", "аналитика", "россия"),
                        "Ведущий экономический и IT университет России.",
                        "https://hse.ru", "ЕГЭ, олимпиады, конкурс портфолио.", 80
                ),
                new University(
                        "Nazarbayev University", "Kazakhstan", "Astana",
                        List.of("Engineering", "Medicine", "Business", "Computer Science"),
                        List.of("казахстан", "инженерия", "медицина", "бизнес", "стипендия"),
                        "Топ университет Казахстана, стипендии, обучение на английском.",
                        "https://nu.edu.kz", "ЕНТ или SAT, IELTS 6.0+, стипендии доступны.", 70
                ),
                new University(
                        "American University of Central Asia", "Kyrgyzstan", "Bishkek",
                        List.of("Business", "Computer Science", "Journalism", "Psychology"),
                        List.of("кыргызстан", "бизнес", "программирование", "психология", "журналистика"),
                        "Лучший либеральный университет ЦА, обучение на английском.",
                        "https://auca.kg", "SAT или внутренний тест, IELTS 5.5+.", 60
                ),
                new University(
                        "University of Tokyo", "Japan", "Tokyo",
                        List.of("Engineering", "Computer Science", "Medicine", "Physics"),
                        List.of("япония", "инженерия", "технологии", "медицина", "исследования"),
                        "Лучший университет Японии, стипендии MEXT для иностранцев.",
                        "https://u-tokyo.ac.jp", "Стипендия MEXT, JLPT N2+ или программы на английском.", 85
                )
        );
    }
}