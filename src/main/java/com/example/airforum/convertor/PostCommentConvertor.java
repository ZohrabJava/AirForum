package com.example.airforum.convertor;


import com.example.airforum.dto.postCommentDto.PostCommentRequestDto;
import com.example.airforum.dto.postCommentDto.PostCommentResponseDto;
import com.example.airforum.model.PostComment;
import com.example.airforum.repository.PostRepository;
import com.example.airforum.repository.UserRepository;
import com.example.airforum.service.impl.PostServiceImpl;
import com.example.airforum.service.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class PostCommentConvertor {
    public final PostServiceImpl postService;
    public final UserServiceImpl userService;
    public PostComment convertor(PostCommentRequestDto postCommentRequestDto){
        return new PostComment(postService.getPostById(postCommentRequestDto.getPostId()),
                userService.getByName(postCommentRequestDto.getUserName()),
                postCommentRequestDto.getComment(),
                LocalDateTime.now()
                );
    }
    public PostCommentResponseDto convertor(PostComment postComment){
        return new PostCommentResponseDto(postComment.getDescription(),
                postComment.getCommentDate());
    }
}
