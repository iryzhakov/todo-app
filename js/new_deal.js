document.addEventListener('DOMContentLoaded', function() {

    const params = new URLSearchParams(window.location.search);
    let listName = params.get('list') || 'Склад';
  
    // создаём todo
    createTodoApp(
      document.getElementById('todo-app'),
      listName,
      listName
    );
  
    // список всех листов
    let lists = JSON.parse(localStorage.getItem('todoLists')) || ['Склад'];
  
    const listsContainer = document.getElementById('lists');
    listsContainer.className = 'nav gap-1';

    function renderLists() {
        listsContainer.innerHTML = '';

        lists.forEach(list => {
      
          const wrapper = document.createElement('div');
          wrapper.className = 'd-flex align-items-center gap-2 mb-2 list nav-link';
      
          // ссылка
          const a = document.createElement('a');
          a.href = `?list=${encodeURIComponent(list)}`;
          a.className = 'nav-link';
          a.textContent = list;
      
          // кнопка удалить
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'btn btn-sm btn-danger';
          deleteBtn.textContent = 'Удалить';
      
          deleteBtn.addEventListener('click', () => {
      
            if (!confirm(`Удалить список "${list}" ?`)) return;
      
            // удаляем из массива
            lists = lists.filter(l => l !== list);
      
            // сохраняем список страниц
            localStorage.setItem('todoLists', JSON.stringify(lists));
      
            // удаляем сами todo данные
            localStorage.removeItem(list);
      
            // если удалили текущую страницу — перейти на главную
            const params = new URLSearchParams(window.location.search);
            const current = params.get('list');
      
            if (current === list) {
              window.location.href = 'index.html';
              return;
            }
      
            renderLists();
          });
      
          wrapper.append(a);
          wrapper.append(deleteBtn);
      
          listsContainer.append(wrapper);
        });
    }
  
    renderLists();
  
    // создание нового списка
    document.getElementById('createList').addEventListener('click', () => {
  
      const input = document.getElementById('newListName');
      const name = input.value.trim();
  
      if (!name) return;
  
      lists.push(name);
      localStorage.setItem('todoLists', JSON.stringify(lists));
  
      window.location.href = `?list=${encodeURIComponent(name)}`;
  
    });
  
  });
  