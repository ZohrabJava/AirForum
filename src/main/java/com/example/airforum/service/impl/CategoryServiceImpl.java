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

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryConvertor categoryConvertor;

    public Category categoryGetById(Long id) {
        return categoryRepository.getCategoryById(id);

    }

    public CategoryResponseDto createCategory(CategoryRequestDto categoryRequestDto) {
        Category category;
        CategoryResponseDto categoryResponseDto=new CategoryResponseDto();
        if( getByName(categoryRequestDto.getPostCategoryType())==null){
             category = categoryRepository.save(categoryConvertor.convert(categoryRequestDto));
             categoryResponseDto=categoryConvertor.convert(category);
        }else{
            categoryResponseDto.setErrorText("Duplicate Category");
        }

        return categoryResponseDto;
    }

    public List<CategoryResponseDto> getAllCategory() {
        List<Category> category = categoryRepository.findAll();
        List<CategoryResponseDto> categoryResponseDto = new ArrayList<>();

        for (Category category1 : category) {
            categoryResponseDto.add(categoryConvertor.convert(category1));
        }
        return categoryResponseDto;
    }

    public CategoryResponseDto getByName(String categoryName) {

        return categoryConvertor.convert(categoryRepository.getCategoryByPostCategory(categoryName));
    }

}
