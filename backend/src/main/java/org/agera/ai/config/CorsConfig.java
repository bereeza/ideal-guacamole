package org.agera.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // allow cookies to be sent with the request
        config.setAllowCredentials(true);
        // allows requests for the frontend only
        config.addAllowedOrigin("https://ideal-guacamole--personal-482711.us-east4.hosted.app/");
        config.addAllowedHeader("*");

        config.setAllowedMethods(Arrays.asList("POST"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
