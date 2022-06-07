package com.example.airforum.repository;

import com.example.airforum.model.User;
import com.example.airforum.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository  extends JpaRepository<UserRole,Long> {

}
