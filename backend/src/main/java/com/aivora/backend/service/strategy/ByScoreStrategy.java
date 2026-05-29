package com.aivora.backend.service.strategy;

import com.aivora.backend.service.UniversityDataset;
import org.springframework.stereotype.Component;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component("byScore")
public class ByScoreStrategy implements RecommendationStrategy {

    @Override
    public List<UniversityDataset.University> recommend(
            List<UniversityDataset.University> universities, String query) {
        return universities.stream()
                .sorted(Comparator.comparingInt(
                        UniversityDataset.University::minScore).reversed())
                .collect(Collectors.toList());
    }
}