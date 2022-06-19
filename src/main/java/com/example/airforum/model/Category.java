package com.example.airforum.model;

import com.example.airforum.enams.PostCategoryType;


import javax.persistence.*;
import java.io.Serializable;


@Entity
@Table(name = "category")
public class Category implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "category_id", nullable = false)
    private Long id;

    @Column(name = "post_category", nullable = false, unique = true)
    private String postCategory;

    public Category( String postCategory) {
        this.postCategory = postCategory;
    }

    public Category() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPostCategory() {
        return postCategory;
    }

    public void setPostCategory(String postCategory) {
        this.postCategory = postCategory;
    }
}
