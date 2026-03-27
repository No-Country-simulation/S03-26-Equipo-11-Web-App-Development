package com.crm.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Respuesta con datos del contacto")
public class ContactResponse {
    @Schema(description = "ID único del contacto", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    
    @Schema(description = "Nombre completo del contacto", example = "Juan Pérez")
    private String name;
    
    @Schema(description = "Correo electrónico", example = "juan@example.com")
    private String email;
    
    @Schema(description = "Número de teléfono", example = "555123456")
    private String phone;
    
    @Schema(description = "Prefijo telefónico", example = "+34")
    private String phonePrefix;
    
    @Schema(description = "Empresa", example = "Tech Corp")
    private String enterprise;
    
    @Schema(description = "Estado en el funnel", example = "Lead", allowableValues = {"Lead", "Contactado", "Propuesta", "Cliente", "Inactivo"})
    private String state;
    
    @Schema(description = "Fecha del último contacto", example = "2026-03-25")
    private LocalDate lastContact;

    public ContactResponse() {}

    public ContactResponse(UUID id, String name, String email, String phone, String phonePrefix,
                           String enterprise, String state, LocalDate lastContact) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.phonePrefix = phonePrefix;
        this.enterprise = enterprise;
        this.state = state;
        this.lastContact = lastContact;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPhonePrefix() { return phonePrefix; }
    public void setPhonePrefix(String phonePrefix) { this.phonePrefix = phonePrefix; }
    
    @JsonProperty("enterprise")
    public String getEnterprise() { return enterprise; }
    public void setEnterprise(String enterprise) { this.enterprise = enterprise; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public LocalDate getLastContact() { return lastContact; }
    public void setLastContact(LocalDate lastContact) { this.lastContact = lastContact; }
}
