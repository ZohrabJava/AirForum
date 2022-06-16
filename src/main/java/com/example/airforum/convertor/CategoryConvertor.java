package com.example.airforum.convertor;

import com.example.airforum.dto.categoryDto.CategoryRequestDto;
import com.example.airforum.dto.categoryDto.CategoryResponseDto;
import com.example.airforum.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryConvertor {

    public Category convert(CategoryRequestDto categoryRequestDto){
        return new Category(categoryRequestDto.getPostCategoryType());
    }
    public CategoryResponseDto convert(Category category){
        return new CategoryResponseDto(category.getId(),
                category.getPostCategory());
    }
}
