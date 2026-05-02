const API_URL = 'https://livros.acilab.com.br/api/livros';

const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const formTitle = document.getElementById('form-title');
const btnCancel = document.getElementById('btn-cancel');


async function loadBooks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}


function renderTable(books) {
    bookList.innerHTML = '';
    books.forEach((book) => {
        const row = `
        <tr>
            <td>${book.titulo}</td>
            <td>${book.autor}</td>
            <td>
                <button class="btn-edit" onclick="fillFormForEdit('${book.id}', '${book.titulo}', '${book.autor}')">Editar</button>
                <button class="btn-delete" onclick="deleteBook('${book.id}')">Excluir</button>
            </td>
        </tr>`;
        bookList.innerHTML += row;
    });
}


bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = bookIdInput.value;
    const bookData = {
        titulo: titleInput.value,
        autor: authorInput.value
    };


    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        resetForm();
        loadBooks();
    } catch (error) {
        alert("Erro ao salvar os dados.");
    }
});


async function deleteBook(id) {
    if (confirm("Tem certeza que deseja excluir?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadBooks();
    }
}


function fillFormForEdit(id, titulo, autor) {
    bookIdInput.value = id;
    titleInput.value = titulo;
    authorInput.value = autor;
    formTitle.innerText = "Editando Livro";
    btnCancel.style.display = 'inline';
}

function resetForm() {
    bookIdInput.value = '';
    bookForm.reset();
    formTitle.innerText = "Adicionar Novo Livro";
    btnCancel.style.display = 'none';
}

btnCancel.onclick = resetForm;
loadBooks();
