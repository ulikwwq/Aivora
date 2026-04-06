package com.aivora.backend.service;

import com.aivora.backend.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${groq.api-key}")
    private String apiKey;

    @Value("${groq.model}")
    private String model;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.groq.com")
            .build();

    private static final String SYSTEM_PROMPT = """
            Ты — Aivora, AI университетский советник. Твоя задача — помочь пользователю выбрать подходящую специальность и университет, а также помочь подготовиться к поступлению.
            
            Веди диалог по следующему плану:
            1. Сначала узнай интересы пользователя (что ему нравится, чем занимается)
            2. Узнай его цели (кем хочет стать, какой доход ожидает)
            3. Узнай его навыки и сильные стороны
            4. На основе собранных данных порекомендуй 2-3 подходящие специальности и университеты
            5. Помоги составить план подготовки к поступлению
            
            Если пользователь уже выбрал университет — помоги ему подготовиться:
            - Расскажи какие тесты нужно сдать
            - Составь план подготовки по месяцам
            - Порекомендуй учебные материалы и курсы
            - Помоги улучшить нужные навыки
            
            Общайся дружелюбно, задавай по одному вопросу за раз.
            Отвечай на том языке, на котором пишет пользователь.
            """;

    public ChatResponse chat(List<Map<String, String>> history, String userMessage, String uniContext) {

        history.add(Map.of("role", "user", "content", userMessage));

        var messages = new ArrayList<Map<String, String>>();

        // Если есть контекст университета — добавляем его в system prompt
        String finalSystemPrompt = SYSTEM_PROMPT;
        if (uniContext != null && !uniContext.isEmpty()) {
            finalSystemPrompt = SYSTEM_PROMPT + "\n\nВАЖНО: Пользователь уже выбрал университет и хочет подготовиться к поступлению. Контекст: " + uniContext + "\nПомоги ему конкретно с подготовкой к этому университету.";
        }

        messages.add(Map.of("role", "system", "content", finalSystemPrompt));

        // Добавляем историю (фильтруем системные сообщения)
        messages.addAll(history.stream()
                .filter(m -> !m.getOrDefault("role", "").equals("system-context"))
                .collect(Collectors.toList()));

        var requestBody = Map.of(
                "model", model,
                "messages", messages,
                "temperature", 0.7
        );

        var response = webClient.post()
                .uri("/openai/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        var choices = (List<Map<String, Object>>) response.get("choices");
        var message = (Map<String, String>) choices.get(0).get("message");
        String reply = message.get("content");

        history.add(Map.of("role", "assistant", "content", reply));

        return new ChatResponse(reply);
    }
}