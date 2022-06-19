package com.example.airforum.service;

import com.example.airforum.dto.postCommentDto.PostCommentResponseDto;

import java.util.List;

public interface PostCommentService {
    public List<PostCommentResponseDto> getCommentsByPostId(Long id);
}
