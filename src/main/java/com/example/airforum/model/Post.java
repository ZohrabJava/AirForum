package com.example.airforum.model;

import com.example.airforum.enams.AnswerState;
import com.example.airforum.enams.PostState;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
public class Post implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", nullable = false)
    private Long id;
    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(name = "description_path", nullable = false)
    private String descriptionPath;
    @Column(name = "image_path", nullable = false)
    private String imagePath;
    @Column(name = "post_state", nullable = false)
    private PostState postState;
    @Column(name = "answer_state", nullable = false)
    private AnswerState answerState;
    @Column(name = "post_date", nullable = false)
    private LocalDateTime localDateTime;
    @Column(name = "rating", nullable = false)
    private Double rating;
    @Column(name = "rating_count", nullable = false)
    private Long ratingCount;
    @JoinColumn(name = "category_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Category category;

    public Post(Long id, User user, String title, String descriptionPath, String imagePath, PostState postState,
                AnswerState answerState, LocalDateTime localDateTime, Double rating, Long ratingCount) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.descriptionPath = descriptionPath;
        this.imagePath = imagePath;
        this.postState = postState;
        this.answerState = answerState;
        this.localDateTime = localDateTime;
        this.rating = rating;
        this.ratingCount = ratingCount;
    }

    public Post() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescriptionPath() {
        return descriptionPath;
    }

    public void setDescriptionPath(String descriptionPath) {
        this.descriptionPath = descriptionPath;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public PostState getPostState() {
        return postState;
    }

    public void setPostState(PostState postState) {
        this.postState = postState;
    }

    public AnswerState getAnswerState() {
        return answerState;
    }

    public void setAnswerState(AnswerState answerState) {
        this.answerState = answerState;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Long getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Long ratingCount) {
        this.ratingCount = ratingCount;
    }
}
