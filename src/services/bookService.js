import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function addBook(userId, book) {
    const bookRef = collection(db, 'users', userId, 'books')
    await addDoc(bookRef, book)
}
export async function getBooks(userId){
    const bookRef = collection(db, 'users', userId, 'books')
    const snapshot= await getDocs(bookRef)
    const books = []
    snapshot.forEach((doc) =>{
        const book = doc.data()
        book.id = doc.id
        books.push(book)
    })
    return books
}
export async function deleteBook(userId, bookId){
    const bookRef = doc(db, 'user', userId, 'books', bookId)
    await deleteDoc(bookRef)
}