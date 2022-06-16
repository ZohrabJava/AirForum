package com.example.airforum.model;

import javax.persistence.*;

@Entity
@Table(name = "post_comments")
public class PostComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_comment_id")
    private Integer id;
    @JoinColumn(name = "post_id",nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Post post;
    @JoinColumn(name = "user_id",nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;
    @Column(name = "url_discription",nullable = false)
    private String description;

    public PostComment() {
    }

    public PostComment(Post post, User user, String description) {
        this.post = post;
        this.user = user;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
