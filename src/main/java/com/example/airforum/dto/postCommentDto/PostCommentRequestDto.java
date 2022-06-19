package com.example.airforum.dto.postCommentDto;

import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class PostCommentRequestDto {
    private Long userId;
    private Long postId;
    private String comment;
}
