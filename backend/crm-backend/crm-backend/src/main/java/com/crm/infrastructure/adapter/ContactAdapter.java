package com.crm.infrastructure.adapter;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import com.crm.infrastructure.mapper.ContactMapper;
import jakarta.persistence.*;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class ContactAdapter implements ContactRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Contact> findAll() {
        TypedQuery<ContactEntity> query = entityManager.createQuery(
            "SELECT c FROM ContactEntity c WHERE c.deletedAt = false", ContactEntity.class);
        return query.getResultList().stream()
            .map(ContactMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public Contact findById(UUID id) {
        ContactEntity entity = entityManager.find(ContactEntity.class, id);
        return ContactMapper.toDomain(entity);
    }

    @Override
    public Contact save(Contact contact) {
        ContactEntity entity = ContactMapper.toEntity(contact);
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entityManager.merge(entity);
        }
        return contact;
    }

    @Override
    public void deleteById(UUID id) {
        ContactEntity entity = entityManager.find(ContactEntity.class, id);
        if (entity != null) {
            entity.setDeletedAt(true);
            entityManager.merge(entity);
        }
    }
}
