package com.example.airforum.dto.categoryDto;

import com.example.airforum.enams.PostCategoryType;
import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class CategoryRequestDto {
    private String postCategoryType;
}
