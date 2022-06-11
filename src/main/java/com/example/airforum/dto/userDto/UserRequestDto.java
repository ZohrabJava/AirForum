package com.example.airforum.dto.userDto;


import lombok.*;
import org.springframework.lang.Nullable;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class UserRequestDto {
    private  String firstName;
    private  String lastName;
    private  String userName;
    private  String email;
    private  String password;

}
