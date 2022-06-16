package com.example.airforum.convertor;

import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.enams.AnswerState;
import com.example.airforum.enams.PostState;
import com.example.airforum.model.Post;
import com.example.airforum.service.impl.CategoryServiceImpl;
import com.example.airforum.service.impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class PostConvertor {
    private final UserServiceImpl userService;
    private final CategoryServiceImpl categoryService;
    public Post convertor(PostRequestDto postRequestDto){
        Post post=new Post(userService.userGetById( postRequestDto.getUserId()),
                postRequestDto.getTitle(),
                postRequestDto.getDescriptionPath(),
                postRequestDto.getImagePath(),
                PostState.CREATED,
                AnswerState.NOT_ANSWERED,
                LocalDateTime.now(),
                0.0,
                0L,
                categoryService.categoryGetById( postRequestDto.getCategoryId()));
        return post;
    }
    public PostResponseDto convertor(Post post){
        PostResponseDto postResponseDto=new PostResponseDto(
                post.getUser().getId(),
                post.getId(),
                post.getTitle(),
                post.getDescriptionPath(),
                post.getImagePath(),
                post.getCategory().getId());
        return postResponseDto;
    }
}
