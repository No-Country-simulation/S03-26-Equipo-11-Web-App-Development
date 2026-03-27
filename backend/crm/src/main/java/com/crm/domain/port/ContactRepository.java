package com.crm.domain.port;

import com.crm.domain.model.Contact;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContactRepository {
    List<Contact> findAll();
    List<Contact> findAll(String search, String state);
    Optional<Contact> findById(UUID id);
    Contact save(Contact contact);
    void deleteById(UUID id);
    boolean existsByEmail(String email);
    boolean existsByEmailExcludingId(String email, UUID id);
}
