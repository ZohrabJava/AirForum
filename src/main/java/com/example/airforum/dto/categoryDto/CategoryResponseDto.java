package com.example.airforum.dto.categoryDto;

import com.example.airforum.enams.PostCategoryType;
import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class CategoryResponseDto {
    private Long id;
    private String postCategoryType;
    private String postCategoryTypeHy;
    private String postCategoryTypeRu;
    private String errorText;
}
