import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <mat-icon class="text-ghg-500 text-5xl h-12 w-12">eco</mat-icon>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin() ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <button (click)="toggleMode()" class="font-medium text-ghg-600 hover:text-ghg-500 transition-colors">
            {{ isLogin() ? 'đăng ký tài khoản mới' : 'đăng nhập nếu đã có tài khoản' }}
          </button>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-6">
            @if (!isLogin()) {
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700">Họ và tên</label>
                <div class="mt-1">
                  <input id="fullName" formControlName="fullName" type="text" required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                </div>
                @if (authForm.get('fullName')?.touched && authForm.get('fullName')?.invalid) {
                  <p class="mt-1 text-xs text-red-600">Vui lòng nhập họ tên đầy đủ.</p>
                }
              </div>
            }

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <div class="mt-1">
                <input id="email" formControlName="email" type="email" autocomplete="email" required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
              </div>
              @if (authForm.get('email')?.touched && authForm.get('email')?.invalid) {
                <p class="mt-1 text-xs text-red-600">Vui lòng nhập email hợp lệ.</p>
              }
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div class="mt-1">
                <input id="password" formControlName="password" type="password" autocomplete="current-password" required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
              </div>
              @if (authForm.get('password')?.touched && authForm.get('password')?.invalid) {
                <p class="mt-1 text-xs text-red-600">Mật khẩu phải có ít nhất 6 ký tự.</p>
              }
            </div>

            @if (errorMessage()) {
              <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <mat-icon class="text-red-400">error</mat-icon>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-red-800">{{ errorMessage() }}</p>
                  </div>
                </div>
              </div>
            }

            <div>
              <button type="submit" [disabled]="authForm.invalid || isLoading()"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ghg-600 hover:bg-ghg-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghg-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                @if (isLoading()) {
                  <mat-icon class="animate-spin mr-2">sync</mat-icon>
                }
                {{ isLogin() ? 'Đăng nhập' : 'Đăng ký' }}
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div class="mt-6">
              <button (click)="loginWithGoogle()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="h-5 w-5 mr-2">
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  isLogin = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['']
  });

  toggleMode() {
    this.isLogin.update(v => !v);
    this.errorMessage.set(null);
    if (!this.isLogin()) {
      this.authForm.get('fullName')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('fullName')?.clearValidators();
    }
    this.authForm.get('fullName')?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.authForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, fullName } = this.authForm.value;

    try {
      if (this.isLogin()) {
        await this.dataService.loginWithEmail(email, password);
      } else {
        await this.dataService.registerWithEmail(email, password, fullName);
      }
      this.router.navigate(['/dashboard']);
    } catch (error) {
      const err = error as { code: string };
      this.errorMessage.set(this.getErrorMessage(err.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginWithGoogle() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.dataService.login();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      const err = error as { code: string };
      this.errorMessage.set(this.getErrorMessage(err.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Người dùng không tồn tại.';
      case 'auth/wrong-password':
        return 'Mật khẩu không chính xác.';
      case 'auth/email-already-in-use':
        return 'Email này đã được sử dụng.';
      case 'auth/invalid-email':
        return 'Email không hợp lệ.';
      case 'auth/weak-password':
        return 'Mật khẩu quá yếu.';
      case 'auth/popup-closed-by-user':
        return 'Cửa sổ đăng nhập đã bị đóng.';
      default:
        return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  }
}
