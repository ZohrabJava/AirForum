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
    private List<String> category;
    private LocalDateTime localDateTime;
    private String status;
    private String firstName;
    private String lastName;
    private String userImg;
    private List<PostCommentResponseDto> comments;

}
