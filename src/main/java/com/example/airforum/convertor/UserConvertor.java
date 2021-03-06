package com.example.airforum.convertor;

import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserConvertor {

    public UserResponseDto toUserDto(User user) {
        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setUserId(user.getId());
        userResponseDto.setFirstName(user.getFirstName());
        userResponseDto.setLastName(user.getLastName());
        userResponseDto.setUserName(user.getUserName());
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setVerification(user.getEnabled());
        userResponseDto.setRole(user.getRoles().ordinal());
        return userResponseDto;
    }

}
