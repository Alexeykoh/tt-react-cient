import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button компонент', () => {
  it('рендерится с текстом', () => {
    render(<Button>Нажми меня</Button>);
    expect(screen.getByText('Нажми меня')).toBeInTheDocument();
  });

  it('применяет правильный класс для варианта по умолчанию', () => {
    render(<Button>Кнопка</Button>);
    const button = screen.getByText('Кнопка');
    expect(button).toHaveClass('bg-primary');
  });

  it('применяет правильный класс для деструктивного варианта', () => {
    render(<Button variant="destructive">Удалить</Button>);
    const button = screen.getByText('Удалить');
    expect(button).toHaveClass('bg-destructive');
  });

  it('применяет правильный класс для размера по умолчанию', () => {
    render(<Button>Кнопка</Button>);
    const button = screen.getByText('Кнопка');
    expect(button).toHaveClass('h-9');
  });

  it('применяет правильный класс для маленького размера', () => {
    render(<Button size="sm">Маленькая</Button>);
    const button = screen.getByText('Маленькая');
    expect(button).toHaveClass('h-8');
  });

  it('применяет дополнительные классы через className', () => {
    render(<Button className="test-class">Кнопка</Button>);
    const button = screen.getByText('Кнопка');
    expect(button).toHaveClass('test-class');
  });

  it('отключается при disabled=true', () => {
    render(<Button disabled>Отключено</Button>);
    const button = screen.getByText('Отключено');
    expect(button).toBeDisabled();
  });

  it('вызывает onClick при клике', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Кликни</Button>);
    
    const button = screen.getByText('Кликни');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('рендерится как другой элемент при asChild=true', () => {
    render(
      <Button asChild>
        <a href="#">Ссылка</a>
      </Button>
    );
    
    const link = screen.getByText('Ссылка');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#');
    expect(link).toHaveClass('bg-primary'); // Проверяем, что стили кнопки применены
  });
});
