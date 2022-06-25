package com.example.airforum.controller;

import com.example.airforum.dto.postCommentDto.PostCommentRequestDto;
import com.example.airforum.dto.postCommentDto.PostCommentResponseDto;
import com.example.airforum.service.impl.PostCommentServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@AllArgsConstructor
public class PostCommentController {
    private final PostCommentServiceImpl postCommentService;


    @PostMapping("/comment")
    public PostCommentResponseDto creatComment(@RequestBody PostCommentRequestDto postCommentRequestDto) {
        return postCommentService.creatComment(postCommentRequestDto);
    }


    @GetMapping("/getComment/{postId}")
    public List<PostCommentResponseDto> getCommentsByPostId(@PathVariable("postId") Long id) {
        return postCommentService.getCommentsByPostId(id);
    }
}
