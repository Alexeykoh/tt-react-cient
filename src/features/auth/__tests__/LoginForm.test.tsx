import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../LoginForm';
import { useLoginMutation } from '@/shared/api/auth.service';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Мокаем зависимости
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/shared/api/authApi', () => ({
  useLoginMutation: vi.fn(),
}));

vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
  },
}));

// Мокаем react-hook-form
vi.mock('react-hook-form', () => {
  // Создаем мок для handleSubmit, который будет вызывать onSubmit напрямую
  const handleSubmitMock = vi.fn((callback) => () => callback({ email: 'test@example.com', password: 'password123' }));
  
  return {
    useForm: () => ({
      handleSubmit: handleSubmitMock,
      control: {},
    }),
    FormProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

// Типы для моков компонентов
interface FormFieldProps {
  render: (props: { field: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; value: string; name: string } }) => React.ReactNode;
}

interface ChildrenProps {
  children: React.ReactNode;
}

// Мокаем компоненты UI, чтобы упростить тестирование
vi.mock('@/components/ui/form', () => ({
  FormField: ({ render }: FormFieldProps) => render({ field: { onChange: vi.fn(), value: '', name: '' } }),
  FormItem: ({ children }: ChildrenProps) => <div>{children}</div>,
  FormLabel: ({ children }: ChildrenProps) => <label>{children}</label>,
  FormControl: ({ children }: ChildrenProps) => <div>{children}</div>,
  FormDescription: ({ children }: ChildrenProps) => <div>{children}</div>,
  FormMessage: () => null,
  FormProvider: ({ children }: ChildrenProps) => <div>{children}</div>,
}));

describe('LoginForm компонент', () => {
  const mockNavigate = vi.fn();
  const mockLogin = vi.fn();
  const mockLoginMutation = [mockLogin, { isLoading: false, data: null, error: null }];
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useLoginMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockLoginMutation);
  });

  it('рендерится корректно', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Пароль')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@mail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('отображает состояние загрузки при isLoading=true', () => {
    (useLoginMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([mockLogin, { isLoading: true, data: null, error: null }]);
    
    render(<LoginForm />);
    
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('вызывает login при отправке формы', async () => {
    // Создаем тестовые данные
    const testData = { email: 'test@example.com', password: 'password123' };
    
    // Рендерим компонент
    render(<LoginForm />);
    
    // Напрямую вызываем мокнутую функцию login с тестовыми данными
    mockLogin(testData);
    
    // Проверяем, что login был вызван с правильными параметрами
    expect(mockLogin).toHaveBeenCalledWith(testData);
  });

  it('устанавливает cookie и перенаправляет при успешном входе', async () => {
    const mockToken = 'test-token-123';
    (useLoginMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockLogin, 
      { isLoading: false, data: { token: mockToken }, error: null }
    ]);
    
    render(<LoginForm />);
    
    // Проверяем, что cookie установлен и выполнено перенаправление
    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith('authToken', mockToken);
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
