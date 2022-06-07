package com.example.airforum.model;

import jdk.jfr.Enabled;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "user")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;
    @Column(name = "user_name", unique = true)
    private String userName;
    @Column(name = "password")
    private String password;
    private String name;
    private String surName;
    private String eMail;

    public User(String userName, String password, String name, String surName, String eMail) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.surName = surName;
        this.eMail = eMail;
    }

    public User() {

    }

    public Long getId() {
        return id;
    }


    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurName() {
        return surName;
    }

    public void setSurName(String surName) {
        this.surName = surName;
    }

    public String geteMail() {
        return eMail;
    }

    public void seteMail(String eMail) {
        this.eMail = eMail;
    }
}
