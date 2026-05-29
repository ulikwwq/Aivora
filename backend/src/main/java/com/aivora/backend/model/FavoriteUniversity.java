package com.aivora.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_universities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteUniversity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String universityName;

    @Column(nullable = false)
    private String country;

    private String city;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    @PrePersist
    public void prePersist() {
        savedAt = LocalDateTime.now();
    }
}
