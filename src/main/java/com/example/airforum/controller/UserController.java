package com.example.airforum.controller;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path = "forum/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/success")
    public String viewConfirmPage() {
        return "success";
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/creat")
    public String register(@RequestBody UserRequestDto request) {
         userService.creatUser(request);
         return "redirect:/forum/user/success";
    }


}
