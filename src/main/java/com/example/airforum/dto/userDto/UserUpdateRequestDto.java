package com.example.airforum.dto.userDto;

import com.example.airforum.enams.Roles;
import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class UserUpdateRequestDto {
    private String userName;
    private String token;
    private String password;
    private String confirmPassword;
    private Long id;
    private String email;
    private Boolean status;
    private Roles roles;
    private String lang;
}
