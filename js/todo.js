window.onload = function() {
	// Display the todo items.
	todoDB.open(refreshTodos);

	// Get references to the form elements.
	var newTodoForm = document.getElementById('todo-add-item');
	var newTodoInput = document.getElementById('todo-add');

	// Handle new todo item form submissions.
	newTodoForm.onsubmit = function() {
	  // Get the todo text.
	  var text = newTodoInput.value;
	  var status = "Active";

	  // Check to make sure the text is not blank (or just spaces).
	  if (text.replace(/ /g,'') != '') {
	    // Create the todo item.
	    todoDB.createTodo(text, status, function(todo) {
	      refreshTodos();
	    });
	  }

	  // Reset the input field.
	  newTodoInput.value = '';

	  // Don't send the form.
	  return false;
	};

	// Update the list of todo items.
	function refreshTodos() {  
	  todoDB.fetchTodos(function(todos) {
	    var todoList = document.getElementById('todo-items');
	    todoList.innerHTML = '';

	    for(var i = 0; i < todos.length; i++) {
	      // Read the todo items backwards (most recent first).
	      var todo = todos[(todos.length - 1 - i)];

	      var li = document.createElement('li');
	      li.id = 'todo-' + todo.timestamp;

	      var checkbox = document.createElement('input');

	      var spanText = document.createElement('span');
	      spanText.innerHTML = todo.text;
	      spanText.className = "todo-text";
	      li.appendChild(spanText);
	      todoList.appendChild(li);

	      var divWrapper = document.createElement('div');
	      divWrapper.className = "todo-wrapper";
	      li.appendChild(divWrapper);

	      if(todo.status == "Active") {
	      	  li.className = "todo-active";

	      	  var buttonDone = document.createElement('input');
	      	  buttonDone.type = "button";
		      buttonDone.className = "todo-button";
		      buttonDone.setAttribute("id", "button-done");
		      buttonDone.setAttribute("data-id", todo.timestamp);                   
	    	  buttonDone.setAttribute("value", 'Mark as Done');
		      divWrapper.appendChild(buttonDone);

		      buttonDone.addEventListener('click', function(e) {
		        var id = parseInt(e.target.getAttribute('data-id'));
		        console.log(id);

		        todoDB.doneTodo(id, refreshTodos);
		        buttonDone.setAttribute("hidden", true);
		      });
	      }

	      var buttonDelete = document.createElement('input');
	      buttonDelete.type = "button";
	      buttonDelete.className = "todo-button";
	      buttonDelete.setAttribute("id", "button-delete");
	      buttonDelete.setAttribute("data-id", todo.timestamp);                    
    	  buttonDelete.setAttribute("value", 'Delete');
	      divWrapper.appendChild(buttonDelete);
	      
	      buttonDelete.addEventListener('click', function(e) {
	        var id = parseInt(e.target.getAttribute('data-id'));
	        console.log(id);

	        todoDB.deleteTodo(id, refreshTodos);
	      });

	      var buttonUpdate = document.createElement('input');
	      buttonUpdate.type = "button";
	      buttonUpdate.className = "todo-button";
	      buttonUpdate.setAttribute("id", "button-update");
	      buttonUpdate.setAttribute("data-id", todo.timestamp);                    
    	  buttonUpdate.setAttribute("value", 'Update');
	      divWrapper.appendChild(buttonUpdate);
	      
	      buttonUpdate.addEventListener('click', function(e) {
	        var id = parseInt(e.target.getAttribute('data-id'));
	        var newText = prompt("New Task Name:", todo.text);
	        console.log(newText);

	        todoDB.updateTodo(id,newText,refreshTodos);
	      });
	      
	    }

	  });
	}
};