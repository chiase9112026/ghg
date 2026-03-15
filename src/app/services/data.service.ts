import { Injectable, signal } from '@angular/core';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../firebase-utils';

export interface User {
  id: string;
  fullName: string;
  email: string;
  position: string;
  department: string;
  role: 'ADMIN' | 'STAFF' | 'EXPERT' | 'ENTERPRISE' | 'STARTUP';
}

export interface Roadmap {
  id: string;
  projectName: string;
  manager: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'PLANNING' | 'ONGOING' | 'ON_HOLD' | 'COMPLETED';
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  assignees: string[]; // Array of user IDs
  roadmapId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEWING' | 'COMPLETED' | 'OVERDUE';
  deadline: string;
}

export interface Partner {
  id: string;
  name: string;
  type: 'ENTERPRISE' | 'STARTUP' | 'INVESTOR' | 'NGO';
  industry: string;
  joinDate: string;
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
}

export interface PartnerRegistration {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  industry: string;
  type: 'ENTERPRISE' | 'STARTUP' | 'INVESTOR' | 'NGO';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'TALKSHOW' | 'WORKSHOP' | 'MATCHING' | 'TRAINING';
  date: string;
  location: string;
  description?: string;
  imageUrl?: string;
  attendees?: number;
}

export interface Settings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface PageContent {
  about: string;
  services: string;
  hub: string;
  experts: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentUser = signal<FirebaseUser | null>(null);
  isAuthReady = signal(false);

  users = signal<User[]>([]);
  roadmaps = signal<Roadmap[]>([]);
  tasks = signal<Task[]>([]);
  partners = signal<Partner[]>([]);
  events = signal<Event[]>([]);
  settings = signal<Settings>({
    siteName: 'GHGVIETNAM',
    heroTitle: 'Mạng lưới Đối tác Khí nhà kính Việt Nam',
    heroSubtitle: 'Cùng nhau kết nối, chia sẻ và hợp tác. Hỗ trợ doanh nghiệp kiểm kê khí nhà kính, áp dụng ESG, chuyển đổi xanh, kinh tế tuần hoàn và kinh tế các-bon thấp.',
    contactEmail: 'contact@ghgvietnam.vn',
    contactPhone: '0981 378 599 (Ms. Vân)',
    contactAddress: 'Tầng 6, tòa nhà Avic Green, Số 12 Hoàng Cầu, Đống Đa, Hà Nội'
  });

  eventRegistrations = signal<EventRegistration[]>([]);
  partnerRegistrations = signal<PartnerRegistration[]>([]);

  pageContent = signal<PageContent>({
    about: 'Giới thiệu về GHGVIETNAM...',
    services: 'Các dịch vụ của chúng tôi...',
    hub: 'Thông tin về HUB...',
    experts: 'Đội ngũ chuyên gia...'
  });

  // Helper to generate IDs
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      this.isAuthReady.set(true);
      this.initListeners();
    });
  }

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const err = error as { code: string };
      console.error('Login error:', err);
      throw err;
    }
  }

  async registerWithEmail(email: string, pass: string, fullName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: fullName });
      return userCredential.user;
    } catch (error) {
      const err = error as { code: string };
      console.error('Registration error:', err);
      throw err;
    }
  }

  async loginWithEmail(email: string, pass: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      return userCredential.user;
    } catch (error) {
      const err = error as { code: string };
      console.error('Login error:', err);
      throw err;
    }
  }

  async logout() {
    try {
      await signOut(auth);
      this.users.set([]);
      this.roadmaps.set([]);
      this.tasks.set([]);
      this.partners.set([]);
      this.events.set([]);
      this.eventRegistrations.set([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private unsubscribes: (() => void)[] = [];

  private initListeners() {
    // Unsubscribe from previous listeners
    this.unsubscribes.forEach(unsub => unsub());
    this.unsubscribes = [];

    // Public collections
    this.syncCollection<Partner>('partners', this.partners);
    this.syncCollection<Event>('events', this.events);
    this.syncDocument<Settings>('settings', 'global', this.settings);
    this.syncDocument<PageContent>('pageContent', 'global', this.pageContent);

    // Private collections (only if authenticated)
    if (this.currentUser()) {
      this.syncCollection<User>('users', this.users);
      this.syncCollection<Roadmap>('roadmaps', this.roadmaps);
      this.syncCollection<Task>('tasks', this.tasks);
      this.syncCollection<EventRegistration>('eventRegistrations', this.eventRegistrations);
      this.syncCollection<PartnerRegistration>('partnerRegistrations', this.partnerRegistrations);
    }
  }

  private syncCollection<T>(path: string, signalRef: { set: (val: T[]) => void }) {
    const unsub = onSnapshot(query(collection(db, path)), (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const normalizedData = this.normalizeDates(data);
        items.push({ id: doc.id, ...normalizedData } as T);
      });
      signalRef.set(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    this.unsubscribes.push(unsub);
  }

  private syncDocument<T>(path: string, id: string, signalRef: { set: (val: T) => void }) {
    const unsub = onSnapshot(doc(db, path, id), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const normalizedData = this.normalizeDates(data);
        signalRef.set(normalizedData as T);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
    });
    this.unsubscribes.push(unsub);
  }

  private normalizeDates(data: Record<string, unknown>): Record<string, unknown> {
    if (!data || typeof data !== 'object') return data;
    
    const result = { ...data };
    const dateFields = ['date', 'startDate', 'endDate', 'deadline', 'joinDate', 'createdAt'];
    
    for (const field of dateFields) {
      const value = result[field];
      if (value) {
        if (typeof value === 'string') {
          // Handle DD/MM/YYYY or DD-MM-YYYY
          const dmyRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(.*)$/;
          const match = value.trim().match(dmyRegex);
          if (match) {
            const day = match[1].padStart(2, '0');
            const month = match[2].padStart(2, '0');
            const year = match[3];
            const timePart = match[4] || '';
            result[field] = `${year}-${month}-${day}${timePart}`;
          }
        } else if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
          // Handle Firestore Timestamp
          result[field] = (value as { toDate: () => Date }).toDate().toISOString();
        }
      }
    }
    return result;
  }

  async addData<T>(path: string, data: T) {
    try {
      await addDoc(collection(db, path), data as Record<string, unknown>);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  async updateData<T>(path: string, id: string, data: Partial<T>) {
    try {
      await updateDoc(doc(db, path, id), data as Record<string, unknown>);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
    }
  }

  async setData<T>(path: string, id: string, data: T) {
    try {
      await setDoc(doc(db, path, id), data as Record<string, unknown>, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
    }
  }

  async deleteData(path: string, id: string) {
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    }
  }
}
