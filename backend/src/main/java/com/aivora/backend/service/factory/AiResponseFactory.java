package com.aivora.backend.service.factory;

import com.aivora.backend.dto.ChatResponse;
import org.springframework.stereotype.Component;

@Component
public class AiResponseFactory {

    public ChatResponse createResponse(String reply) {
        return new ChatResponse(reply);
    }

    public ChatResponse createErrorResponse(String errorMessage) {
        return new ChatResponse("Извините, произошла ошибка: " + errorMessage +
                "\nПожалуйста, попробуйте снова.");
    }

    public ChatResponse createContextResponse(String university, String country) {
        return new ChatResponse(
                "Привет! Я вижу что тебя интересует **" + university +
                        "** (" + country + ") 🎓\n\n" +
                        "Я помогу тебе подготовиться к поступлению!\n\n" +
                        "С чего начнём?\n" +
                        "1️⃣ Составить план подготовки\n" +
                        "2️⃣ Узнать про требования и тесты\n" +
                        "3️⃣ Подобрать учебные материалы"
        );
    }
}
