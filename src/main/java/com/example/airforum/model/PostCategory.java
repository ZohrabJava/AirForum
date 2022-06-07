package com.example.airforum.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "post_category", uniqueConstraints = {@UniqueConstraint(columnNames = {"post_id", "category_id"})})
public class PostCategory implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_category_id", nullable = false)
    private Long id;
    @JoinColumn(name = "post_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Post post;
    @JoinColumn(name = "category_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Category category;

    public PostCategory(Long id, Post post, Category category) {
        this.id = id;
        this.post = post;
        this.category = category;
    }

    public PostCategory() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
