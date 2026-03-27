package com.crm.infrastructure.config;

import com.crm.application.usecase.*;
import com.crm.domain.port.ContactRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public GetAllContacts getAllContacts(ContactRepository contactRepository) {
        return new GetAllContacts(contactRepository);
    }

    @Bean
    public GetContactById getContactById(ContactRepository contactRepository) {
        return new GetContactById(contactRepository);
    }

    @Bean
    public CreateContact createContact(ContactRepository contactRepository) {
        return new CreateContact(contactRepository);
    }

    @Bean
    public UpdateContact updateContact(ContactRepository contactRepository) {
        return new UpdateContact(contactRepository);
    }

    @Bean
    public UpdateContactState updateContactState(ContactRepository contactRepository) {
        return new UpdateContactState(contactRepository);
    }

    @Bean
    public DeleteContact deleteContact(ContactRepository contactRepository) {
        return new DeleteContact(contactRepository);
    }

    @Bean
    public ExportContactsCsv exportContactsCsv(ContactRepository contactRepository) {
        return new ExportContactsCsv(contactRepository);
    }
}
