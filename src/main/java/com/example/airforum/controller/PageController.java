package com.example.airforum.controller;

import com.example.airforum.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@AllArgsConstructor
public class PageController {
    private final UserService userService;

    @GetMapping("/forum")
    public String viewLoginPage() {
        return "index";
    }

    @GetMapping("/forum/user/register")
    public String viewRegisterPage() {
        return "register";
    }

    @GetMapping("/confirm")
    public String viewConfirmPage(@RequestParam("token") String token) {
        userService.confirmToken(token);
        return "emailSuccess";
    }


}
