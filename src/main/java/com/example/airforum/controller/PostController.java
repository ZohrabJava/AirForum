package com.example.airforum.controller;

import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.dto.postDto.PostUpdateRequestDto;
import com.example.airforum.dto.postDto.PostUpdateResponseDto;
import com.example.airforum.enams.PostState;
import com.example.airforum.service.impl.PostServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

        return postService.getAllPostsByPostStatus(PostState.Created, null);
    }


    @GetMapping("/createdPosts/{id}")
    public List<PostResponseDto> getCreatedPostById(@PathVariable("id") Long id) {
        return postService.getAllPostsByPostStatus(PostState.Created, id);
    }


    @PostMapping("/searchPosts")
    public List<PostResponseDto> getAllCreatedPostsByCategory(@RequestBody PostRequestDto postRequestDto) {
        return postService.getAllCreatedPostsBySearch(postRequestDto.getCategoryId(), postRequestDto.getTitle());
    }


    @GetMapping("/waitingPosts")
    public List<PostResponseDto> getAllWaitingPosts() {
        return postService.getAllPostsByPostStatus(PostState.Waiting, null);
    }


    @GetMapping("/getPostsByUserName/{userName}")
    public List<PostResponseDto> getAllWaitingPosts(@PathVariable("userName") String name) {
        return postService.getPostsByUserName(name);
    }

    @PostMapping("/blockPost")

    public PostUpdateResponseDto blockPost(@RequestBody PostUpdateRequestDto postUpdateRequestDto) {
        return postService.updatePostStatus(postUpdateRequestDto, PostState.Blocked);
    }


    @PostMapping("/activatePost")
    public PostUpdateResponseDto activatePost(@RequestBody PostUpdateRequestDto postUpdateRequestDto) {
        return postService.updatePostStatus(postUpdateRequestDto, PostState.Created);
    }


    @PostMapping("/privatePost")
    public PostUpdateResponseDto privatePost(@RequestBody PostUpdateRequestDto postUpdateRequestDto) {
        return postService.updatePostStatus(postUpdateRequestDto, PostState.Private);
    }


}
