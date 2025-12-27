package org.agera.ai.controller;

import org.agera.ai.model.UserRequest;
import org.agera.ai.service.AgentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping(path = "/api/v1/chat")
public class AgentController {

    private final AgentService agent;

    public AgentController(AgentService agent) {
        this.agent = agent;
    }

    @PostMapping(produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<String> chat(@RequestBody UserRequest req) {
        return agent.chat(req.getRequest());
    }
}
