#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Define the Book structure
typedef struct Book {
    char name[100];
    char author[100];
    char genre[50];
    char isbn[20];
    struct Book *next;
} Book;

// Function prototypes
Book *createBook(const char *name, const char *author, const char *genre, const char *isbn);
void addBook(Book **head, const char *name, const char *author, const char *genre, const char *isbn);
void viewBooks(Book *head);
void searchBook(Book *head, const char *query);
void removeBook(Book **head, const char *isbn);

int main() {
    Book *head = NULL;
    int choice;
    char name[100], author[100], genre[50], isbn[20], query[100];

    while (1) {
        printf("\nLibrary Management System\n");
        printf("1. Add Book\n");
        printf("2. View Books\n");
        printf("3. Search Book\n");
        printf("4. Remove Book\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar(); // Consume newline character

        switch (choice) {
            case 1:
                printf("Enter Book Name: ");
                fgets(name, sizeof(name), stdin);
                name[strcspn(name, "\n")] = 0; // Remove newline character

                printf("Enter Author Name: ");
                fgets(author, sizeof(author), stdin);
                author[strcspn(author, "\n")] = 0;

                printf("Enter Genre: ");
                fgets(genre, sizeof(genre), stdin);
                genre[strcspn(genre, "\n")] = 0;

                printf("Enter ISBN: ");
                fgets(isbn, sizeof(isbn), stdin);
                isbn[strcspn(isbn, "\n")] = 0;

                addBook(&head, name, author, genre, isbn);
                break;

            case 2:
                viewBooks(head);
                break;

            case 3:
                printf("Enter search query (name or author): ");
                fgets(query, sizeof(query), stdin);
                query[strcspn(query, "\n")] = 0;
                searchBook(head, query);
                break;

            case 4:
                printf("Enter ISBN to remove: ");
                fgets(isbn, sizeof(isbn), stdin);
                isbn[strcspn(isbn, "\n")] = 0;
                removeBook(&head, isbn);
                break;

            case 5:
                printf("Exiting...\n");
                return 0;

            default:
                printf("Invalid choice. Please try again.\n");
        }
    }
}

// Create a new book node
Book *createBook(const char *name, const char *author, const char *genre, const char *isbn) {
    Book *newBook = (Book *)malloc(sizeof(Book));
    strcpy(newBook->name, name);
    strcpy(newBook->author, author);
    strcpy(newBook->genre, genre);
    strcpy(newBook->isbn, isbn);
    newBook->next = NULL;
    return newBook;
}

// Add a book to the list
void addBook(Book **head, const char *name, const char *author, const char *genre, const char *isbn) {
    Book *newBook = createBook(name, author, genre, isbn);

    // Check for duplicates
    Book *current = *head;
    while (current) {
        if (strcmp(current->isbn, isbn) == 0) {
            printf("Error: A book with this ISBN already exists!\n");
            free(newBook);
            return;
        }
        current = current->next;
    }

    // Insert in sorted order by book name
    if (*head == NULL || strcmp((*head)->name, name) > 0) {
        newBook->next = *head;
        *head = newBook;
    } else {
        current = *head;
        while (current->next && strcmp(current->next->name, name) < 0) {
            current = current->next;
        }
        newBook->next = current->next;
        current->next = newBook;
    }

    printf("Book added successfully!\n");
}

// View all books
void viewBooks(Book *head) {
    if (head == NULL) {
        printf("No books available.\n");
        return;
    }

    printf("\nBooks in Library:\n");
    while (head) {
        printf("Name: %s, Author: %s, Genre: %s, ISBN: %s\n",
               head->name, head->author, head->genre, head->isbn);
        head = head->next;
    }
}

// Search for a book by name or author
void searchBook(Book *head, const char *query) {
    int found = 0;

    while (head) {
        if (strstr(head->name, query) || strstr(head->author, query)) {
            printf("Found: Name: %s, Author: %s, Genre: %s, ISBN: %s\n",
                   head->name, head->author, head->genre, head->isbn);
            found = 1;
        }
        head = head->next;
    }

    if (!found) {
        printf("No books found matching \"%s\".\n", query);
    }
}

// Remove a book by ISBN
void removeBook(Book **head, const char *isbn) {
    if (*head == NULL) {
        printf("No books available to remove.\n");
        return;
    }

    Book *current = *head;
    Book *prev = NULL;

    while (current && strcmp(current->isbn, isbn) != 0) {
        prev = current;
        current = current->next;
    }

    if (current == NULL) {
        printf("No book found with ISBN \"%s\".\n", isbn);
        return;
    }

    if (prev == NULL) {
        *head = current->next;
    } else {
        prev->next = current->next;
    }

    free(current);
    printf("Book removed successfully!\n");
}
