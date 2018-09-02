var todoDB = (function() {
  var tDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  tDB.open = function(callback) {
  // Database version.
  var version = 1;

  // Open a connection to the datastore.
  var request = indexedDB.open('todos', version);

  // Handle datastore upgrades.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    e.target.transaction.onerror = tDB.onerror;

    // Delete the old datastore.
    if (db.objectStoreNames.contains('todo')) {
      db.deleteObjectStore('todo');
    }

    // Create a new datastore.
    var store = db.createObjectStore('todo', {
      keyPath: 'timestamp'
    });
  };

  // Handle successful datastore access.
  request.onsuccess = function(e) {
    // Get a reference to the DB.
    datastore = e.target.result;

    // Execute the callback.
    callback();
  };

  // Handle errors when opening the datastore.
  request.onerror = tDB.onerror;
};

/**
 * Fetch all of the todo items in the datastore.
 */
tDB.fetchTodos = function(callback) {
  var db = datastore;
  var transaction = db.transaction(['todo'], 'readwrite');
  var objStore = transaction.objectStore('todo');

  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = objStore.openCursor(keyRange);

  var todos = [];

  transaction.oncomplete = function(e) {
    // Execute the callback function.
    callback(todos);
  };

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;

    if (!!result == false) {
      return;
    }

    todos.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = tDB.onerror;
};

/**
 * Create a new todo item.
 */
tDB.createTodo = function(text, status, callback) {
  // Get a reference to the db.
  var db = datastore;

  // Initiate a new transaction.
  var transaction = db.transaction(['todo'], 'readwrite');

  // Get the datastore.
  var objStore = transaction.objectStore('todo');

  // Create a timestamp for the todo item.
  var timestamp = new Date().getTime();

  // Create an object for the todo item.
  var todo = {
    'text': text,
    'status': status,
    'timestamp': timestamp
  };

  // Create the datastore request.
  var request = objStore.put(todo);

  // Handle a successful datastore put.
  request.onsuccess = function(e) {
    // Execute the callback function.
    callback(todo);
  };

  // Handle errors.
  request.onerror = tDB.onerror;
};

/**
 * Delete a todo item.
 */
tDB.deleteTodo = function(id, callback) {
  var db = datastore;
  var transaction = db.transaction(['todo'], 'readwrite');
  var objStore = transaction.objectStore('todo');
  var request = objStore.delete(id);

  request.onsuccess = function(e) {
    callback();
  }

  request.onerror = function(e) {
    console.log(e);
  }
};

/**
 * Update todo to "Completed" status.
 */
tDB.doneTodo = function(id, callback) {
  var db = datastore;
  var transaction = db.transaction(['todo'], 'readwrite');
  var objStore = transaction.objectStore('todo');
  var request = objStore.get(id);

  request.onsuccess = function(e) {
	// Get the old value that we want to update
	var data = e.target.result;

	// update the value(s) in the object that you want to change
	data.status = "Completed";

	// Put this updated object back into the database.
	var requestUpdate = objStore.put(data);
	requestUpdate.onerror = function(event) {
	 console.log(e);
	};
	requestUpdate.onsuccess = function(event) {
	 callback();
	};
  }

  request.onerror = function(e) {
    console.log(e);
  }
};

/**
 * Update todo title/text.
 */
tDB.updateTodo = function(id,text,callback) {
  var db = datastore;
  var transaction = db.transaction(['todo'], 'readwrite');
  var objStore = transaction.objectStore('todo');
  var request = objStore.get(id);

  request.onsuccess = function(e) {
	// Get the old value that we want to update
	var data = e.target.result;

	// update the value(s) in the object that you want to change
	data.text = text;

	// Put this updated object back into the database.
	var requestUpdate = objStore.put(data);
	requestUpdate.onerror = function(event) {
	 console.log(e);
	};
	requestUpdate.onsuccess = function(event) {
	 callback();
	};
  }

  request.onerror = function(e) {
    console.log(e);
  }
};


  // Export the tDB object.
  return tDB;
}());