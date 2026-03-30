package com.crm.infrastructure.mapper;

import com.crm.domain.model.Contact;
import com.crm.infrastructure.adapter.ContactEntity;

public class ContactMapper {

    public static Contact toDomain(ContactEntity entity) {
        if (entity == null) return null;
        return new Contact(
            entity.getId(),
            entity.getName(),
            entity.getEmail(),
            entity.getPhone(),
            entity.getPhonePrefix(),
            entity.getEnterprise(),
            entity.getState(),
            entity.getLastContact(),
            entity.getDeletedAt()
        );
    }

    public static ContactEntity toEntity(Contact contact) {
        if (contact == null) return null;
        ContactEntity entity = new ContactEntity();
        entity.setId(contact.getId());
        entity.setName(contact.getName());
        entity.setEmail(contact.getEmail());
        entity.setPhone(contact.getPhone());
        entity.setPhonePrefix(contact.getPhonePrefix());
        entity.setEnterprise(contact.getEnterprise());
        entity.setState(contact.getState());
        entity.setLastContact(contact.getLastContact());
        entity.setDeletedAt(contact.getDeletedAt());
        return entity;
    }
}
