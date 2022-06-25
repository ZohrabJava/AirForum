package com.example.airforum.model;


import org.springframework.security.core.authority.AuthorityUtils;

public class CurrentUser extends org.springframework.security.core.userdetails.User {
    private final User user;

    public CurrentUser (User user) {
        super(user.getUserName(), user.getPassword(), AuthorityUtils.createAuthorityList(String.valueOf(user.getRoles())));
        this.user = user;
    }

    public User getCompany() {
        return user;
    }
}
