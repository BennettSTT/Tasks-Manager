export function getTask(tasks, id) {
    let children = undefined;
    for (let object of tasks) {
        const t = loadChildren(object, id);
        children = children === undefined ? t : children;
    }
    return children;
}

function loadChildren(obj, id) {
    if (obj.id === id) {
        return obj;
    }
    for (let object of obj.children) {
        return loadChildren(object, id);
    }
}

export function addTask(tasks, tasksId, children) {
    // Если tasksId => значит это корневой элемент
    if (tasksId === undefined) {
        return tasks.push(children)
    }

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === tasksId) {
            return tasks[i].children.push(children);
        }

        addChildren(tasks[i], tasksId, children);
    }
}

function addChildren(obj, tasksId, children) {
    if (obj.id === tasksId) {
        return obj.children.push(children);
    }

    for (let object of obj.children) {
        return addChildren(object, tasksId, children);
    }
}

export function deleteNode(tasks, id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return tasks.splice(i, 1);
        }

        deleteTask(tasks[i], id);
    }
}

function deleteTask(task, id) {
    for (let i = 0; i < task.children.length; i++) {
        if (task.children[i].id === id) {
            return task.children.splice(i, 1);
        }
    }

    for (let object of task.children) {
        return deleteTask(object, id);
    }
}

export function loadAndUpdateTask(tasks, task) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === task.id) {
            const t = tasks[i];
            return tasks[i] = {
                id: t.id,
                title: task.title,
                level: task.level,
                dueDate: task.dueDate,
                createDate: task.createDate,
                completeDate: task.completeDate,
                priority: task.priority,
                status: task.status,
                children: t.children
            };
        }
        loadAndUpdateTaskInTasks(tasks[i], task);
    }
}

function loadAndUpdateTaskInTasks(object, task) {
    for (let i = 0; i < object.children.length; i++) {
        if (object.children[i].id === task.id) {
            const t = object.children[i];
            return object.children[i] = {
                id: t.id,
                title: task.title,
                level: task.level,
                dueDate: task.dueDate,
                createDate: task.createDate,
                completeDate: task.completeDate,
                priority: task.priority,
                status: task.status,
                children: t.children
            };
        }
    }

    for (let obj of object.children) {
        return loadAndUpdateTaskInTasks(obj, task);
    }
}
