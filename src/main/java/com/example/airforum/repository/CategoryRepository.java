package com.example.airforum.repository;

import com.example.airforum.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository  extends JpaRepository<Category,Long> {
    Category getCategoryById(Long id);
    Category getCategoryByPostCategory(String categoryName);

}
