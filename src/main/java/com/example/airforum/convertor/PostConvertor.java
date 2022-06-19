package com.example.airforum.convertor;

import com.example.airforum.dto.postCommentDto.PostCommentResponseDto;
import com.example.airforum.dto.postDto.PostRequestDto;
import com.example.airforum.dto.postDto.PostResponseDto;
import com.example.airforum.enams.AnswerState;
import com.example.airforum.enams.PostState;
import com.example.airforum.model.Post;
import com.example.airforum.model.PostComment;
import com.example.airforum.repository.CategoryRepository;
import com.example.airforum.repository.PostCommentRepository;
import com.example.airforum.repository.UserRepository;
import com.example.airforum.service.PostCommentService;
import com.example.airforum.service.impl.CategoryServiceImpl;
import com.example.airforum.service.impl.PostCommentServiceImpl;
import com.example.airforum.service.impl.PostServiceImpl;
import com.example.airforum.service.impl.UserServiceImpl;
import com.example.airforum.util.Path;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class PostConvertor {
    public final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PostCommentRepository postCommentRepository;
    private final PostCommentConvertor postCommentConvertor;

    public Post convertor(PostRequestDto postRequestDto) {
        Post post = new Post(userRepository.getUserByUserName(postRequestDto.getUserName()),
                postRequestDto.getTitle(),
                Path.savePath(postRequestDto.getDescriptionPath(),
                        userRepository.getUserByUserName(postRequestDto.getUserName())),
                Path.savePath(postRequestDto.getImagePath(),
                        userRepository.getUserByUserName(postRequestDto.getUserName())),
                PostState.Waiting,
                AnswerState.NOT_ANSWERED,
                LocalDateTime.now(),
                0.0,
                0L,
                categoryRepository.getCategoryById(postRequestDto.getCategoryId()));
        System.out.println(post);
        return post;
    }

    public PostResponseDto convertor(Post post) {
        PostResponseDto postResponseDto = new PostResponseDto(
                post.getId(),
                post.getTitle(),
                Path.readPath(post.getDescriptionPath()),
                Path.readPath(post.getImagePath()),
                post.getCategory().getPostCategory(),
                post.getLocalDateTime(),post.getPostState().toString());
        postResponseDto.setFirstName(post.getUser().getFirstName());
        postResponseDto.setLastName(post.getUser().getLastName());
        postResponseDto.setComments(getCommentsByPostId(post.getId()));
        System.out.println(postResponseDto);
        return postResponseDto;
    }
    public List<PostCommentResponseDto> getCommentsByPostId(Long id) {
        List<PostComment> postComments = postCommentRepository.getPostCommentByPostId(id);
        List<PostCommentResponseDto> postCommentResponseDto=new ArrayList<>();
        for (PostComment postComment : postComments) {
            postCommentResponseDto.add(postCommentConvertor.convertor(postComment));
        }
        return postCommentResponseDto;
    }
}
