package com.crm.infrastructure.config;

import com.crm.application.usecase.GetAllContacts;
import com.crm.domain.port.ContactRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public GetAllContacts getAllContacts(ContactRepository contactRepository) {
        return new GetAllContacts(contactRepository);
    }
}
