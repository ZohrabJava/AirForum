package com.example.airforum.convertor;

import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.enams.AnswerState;
import com.example.airforum.enams.PostState;
import com.example.airforum.model.Post;
import com.example.airforum.repository.CategoryRepository;
import com.example.airforum.service.impl.CategoryServiceImpl;
import com.example.airforum.service.impl.UserServiceImpl;
import com.example.airforum.util.Path;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class PostConvertor {
    private final UserServiceImpl userService;
    private final CategoryServiceImpl categoryService;
    private final CategoryConvertor categoryConvertor;
    private final CategoryRepository categoryRepository;

    public Post convertor(PostRequestDto postRequestDto) {
        Post post = new Post(userService.getByName(postRequestDto.getUserName()),
                postRequestDto.getTitle(),
                Path.savePath(postRequestDto.getDescriptionPath(),
                        userService.getByName(postRequestDto.getUserName())),
                Path.savePath(postRequestDto.getImagePath(),
                        userService.getByName(postRequestDto.getUserName())),
                PostState.WAITING,
                AnswerState.NOT_ANSWERED,
                LocalDateTime.now(),
                0.0,
                0L,
                categoryRepository.getCategoryByPostCategory(postRequestDto.getCategoryName()));
        System.out.println(post);
        return post;
    }

    public PostResponseDto convertor(Post post) {
        PostResponseDto postResponseDto = new PostResponseDto(
                post.getId(),
                post.getTitle(),
                Path.readPath(post.getDescriptionPath()),
                Path.readPath(post.getImagePath()),
                post.getCategory().getPostCategory().toString(),
                post.getLocalDateTime());
        System.out.println(postResponseDto);
        return postResponseDto;
    }
}
