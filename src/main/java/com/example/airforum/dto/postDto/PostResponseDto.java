package com.example.airforum.dto.postDto;

import com.example.airforum.model.Category;
import com.example.airforum.model.User;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class PostResponseDto {
    private User userId;
    private Long postId;
    private String title;
    private String descriptionPath;
    private String imagePath;
    private Category categoryId;
}
