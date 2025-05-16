import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from '../HomePage';

describe('HomePage компонент', () => {
  it('рендерится корректно', () => {
    render(<HomePage />);
    
    // Проверяем, что заголовок страницы отображается
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('имеет правильную структуру DOM', () => {
    const { container } = render(<HomePage />);
    
    // Проверяем, что компонент содержит div как корневой элемент
    expect(container.firstChild?.nodeName).toBe('DIV');
    
    // Проверяем, что h1 находится внутри div
    const heading = screen.getByText('Home Page');
    expect(heading.nodeName).toBe('H1');
    expect(heading.parentElement?.nodeName).toBe('DIV');
  });
});
