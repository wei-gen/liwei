package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.common.result.R;
import com.example.demo.entity.Business;
import com.example.demo.service.BusinessService;
import com.example.demo.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/business")
public class BusinessController {
    
    @Autowired
    private BusinessService businessService;

    @GetMapping("/list")
    public R list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer type) {
        Page<Business> page = new Page<>(current, size);
        LambdaQueryWrapper<Business> wrapper = new LambdaQueryWrapper<>();
        if (type != null) {
            wrapper.eq(Business::getType, type);
        }
        wrapper.orderByDesc(Business::getCreateTime);
        return R.ok(businessService.page(page, wrapper));
    }

    @GetMapping("/{id}")
    public R getById(@PathVariable Integer id) {
        return R.ok(businessService.getById(id));
    }

    @PostMapping("/add")
    public R save(@RequestBody Business business) {
        return R.ok(businessService.save(business));
    }

    @PostMapping("/update")
    public R update(@RequestBody Business business) {
        return R.ok(businessService.updateById(business));
    }

    @DeleteMapping("/{id}")
    public R delete(@PathVariable Integer id) {
        return R.ok(businessService.removeById(id));
    }

    @PostMapping("/upload")
    public R upload(@RequestParam("file") MultipartFile file, 
                   @RequestParam(value = "type", defaultValue = "common") String type) {
        try {
            String filePath = FileUtil.uploadFile(file, type);
            return R.ok(filePath);
        } catch (IOException e) {
            return R.error("文件上传失败：" + e.getMessage());
        }
    }
} 