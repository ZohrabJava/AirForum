package com.example.airforum.service;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.model.User;

import java.util.Optional;

public interface UserService {
    String creatUser(UserRequestDto user);
    UserResponseDto getByUserName(String userName);
    UserResponseDto getById( Long id);
}
