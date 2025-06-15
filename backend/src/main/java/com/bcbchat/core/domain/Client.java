package com.bcbchat.core.domain;

import lombok.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Client {

    @Id
    private String id;

    private String name;

    private String documentId;      // CPF ou CNPJ

    private String documentType;    // "CPF" ou "CNPJ"

    private BigDecimal balance;     // Para plano pré-pago

    private BigDecimal creditLimit;       // Para plano pós-pago

    private String planType;        // "prepaid" ou "postpaid"

    private boolean active;

}