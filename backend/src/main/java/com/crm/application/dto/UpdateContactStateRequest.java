package com.crm.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request para actualizar el estado de un contacto")
public class UpdateContactStateRequest {
    @Schema(
        description = "Nuevo estado del contacto en el funnel",
        example = "Contactado",
        allowableValues = {"Lead", "Contactado", "Propuesta", "Cliente", "Inactivo"},
        required = true
    )
    private String state;

    public UpdateContactStateRequest() {}

    public UpdateContactStateRequest(String state) {
        this.state = state;
    }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
