package com.example.airforum.repository;

import com.example.airforum.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository  extends JpaRepository<Category,Long> {
//    @Query("select Category c " +
//            "from Category  WHERE Category.id= id")

    Category getCategoryById(Long id);
}
