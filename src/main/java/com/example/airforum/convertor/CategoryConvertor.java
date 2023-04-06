package com.example.airforum.convertor;

import com.example.airforum.dto.categoryDto.CategoryRequestDto;
import com.example.airforum.dto.categoryDto.CategoryResponseDto;
import com.example.airforum.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryConvertor {

    public Category convert(CategoryRequestDto categoryRequestDto){
        Category category = new Category();
        category.setPostCategory(categoryRequestDto.getPostCategoryType());
        category.setPostCategoryHy(categoryRequestDto.getPostCategoryTypeHy());
        category.setPostCategoryRu(categoryRequestDto.getPostCategoryTypeRu());
        return category;
    }

    public CategoryResponseDto convert(Category category){
        CategoryResponseDto dto = new CategoryResponseDto();
        dto.setId(category.getId());
        dto.setPostCategoryType(category.getPostCategory());
        dto.setPostCategoryTypeHy(category.getPostCategoryHy());
        dto.setPostCategoryTypeRu(category.getPostCategoryRu());
        return dto;
    }
}
