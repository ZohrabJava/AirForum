package com.example.airforum.dto.postCommentDto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class PostCommentResponseDto {
    private String firstName;
    private String lastName;
    private String comment;
    private LocalDateTime localDateTime;
    private String userImg;
}
