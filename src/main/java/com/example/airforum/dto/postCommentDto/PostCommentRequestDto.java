package com.example.airforum.dto.postCommentDto;

import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class PostCommentRequestDto {
    private String userName;
    private Long postId;
    private String comment;
}
