package com.example.airforum.service.impl;

import com.example.airforum.convertor.CategoryConvertor;
import com.example.airforum.dto.categoryDto.CategoryRequestDto;
import com.example.airforum.dto.categoryDto.CategoryResponseDto;
import com.example.airforum.model.Category;
import com.example.airforum.model.User;
import com.example.airforum.repository.CategoryRepository;
import com.example.airforum.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {
    private  final CategoryRepository categoryRepository;
    private final CategoryConvertor categoryConvertor;

    public Category  categoryGetById(Long id) {
        return categoryRepository.getCategoryById(id);

    }

    public CategoryResponseDto createCategory(CategoryRequestDto categoryRequestDto){
      Category category = categoryRepository.save( categoryConvertor.convert(categoryRequestDto));
        return categoryConvertor.convert(category);
    }
}
