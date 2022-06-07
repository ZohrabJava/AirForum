package com.example.airforum.model;

import javax.persistence.*;
import java.io.Serializable;


@Entity
@Table(name = "user_role", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "role_id"})})
public class UserRole implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_role_id", nullable = false)
    private Long id;
    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;
    @JoinColumn(name = "role_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Role role;

    public UserRole(User user, Role role) {
        this.user = user;
        this.role = role;
    }

    public UserRole() {

    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
