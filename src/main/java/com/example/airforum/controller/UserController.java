package com.example.airforum.controller;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.swing.text.html.HTMLDocument;

@RestController
@RequestMapping(path = "forum/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;


    @CrossOrigin(origins = "*")
    @PostMapping
    public String register(@RequestBody UserRequestDto request) {
        return userService.creatUser(request);
    }

    @GetMapping("/confirm")
    public String confirm(@RequestParam("token") String token) {
        userService.confirmToken(token);
        return "sucess";
    }

}
