package com.example.airforum.dto.userDto;


import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class UserRequestDto {
    private final String firstName;
    private final String lastName;
    private final String userName;
    private final String email;
    private final String password;
}
