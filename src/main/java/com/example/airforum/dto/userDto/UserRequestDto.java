package com.example.airforum.dto.userDto;


import lombok.*;
import org.springframework.lang.Nullable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class UserRequestDto implements Serializable {
    @NotEmpty(message = "First name can not be empty")
    private String firstName;
    @NotEmpty(message = "Last name can not be empty")
    private String lastName;
    @NotEmpty(message = "User name can not be empty")
    private String userName;
    @NotEmpty(message = "Email can not be empty")
    @Email(message = "Please provide a valid email id")
    private String email;
    @NotEmpty(message = "Password can not be empty")
    private String password;
    @NotEmpty(message = "Confirm password can not be empty")
    private String confirmPassword;

}
