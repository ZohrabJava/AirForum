package com.example.airforum.model;

import com.example.airforum.enams.PostCategoryType;


import javax.persistence.*;
import java.io.Serializable;


@Entity
@Table(name = "category")
public class Category implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", nullable = false)
    private Long id;
    @Column(name = "post_category", nullable = false, unique = true)
    private PostCategoryType postCategory;

    public Category(Long id, PostCategoryType postCategory) {
        this.id = id;
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

    public PostCategoryType getPostCategory() {
        return postCategory;
    }

    public void setPostCategory(PostCategoryType postCategory) {
        this.postCategory = postCategory;
    }
}
