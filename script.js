// Book and Linked List Structures
class Book {
  constructor(name, author, genre, isbn) {
    this.name = name;
    this.author = author;
    this.genre = genre;
    this.isbn = isbn;
  }
}

class Node {
  constructor(book) {
    this.book = book;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insert(book) {
    let current = this.head;
    while (current) {
      if (current.book.isbn === book.isbn) {
        alert("Error: A book with this ISBN already exists!");
        return false;
      }
      if (
        current.book.name.toLowerCase() === book.name.toLowerCase() &&
        current.book.author.toLowerCase() === book.author.toLowerCase()
      ) {
        alert("Error: A book with the same name and author already exists!");
        return false;
      }
      current = current.next;
    }

    const newNode = new Node(book);
    if (!this.head || this.head.book.name.localeCompare(book.name) > 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next && current.next.book.name.localeCompare(book.name) < 0) {
        current = current.next;
      }
      newNode.next = current.next;
      current.next = newNode;
    }
    return true;
  }

  displayWithRemove() {  
    let current = this.head;
    const books = [];
    while (current) {
      books.push(
        `<div class="book-item" data-isbn="${current.book.isbn}">
           <span><strong>${current.book.name}</strong> by ${current.book.author}</span>
           <span>Genre: ${current.book.genre}</span>
           <span>ISBN: ${current.book.isbn}</span>
           <button class="remove-btn">Remove</button>
         </div>`
      );
      current = current.next;
    }
    return books.join("") || "<p>No books available.</p>";
  }

  remove(isbn) {
    if (!this.head) return false;

    if (this.head.book.isbn === isbn) {
      this.head = this.head.next;
      return true;
    }

    let current = this.head;
    while (current.next && current.next.book.isbn !== isbn) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      return true;
    }
    return false;
  }

  toArray() {
    const books = [];
    let current = this.head;
    while (current) {
      books.push(current.book);
      current = current.next;
    }
    return books;
  }
}

function binarySearch(books, query) {
  let left = 0;
  let right = books.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const book = books[mid];

    if (book.name.toLowerCase() === query || book.author.toLowerCase() === query) {
      return book;
    } else if (book.name.toLowerCase() > query) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return null;
}

// Initialize
const bookList = new LinkedList();
const defaultBooks = [
  new Book("The Great Gatsby", "F. Scott Fitzgerald", "Classic", "9780743273565"),
  new Book("1984", "George Orwell", "Dystopian", "9780451524935"),
  new Book("To Kill a Mockingbird", "Harper Lee", "Classic", "9780061120084"),
];

defaultBooks.forEach((book) => bookList.insert(book));

const addBookSection = document.getElementById("addBookSection");
const viewBooksSection = document.getElementById("viewBooksSection");
const searchBooksSection = document.getElementById("searchBooksSection");
const bookListView = document.getElementById("bookListView");
const searchResults = document.getElementById("searchResults");

function refreshRemoveButtons() {
  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const isbn = e.target.closest(".book-item").getAttribute("data-isbn");
      if (bookList.remove(isbn)) {
        alert("Book removed!");
        bookListView.innerHTML = bookList.displayWithRemove();
        refreshRemoveButtons(); // Rebind event listeners
      }
    })
  );
}

document.getElementById("addBookBtn").addEventListener("click", () => toggleSection(addBookSection));
document.getElementById("viewBooksBtn").addEventListener("click", () => {
  toggleSection(viewBooksSection);
  bookListView.innerHTML = bookList.displayWithRemove();
  refreshRemoveButtons();
});

document.getElementById("searchBooksBtn").addEventListener("click", () => toggleSection(searchBooksSection));
document.getElementById("addBookButton").addEventListener("click", () => {
  const name = document.getElementById("newBookName").value.trim();
  const author = document.getElementById("newAuthorName").value.trim();
  const genre = document.getElementById("newGenre").value.trim();
  const isbn = document.getElementById("newISBN").value.trim();
  if (name && author && genre && isbn) {
    if (bookList.insert(new Book(name, author, genre, isbn))) {
      alert("Book added!");
      document.getElementById("newBookName").value = "";
      document.getElementById("newAuthorName").value = "";
      document.getElementById("newGenre").value = "";
      document.getElementById("newISBN").value = "";
    }
  }
});

document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchBar").value.trim().toLowerCase();
  if (query) {
    const sortedBooks = bookList.toArray().sort((a, b) => a.name.localeCompare(b.name));
    const result = binarySearch(sortedBooks, query);
    searchResults.innerHTML = result
      ? `<div class="book-item">
           <span><strong>${result.name}</strong> by ${result.author}</span>
           <span>Genre: ${result.genre}</span>
           <span>ISBN: ${result.isbn}</span>
         </div>`
      : `<p>No results found.</p>`;
  }
});

function toggleSection(section) {
  [addBookSection, viewBooksSection, searchBooksSection].forEach((s) => (s.style.display = s === section ? "block" : "none"));
}
