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
import com.example.airforum.util.Path;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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
                postRequestDto.getDescriptionPath(),
                Path.savePath(postRequestDto.getImagePath(),
                        userRepository.getUserByUserName(postRequestDto.getUserName())),
                PostState.Waiting,
                AnswerState.NOT_ANSWERED,
                LocalDateTime.now(),
                categoryRepository.getCategoryById(postRequestDto.getCategoryId()));
        return post;
    }

    public PostResponseDto convertor(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setCategory(Arrays.asList(post.getCategory().getPostCategory(),post.getCategory().getPostCategoryHy(),post.getCategory().getPostCategoryRu()));
        dto.setPostId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setDescriptionPath(post.getDescriptionPath());
        dto.setImagePath(Path.readPath(post.getImagePath()));
        dto.setLocalDateTime(post.getLocalDateTime());
        dto.setStatus(post.getPostState().toString());
        dto.setFirstName(post.getUser().getFirstName());
        dto.setLastName(post.getUser().getLastName());
        dto.setComments(getCommentsByPostId(post.getId()));
        dto.setUserImg(post.getUser().getImagePath() == null ?  Path.readPath("src\\main\\resources\\static\\profile\\userJpg") : Path.readPath(post.getUser().getImagePath()));


        return dto;
    }

    public List<PostCommentResponseDto> getCommentsByPostId(Long id) {
        List<PostComment> postComments = postCommentRepository.getPostCommentByPostId(id);
        List<PostCommentResponseDto> postCommentResponseDto = new ArrayList<>();
        for (PostComment postComment : postComments) {
            postCommentResponseDto.add(postCommentConvertor.convertor(postComment));
        }
        return postCommentResponseDto;
    }
}
