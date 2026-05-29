package com.aivora.backend.service.strategy;

import com.aivora.backend.service.UniversityDataset;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component("byInterest")
public class ByInterestStrategy implements RecommendationStrategy {

    @Override
    public List<UniversityDataset.University> recommend(
            List<UniversityDataset.University> universities, String query) {
        if (query == null || query.isEmpty()) return universities;
        String q = query.toLowerCase();
        return universities.stream()
                .filter(u -> u.tags().stream()
                        .anyMatch(tag -> q.contains(tag) || tag.contains(q.split(" ")[0])))
                .collect(Collectors.toList());
    }
}