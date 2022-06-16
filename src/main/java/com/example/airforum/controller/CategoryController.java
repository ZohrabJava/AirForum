package com.example.airforum.controller;

import com.example.airforum.convertor.CategoryConvertor;
import com.example.airforum.dto.categoryDto.CategoryRequestDto;
import com.example.airforum.dto.categoryDto.CategoryResponseDto;
import com.example.airforum.model.Category;
import com.example.airforum.service.impl.CategoryServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping
public class CategoryController {
    private final CategoryServiceImpl categoryService;
    private final CategoryConvertor convertor;

    @PostMapping("/category")
    public CategoryResponseDto creatCategory(@RequestBody CategoryRequestDto categoryRequestDto){
        return categoryService.createCategory(categoryRequestDto);
    }
    @GetMapping("/category/{id}")
    public Category getCategoryById(@PathVariable("id") Long id){
        return categoryService.categoryGetById(id);
    }
}
