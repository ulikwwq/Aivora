package com.aivora.backend.dto;

import lombok.Data;

@Data
public class RecommendationRequest {
    private String interests;
    private String country;
    private String specialty;
}