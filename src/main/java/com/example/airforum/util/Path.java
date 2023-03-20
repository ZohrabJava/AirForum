package com.example.airforum.util;

import com.example.airforum.model.User;
import org.apache.commons.lang3.RandomStringUtils;


import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Path {

    public static String savePath(String Path, User user) {
        PrintWriter writer = null;
        String uniqueFileName = user.getUserName();
        String path = null;
        try {
            path = String.valueOf(File.createTempFile(user.getUserName(), RandomStringUtils.randomAlphanumeric(4), new File("src/main/resources/descriptions/")));
            writer = new PrintWriter(path);
            writer.print(Path);
        } catch (FileNotFoundException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            assert writer != null;
            writer.close();
        }

        return path;
    }

    public static String savePath(String Path, String username) {
        PrintWriter writer = null;
        String path = null;
        try {
            path = String.valueOf(File.createTempFile(username,"", new File("src/main/resources/static/profile/")));
            writer = new PrintWriter(path);
            writer.print(Path);
        } catch (FileNotFoundException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            assert writer != null;
            writer.close();
        }

        return path;
    }


    public static String readPath(String path) {
        String file;
        try {
            file = new String(Files.readAllBytes(Paths.get(path)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return file;
    }

}
