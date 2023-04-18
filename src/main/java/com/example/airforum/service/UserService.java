package com.example.airforum.service;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.dto.userDto.UserUpdateRequestDto;
import com.example.airforum.dto.userDto.UserUpdateResponseDto;
import com.example.airforum.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserUpdateResponseDto creatUser(UserRequestDto user);
    UserResponseDto getByUserName(String userName);
    UserResponseDto getById( Long id);
    List<UserResponseDto> getAllUsers();
    List<UserResponseDto> getAllAdmins();

    UserUpdateResponseDto updateUser(UserUpdateRequestDto userUpdateRequestDto);

    UserUpdateResponseDto changeRole(UserUpdateRequestDto userUpdateRequestDto);

    UserUpdateResponseDto resetPassword(UserUpdateRequestDto user);

    UserUpdateResponseDto updateUserPassword(String token, String password);
    UserUpdateResponseDto changeUserPassword(UserUpdateRequestDto dto);
    UserResponseDto updateUserPicture(UserRequestDto userRequestDto);

    int getPostCount(long userId);
    int getCommentCount(long userId);
}
