package com.example.airforum.service;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.model.User;

public interface UserService {
    UserResponseDto creatUser(UserRequestDto user);
    UserResponseDto getByLoginPassword(UserRequestDto user);

}