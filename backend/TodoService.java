package com.example.todo.service;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for managing Todo business logic.
 * This class acts as a bridge between the TodoController and the TodoRepository.
 */
@Service
public class TodoService {

    private final TodoRepository todoRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * Retrieves all todo items from the database.
     */
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    /**
     * Retrieves todo items filtered by their completion status.
     */
    public List<Todo> getTodosByStatus(boolean completed) {
        return todoRepository.findByCompleted(completed);
    }

    /**
     * Retrieves a single todo item by its unique ID.
     */
    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    /**
     * Saves a new todo item to the database.
     */
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    /**
     * Updates an existing todo item's details.
     */
    public Todo updateTodo(Long id, Todo todoDetails) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(todoDetails.getTitle());
                    todo.setDescription(todoDetails.getDescription());
                    todo.setCompleted(todoDetails.isCompleted());
                    return todoRepository.save(todo);
                })
                .orElseThrow(() -> new RuntimeException("Todo not found with id " + id));
    }

    /**
     * Deletes a todo item from the database.
     */
    public void deleteTodo(Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Todo not found with id " + id);
        }
    }
}