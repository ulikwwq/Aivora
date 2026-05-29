package com.aivora.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {

    @NotBlank(message = "Сообщение не может быть пустым")
    private String message;

    private String uniContext;
}