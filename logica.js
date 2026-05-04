const API_URL = 'https://livros.acilab.com.br/api/livros';

const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('books-list');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const formTitle = document.getElementById('form-title');
const btnCancel = document.getElementById('btn-cancel');

async function loadBooks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`); // ✅ checa status
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}

function renderTable(books) {
    if (!books || books.length === 0) {
        bookList.innerHTML = '<tr><td colspan="3">Nenhum livro cadastrado.</td></tr>';
        return;
    }

    bookList.innerHTML = books.map((book) => `
        <tr>
            <td>${book.titulo}</td>
            <td>${book.autor}</td>
            <td>
                <button class="btn-edit" onclick="fillFormForEdit('${book.id}', '${book.titulo}', '${book.autor}')">Editar</button>
                <button class="btn-delete" onclick="deleteBook('${book.id}')">Excluir</button>
            </td>
        </tr>
    `).join('');
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
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`); // ✅ checa status
        resetForm();
        loadBooks();
    } catch (error) {
        alert("Erro ao salvar os dados.");
        console.error(error);
    }
});

async function deleteBook(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        loadBooks();
    } catch (error) {
        alert("Erro ao excluir o livro.");
        console.error(error);
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
