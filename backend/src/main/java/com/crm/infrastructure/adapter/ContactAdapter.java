package com.crm.infrastructure.adapter;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import com.crm.infrastructure.mapper.ContactMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
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
    public List<Contact> findAll(String search, String state) {
        StringBuilder jpql = new StringBuilder(
            "SELECT c FROM ContactEntity c WHERE c.deletedAt = false");
        
        if (search != null && !search.isEmpty()) {
            jpql.append(" AND (LOWER(c.name) LIKE LOWER(:search) OR LOWER(c.enterprise) LIKE LOWER(:search))");
        }
        
        if (state != null && !state.isEmpty()) {
            jpql.append(" AND c.state = :state");
        }
        
        jakarta.persistence.TypedQuery<ContactEntity> query = entityManager.createQuery(jpql.toString(), ContactEntity.class);
        
        if (search != null && !search.isEmpty()) {
            query.setParameter("search", "%" + search + "%");
        }
        
        if (state != null && !state.isEmpty()) {
            query.setParameter("state", state);
        }
        
        return query.getResultList().stream()
            .map(ContactMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Contact> findById(UUID id) {
        ContactEntity entity = entityManager.find(ContactEntity.class, id);
        if (entity == null || entity.getDeletedAt()) {
            return Optional.empty();
        }
        return Optional.ofNullable(ContactMapper.toDomain(entity));
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

    @Override
    public boolean existsByEmail(String email) {
        try {
            Long count = entityManager.createQuery(
                "SELECT COUNT(c) FROM ContactEntity c WHERE c.email = :email AND c.deletedAt = false", Long.class)
                .setParameter("email", email)
                .getSingleResult();
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean existsByEmailExcludingId(String email, UUID id) {
        try {
            Long count = entityManager.createQuery(
                "SELECT COUNT(c) FROM ContactEntity c WHERE c.email = :email AND c.id != :id AND c.deletedAt = false", Long.class)
                .setParameter("email", email)
                .setParameter("id", id)
                .getSingleResult();
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }
}
