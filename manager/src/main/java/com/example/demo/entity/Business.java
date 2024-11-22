package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("business")
public class Business {
    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private Integer type;
    
    private String title;
    
    private String description;
    
    private String image;
    
    private String content;
    
    private String attachment;
    
    private Integer checkNum;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
} 