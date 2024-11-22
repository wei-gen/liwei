package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 获取项目根路径
        String projectPath = System.getProperty("user.dir");
        
        // 配置swagger
        registry.addResourceHandler("/file/**")
                .addResourceLocations("file:" + projectPath + "/file/");
                
        // 配置外部访问路径
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file:" + projectPath + "/file/");
    }
} 