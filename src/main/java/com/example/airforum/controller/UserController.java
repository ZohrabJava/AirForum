package com.example.airforum.controller;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.dto.userDto.UserUpdateRequestDto;
import com.example.airforum.dto.userDto.UserUpdateResponseDto;
import com.example.airforum.model.User;
import com.example.airforum.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/user/{username}")
    public UserResponseDto getUserByUserName(@PathVariable("username") String name){

        return userService.getByUserName(name);

    }
    @GetMapping("/userById/{id}")
    public UserResponseDto getUserByUserId(@PathVariable("id") Long id){

        return userService.getById(id);

    }
    @PostMapping("/blockUser")
    public UserUpdateResponseDto blockUser(@RequestBody UserUpdateRequestDto userUpdateRequestDto){
        return userService.blockUser(userUpdateRequestDto);
    }
    @GetMapping("/getAllUsers")
    public List<UserResponseDto> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/getAllAdmins")
    public List<UserResponseDto> getAllAdmins(){
        return userService.getAllAdmins();
    }


}
