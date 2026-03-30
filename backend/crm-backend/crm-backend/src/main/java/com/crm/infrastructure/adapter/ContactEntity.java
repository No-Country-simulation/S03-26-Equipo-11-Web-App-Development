package com.crm.infrastructure.adapter;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "contact")
public class ContactEntity {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "phone_prefix", nullable = false, length = 5)
    private String phonePrefix;

    @Column(name = "enterprise", nullable = false)
    private Long enterprise;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "last_contact", nullable = false)
    private LocalDate lastContact;

    @Column(name = "deleted_at", nullable = false)
    private Boolean deletedAt;

    public ContactEntity() {}

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
