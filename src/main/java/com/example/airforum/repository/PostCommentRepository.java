package com.example.airforum.repository;

import com.example.airforum.model.Category;
import com.example.airforum.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    List<PostComment> getPostCommentByPostId(Long id);
    List<PostComment> getAllByUserId(long id);
}
