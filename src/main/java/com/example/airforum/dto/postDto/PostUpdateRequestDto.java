package com.example.airforum.dto.postDto;

import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class PostUpdateRequestDto {
    private String userName;
    private Long id;
}
