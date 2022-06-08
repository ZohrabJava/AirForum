package com.example.airforum.model;

import com.example.airforum.enams.Roles;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "role")
public class Role implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id", nullable = false)
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(name = "role", unique = true)
    private Roles roles;

    public Role(Roles roles) {
        this.roles = roles;
    }

    public Role() {

    }

    public Long getId() {
        return id;
    }

    public Roles getRoles() {
        return roles;
    }

    public void setRoles(Roles roles) {
        this.roles = roles;
    }
}
