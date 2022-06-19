package com.example.airforum.dto.userDto;

import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class UserUpdateRequestDto {
    private String userName;
    private Long id;
}
