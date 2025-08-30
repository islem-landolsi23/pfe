package com.example.pfe.Service.ServiceImpl;

import com.example.pfe.Entity.User;
import com.example.pfe.Repository.UserRepository;
import com.example.pfe.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository ;



    @Override
    public User SaveUser(User user) {
        return userRepository.save(user);
    }
}
