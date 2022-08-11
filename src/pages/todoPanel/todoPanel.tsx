import React, { ChangeEvent, useEffect } from "react";
import "./todoPanel.css"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectTodos,
    init,
    markEvent,
    selectPriority,
    filterByCompletion,
    filterByPriority,
} from "../../reducer/todoSlice";
import TodoItem from "./todoItem/todoItem";
import TodoControlItem from "./todoControlItem/todoControlItem";
import { filterCompletionOptions, filterPriorityOptions, FilterTodoEnum } from "../../constant/todo";
import { useQuery } from "react-query";
import { fetchTodos } from "../../api/todoAPI";

const TodoPanel = () => {
    const dispatch = useAppDispatch()
    const todos = useQuery("todos", fetchTodos)
    const currentTodos = useAppSelector(selectTodos)
    const handleTodoItemCheckboxClicked = (index: number) => {
        dispatch(markEvent(index))
    }

    const handleTodoItemPrioritySelected = (e: ChangeEvent<HTMLSelectElement>,index: number) => {
        dispatch(selectPriority({index, value: e.target.value}))
    }

    const handleCompletionOptionClick = (type: FilterTodoEnum) => {
        dispatch(filterByCompletion(type))
    }

    const handlePriorityOptionClick = (type: FilterTodoEnum) => {
        dispatch(filterByPriority(type))
    }

    useEffect(()=> {
        if (todos.isSuccess) {
            dispatch(init(todos.data))
        }
    },[todos.isSuccess])

    return <div className="todo-panel">
        <section className="todo-list">
            <h3>todo list</h3>
            <div className="todo-list-content" >
                {currentTodos.map((item,index) =>
                    <TodoItem
                        key={index}
                        index={index}
                        isChecked={item.completed}
                        description={item.text}
                        onCheckboxClicked={() => handleTodoItemCheckboxClicked(item.index ?? 0)}
                        onPrioritySelect={(e) => handleTodoItemPrioritySelected(e, item.index ?? 0)}
                        priority={item.priority}
                    />
                )}
            </div>

        </section>
        <section className="todo-control">
            <div>
                <button>add todo</button>
                <button>delete completed</button>
            </div>
            <div className="todo-control-options">
                <TodoControlItem
                    title="filter by completion: "
                    type="completion"
                    options={filterCompletionOptions}
                    onOptionClick={handleCompletionOptionClick}
                />
                <TodoControlItem
                    title="filter by priority: "
                    type="priority"
                    options={filterPriorityOptions}
                    onOptionClick={handlePriorityOptionClick}
                />
            </div>
        </section>
    </div>
}

export default TodoPanel
