import React from "react";

interface QuestionData {
  id: string | number;
  jenis: string;
  pertanyaan: string;
  jawaban: string[];
  gambar?: string;
  petunjuk?: string;
}

interface StorageInterface {
  getItem(name: string): string | null;
  setItem(name: string, value: string): void;
  removeItem(name: string): void;
}

interface SafeStorageInterface {
  setItem(key: string, value: unknown): boolean;
  getItem<T>(key: string, fallback: T): T;
  removeItem(key: string): boolean;
  clear(): boolean;
}

export const safeJSONStringify = (
  obj: unknown,
  space?: number,
): string | null => {
  try {
    const seen = new WeakSet<object>();
    const replacer = (key: string, value: unknown): unknown => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular Reference]";
        }
        seen.add(value);
      }
      return value;
    };
    return JSON.stringify(obj, replacer, space);
  } catch (error) {
    console.error("Safe JSON stringify failed:", error);
    return null;
  }
};

/**
 * Safe JSON parse with error handling
 */
export const safeJSONParse = <T = unknown>(str: string, fallback: T): T => {
  try {
    const parsed: unknown = JSON.parse(str);
    return parsed as T;
  } catch (error) {
    console.error("Safe JSON parse failed:", error);
    return fallback;
  }
};

/**
 * Safe localStorage operations with SSR compatibility
 */
export const safeStorage: SafeStorageInterface = {
  setItem: (key: string, value: unknown): boolean => {
    // Double check for browser environment
    if (!isBrowser() || !isLocalStorageAvailable()) {
      return false; // NoOp on server or when localStorage unavailable
    }

    try {
      const stringified = safeJSONStringify(value);
      if (stringified === null) {
        console.error("Failed to stringify value for localStorage");
        return false;
      }
      window.localStorage.setItem(key, stringified);
      return true;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      return false;
    }
  },

  getItem: <T>(key: string, fallback: T): T => {
    // Double check for browser environment
    if (!isBrowser() || !isLocalStorageAvailable()) {
      return fallback; // Return fallback on server or when localStorage unavailable
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return safeJSONParse<T>(item, fallback);
    } catch (error) {
      console.error(`Failed to get item '${key}' from localStorage:`, error);
      return fallback;
    }
  },

  removeItem: (key: string): boolean => {
    // Double check for browser environment
    if (!isBrowser() || !isLocalStorageAvailable()) {
      return false; // NoOp on server or when localStorage unavailable
    }

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
      return false;
    }
  },

  clear: (): boolean => {
    // Double check for browser environment
    if (!isBrowser() || !isLocalStorageAvailable()) {
      return false; // NoOp on server or when localStorage unavailable
    }

    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      return false;
    }
  },
};

/**
 * NoOp storage for server-side environment
 */
const createNoOpStorage = (): StorageInterface => ({
  getItem: (_name: string): string | null => {
    return null;
  },
  setItem: (_name: string, _value: string): void => {
    // NoOp - do nothing on server
  },
  removeItem: (_name: string): void => {
    // NoOp - do nothing on server
  },
});

/**
 * Memory storage fallback for environments where localStorage fails
 */
const createMemoryStorage = (): StorageInterface => {
  const storage = new Map<string, string>();

  return {
    getItem: (name: string): string | null => {
      return storage.get(name) ?? null;
    },
    setItem: (name: string, value: string): void => {
      storage.set(name, value);
    },
    removeItem: (name: string): void => {
      storage.delete(name);
    },
  };
};

/**
 * Browser localStorage implementation
 */
const createBrowserStorage = (): StorageInterface => ({
  getItem: (name: string): string | null => {
    if (!isBrowser() || !isLocalStorageAvailable()) {
      return null;
    }

    try {
      return window.localStorage.getItem(name);
    } catch (error) {
      console.error(`Failed to get item '${name}' from localStorage:`, error);
      return null;
    }
  },

  setItem: (name: string, value: string): void => {
    if (!isBrowser() || !isLocalStorageAvailable()) {
      return; // NoOp when not available
    }

    try {
      window.localStorage.setItem(name, value);
    } catch (error) {
      console.error(`Failed to set item '${name}' to localStorage:`, error);

      // Try to clear some space and retry
      try {
        window.localStorage.clear();
        window.localStorage.setItem(name, value);
        console.log("Successfully saved after clearing localStorage");
      } catch (retryError) {
        console.error(
          "Failed to save even after clearing localStorage:",
          retryError,
        );
      }
    }
  },

  removeItem: (name: string): void => {
    if (!isBrowser() || !isLocalStorageAvailable()) {
      return; // NoOp when not available
    }

    try {
      window.localStorage.removeItem(name);
    } catch (error) {
      console.error(
        `Failed to remove item '${name}' from localStorage:`,
        error,
      );
    }
  },
});

/**
 * SSR-safe storage that automatically selects appropriate backend
 */
export const createSafeStorage = (): StorageInterface => {
  // Server-side: use NoOp storage
  if (!isBrowser()) {
    return createNoOpStorage();
  }

  // Client-side: check localStorage availability
  if (isLocalStorageAvailable()) {
    return createBrowserStorage();
  }

  // Fallback: use memory storage
  console.warn("localStorage not available, falling back to memory storage");
  return createMemoryStorage();
};

/**
 * Check if sessionStorage is available and functional
 */
export const isSessionStorageAvailable = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  try {
    const testKey = "__sessionStorage_test__";
    window.sessionStorage.setItem(testKey, "test");
    const retrievedValue = window.sessionStorage.getItem(testKey);
    window.sessionStorage.removeItem(testKey);
    return retrievedValue === "test";
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * SSR-safe sessionStorage implementation
 */
export const createSafeSessionStorage = (): StorageInterface => {
  // Server-side: use NoOp storage
  if (!isBrowser()) {
    return createNoOpStorage();
  }

  // Client-side: check sessionStorage availability
  if (isSessionStorageAvailable()) {
    return {
      getItem: (name: string): string | null => {
        if (!isBrowser() || !isSessionStorageAvailable()) {
          return null;
        }

        try {
          return window.sessionStorage.getItem(name);
        } catch (error) {
          console.error(
            `Failed to get item '${name}' from sessionStorage:`,
            error,
          );
          return null;
        }
      },
      setItem: (name: string, value: string): void => {
        if (!isBrowser() || !isSessionStorageAvailable()) {
          return; // NoOp when not available
        }

        try {
          window.sessionStorage.setItem(name, value);
        } catch (error) {
          console.error(
            `Failed to set item '${name}' to sessionStorage:`,
            error,
          );
        }
      },
      removeItem: (name: string): void => {
        if (!isBrowser() || !isSessionStorageAvailable()) {
          return; // NoOp when not available
        }

        try {
          window.sessionStorage.removeItem(name);
        } catch (error) {
          console.error(
            `Failed to remove item '${name}' from sessionStorage:`,
            error,
          );
        }
      },
    };
  }

  // Fallback: use memory storage
  console.warn("sessionStorage not available, falling back to memory storage");
  return createMemoryStorage();
};

/**
 * Type guard to check if value is a valid object
 */
const isValidObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * Type guard to check if value looks like QuestionData
 */
const isQuestionLike = (value: unknown): value is Partial<QuestionData> => {
  return (
    isValidObject(value) &&
    ("id" in value || "jenis" in value || "pertanyaan" in value)
  );
};

/**
 * Safe string conversion
 */
const toSafeString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return "";
};

/**
 * Safe array conversion for jawaban
 */
const toSafeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(toSafeString);
  }
  return [];
};

/**
 * Sanitize question data to prevent circular references
 */
export const sanitizeQuestion = (question: unknown): QuestionData => {
  const defaultQuestion: QuestionData = {
    id: "",
    jenis: "",
    pertanyaan: "",
    jawaban: [],
  };

  if (!isQuestionLike(question)) {
    return defaultQuestion;
  }

  return {
    id: question.id !== undefined ? toSafeString(question.id) : "",
    jenis: toSafeString(question.jenis),
    pertanyaan: toSafeString(question.pertanyaan),
    jawaban: toSafeStringArray(question.jawaban),
    gambar: typeof question.gambar === "string" ? question.gambar : undefined,
    petunjuk:
      typeof question.petunjuk === "string" ? question.petunjuk : undefined,
  };
};

/**
 * Sanitize array of questions
 */
export const sanitizeQuestions = (questions: unknown): QuestionData[] => {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions.map(sanitizeQuestion);
};

/**
 * Check if we're in a browser environment
 */
export const isBrowser = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined" &&
    typeof document !== "undefined"
  );
};

/**
 * Check if localStorage is available and functional
 */
export const isLocalStorageAvailable = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  try {
    const testKey = "__localStorage_test__";
    window.localStorage.setItem(testKey, "test");
    const retrievedValue = window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);
    return retrievedValue === "test";
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Error boundary helper for storage operations
 */
export const withStorageErrorHandler = <T extends unknown[], R>(
  fn: (...args: T) => R,
  fallback: R,
  errorMessage = "Storage operation failed",
) => {
  return (...args: T): R => {
    try {
      return fn(...args);
    } catch (error) {
      console.error(errorMessage, error);
      return fallback;
    }
  };
};

/**
 * Storage info interface
 */
interface StorageInfo {
  isBrowser: boolean;
  isLocalStorageAvailable: boolean;
  isSessionStorageAvailable: boolean;
  storageType: "NoOp (Server)" | "localStorage" | "Memory";
  sessionStorageType: "NoOp (Server)" | "sessionStorage" | "Memory";
}

/**
 * Get storage info for debugging
 */
export const getStorageInfo = (): StorageInfo => {
  const browserCheck = isBrowser();
  const localStorageCheck = isLocalStorageAvailable();
  const sessionStorageCheck = isSessionStorageAvailable();

  return {
    isBrowser: browserCheck,
    isLocalStorageAvailable: localStorageCheck,
    isSessionStorageAvailable: sessionStorageCheck,
    storageType: !browserCheck
      ? "NoOp (Server)"
      : localStorageCheck
        ? "localStorage"
        : "Memory",
    sessionStorageType: !browserCheck
      ? "NoOp (Server)"
      : sessionStorageCheck
        ? "sessionStorage"
        : "Memory",
  };
};

/**
 * Hook-like utility for Next.js to ensure client-side only execution
 * Use this in components that need to access localStorage
 */
export const useClientOnlyStorage = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isClient,
    storage: isClient
      ? safeStorage
      : ({
          getItem: <T>(key: string, fallback: T): T => fallback,
          setItem: (): boolean => false,
          removeItem: (): boolean => false,
          clear: (): boolean => false,
        } as SafeStorageInterface),
  };
};

/**
 * Alternative approach: Create a storage instance that's guaranteed to work
 * This prevents any direct localStorage access during SSR
 */
export const createSSRSafeStorage = (): SafeStorageInterface => {
  // Memory fallback for server-side
  const memoryStorage = new Map<string, string>();

  return {
    setItem: (key: string, value: unknown): boolean => {
      // Server-side or when localStorage is not available
      if (!isBrowser() || !isLocalStorageAvailable()) {
        try {
          const stringified = safeJSONStringify(value);
          if (stringified !== null) {
            memoryStorage.set(key, stringified);
            return true;
          }
          return false;
        } catch (error) {
          console.error("Failed to save to memory storage:", error);
          return false;
        }
      }

      // Client-side with localStorage available
      return safeStorage.setItem(key, value);
    },

    getItem: <T>(key: string, fallback: T): T => {
      // Server-side or when localStorage is not available
      if (!isBrowser() || !isLocalStorageAvailable()) {
        try {
          const item = memoryStorage.get(key);
          if (item === undefined) return fallback;
          return safeJSONParse<T>(item, fallback);
        } catch (error) {
          console.error("Failed to read from memory storage:", error);
          return fallback;
        }
      }

      // Client-side with localStorage available
      return safeStorage.getItem(key, fallback);
    },

    removeItem: (key: string): boolean => {
      // Server-side or when localStorage is not available
      if (!isBrowser() || !isLocalStorageAvailable()) {
        try {
          memoryStorage.delete(key);
          return true;
        } catch (error) {
          console.error("Failed to remove from memory storage:", error);
          return false;
        }
      }

      // Client-side with localStorage available
      return safeStorage.removeItem(key);
    },

    clear: (): boolean => {
      // Server-side or when localStorage is not available
      if (!isBrowser() || !isLocalStorageAvailable()) {
        try {
          memoryStorage.clear();
          return true;
        } catch (error) {
          console.error("Failed to clear memory storage:", error);
          return false;
        }
      }

      // Client-side with localStorage available
      return safeStorage.clear();
    },
  };
};
