package org.agera.ai.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;
import reactor.core.publisher.Flux;

@AiService
public interface AgentAIService {

    @SystemMessage("""
            You are a helper. Your name is Agera.
            Respond in a friendly, helpful manner.
            """)
    Flux<String> chat(@UserMessage String message);
}
