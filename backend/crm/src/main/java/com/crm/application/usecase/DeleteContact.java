package com.crm.application.usecase;

import com.crm.domain.port.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class DeleteContact {
    private final ContactRepository contactRepository;

    public DeleteContact(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public void execute(UUID id) {
        contactRepository.deleteById(id);
    }
}
