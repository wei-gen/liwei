package com.example.demo.utils;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class FileUtil {
    
    public static String uploadFile(MultipartFile file, String type) throws IOException {
        // 获取项目根路径
        String projectPath = System.getProperty("user.dir");
        // 文件保存路径
        String savePath = projectPath + "/file/" + type + "/";
        // 创建保存文件的目录
        File saveDir = new File(savePath);
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }
        
        // 生成新的文件名
        String originalFilename = file.getOriginalFilename();
        String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString().replace("-", "") + suffix;
        
        // 保存文件
        File saveFile = new File(savePath + newFileName);
        file.transferTo(saveFile);
        
        // 返回文件访问路径
        return "/static/" + type + "/" + newFileName;
    }
} 