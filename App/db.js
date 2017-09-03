let statusENUMS = {
    ACTIVE: 'ACTIVE',
    COMPLETE: 'COMPLETE',
    DELETED: 'DELETED',
};

let todos = {
    1: {title: 'Learn JS', status: statusENUMS.ACTIVE},
    2:  {title: 'Git Tutorial', status: statusENUMS.COMPLETE},
    3: {title: 'Interactive git', status: statusENUMS.DELETED},
};

let nextTodoID =4;

module.exports = {
    status: statusENUMS,
    nextId: nextTodoID,
    todos: todos,
};
