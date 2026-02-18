package com.example.todo.controller;

import com.example.todo.model.Todo;
import com.example.todo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000") // Allow React app to access
public class TodoController {

    @Autowired
    private TodoService todoService;

    // GET /api/todos
    // Optionally filter by completed status: /api/todos?completed=true
    @GetMapping
    public List<Todo> getAllTodos(@RequestParam(required = false) Boolean completed) {
        return todoService.getAllTodos(completed);
    }

    // POST /api/todos
    @PostMapping
    public ResponseEntity<?> createTodo(@RequestBody Todo todo) {
        try {
            return ResponseEntity.ok(todoService.createTodo(todo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/todos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        return ResponseEntity.ok(todoService.updateTodo(id, todoDetails));
    }

    // DELETE /api/todos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}