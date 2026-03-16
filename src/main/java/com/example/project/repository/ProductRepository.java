package com.example.project.repository; // Change 'a' to 'o' here

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Ensure this is here

import com.example.project.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}