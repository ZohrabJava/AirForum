//package com.example.airforum.service.impl;
//
//import com.example.airforum.dto.postDto.PostRequestDto;
//import com.example.airforum.dto.postDto.PostResponseDto;
//import com.example.airforum.repository.PostRepository;
//import lombok.AllArgsConstructor;
//
//@AllArgsConstructor
//public class PostServiceImpl {
//    private final PostRepository postRepo;
//
//
//    public PostResponseDto creatPost(PostRequestDto postRequestDto) {
//        Post post = postMapper.toPost(postRequestDto);
//        post.setPostDate(LocalDateTime.now());
//        post.setRating(0D);
//        post.setRatingCount(0);
//        post.setStatus(Status.CREATED);
//
//        postRepo.save(post);
//
//        return postMapper.ToPostResponseDto(post);
//    }
//
//    public void deletePost(Integer id) {
//        Optional<Post> post = postRepo.findById(id);
//        post.ifPresent(postRepo::delete);
//    }
//
//    public void postActivator(Integer id) {
//        Optional<Post> post = postRepo.findById(id);
//        Post post1;
//        if (post.isPresent()) {
//            post1 = post.get();
//            post1.setStatus(Status.ACTIVE);
//            postRepo.save(post1);
//        }
//    }
//
//    public void postBlocker(Integer id) {
//        Optional<Post> post = postRepo.findById(id);
//        Post post1;
//        if (post.isPresent()) {
//            post1 = post.get();
//            post1.setStatus(Status.BLOCKED);
//            postRepo.save(post1);
//        }
//    }
//
//}
