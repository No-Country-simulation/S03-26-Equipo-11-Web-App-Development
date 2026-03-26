package com.crm.application.usecase;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CreateContact {
    private final ContactRepository contactRepository;

    public CreateContact(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Contact execute(String name, String email, String phone, String phonePrefix, String enterprise) {
        // Validate email uniqueness
        if (contactRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        Contact contact = new Contact();
        contact.setId(UUID.randomUUID());
        contact.setName(name);
        contact.setEmail(email);
        contact.setPhone(phone);
        contact.setPhonePrefix(phonePrefix);
        contact.setEnterprise(enterprise != null && !enterprise.isEmpty() ? parseEnterprise(enterprise) : 1L);
        contact.setState("Lead");
        contact.setLastContact(LocalDate.now(ZoneId.of("UTC")));
        contact.setDeletedAt(false);

        return contactRepository.save(contact);
    }

    private Long parseEnterprise(String enterprise) {
        try {
            return Long.parseLong(enterprise);
        } catch (NumberFormatException e) {
            return 1L;
        }
    }
}
