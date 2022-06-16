package com.example.airforum.controller;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.model.User;
import com.example.airforum.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping()
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/success")
    public String viewConfirmPage() {
        return "success";
    }

    @PostMapping("/creat")
    public UserResponseDto register(@RequestBody UserRequestDto request) {
        userService.creatUser(request);
        return userService.getByUserName(request.getUserName());
    }
//    @GetMapping("/user")
//    public UserResponseDto getUserById(@RequestParam Long id){
//        return userService.getById(id);
//    }
    @GetMapping("/user/{username}")
    public UserResponseDto getUserByUserName(@PathVariable("username") String name){
        System.out.println(userService.getByUserName(name));
        return userService.getByUserName(name);

    }




}
