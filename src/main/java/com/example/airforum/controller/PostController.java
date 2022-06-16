package com.example.airforum.controller;

import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.service.impl.PostServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@AllArgsConstructor
public class PostController {

    private final PostServiceImpl postService;
    @PostMapping("/post")
    public PostResponseDto creatPost(@RequestBody PostRequestDto postRequestDto){
        return   postService.creatPost(postRequestDto);
    }
}
