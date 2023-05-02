import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';

describe('Teste o componente <Pokemon.js />', () => {
  test('Teste se é renderizado um card com as informações de determinado Pokémon', () => {
    renderWithRouter(<App />);
    // verificar se as informações do pikachu são renderizadas
    const buttonEletric = screen.getByRole('button', { name: /electric/i });
    userEvent.click(buttonEletric);
    expect(screen.getByTestId('pokemon-name')).toHaveTextContent(/pikachu/i);
    expect(screen.getByTestId('pokemon-type')).toHaveTextContent(/electric/i);
    expect(screen.getByTestId('pokemon-weight')).toHaveTextContent(/average weight: 6\.0 kg/i);
    const img = screen.getByRole('img', { name: /pikachu sprite/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveProperty('src', 'https://archives.bulbagarden.net/media/upload/b/b2/Spr_5b_025_m.png');
  });

  test('Teste se o card do Pokémon indicado na Pokédex contém um link de navegação para exibir detalhes deste Pokémon', () => {
    renderWithRouter(<App />);
    // verificar se as informações do pikachu são renderizadas
    const buttonEletric = screen.getByRole('button', { name: /electric/i });
    userEvent.click(buttonEletric);
    const linkMoreDetails = screen.getByRole('link', { name: /more details/i });
    expect(linkMoreDetails).toHaveAttribute('href', '/pokemon/25');
  });

  test('Teste se ao clicar no link de navegação do Pokémon, é feito o redirecionamento da aplicação para a página de detalhes de Pokémon', () => {
    renderWithRouter(<App />);
    const buttonEletric = screen.getByRole('button', { name: /electric/i });
    userEvent.click(buttonEletric);
    const linkMoreDetails = screen.getByRole('link', { name: /more details/i });
    userEvent.click(linkMoreDetails);

    // verificar o titulo
    const titleDetails = screen.getByRole('heading', { name: /pikachu details/i });
    expect(titleDetails).toBeInTheDocument();
    const titleSummary = screen.getByRole('heading', { name: /summary/i });
    expect(titleSummary).toBeInTheDocument();
  });

  test('Teste também se a URL exibida no navegador muda para /pokemon/<id>, onde <id> é o id do Pokémon cujos detalhes se deseja ver', () => {
    const { history } = renderWithRouter(<App />);
    const buttonEletric = screen.getByRole('button', { name: /electric/i });
    userEvent.click(buttonEletric);
    const linkMoreDetails = screen.getByRole('link', { name: /more details/i });
    userEvent.click(linkMoreDetails);
    const { pathname } = history.location;
    expect(pathname).toBe('/pokemon/25');
  });

  test('Teste se existe um ícone de estrela nos Pokémon favoritados', () => {
    renderWithRouter(<App />);
    const buttonEletric = screen.getByRole('button', { name: /electric/i });
    userEvent.click(buttonEletric);
    const linkMoreDetails = screen.getByRole('link', { name: /more details/i });
    userEvent.click(linkMoreDetails);
    // clicar em favoritar o pokemon e verificar se a estrela aparece
    const checkboxFavorite = screen.getByRole('checkbox', { name: /pokémon favoritado\?/i });
    userEvent.click(checkboxFavorite);
    const starImg = screen.getByRole('img', { name: /pikachu is marked as favorite/i });
    expect(starImg).toBeInTheDocument();
    expect(starImg).toHaveAttribute('src', '/star-icon.svg');
  });
});
