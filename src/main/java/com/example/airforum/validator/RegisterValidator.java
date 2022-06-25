package com.example.airforum.validator;

import com.example.airforum.dto.userDto.UserRequestDto;
import com.example.airforum.dto.userDto.UserUpdateResponseDto;

public class RegisterValidator {
    public static UserUpdateResponseDto isValidForm(UserRequestDto userRequestDto){
        UserUpdateResponseDto userUpdateResponseDto=new UserUpdateResponseDto();
        if(numberContain(userRequestDto.getFirstName()) ||
                spaceContain(userRequestDto.getFirstName())||
                userRequestDto.getFirstName().length()<3 ||
                userRequestDto.getFirstName().length()>20 ){
            userUpdateResponseDto.setErrorText("First name must contain between 3 and 20 letters without space");
            return userUpdateResponseDto;
        }
        if(numberContain(userRequestDto.getLastName())||
                spaceContain(userRequestDto.getLastName())||
                userRequestDto.getLastName().length()<3 ||
                userRequestDto.getLastName().length()>20 ){
            userUpdateResponseDto.setErrorText("Last name must contain between 3 and 20 letters without space!");
            return userUpdateResponseDto;
        }
        if(spaceContain(userRequestDto.getUserName())||
                userRequestDto.getUserName().length()<3 ||
                userRequestDto.getUserName().length()>10 ){
            userUpdateResponseDto.setErrorText("User name must contain between 3 and 10 letters and numbers without space!");
            return userUpdateResponseDto;
        }
        if(!isMail(userRequestDto.getEmail())){
            userUpdateResponseDto.setErrorText("Wrong email!");
            return userUpdateResponseDto;
        }
        if(userRequestDto.getPassword().length()<8){
            userUpdateResponseDto.setErrorText("Password must have a minimum length of 8");
            return userUpdateResponseDto;
        }
        return null;
    }
    public static boolean numberContain(String name){
        for (int i = 0; i < name.length(); i++) {
            if(name.charAt(i)>='0'&&name.charAt(i)<='9'){
                return true;
            }
        }
        return false;
    }
    public static boolean spaceContain(String name){
        for (int i = 0; i < name.length(); i++) {
            if(name.charAt(i)==' '){
                return true;
            }
        }
        return false;
    }
    public static boolean isMail(String mail) {
        boolean flag = false;
        for (int i = 0; i < mail.length(); i++) {
            if (mail.charAt(i) == '@'&& i!=0) {
                i++;
                flag = true;
            }
            if (flag && mail.charAt(i)=='@'){
                return false;
            }
            if (i + 1 < mail.length() && flag && (mail.charAt(i) == '.')) {
                return true;
            }
        }
        return false;
    }
}
