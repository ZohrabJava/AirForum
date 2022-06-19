package com.example.airforum.controller;

import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.dto.postDto.PostUpdateRequestDto;
import com.example.airforum.dto.postDto.PostUpdateResponseDto;
import com.example.airforum.enams.PostState;
import com.example.airforum.service.impl.PostServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@AllArgsConstructor
public class PostController {

    private final PostServiceImpl postService;

    @PostMapping("/post")
    public PostResponseDto creatPost(@RequestBody PostRequestDto postRequestDto) {
        return postService.creatPost(postRequestDto);
    }

    @GetMapping("/createdPosts")
    public List<PostResponseDto> getAllCreatedPosts() {
        return postService.getAllPostsByPostStatus(PostState.CREATED);
    }

    @GetMapping("/waitingPosts")
    public List<PostResponseDto> getAllWaitingPosts() {
        return postService.getAllPostsByPostStatus(PostState.WAITING);
    }

    @GetMapping("/getPostsByUserName/{userName}")
    public List<PostResponseDto> getAllWaitingPosts(@PathVariable("userName") String name) {
        return postService.getPostsByUserName(name);
    }

    @PostMapping("/blockPost")
    public PostUpdateResponseDto blockPost(@RequestBody PostUpdateRequestDto postUpdateRequestDto) {
        return postService.updatePostStatus(postUpdateRequestDto, PostState.BLOCKED);
    }

    @PostMapping("/activatePost")
    public PostUpdateResponseDto activatePost(@RequestBody PostUpdateRequestDto postUpdateRequestDto) {
        return postService.updatePostStatus(postUpdateRequestDto, PostState.CREATED);
    }


}
