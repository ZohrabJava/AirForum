package com.example.airforum.dto.postDto;

import com.example.airforum.model.Category;
import com.example.airforum.model.User;
import lombok.*;

import java.time.LocalDateTime;

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
}
