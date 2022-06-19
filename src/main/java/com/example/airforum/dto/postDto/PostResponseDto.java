package com.example.airforum.dto.postDto;

import com.example.airforum.dto.postCommentDto.PostCommentResponseDto;
import com.example.airforum.model.Category;
import com.example.airforum.model.PostComment;
import com.example.airforum.model.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class PostResponseDto {
    private Long postId;
    private String title;
    private String descriptionPath;
    private String imagePath;
    private String category;
    private LocalDateTime localDateTime;
    private String status;
    private String firstName;
    private String lastName;
    private List< PostCommentResponseDto> comments;

    public PostResponseDto(Long postId, String title, String descriptionPath, String imagePath, String category, LocalDateTime localDateTime, String status) {
        this.postId = postId;
        this.title = title;
        this.descriptionPath = descriptionPath;
        this.imagePath = imagePath;
        this.category = category;
        this.localDateTime = localDateTime;
        this.status = status;
    }
}
