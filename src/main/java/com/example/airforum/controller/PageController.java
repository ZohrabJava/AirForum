package com.example.airforum.controller;

import com.example.airforum.service.UserService;
import com.example.airforum.service.impl.CustomUserDetailsService;
import com.example.airforum.service.impl.UserServiceImpl;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Controller
@AllArgsConstructor
public class PageController {

    private final UserServiceImpl userService;

    @GetMapping("/confirm")
    public String viewConfirmPage(Model model, @RequestParam("token") String token) {
        String verification = userService.confirmToken(token);
        if (verification.equals("confirmed")) {
            model.addAttribute("infoPopup", true);
            model.addAttribute("used", true);
            return "index";
        } else if (verification.equals("notFound")) {
            model.addAttribute("infoPopup", true);
            model.addAttribute("invalid", true);
            return "index";
        } else if (verification.equals("expired")) {
            model.addAttribute("infoPopup", true);
            model.addAttribute("expired", true);
            return "index";
        }
        model.addAttribute("showPopup", true);
        return "index";
    }

    @GetMapping("/index")
    public String viewHome(Model model) {
        return "index";
    }

    @GetMapping("/reset")
    public String resetPassword(Model model, @RequestParam("token") String token) {
        String verification = userService.resetTokenState(token);
        if (verification.equals("success")) {
            model.addAttribute("changePassword", true);
            return "index";
        } else if (verification.equals("confirmed")) {
            model.addAttribute("infoPopup", true);
            model.addAttribute("used", true);
            return "index";
        } else if (verification.equals("notFound")) {
            model.addAttribute("infoPopup", true);
            model.addAttribute("invalid", true);
            return "index";
        } else if (verification.equals("expired")) {
            model.addAttribute("infoPopup", true);
            model.addAttribute("expired", true);
            return "index";
        }
        return "index";
    }

    @GetMapping("/admins")
    public String viwAdmins() {
        return "admins";
    }

    @GetMapping("/users")
    public String viwUsers() {
        return "users";
    }

    @GetMapping("/postsforapproval")
    public String viewPostsForApproval() {
        return "postsforapproval";
    }

    @GetMapping("/categories")
    public String viewCategories() {
        return "categories";
    }

    @GetMapping("/myposts")
    public String viewMyPosts() {
        return "myposts";
    }

    @GetMapping("/posts")
    public String viewPosts() {
        return "posts";
    }

    @GetMapping("/user/details")
    public String profileDetails() {
        return "user_details";
    }

}
