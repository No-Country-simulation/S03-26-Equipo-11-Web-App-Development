package com.crm.application.usecase;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class GetContactById {
    private final ContactRepository contactRepository;

    public GetContactById(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Optional<Contact> execute(UUID id) {
        return contactRepository.findById(id);
    }
}
