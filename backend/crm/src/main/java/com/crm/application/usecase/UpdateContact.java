package com.crm.application.usecase;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UpdateContact {
    private final ContactRepository contactRepository;

    public UpdateContact(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Optional<Contact> execute(UUID id, String name, String email, String enterprise) {
        Optional<Contact> existingContact = contactRepository.findById(id);
        
        if (existingContact.isEmpty()) {
            return Optional.empty();
        }

        Contact contact = existingContact.get();
        
        // Validate email uniqueness if changed
        if (!contact.getEmail().equals(email) && contactRepository.existsByEmailExcludingId(email, id)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        contact.setName(name != null ? name : contact.getName());
        contact.setEmail(email != null ? email : contact.getEmail());
        if (enterprise != null && !enterprise.isEmpty()) {
            contact.setEnterprise(parseEnterprise(enterprise, contact.getEnterprise()));
        }
        contact.setLastContact(LocalDate.now(ZoneId.of("UTC")));

        return Optional.of(contactRepository.save(contact));
    }

    private Long parseEnterprise(String enterprise, Long currentEnterprise) {
        try {
            return Long.parseLong(enterprise);
        } catch (NumberFormatException e) {
            return currentEnterprise;
        }
    }
}
