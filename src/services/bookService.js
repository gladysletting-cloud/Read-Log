import {
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

export async function addBook(userId, book) {
    const bookRef = collection(db, 'users', userId, 'books')
    await addDoc(bookRef, book)
}
export async function getBooks(userId){
    const bookRef = collection(db, 'users', userId, 'books')
    const snapshot= await getDocs(bookRef)
    const books = []
    snapshot.forEach((item) =>{
        const book = item.data()
        book.id = item.id
        books.push(book)
    })
    return books
}
export async function deleteBook(userId, bookId){
    const bookRef = doc(db, 'users', userId, 'books', bookId)
    await deleteDoc(bookRef)
}
export async function updateBookStatus(userId, bookId, newStatus){
    const bookRef = doc(db, 'users', userId, 'books', bookId)
    await updateDoc(bookRef,{status: newStatus})
}