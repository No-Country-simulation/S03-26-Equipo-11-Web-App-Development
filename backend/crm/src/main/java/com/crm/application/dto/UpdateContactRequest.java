package com.crm.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request para actualizar datos de un contacto")
public class UpdateContactRequest {
    @Schema(description = "Nombre completo del contacto", example = "Juan Pérez", required = false)
    private String name;
    
    @Schema(description = "Correo electrónico único", example = "juan@example.com", required = false)
    private String email;
    
    @Schema(description = "Nombre de la empresa", example = "Tech Corp", required = false)
    private String enterprise;

    public UpdateContactRequest() {}

    public UpdateContactRequest(String name, String email, String enterprise) {
        this.name = name;
        this.email = email;
        this.enterprise = enterprise;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getEnterprise() { return enterprise; }
    public void setEnterprise(String enterprise) { this.enterprise = enterprise; }
}
