package com.example.airforum.service.impl;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.dto.userDto.UserUpdateRequestDto;
import com.example.airforum.dto.userDto.UserUpdateResponseDto;
import com.example.airforum.email.EmailSender;
import com.example.airforum.enams.Roles;
import com.example.airforum.model.Post;
import com.example.airforum.model.PostComment;
import com.example.airforum.model.User;
import com.example.airforum.repository.PostCommentRepository;
import com.example.airforum.repository.PostRepository;
import com.example.airforum.repository.UserRepository;
import com.example.airforum.service.UserService;
import com.example.airforum.service.token.*;
import com.example.airforum.util.Path;
import com.example.airforum.validator.EmailValidator;
import com.example.airforum.validator.RegisterValidator;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final static String USER_NOT_FOUND_MSG =
            "user with email %s not found";
    private final EmailValidator emailValidator;
    private final EmailSender emailSender;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConfirmationTokenService confirmationTokenService;
    private final ResetTokenService resetTokenService;
    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;
    private final MessageSource messageSource;
    private final String DOMAIN = "localhost";
//    private final String DOMAIN = "10.5.113.18";

    @Override
    public UserUpdateResponseDto creatUser(UserRequestDto request) {

        UserUpdateResponseDto userUpdateResponseDto = new UserUpdateResponseDto();
        if (userRepository.getUserByEmail(request.getEmail()) != null) {
            userUpdateResponseDto.setErrorText("emailUsed");
            return userUpdateResponseDto;
        }
        if (userRepository.getUserByUserName(request.getUserName()) != null) {
            userUpdateResponseDto.setErrorText("usernameUsed");
            return userUpdateResponseDto;
        }
        if (RegisterValidator.isValidForm(request) != null) {
            return RegisterValidator.isValidForm(request);
        }


        boolean isValidEmail = emailValidator.
                test(request.getEmail());

        if (!isValidEmail) {
            throw new IllegalStateException("email not valid");
        }

        String token = signUpUser(
                new User(
                        request.getFirstName(),
                        request.getLastName(),
                        request.getUserName(),
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String link = "http://" + DOMAIN + ":8089/confirm?token=" + token;
        emailSender.send(
                request.getEmail(),
                buildEmail(request.getFirstName(), link, request.getLang()));

        return userUpdateResponseDto;
    }

    @Override
    public UserUpdateResponseDto resetPassword(UserUpdateRequestDto dto) {
        UserUpdateResponseDto userUpdateResponseDto = new UserUpdateResponseDto();
        User user = userRepository.getUserByEmail(dto.getEmail());
        if (user == null) {
            userUpdateResponseDto.setErrorText("notFound");
            return userUpdateResponseDto;
        }

        String token = UUID.randomUUID().toString();

        ResetToken confirmationToken = new ResetToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(3),
                user
        );

        resetTokenService.saveConfirmationToken(
                confirmationToken);

        String link = "http://" + DOMAIN + ":8089/reset?token=" + token;
        emailSender.send(
                dto.getEmail(),
                resetPassword(user.getFirstName(), link, dto.getLang()));
        return userUpdateResponseDto;
    }

    @Override
    public UserUpdateResponseDto updateUserPassword(String token, String password) {
        UserUpdateResponseDto userUpdateResponseDto = new UserUpdateResponseDto();
        if (token == null || password == null) {
            userUpdateResponseDto.setErrorText("Bad request");
            return userUpdateResponseDto;
        }
        ResetToken resetToken = resetTokenService.findConfirmationTokenByToken(token);
        if (resetToken == null) {
            userUpdateResponseDto.setErrorText("User not found");
            return userUpdateResponseDto;
        }
        User user = resetToken.getUser();
        if (user == null) {
            userUpdateResponseDto.setErrorText("User not found");
            return userUpdateResponseDto;
        }

        if (!password.matches(RegisterValidator.PASSWORD_REGEX)) {
            userUpdateResponseDto.setErrorText("badPassword");
            return userUpdateResponseDto;
        }
        String encodedPassword = passwordEncoder
                .encode(password);

        user.setPassword(encodedPassword);
        userRepository.save(user);
        resetToken.setConfirmedAt(LocalDateTime.now());
        resetTokenService.saveConfirmationToken(resetToken);
        return userUpdateResponseDto;
    }

    @Override
    public UserUpdateResponseDto changeUserPassword(UserUpdateRequestDto dto) {
        UserUpdateResponseDto userUpdateResponseDto = new UserUpdateResponseDto();
        if (dto.getUserName() == null && dto.getPassword() == null) {
            userUpdateResponseDto.setErrorText("Bad request");
            return userUpdateResponseDto;
        }


        User user = userRepository.getUserByUserName(dto.getUserName());
        if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            if (!dto.getConfirmPassword().matches(RegisterValidator.PASSWORD_REGEX)) {
                userUpdateResponseDto.setErrorText("badPassword");
                return userUpdateResponseDto;
            }
            String encodedPassword = passwordEncoder
                    .encode(dto.getConfirmPassword());

            user.setPassword(encodedPassword);
            userRepository.save(user);
        } else {
            userUpdateResponseDto.setErrorText("Wrong old password");
            return userUpdateResponseDto;
        }


        return userUpdateResponseDto;
    }

    @Override
    public UserResponseDto getByUserName(String userName) {
        Optional<User> user = userRepository.findByUserName(userName);
        return toUserDto(user.get());

    }

    public User getByName(String userName) {

        return userRepository.findByUserName(userName).get();

    }


    public User usergetById(Long id) {
        return userRepository.getUserById(id);

    }

    @Override
    public UserResponseDto getById(Long id) {
        User user = userRepository.getUserById(id);
        return toUserDto(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.getAllByRoles(Roles.USER);
        List<UserResponseDto> userResponseDto = new ArrayList<>();
        for (User user : users) {
            userResponseDto.add(toUserDto(user));
        }
        return userResponseDto;
    }

    @Override
    public List<UserResponseDto> getAllAdmins() {
        List<User> users = userRepository.getAllByRoles(Roles.ADMIN);
        List<UserResponseDto> userResponseDto = new ArrayList<>();
        for (User user : users) {
            userResponseDto.add(toUserDto(user));
        }
        return userResponseDto;
    }

    @Override
    public UserUpdateResponseDto updateUser(UserUpdateRequestDto userUpdateRequestDto) {
        UserUpdateResponseDto userUpdateResponseDto = new UserUpdateResponseDto();
        if (getByName(userUpdateRequestDto.getUserName()) == null) {
            userUpdateResponseDto.setErrorText("Super User or Admin  not found");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.SuperAdmin &&
                getByName(userUpdateRequestDto.getUserName()).getId().equals(userUpdateRequestDto.getId())) {
            userUpdateResponseDto.setErrorText("Super User cant block him");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.ADMIN &&
                getByName(userUpdateRequestDto.getUserName()).getId().equals(userUpdateRequestDto.getId())) {
            userUpdateResponseDto.setErrorText("Admin cant block him");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.USER) {
            userUpdateResponseDto.setErrorText("User cant block ");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.ADMIN &&
                getByName(getById(userUpdateRequestDto.getId()).getUserName()).getRoles() == Roles.ADMIN) {
            userUpdateResponseDto.setErrorText("Admin cant block another Admin");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.ADMIN &&
                getByName(getById(userUpdateRequestDto.getId()).getUserName()).getRoles() == Roles.SuperAdmin) {
            userUpdateResponseDto.setErrorText("Admin cant block Super Admin");
            return userUpdateResponseDto;
        }

        User user = getByName(getById(userUpdateRequestDto.getId()).getUserName());
        user.setEnabled(userUpdateRequestDto.getStatus());
        userRepository.save(user);
        return userUpdateResponseDto;

    }

    @Override
    public UserUpdateResponseDto changeRole(UserUpdateRequestDto userUpdateRequestDto) {
        UserUpdateResponseDto userUpdateResponseDto = new UserUpdateResponseDto();
        if (getByName(userUpdateRequestDto.getUserName()) == null) {
            userUpdateResponseDto.setErrorText("Super User  not found");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.SuperAdmin &&
                getByName(userUpdateRequestDto.getUserName()).getId().equals(userUpdateRequestDto.getId())) {
            userUpdateResponseDto.setErrorText("Super User cant remove him");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.USER ||
                getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.ADMIN) {
            userUpdateResponseDto.setErrorText("User or Admin  cant remove ");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles() == Roles.USER) {
            userUpdateResponseDto.setErrorText("Already User");
            return userUpdateResponseDto;
        }

        User user = getByName(getById(userUpdateRequestDto.getId()).getUserName());
        user.setRoles(userUpdateRequestDto.getRoles());
        userRepository.save(user);
        return userUpdateResponseDto;
    }


    public String signUpUser(User user) {
        boolean userExists = userRepository
                .findByEmail(user.getEmail())
                .isPresent();

        if (userExists) {
            throw new IllegalStateException("email already taken");
        }

        String encodedPassword = passwordEncoder
                .encode(user.getPassword());

        user.setPassword(encodedPassword);

        userRepository.save(user);

        String token = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(3),
                user
        );

        confirmationTokenService.saveConfirmationToken(
                confirmationToken);

        return token;
    }

    public String resetPassword(String name, String link, String lang) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">"
                + messageSource.getMessage("email.reset_title", null, new Locale(lang)) +
                "</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">"
                + messageSource.getMessage("email.confirm_hi", null, new Locale(lang)) +
                " " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">"
                + messageSource.getMessage("email.reset_text_1", null, new Locale(lang)) +
                " </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">"
                + messageSource.getMessage("email.reset", null, new Locale(lang)) +
                "</a> </p></blockquote>\n  <p>"
                + messageSource.getMessage("email.confirm_text_2", null, new Locale(lang)) +
                "</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

    public String buildEmail(String name, String link, String lang) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">"
                + messageSource.getMessage("email.confirm_title", null, new Locale(lang)) +
                "</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">"
                + messageSource.getMessage("email.confirm_hi", null, new Locale(lang)) + " " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> "
                + messageSource.getMessage("email.confirm_text_1", null, new Locale(lang)) + " </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">"
                + messageSource.getMessage("email.confirm_activate", null, new Locale(lang)) + "</a> </p></blockquote>\n "
                + messageSource.getMessage("email.confirm_text_2", null, new Locale(lang)) +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

    @Transactional
    public String confirmToken(String token) {
        try {
            ConfirmationToken confirmationToken = confirmationTokenService
                    .getToken(token)
                    .orElseThrow(() ->
                            new IllegalStateException("token not found"));

            if (confirmationToken.getConfirmedAt() != null) {
                return "confirmed";
            }

            LocalDateTime expiredAt = confirmationToken.getExpiresAt();

            if (expiredAt.isBefore(LocalDateTime.now())) {
                User user = confirmationToken.getUser();
                confirmationTokenRepository.delete(confirmationToken);
                userRepository.delete(user);
                return "expired";
            }

            confirmationTokenService.setConfirmedAt(token);
            enableAppUser(
                    confirmationToken.getUser().getEmail());
            return "success";
        } catch (Exception e) {
            return "notFound";
        }

    }

    public String resetTokenState(String token) {
        try {
            ResetToken resetToken = resetTokenService
                    .getToken(token)
                    .orElseThrow(() ->
                            new IllegalStateException("token not found"));

            if (resetToken.getConfirmedAt() != null) {
                return "confirmed";
            }

            LocalDateTime expiredAt = resetToken.getExpiresAt();

            if (expiredAt.isBefore(LocalDateTime.now())) {
                return "expired";
            }

            return "success";

        } catch (Exception e) {
            return "notFound";
        }
    }

    public int enableAppUser(String email) {
        return userRepository.enableAppUser(email);
    }

    @Override
    public UserResponseDto updateUserPicture(UserRequestDto userRequestDto) {
        UserResponseDto dto = new UserResponseDto();
        User user = getByName(userRequestDto.getUserName());

        String imageDataString = userRequestDto.getImagePath();
        if (user.getImagePath() == null) {
            String path = Path.savePath(imageDataString, userRequestDto.getUserName());
            user.setImagePath(path);
        } else {
            String path = Path.updateImage(user.getImagePath(), imageDataString);
            user.setImagePath(path);
        }


        userRepository.save(user);
        dto = toUserDto(user);
        return dto;
    }

    @Override
    public int getPostCount(long userId) {
        List<Post> posts = postRepository.getPostByUserId(userId);
        return posts.size();
    }

    @Override
    public int getCommentCount(long userId) {
        List<PostComment> comments = postCommentRepository.getAllByUserId(userId);
        return comments.size();
    }

    public UserResponseDto toUserDto(User user) {
        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setUserId(user.getId());
        userResponseDto.setFirstName(user.getFirstName());
        userResponseDto.setLastName(user.getLastName());
        userResponseDto.setUserName(user.getUserName());
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setVerification(user.getEnabled());
        userResponseDto.setRole(user.getRoles().ordinal());
        userResponseDto.setImagePath(user.getImagePath() == null ? Path.readPath("src\\main\\resources\\static\\profile\\userJpg") : Path.readPath(user.getImagePath()));
        userResponseDto.setCommentCount(getCommentCount(user.getId()));
        userResponseDto.setPostCount(getPostCount(user.getId()));
        return userResponseDto;
    }
}
