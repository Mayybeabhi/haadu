package com.mayybeabhi.haadu.redis;

import com.mayybeabhi.haadu.redis.RedisService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedisTest{

    @Bean
    public CommandLineRunner test(RedisService redisService) {

        return args -> {

            redisService.setValue("hello", "world");

            System.out.println(
                    redisService.getValue("hello")
            );

        };
    }
}
