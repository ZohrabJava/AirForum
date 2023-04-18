package com.example.airforum.dto.userDto;


import lombok.*;
import org.springframework.lang.Nullable;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class UserRequestDto implements Serializable {

    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String password;
    private String imagePath;
    private String lang;

}
