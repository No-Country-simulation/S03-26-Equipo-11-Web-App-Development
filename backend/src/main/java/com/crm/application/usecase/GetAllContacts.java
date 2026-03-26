package com.crm.application.usecase;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class GetAllContacts {
    private final ContactRepository contactRepository;

    public GetAllContacts(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> execute(String search, String state) {
        return contactRepository.findAll(search, state);
    }
}
