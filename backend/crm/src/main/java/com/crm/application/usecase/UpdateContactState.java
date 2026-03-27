package com.crm.application.usecase;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UpdateContactState {
    private final ContactRepository contactRepository;
    private static final List<String> VALID_STATES = Arrays.asList("Lead", "Contactado", "Propuesta", "Cliente", "Inactivo");

    public UpdateContactState(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Optional<Contact> execute(UUID id, String state) {
        if (!VALID_STATES.contains(state)) {
            throw new IllegalArgumentException("Invalid state: " + state + ". Valid states: " + VALID_STATES);
        }

        Optional<Contact> existingContact = contactRepository.findById(id);
        
        if (existingContact.isEmpty()) {
            return Optional.empty();
        }

        Contact contact = existingContact.get();
        contact.setState(state);
        contact.setLastContact(LocalDate.now(ZoneId.of("UTC")));

        return Optional.of(contactRepository.save(contact));
    }
}
