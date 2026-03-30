package com.crm.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.ExternalDocumentation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("CRM Backend API")
                .version("0.0.1")
                .description("API REST para el sistema CRM - Startup CRM\n\n" +
                    "## Funcionalidades\n" +
                    "- Gestión de contactos (CRUD completo)\n" +
                    "- Búsqueda y filtrado de contactos\n" +
                    "- Exportación a CSV\n" +
                    "- Segmentación por estado (Lead, Contactado, Propuesta, Cliente, Inactivo)")
                .contact(new Contact()
                    .name("Equipo 11 - Startup CRM")
                    .url("https://github.com/fabinnerself")))
            .externalDocs(new ExternalDocumentation()
                .description("Documentación del proyecto")
                .url("https://github.com/fabinnerself/crm-backend"));
    }
}
