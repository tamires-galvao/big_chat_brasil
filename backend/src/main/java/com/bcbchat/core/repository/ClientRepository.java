package com.bcbchat.core.repository;

import com.bcbchat.core.domain.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, String> {

    Optional<Client> findByDocumentIdAndDocumentType(String documentId, String documentType);

    Optional<Client> findByDocumentId(String documentId);

}