package com.example.airforum.controller;


import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.util.Path;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Base64;
import java.io.ByteArrayInputStream;
import java.awt.image.BufferedImage;

@RestController
@RequestMapping()
@AllArgsConstructor
public class UserProfileController {

    private static final String UPLOAD_DIR = "src/main/resources/static/profile/";

    private ObjectMapper objectMapper = new ObjectMapper();


}
