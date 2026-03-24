package com.crm.application.usecase;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import java.util.List;
import java.util.UUID;

public class GetAllContacts {
    private final ContactRepository contactRepository;

    public GetAllContacts(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> execute() {
        return contactRepository.findAll();
    }
}
