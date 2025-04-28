import {create} from 'zustand'
import axios from 'axios'

export const useNotes = create((set, get) => ({
    notes: [],
    loading: false,
    error: null,
    
    getNotes: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        set({ loading: true });
        try {
            const response = await axios.get('http://localhost:8000/get-all-notes', {
                headers: {
                    Authorization: token // Token already includes 'Bearer '
                }
            });
            set({ 
                notes: response.data.notes || [], 
                loading: false,
                error: null
            });
        } catch (error) {
            console.error("Get notes error:", error);
            if (error.response?.status === 401) {
                localStorage.clear(); // Clear storage on auth error
                window.location.href = '/'; // Redirect to login
            }
            set({ 
                notes: [], 
                loading: false,
                error: error.message 
            });
        }
    },

    addToNotes: async (title, content, tags) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return false;
        }

        set({ loading: true });
        try {
            const response = await axios.post(
                "http://localhost:8000/add-note",
                { title, content, tags },
                {
                    headers: {
                        Authorization: token // Token already includes 'Bearer '
                    }
                }
            );
                
            if (response.data) {
                set(state => ({
                    notes: [...state.notes, response.data.note],
                    loading: false,
                    error: null
                }));
                return true;
            }
        } catch (error) {
            console.error("Add note error:", error);
            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = '/';
            }
            const errorMessage = error.response?.data?.message || 'Failed to add note';
            set({ error: errorMessage, loading: false });
            return false;
        }
    },

    updateNote: async (noteId, updatedData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return false;
        }

        set({ loading: true });
        try {
            if (!noteId) {
                throw new Error('Note ID is required');
            }
            
            const response = await axios.put(
                `http://localhost:8000/edit-note/${noteId}`, // Changed to http
                updatedData,
                { 
                    headers: { 
                        Authorization: token // Token already includes 'Bearer '
                    } 
                }
            );
            
            if (response.data) {
                const notes = get().notes.map(note => 
                    note._id === noteId ? { ...note, ...updatedData } : note
                );
                set({ notes, loading: false, error: null });
                return true;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = '/';
            }
            const errorMessage = error.response?.data?.message || 'Failed to update note';
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    deleteNote: async (noteId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return false;
        }

        if (!noteId) {
            console.error('Note ID is required for deletion');
            return false;
        }

        set({ loading: true });
        console.log(noteId)
        try {
            const response = await axios.delete(
                `http://localhost:8000/delete-note/${noteId}`, // Changed to http
                {
                    headers: {
                        Authorization: token // Token already includes 'Bearer '
                    }
                }
            );
            
            if (response.data) {
                const currentNotes = get().notes.filter(note => note._id !== noteId);
                set({ notes: currentNotes, loading: false, error: null });
                return true;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = '/';
            }
            const errorMessage = error.response?.data?.message || 'Failed to delete note';
            set({ error: errorMessage, loading: false });
            return false;
        }
    },

    togglePinNote: async (noteId, isPinned) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return false;
        }

        try {
            const response = await axios.put(
                `http://localhost:8000/update-note-isPinned/${noteId}`,
                { isPinned: !isPinned },
                { 
                    headers: { 
                        Authorization: token 
                    } 
                }
            );
            
            if (response.data) {
                const notes = get().notes.map(note => 
                    note._id === noteId ? { ...note, isPinned: !note.isPinned } : note
                );
                set({ notes });
                return true;
            }
        } catch (error) {
            console.error("Pin note error:", error);
            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = '/';
            }
            set({ error: error.response?.data?.message || 'Failed to pin note' });
            return false;
        }
    }
}))