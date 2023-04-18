package com.example.airforum.dto.userDto;

import com.example.airforum.enams.Roles;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@NoArgsConstructor
public class UserResponseDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private Boolean verification;
    private Integer role;
    private String imagePath;
    private String message;
    private int postCount;
    private int commentCount;
}
