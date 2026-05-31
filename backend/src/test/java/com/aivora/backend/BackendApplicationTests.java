package com.aivora.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "groq.api-key=test-key",
        "groq.model=test-model",
        "jwt.secret=test-secret-key-must-be-at-least-32-characters",
        "jwt.expiration=86400000"
})
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
