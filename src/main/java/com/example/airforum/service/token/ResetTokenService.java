package com.example.airforum.service.token;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ResetTokenService {

    private final ResetTokenRepository resetTokenRepository;

    public void saveConfirmationToken(ResetToken token) {
        resetTokenRepository.save(token);
    }

    public Optional<ResetToken> getToken(String token) {
        return resetTokenRepository.findByToken(token);
    }

    public int setConfirmedAt(String token) {
        return resetTokenRepository.updateConfirmedAt(
                token, LocalDateTime.now());
    }

    public String getTokenByUserId(Long id) {
        return resetTokenRepository.getConfirmationTokenByUserId(id).getToken();
    }

    public ResetToken findConfirmationTokenByToken(String token) {
        ResetToken confirmationToken = resetTokenRepository.getConfirmationTokenByToken(token);
        return confirmationToken;
    }

}
