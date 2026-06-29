import { useState, useEffect, useCallback } from 'react';
import { Character } from '../types';
import { generateId, AVATAR_COLORS } from './helpers';

const STORAGE_KEY = 'mockup-studio-characters';

// No seeded characters — users build their own cast from scratch.
const DEFAULT_CHARACTERS: Character[] = [];

function loadFromStorage(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHARACTERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_CHARACTERS;
  } catch {
    return DEFAULT_CHARACTERS;
  }
}

function saveToStorage(chars: Character[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  } catch {
    // quota exceeded or private mode — silently fail
  }
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(loadFromStorage);

  // Persist on every change
  useEffect(() => {
    saveToStorage(characters);
  }, [characters]);

  const addCharacter = useCallback((partial?: Partial<Character>): Character => {
    const id = generateId();
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newChar: Character = {
      id,
      name: '',
      avatarColor: color,
      avatarPhotoUrl: null,
      handle: '',
      note: '',
      ...partial,
    };
    setCharacters(prev => [...prev, newChar]);
    return newChar;
  }, []);

  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  }, []);

  const getCharacter = useCallback((id: string): Character | undefined => {
    return characters.find(c => c.id === id);
  }, [characters]);

  /** Apply a character's info to a partial object (for prefilling conversations/posts) */
  const characterToConvPatch = useCallback((char: Character) => ({
    name: char.name,
    avatarColor: char.avatarColor,
    avatarPhotoUrl: char.avatarPhotoUrl,
  }), []);

  const characterToPostPatch = useCallback((char: Character) => ({
    username: char.name,
    handle: char.handle || char.name.toLowerCase().replace(/\s+/g, ''),
    avatarColor: char.avatarColor,
    avatarPhotoUrl: char.avatarPhotoUrl,
  }), []);

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacter,
    characterToConvPatch,
    characterToPostPatch,
  };
}

export type CharacterStore = ReturnType<typeof useCharacters>;
