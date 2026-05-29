package com.aivora.backend.service.strategy;

import com.aivora.backend.service.UniversityDataset;
import java.util.List;

public interface RecommendationStrategy {
    List<UniversityDataset.University> recommend(
            List<UniversityDataset.University> universities,
            String query
    );
}
