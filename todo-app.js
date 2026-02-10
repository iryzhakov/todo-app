(function () {

  function createAppTitle(title) {
      let appTitle = document.createElement('h2');
      appTitle.innerHTML = title;
      return appTitle;
  };

  function createTodoItemForm() {
      let form = document.createElement('form');
      let input = document.createElement('input');
      // input.addEventListener('keydown', function(e) {

      //   if (e.key === 'Enter' && e.ctrlKey) {
      //     form.requestSubmit();
      //   }
      
      // });
      let buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('align-content-center');
      let button = document.createElement('button');

      form.classList.add('input-group', 'mb-3');
      input.classList.add('form-control', 'list-name');
      input.placeholder = 'Запиши что взял';

      // buttonWrapper.classList.add('input-group');
      button.classList.add('btn', 'btn-primary', 'btn-add');
      button.textContent = 'Добавить';

      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);

      button.disabled = true;
      input.addEventListener ('input', function() {
        if (input.value.trim () !== '') {
          button.disabled = false;
        };
      });

      return {
          form,
          input,
          button
      };
  };

  function createTodoList() {
      let list = document.createElement('ul');
      list.classList.add('list-group');
      return list;
  };

  function createTodoItem(name, done) {
    let item = document.createElement('li');
    let textWrapper = document.createElement('span'); // Обертка для текста дела
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    let editButton = document.createElement('button'); // Новая кнопка "Изменить"
    let itemDone = done || false;

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    textWrapper.textContent = name; // Устанавливаем текст дела в обертку
    item.style.whiteSpace = 'pre-wrap';

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Вернул';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';
    editButton.classList.add('btn', 'btn-blue'); // Класс для кнопки "Изменить"
    editButton.textContent = '<– –>';

    buttonGroup.append(doneButton);
    buttonGroup.append(editButton); // Добавляем кнопку "Изменить"
    buttonGroup.append(deleteButton);
    item.append(textWrapper); // Добавляем текстовую обертку в элемент
    item.append(buttonGroup);

    // Логика редактирования текста
    editButton.addEventListener('click', function () {
        const newText = prompt('Введите новый текст для дела:', textWrapper.textContent);
        if (newText !== null && newText.trim() !== '') {
            textWrapper.textContent = newText; // Обновляем только текст дела
        }
    });

    return {
        item,
        doneButton,
        deleteButton,
        editButton, // Возвращаем кнопку "Изменить"
        itemDone,
    };
}

  let todoItems = [];

  function getId () {
    //вариант с произвольным номером
    // if (todoItems.length === 0) {
    //   return 1;
    // };
    // return Math.floor(Math.random() * 100);

    // загуглено с порядковым
    return todoItems.length ? Math.max(...todoItems.map(i => i.id)) + 1 : 1;
  };


  function saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadFromLocal (key) {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  function createTodoApp(container, title = 'Список дел', pageName) {
      let pageKey = pageName;
      let todoAppTitle = createAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();

      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);


      // загрузка из локал сторэдж для нужной страницы
      todoItems = loadFromLocal(pageKey);

      // загрузка с обрадоткой дела при отметке готово
      todoItems.forEach(itemData => {
      let todoItem = createTodoItem(itemData.name, itemData.done);

      if (itemData.done) {
        todoItem.item.classList.add('list-group-item-success');
      }

      // это обработка кнопок для дел, которые подгружаются из локал,
      // иначе нельзя пометить старое дело как выполненое
        todoItem.doneButton.addEventListener('click', function () {
        todoItem.item.classList.toggle('list-group-item-success');
        let item = todoItems.find(i => i.id === itemData.id);
        if (item) {
            item.done = !item.done;
            saveToLocal(pageKey, todoItems);
        }
        });

        todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
            todoItem.item.remove();
            todoItems = todoItems.filter(i => i.id !== itemData.id);
            saveToLocal(pageKey, todoItems);
        }
        });

        todoList.append(todoItem.item);
        });

      // браузер создает submit в форме по нажатию Enter или на кнопку создания тела
      todoItemForm.form.addEventListener('submit', function(e) {
        e.preventDefault();
    
        // Игнорируем создание, если поле ввода пустое
        if (!todoItemForm.input.value) {
            return;
        }
    
        // Вычисляем порядковый номер
        const itemNumber = todoItems.length + 1;
    
        // Формируем название с порядковым номером
        const itemName = `${itemNumber}. ${todoItemForm.input.value}`;
    
        // Создаем и добавляем в список новое дело
        let todoItem = createTodoItem(itemName);
    
        let itemData = {
            id: getId(),
            name: itemName,
            done: todoItem.itemDone,
        };
    
        // Добавляем обработчики кнопок
        todoItem.doneButton.addEventListener('click', function() {
            todoItem.item.classList.toggle('list-group-item-success');
    
            let item = todoItems.find(i => i.id === itemData.id);
            if (item) {
                item.done = !item.done;
                saveToLocal(pageKey, todoItems);
            }
        });
    
        todoItem.deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                todoItem.item.remove();
                // Удаление из массива
                todoItems = todoItems.filter(i => i.id !== itemData.id);
                saveToLocal(pageKey, todoItems);
            }
        });
    
        // Добавляем дело в массив и сохраняем в localStorage
        todoItems.push(itemData);
        saveToLocal(pageKey, todoItems);
    
        // Добавляем дело в список
        todoList.append(todoItem.item);
    
        // Обнуляем значение в поле ввода
        todoItemForm.input.value = '';
        todoItemForm.button.disabled = true;
    });
  };

  window.createTodoApp = createTodoApp;
})();

// document.addEventListener('DOMContentLoaded', function() {
//   createTodoApp(document.getElementById('todo-app'));
// });
