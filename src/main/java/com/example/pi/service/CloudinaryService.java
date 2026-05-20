package com.example.pi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws Exception {

        String originalFilename = file.getOriginalFilename();

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "auto",
                        "public_id", originalFilename,
                        "use_filename", true,
                        "unique_filename", true,
                        "overwrite", false,
                        "folder", "cv_files",
                        "access_mode", "public"
                )
        );

        return uploadResult.get("secure_url").toString();
    }
}