package com.aivora.backend.service;

import com.aivora.backend.service.strategy.ByCountryStrategy;
import com.aivora.backend.service.strategy.ByInterestStrategy;
import com.aivora.backend.service.strategy.RecommendationStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    private RecommendationService service;
    private UniversityDataset dataset;

    @BeforeEach
    void setUp() {
        dataset = new UniversityDataset();
        Map<String, RecommendationStrategy> strategies = new HashMap<>();
        strategies.put("byInterest", new ByInterestStrategy());
        strategies.put("byCountry", new ByCountryStrategy());
        service = new RecommendationService(dataset, strategies);
    }

    @Test
    void getAll_ReturnsAllUniversities() {
        var result = service.getAll();
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void recommend_ByCountry_ReturnsKyrgyzstanOnly() {
        var result = service.recommend(null, "Kyrgyzstan", null);
        assertFalse(result.isEmpty());
        result.forEach(u ->
                assertEquals("Kyrgyzstan", u.country()));
    }

    @Test
    void recommend_ByInterest_ReturnsProgramming() {
        var result = service.recommend("программирование", null, null);
        assertFalse(result.isEmpty());
    }

    @Test
    void findByName_ExistingUniversity_ReturnsIt() {
        var result = service.findByName("MIT");
        assertTrue(result.isPresent());
        assertEquals("MIT", result.get().name());
    }

    @Test
    void findByName_NotExisting_ReturnsEmpty() {
        var result = service.findByName("Несуществующий");
        assertFalse(result.isPresent());
    }

    @Test
    void getCountries_ReturnsDistinctList() {
        var countries = service.getCountries();
        assertNotNull(countries);
        assertEquals(countries.stream().distinct().count(), countries.size());
    }
}
