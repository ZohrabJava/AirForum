package com.example.airforum.validator;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserUpdateResponseDto;

public class RegisterValidator {
    public static final String NAME_REGEX = "^[Ա-Ֆա-ֆА-Яа-яЁёA-Za-z ]+$";
    public static final String MAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String USERNAME_REGEX = "^[a-zA-Z0-9._-]{3,20}$";
    public static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!])(?=\\S+$).{8,}$";

    public static UserUpdateResponseDto isValidForm(UserRequestDto userRequestDto) {
        UserUpdateResponseDto userUpdateResponseDto = new UserUpdateResponseDto();
        if (!userRequestDto.getFirstName().matches(NAME_REGEX) ||
                userRequestDto.getFirstName().length() > 30) {
            userUpdateResponseDto.setErrorText("badFirstName");
            return userUpdateResponseDto;
        }
        if (!userRequestDto.getLastName().matches(NAME_REGEX) ||
                userRequestDto.getLastName().length() > 30) {
            userUpdateResponseDto.setErrorText("badLastName");
            return userUpdateResponseDto;
        }
        if (!userRequestDto.getUserName().matches(USERNAME_REGEX)) {
            userUpdateResponseDto.setErrorText("badUsername");
            return userUpdateResponseDto;
        }
        if (!userRequestDto.getEmail().matches(MAIL_REGEX)) {
            userUpdateResponseDto.setErrorText("badMail");
            return userUpdateResponseDto;
        }
        if (!userRequestDto.getPassword().matches(PASSWORD_REGEX)) {
            userUpdateResponseDto.setErrorText("badPassword");
            return userUpdateResponseDto;
        }
        return null;
    }
}
