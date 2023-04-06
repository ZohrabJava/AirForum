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
    @Column(name = "post_category_hy", nullable = false, unique = true)
    private String postCategoryHy;
    @Column(name = "post_category_ru", nullable = false, unique = true)
    private String postCategoryRu;

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

    public String getPostCategoryHy() {
        return postCategoryHy;
    }

    public void setPostCategoryHy(String postCategoryHy) {
        this.postCategoryHy = postCategoryHy;
    }

    public String getPostCategoryRu() {
        return postCategoryRu;
    }

    public void setPostCategoryRu(String postCategoryRu) {
        this.postCategoryRu = postCategoryRu;
    }
}
