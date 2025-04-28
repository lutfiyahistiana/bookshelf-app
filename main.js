document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    const searchBook = document.getElementById("searchBook");
    const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
    const submitButton = document.getElementById("bookFormSubmit");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    function renderBooks() {
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";

        books.forEach(book => {
            const bookElement = createBookElement(book);
            if (!book.isComplete) {
                incompleteBookList.append(bookElement);
            } else {
                completeBookList.append(bookElement);
            }
        });
    }

    function createBookElement(book) {
        const bookDiv = document.createElement("div");
        bookDiv.setAttribute("data-bookid", book.id);
        bookDiv.setAttribute("data-testid", "bookItem");
    
        bookDiv.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton"></button>
                <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                <button data-testid="bookItemEditButton">Edit Buku</button>
            </div>
        `;
    
        const moveButton = bookDiv.querySelector("[data-testid='bookItemIsCompleteButton']");
        moveButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    
        moveButton.addEventListener("click", () => {
            book.isComplete = !book.isComplete;
            saveBooks();
            renderBooks();
        });
    
        bookDiv.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => {
            if (confirm("Apakah Anda yakin ingin menghapus buku ini dari daftar?")) {
                books = books.filter(b => b.id !== book.id);
                saveBooks();
                renderBooks();
            }
        });
    
        bookDiv.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", () => {
            editBook(book);
        });
    
        return bookDiv;
    }    

    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
    }

    function editBook(book) {
        const title = prompt("Edit Judul", book.title);
        const author = prompt("Edit Penulis", book.author);
        const year = prompt("Edit Tahun", book.year);
        if (title && author && year) {
            book.title = title;
            book.author = author;
            book.year = Number(year);
            saveBooks();
            renderBooks();
        }
    }

    // Menambahkan event listener untuk checkbox
    isCompleteCheckbox.addEventListener("change", () => {
        if (isCompleteCheckbox.checked) {
            submitButton.innerHTML = "Masukkan Buku ke rak Selesai dibaca";
        } else {
            submitButton.innerHTML = "Masukkan Buku ke rak Belum selesai dibaca";
        }
    });

    bookForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = Number(document.getElementById("bookFormYear").value);
        const isComplete = isCompleteCheckbox.checked;

        const newBook = {
            id: new Date().getTime(),
            title,
            author,
            year,
            isComplete
        };

        books.push(newBook);
        saveBooks();
        renderBooks();
        bookForm.reset();
        submitButton.innerHTML = "Masukkan Buku ke rak Belum selesai dibaca"; // Reset tombol setelah submit
    });

    searchBook.addEventListener("submit", (event) => {
        event.preventDefault();
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
        
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";

        filteredBooks.forEach(book => {
            const bookElement = createBookElement(book);
            if (!book.isComplete) {
                incompleteBookList.append(bookElement);
            } else {
                completeBookList.append(bookElement);
            }
        });
    });

    renderBooks();
});