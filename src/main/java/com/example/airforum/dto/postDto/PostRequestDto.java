package com.example.airforum.dto.postDto;

import com.example.airforum.model.Category;
import com.example.airforum.model.User;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class PostRequestDto {
        private String userName;
        private String title;
        private String descriptionPath;
        private String imagePath;
        private Long categoryId;
}
