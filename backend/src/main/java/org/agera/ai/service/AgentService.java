package org.agera.ai.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Service
public class AgentService {
    private final AgentAIService agent;

    public AgentService(AgentAIService agent) {
        this.agent = agent;
    }

    public Flux<String> chat(String message) {
        UUID.randomUUID().toString();
        return agent.chat(message);
    }
}
