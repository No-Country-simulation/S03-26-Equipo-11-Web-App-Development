package com.crm.infrastructure.controller;

import com.crm.application.usecase.GetAllContacts;
import com.crm.domain.model.Contact;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final GetAllContacts getAllContacts;

    public ContactController(GetAllContacts getAllContacts) {
        this.getAllContacts = getAllContacts;
    }

    @GetMapping
    public ResponseEntity<List<Contact>> getAll() {
        List<Contact> contacts = getAllContacts.execute();
        return ResponseEntity.ok(contacts);
    }
}
