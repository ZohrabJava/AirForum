package com.example.airforum.repository;

import com.example.airforum.enams.PostState;
import com.example.airforum.model.Post;
import com.example.airforum.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository  extends JpaRepository<Post,Long> {
    Post getPostById(Long id);
    Post getPostByUserId(Long id);
    List<Post> getAllByPostState(PostState postState);
    List<Post> getAllByUserId(Long id);
    List<Post> getPostByUserUserName(String name);
    List<Post> getPostByTitleContains(String title);
}
