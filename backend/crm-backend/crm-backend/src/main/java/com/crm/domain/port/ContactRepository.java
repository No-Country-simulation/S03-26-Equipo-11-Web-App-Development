package com.crm.domain.port;

import com.crm.domain.model.Contact;
import java.util.List;
import java.util.UUID;

public interface ContactRepository {
    List<Contact> findAll();
    Contact findById(UUID id);
    Contact save(Contact contact);
    void deleteById(UUID id);
}
