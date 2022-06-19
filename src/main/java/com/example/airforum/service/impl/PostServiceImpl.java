package com.example.airforum.service.impl;

import com.example.airforum.convertor.PostConvertor;
import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.dto.postDto.PostUpdateRequestDto;
import com.example.airforum.dto.postDto.PostUpdateResponseDto;
import com.example.airforum.enams.PostState;
import com.example.airforum.enams.Roles;
import com.example.airforum.model.Post;
import com.example.airforum.model.User;
import com.example.airforum.repository.PostRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class PostServiceImpl {
    private final PostRepository postRepository;
    private final UserServiceImpl userService;
    private final PostConvertor postConvertor;

    public PostResponseDto creatPost(PostRequestDto postRequestDto) {
        Post post = postConvertor.convertor(postRequestDto);
        return postConvertor.convertor(postRepository.save(post));
    }

    public List<PostResponseDto> getAllPostsByPostStatus(PostState postState) {
        List<Post> posts = postRepository.getAllByPostState(postState);
        List<PostResponseDto> postResponseDto = new ArrayList<>();
        for (Post post : posts) {
            postResponseDto.add(postConvertor.convertor(post));
        }
        return postResponseDto;
    }
    public List<PostResponseDto> getPostsByUserName(String userName) {

        List<Post> posts = postRepository.getAllByUserId(userService.getByName(userName).getId());
        List<PostResponseDto> postResponseDto = new ArrayList<>();
        for (Post post : posts) {
            postResponseDto.add(postConvertor.convertor(post));
        }
        return postResponseDto;
    }

    public Post getPostById(Long id) {
        return postRepository.getPostById(id);
    }


    public PostUpdateResponseDto updatePostStatus(PostUpdateRequestDto userUpdateRequestDto,PostState postState) {
        PostUpdateResponseDto postUpdateResponseDto=new PostUpdateResponseDto();
        User admin=userService.getByName(userUpdateRequestDto.getUserName());
        Post post=postRepository.getPostById(userUpdateRequestDto.getId());
        if(admin==null){
            postUpdateResponseDto.setError("Super User or Admin  not found");
            return postUpdateResponseDto;
        }
        if(post==null){
            postUpdateResponseDto.setError("Post not found");
            return postUpdateResponseDto;
        }
        if(admin.getRoles()==Roles.USER){
            postUpdateResponseDto.setError("User cant approve a post");
            return postUpdateResponseDto;
        }
        post.setPostState(postState);
        postRepository.save(post);
        return postUpdateResponseDto;
    }


}
