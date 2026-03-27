package com.crm.application.usecase;

import com.crm.domain.model.Contact;
import com.crm.domain.port.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ExportContactsCsv {
    private final ContactRepository contactRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public ExportContactsCsv(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public byte[] execute(String search, String state) throws IOException {
        List<Contact> contacts = contactRepository.findAll(search, state);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(outputStream);

        // Write CSV header
        writer.write("ID,Name,Email,Phone,Phone Prefix,Enterprise,State,Last Contact\n");

        // Write CSV data
        for (Contact contact : contacts) {
            writer.write(String.format("%s,", contact.getId()));
            writer.write(String.format("\"%s\",", escapeCsv(contact.getName())));
            writer.write(String.format("\"%s\",", escapeCsv(contact.getEmail())));
            writer.write(String.format("\"%s\",", escapeCsv(contact.getPhone())));
            writer.write(String.format("\"%s\",", escapeCsv(contact.getPhonePrefix())));
            writer.write(String.format("\"%s\",", escapeCsv(String.valueOf(contact.getEnterprise()))));
            writer.write(String.format("\"%s\",", escapeCsv(contact.getState())));
            writer.write(String.format("\"%s\"\n", contact.getLastContact().format(DATE_FORMATTER)));
        }

        writer.flush();
        return outputStream.toByteArray();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\"", "\"\"");
    }
}
