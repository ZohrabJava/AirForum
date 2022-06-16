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
//    private Long id;
//
//    private String firstName;
//
//    private String lastName;
//
//    private String userName;
//
//    private String email;
//
//    private String errorText;
//
//    private Boolean enabled;
//
//    private Roles roles;
//{
//    "firstName":"Artur",
//        "lastName":"Hayrapetyan",
//        "userName":"ahayrapetyan",
//        "email":"ahayrapetyan@gmail.com",
//        "errorText":null,
//        "userId":1,
//        "status":1,
//        "verification":true,
//        "role":2
//}
 private String firstName;
 private String lastName;
 private String email;
 private String errorText;
 private Long userId;
 private Integer status;
 private Boolean verification;
 private Integer role;
}
