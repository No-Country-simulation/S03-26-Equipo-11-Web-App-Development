package com.crm.infrastructure.controller;

import com.crm.application.dto.ContactRequest;
import com.crm.application.dto.ContactResponse;
import com.crm.application.dto.UpdateContactRequest;
import com.crm.application.dto.UpdateContactStateRequest;
import com.crm.application.usecase.*;
import com.crm.domain.model.Contact;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    private final GetAllContacts getAllContacts;
    private final GetContactById getContactById;
    private final CreateContact createContact;
    private final UpdateContact updateContact;
    private final UpdateContactState updateContactState;
    private final DeleteContact deleteContact;
    private final ExportContactsCsv exportContactsCsv;

    public ContactController(
            GetAllContacts getAllContacts,
            GetContactById getContactById,
            CreateContact createContact,
            UpdateContact updateContact,
            UpdateContactState updateContactState,
            DeleteContact deleteContact,
            ExportContactsCsv exportContactsCsv) {
        this.getAllContacts = getAllContacts;
        this.getContactById = getContactById;
        this.createContact = createContact;
        this.updateContact = updateContact;
        this.updateContactState = updateContactState;
        this.deleteContact = deleteContact;
        this.exportContactsCsv = exportContactsCsv;
    }

    /**
     * List all contacts with optional filters
     * GET /api/contacts?q=search&state=Lead
     */
    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String state) {
        List<Contact> contacts = getAllContacts.execute(q, state);
        List<ContactResponse> response = contacts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Get contact by ID
     * GET /api/contacts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getById(@PathVariable UUID id) {
        Optional<Contact> contact = getContactById.execute(id);
        return contact.map(c -> ResponseEntity.ok(toResponse(c)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Create new contact
     * POST /api/contacts
     */
    @PostMapping
    public ResponseEntity<ContactResponse> create(@RequestBody ContactRequest request) {
        try {
            Contact contact = createContact.execute(
                    request.getName(),
                    request.getEmail(),
                    request.getPhone(),
                    request.getPhonePrefix(),
                    request.getEnterprise());
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(contact));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Update contact (name, email, enterprise)
     * PUT /api/contacts/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> update(
            @PathVariable UUID id,
            @RequestBody UpdateContactRequest request) {
        try {
            Optional<Contact> contact = updateContact.execute(
                    id,
                    request.getName(),
                    request.getEmail(),
                    request.getEnterprise());
            return contact.map(c -> ResponseEntity.ok(toResponse(c)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Update contact state
     * PATCH /api/contacts/{id}/state
     */
    @PatchMapping("/{id}/state")
    public ResponseEntity<ContactResponse> updateState(
            @PathVariable UUID id,
            @RequestBody UpdateContactStateRequest request) {
        try {
            Optional<Contact> contact = updateContactState.execute(id, request.getState());
            return contact.map(c -> ResponseEntity.ok(toResponse(c)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Delete contact (soft delete)
     * DELETE /api/contacts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deleteContact.execute(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Export contacts to CSV
     * GET /api/contacts/export?q=search&state=Lead
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> export(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String state) {
        try {
            byte[] csvData = exportContactsCsv.execute(q, state);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "contacts.csv");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private ContactResponse toResponse(Contact contact) {
        ContactResponse response = new ContactResponse();
        response.setId(contact.getId());
        response.setName(contact.getName());
        response.setEmail(contact.getEmail());
        response.setPhone(contact.getPhone());
        response.setPhonePrefix(contact.getPhonePrefix());
        response.setEnterprise(String.valueOf(contact.getEnterprise()));
        response.setState(contact.getState());
        response.setLastContact(contact.getLastContact());
        return response;
    }
}
