package com.example.airforum.service.impl;

import com.example.airforum.convertor.PostConvertor;
import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.dto.postDto.PostUpdateRequestDto;
import com.example.airforum.dto.postDto.PostUpdateResponseDto;
import com.example.airforum.enams.PostState;
import com.example.airforum.enams.Roles;
import com.example.airforum.model.Category;
import com.example.airforum.model.Post;
import com.example.airforum.model.User;
import com.example.airforum.repository.CategoryRepository;
import com.example.airforum.repository.PostRepository;
import com.example.airforum.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Service
public class PostServiceImpl {
    private final PostRepository postRepository;
    private final PostConvertor postConvertor;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public PostResponseDto creatPost(PostRequestDto postRequestDto) {
        Post post = postConvertor.convertor(postRequestDto);
        return postConvertor.convertor(postRepository.save(post));
    }

    public List<PostResponseDto> getAllPostsByPostStatus(PostState postState, Long id) {
        List<Post> posts = new ArrayList<>();
        List<PostResponseDto> postResponseDto = new ArrayList<>();
        if (id == null) {
            posts = postRepository.getAllByPostState(postState);
            Collections.reverse(posts);
            for (Post post : posts) {
                postResponseDto.add(postConvertor.convertor(post));
            }
            return postResponseDto;
        }
        posts.add(postRepository.getPostById(id));
        postResponseDto.add(postConvertor.convertor(posts.get(0)));
        return postResponseDto;
    }

    public List<PostResponseDto> getPostsByUserName(String userName) {

        List<Post> posts = postRepository.getPostByUserUserName(userName);
        Collections.reverse(posts);
        List<PostResponseDto> postResponseDto = new ArrayList<>();
        for (Post post : posts) {
            postResponseDto.add(postConvertor.convertor(post));
        }
        return postResponseDto;
    }

    public Post getPostById(Long id) {
        return postRepository.getPostById(id);
    }


    public PostUpdateResponseDto updatePostStatus(PostUpdateRequestDto userUpdateRequestDto, PostState postState) {
        PostUpdateResponseDto postUpdateResponseDto = new PostUpdateResponseDto();
        User admin = userRepository.getUserByUserName(userUpdateRequestDto.getUserName());
        Post post = postRepository.getPostById(userUpdateRequestDto.getId());
        if (admin == null) {
            postUpdateResponseDto.setError("User not found");
            return postUpdateResponseDto;
        }
        if (post == null) {
            postUpdateResponseDto.setError("Post not found");
            return postUpdateResponseDto;
        }

        post.setPostState(postState);
        postRepository.save(post);
        return postUpdateResponseDto;
    }


    public List<PostResponseDto> getAllCreatedPostsBySearch(Long categoryId, String title) {
        List<Post> posts = new ArrayList<>();
        List<PostResponseDto> postResponseDto = new ArrayList<>();
        Category category = categoryRepository.getCategoryById(categoryId);
        if (categoryId == 0) {
            if (title != null) {
                posts = postRepository.getPostByTitleContains(title);
                Collections.reverse(posts);
                for (Post post : posts) {
                    if(post.getPostState()==PostState.Created) {
                        postResponseDto.add(postConvertor.convertor(post));
                    }
                }
                return postResponseDto;
            }
            return postResponseDto;
        }
        if (title == null) {
            posts = postRepository.getAllByPostState(PostState.Created);
            Collections.reverse(posts);
            for (Post post : posts) {
                if (post.getCategory() == category) {
                    postResponseDto.add(postConvertor.convertor(post));
                }
            }
            return postResponseDto;
        }
        posts = postRepository.getPostByTitleContains(title);
        for (Post post : posts) {
            if(post.getPostState()==PostState.Created) {
                postResponseDto.add(postConvertor.convertor(post));
            }
        }
        postResponseDto.removeIf(responseDto -> categoryRepository.getCategoryByPostCategory(responseDto.getCategory().get(0)) != category);
        return postResponseDto;

    }
}
