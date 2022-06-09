package com.example.airforum.controller;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(path = "confirm")
    @ResponseBody
    public String confirm(@RequestParam("token") String token) {
         userService.confirmToken(token);
        return "success.html";
    }

}
