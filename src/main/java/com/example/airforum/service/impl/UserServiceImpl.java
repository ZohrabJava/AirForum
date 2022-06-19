package com.example.airforum.service.impl;

import com.example.airforum.convertor.UserConvertor;
import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserResponseDto;
import com.example.airforum.dto.userDto.UserUpdateRequestDto;
import com.example.airforum.dto.userDto.UserUpdateResponseDto;
import com.example.airforum.email.EmailSender;
import com.example.airforum.enams.Roles;
import com.example.airforum.model.User;
import com.example.airforum.repository.UserRepository;
import com.example.airforum.service.UserService;
import com.example.airforum.service.token.ConfirmationToken;
import com.example.airforum.service.token.ConfirmationTokenRepository;
import com.example.airforum.service.token.ConfirmationTokenService;
import com.example.airforum.validator.EmailValidator;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final static String USER_NOT_FOUND_MSG =
            "user with email %s not found";
    private final EmailValidator emailValidator;
    private final EmailSender emailSender;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final UserRepository userRepository;
    private final UserConvertor userConvertor;
    private final PasswordEncoder passwordEncoder;

    private final ConfirmationTokenService confirmationTokenService;
    @Override
    public UserUpdateResponseDto creatUser(UserRequestDto request) {

        UserUpdateResponseDto userUpdateResponseDto=new UserUpdateResponseDto();
        if(userRepository.getUserByEmail(request.getEmail())!=null){
              userUpdateResponseDto.setErrorText("Wrong mail");
            return userUpdateResponseDto;
        }
        if(userRepository.getUserByUserName(request.getUserName())!=null){
              userUpdateResponseDto.setErrorText("Wrong user name");
              return userUpdateResponseDto;
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

        String link = "http://localhost:8082/confirm?token=" + token;
        emailSender.send(
                request.getEmail(),
                buildEmail(request.getFirstName(), link));

        return userUpdateResponseDto;
    }
    @Override
    public UserUpdateResponseDto resetPassword(String email) {
        UserUpdateResponseDto userUpdateResponseDto=new UserUpdateResponseDto();
        User user= userRepository.getUserByEmail(email);
        if(user==null){
            userUpdateResponseDto.setErrorText("Wrong email");
            return userUpdateResponseDto;
        }
        String link = "http://localhost:8082/index.html?token=" + confirmationTokenService.getTokenByUserId(user.getId());
        emailSender.send(
                email,
                resetPassword(user.getFirstName(), link));
        return userUpdateResponseDto;
    }

    @Override
    public UserUpdateResponseDto updateUserPassword(String token, String password) {
        UserUpdateResponseDto userUpdateResponseDto =new UserUpdateResponseDto();
        if(token==null || password==null){
            userUpdateResponseDto.setErrorText("Bad request");
            return userUpdateResponseDto;
        }
        ConfirmationToken confirmationToken=confirmationTokenService.findConfirmationTokenByToken(token);
        if(confirmationToken==null){
            userUpdateResponseDto.setErrorText("User not found");
            return userUpdateResponseDto;
        }
        User user =confirmationToken.getUser();
        if(user==null){
            userUpdateResponseDto.setErrorText("User not found");
            return userUpdateResponseDto;
        }

        String encodedPassword = passwordEncoder
                .encode(password);

        user.setPassword(encodedPassword);
        userRepository.save(user);
        return  userUpdateResponseDto;
    }

    @Override
    public UserResponseDto getByUserName(String userName) {
        Optional<User> user = userRepository.findByUserName(userName);
        return userConvertor.toUserDto(user.get());

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
        return userConvertor.toUserDto(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users=userRepository.getAllByRoles(Roles.USER);
        List<UserResponseDto> userResponseDto=new ArrayList<>();
        for (User user : users) {
            userResponseDto.add(userConvertor.toUserDto(user));
        }
        return userResponseDto;
    }

    @Override
    public List<UserResponseDto> getAllAdmins() {
        List<User> users=userRepository.getAllByRoles(Roles.ADMIN);
        List<UserResponseDto> userResponseDto=new ArrayList<>();
        for (User user : users) {
            userResponseDto.add(userConvertor.toUserDto(user));
        }
        return userResponseDto;
    }

    @Override
    public UserUpdateResponseDto updateUser(UserUpdateRequestDto userUpdateRequestDto) {
        UserUpdateResponseDto userUpdateResponseDto=new UserUpdateResponseDto();
        if(getByName(userUpdateRequestDto.getUserName())==null){
            userUpdateResponseDto.setErrorText("Super User or Admin  not found");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.SuperAdmin &&
                getByName(userUpdateRequestDto.getUserName()).getId().equals(userUpdateRequestDto.getId())){
            userUpdateResponseDto.setErrorText("Super User cant block him");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.ADMIN &&
                getByName(userUpdateRequestDto.getUserName()).getId().equals(userUpdateRequestDto.getId())){
            userUpdateResponseDto.setErrorText("Admin cant block him");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.USER ){
            userUpdateResponseDto.setErrorText("User cant block ");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.ADMIN &&
                getByName(getById( userUpdateRequestDto.getId()).getUserName()).getRoles()==Roles.ADMIN){
            userUpdateResponseDto.setErrorText("Admin cant block another Admin");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.ADMIN &&
                getByName(getById( userUpdateRequestDto.getId()).getUserName()).getRoles()==Roles.SuperAdmin){
            userUpdateResponseDto.setErrorText("Admin cant block Super Admin");
            return userUpdateResponseDto;
        }

           User user= getByName(getById(userUpdateRequestDto.getId()).getUserName());
           user.setEnabled(userUpdateRequestDto.getStatus());
           userRepository.save(user);
           return userUpdateResponseDto;

    }

    @Override
    public UserUpdateResponseDto changeRole(UserUpdateRequestDto userUpdateRequestDto) {
        UserUpdateResponseDto userUpdateResponseDto=new UserUpdateResponseDto();
        if(getByName(userUpdateRequestDto.getUserName())==null){
            userUpdateResponseDto.setErrorText("Super User  not found");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.SuperAdmin &&
                getByName(userUpdateRequestDto.getUserName()).getId().equals(userUpdateRequestDto.getId())){
            userUpdateResponseDto.setErrorText("Super User cant remove him");
            return userUpdateResponseDto;
        }
        if (getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.USER ||
                getByName(userUpdateRequestDto.getUserName()).getRoles()== Roles.ADMIN ){
            userUpdateResponseDto.setErrorText("User or Admin  cant remove ");
            return userUpdateResponseDto;
        }
        if( getByName(userUpdateRequestDto.getUserName()).getRoles()==Roles.USER){
            userUpdateResponseDto.setErrorText("Already User");
            return userUpdateResponseDto;
        }

        User user= getByName(getById(userUpdateRequestDto.getId()).getUserName());
        user.setRoles(userUpdateRequestDto.getRoles());
        userRepository.save(user);
        return userUpdateResponseDto;
    }



    public String signUpUser(User user) {
        boolean userExists = userRepository
                .findByEmail(user.getEmail())
                .isPresent();

        if (userExists) {
            // TODO check of attributes are the same and
            // TODO if email not confirmed send confirmation email.

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
                LocalDateTime.now().plusMinutes(15),
                user
        );

        confirmationTokenService.saveConfirmationToken(
                confirmationToken);

//        TODO: SEND EMAIL

        return token;
    }

    public String resetPassword(String name, String link) {
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
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Reset password</span>\n" +
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
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">You are forgot your password  , if you want to reset go to the link </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Reset Now</a> </p></blockquote>\n  <p>See you soon</p>" +
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
    public String buildEmail(String name, String link) {
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
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
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
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>" +
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
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            User user=confirmationToken.getUser();
            confirmationTokenRepository.delete(confirmationToken);
            userRepository.delete(user);
            return "expired";
        }

        confirmationTokenService.setConfirmedAt(token);
        enableAppUser(
                confirmationToken.getUser().getEmail());
        return "confirmed";
    }

    public int enableAppUser(String email) {
        return userRepository.enableAppUser(email);
    }


}
