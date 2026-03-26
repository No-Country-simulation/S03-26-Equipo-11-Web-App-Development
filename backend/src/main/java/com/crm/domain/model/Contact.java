package com.crm.domain.model;

import java.time.LocalDate;
import java.util.UUID;

public class Contact {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String phonePrefix;
    private Long enterprise;
    private String state;
    private LocalDate lastContact;
    private Boolean deletedAt;

    public Contact() {}

    public Contact(UUID id, String name, String email, String phone, 
                   String phonePrefix, Long enterprise, String state, 
                   LocalDate lastContact, Boolean deletedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.phonePrefix = phonePrefix;
        this.enterprise = enterprise;
        this.state = state;
        this.lastContact = lastContact;
        this.deletedAt = deletedAt;
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
    public Long getEnterprise() { return enterprise; }
    public void setEnterprise(Long enterprise) { this.enterprise = enterprise; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public LocalDate getLastContact() { return lastContact; }
    public void setLastContact(LocalDate lastContact) { this.lastContact = lastContact; }
    public Boolean getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Boolean deletedAt) { this.deletedAt = deletedAt; }
}
