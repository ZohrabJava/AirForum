package com.example.airforum.model;

import com.example.airforum.enams.AnswerState;
import com.example.airforum.enams.PostState;
import lombok.ToString;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@ToString
public class Post implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", nullable = false)
    private Long id;
    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;
    @JoinColumn(name = "category_id", nullable = false)
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Category category;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(name = "description", nullable = false)
    @Type(type = "text")
    private String descriptionPath;
    @Column(name = "image_path", nullable = true)
    private String imagePath;
    @Enumerated(EnumType.STRING)
    @Column(name = "post_state", nullable = false)
    private PostState postState;

    @Column(name = "post_date", nullable = false)
    private LocalDateTime localDateTime;

    public Post(User user,
                String title,
                String descriptionPath,
                String imagePath,
                PostState postState,
                LocalDateTime localDateTime,
                Category category) {
        this.user = user;
        this.title = title;
        this.descriptionPath = descriptionPath;
        this.imagePath = imagePath;
        this.postState = postState;
        this.localDateTime = localDateTime;
        this.category = category;
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

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

}
