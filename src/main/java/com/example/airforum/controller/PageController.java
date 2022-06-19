package com.example.airforum.controller;

import com.example.airforum.service.UserService;
import com.example.airforum.service.impl.CustomUserDetailsService;
import com.example.airforum.service.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Controller
@AllArgsConstructor
public class PageController {

    private final UserServiceImpl userService;

    @GetMapping("/confirm")
    public String viewConfirmPage(@RequestParam("token") String token) {
        String verification=userService.confirmToken(token);
        if(verification.equals("expired")){
            return "emailfaild";
        }
        return "emailSuccess";
    }

    @GetMapping("/index.html")
    public String viewHome() {
        return "index";
    }

    @GetMapping("/admins")
    public String viwAdmins() {
        return "admins";
    }
    @GetMapping("/users")
    public String viwUsers() {
        return "users";
    }
    @GetMapping("/postsforapproval")
    public String viewPostsForApproval() {
        return "postsforapproval";
    }

    @GetMapping("/categories")
    public String viewCategories() {
        return "categories";
    }
    @GetMapping("/myposts")
    public String viewMyPosts() {
        return "myposts";
    }
    @GetMapping("/posts")
    public String viewPosts() {
        return "posts";
    }


}
