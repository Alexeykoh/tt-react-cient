import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input компонент', () => {
  it('рендерится корректно', () => {
    render(<Input placeholder="Введите текст" />);
    expect(screen.getByPlaceholderText('Введите текст')).toBeInTheDocument();
  });

  it('применяет дополнительные классы через className', () => {
    render(<Input className="test-class" placeholder="Тест" />);
    const input = screen.getByPlaceholderText('Тест');
    expect(input).toHaveClass('test-class');
  });

  it('применяет базовые классы стилей', () => {
    render(<Input placeholder="Тест" />);
    const input = screen.getByPlaceholderText('Тест');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('rounded');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
  });

  it('принимает и отображает значение', () => {
    render(<Input value="Тестовое значение" readOnly />);
    expect(screen.getByDisplayValue('Тестовое значение')).toBeInTheDocument();
  });

  it('вызывает onChange при вводе текста', async () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Введите текст" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Введите текст');
    await userEvent.type(input, 'Привет');
    
    expect(handleChange).toHaveBeenCalledTimes(6); // По одному вызову на каждый символ
  });

  it('отключается при disabled=true', () => {
    render(<Input disabled placeholder="Отключено" />);
    const input = screen.getByPlaceholderText('Отключено');
    expect(input).toBeDisabled();
  });

  it('принимает различные типы ввода', () => {
    render(<Input type="password" placeholder="Пароль" />);
    const input = screen.getByPlaceholderText('Пароль');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('корректно передает ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Тест" />);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });
});
