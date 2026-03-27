package com.crm.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request para crear un nuevo contacto")
public class ContactRequest {
    @Schema(description = "Nombre completo del contacto", example = "Juan Pérez")
    private String name;
    
    @Schema(description = "Correo electrónico único", example = "juan@example.com")
    private String email;
    
    @Schema(description = "Número de teléfono", example = "555123456")
    private String phone;
    
    @Schema(description = "Prefijo telefónico", example = "+34")
    private String phonePrefix;
    
    @Schema(description = "Nombre de la empresa", example = "Tech Corp")
    private String enterprise;

    public ContactRequest() {}

    public ContactRequest(String name, String email, String phone, String phonePrefix, String enterprise) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.phonePrefix = phonePrefix;
        this.enterprise = enterprise;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPhonePrefix() { return phonePrefix; }
    public void setPhonePrefix(String phonePrefix) { this.phonePrefix = phonePrefix; }
    public String getEnterprise() { return enterprise; }
    public void setEnterprise(String enterprise) { this.enterprise = enterprise; }
}
