package com.example.airforum.controller;

import com.example.airforum.service.UserService;
import com.example.airforum.service.impl.CustomUserDetailsService;
import com.example.airforum.service.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@AllArgsConstructor
public class PageController {

    private final UserServiceImpl userService;


    @GetMapping("/confirm")
    public String viewConfirmPage(@RequestParam("token") String token) {
        userService.confirmToken(token);
        return "emailSuccess";
    }

    @GetMapping("/home")
    public String viewHome() {
        return "index";
    }


}
