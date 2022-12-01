package com.example.airforum;

import com.example.airforum.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;

import javax.mail.MessagingException;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
    public class AirForumApplication {

    public static void main(String[] args) {
        SpringApplication.run(AirForumApplication.class, args);
    }

}
