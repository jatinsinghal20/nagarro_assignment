var statusENUMS = {
    ACTIVE : "ACTIVE",
    COMPLETE : "COMPLETE",
    DELETED : "DELETED"
};

var todos = {
    1 : {title : "Learn JS", status: statusENUMS.ACTIVE},
    2:  {title : "Git Tutorial", status: statusENUMS.ACTIVE},
    3 : {title : "Interactive git", status: statusENUMS.ACTIVE},
};

var next_todo_id =4;

module.exports = {
    status : statusENUMS,
    nextId : next_todo_id,
    todos : todos
}