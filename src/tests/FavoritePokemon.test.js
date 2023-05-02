import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';
import { FavoritePokemon } from '../pages';

describe('Teste o componente <FavoritePokemon.js />', () => {
  test('Teste se é exibida na tela a mensagem No favorite pokemon found, caso a pessoa não tenha Pokémon favoritos', () => {
    renderWithRouter(<FavoritePokemon />);

    // limpar o local storage
    localStorage.setItem('favoritePokemonIds', JSON.stringify([]));
    // verificar se a frase está renderizada na tela
    const p = screen.getByText(/no favorite pokémon found/i);
    expect(p).toBeInTheDocument();
  });

  test('Teste se apenas são exibidos os Pokémon favoritados.', () => {
    renderWithRouter(<App />);
    // limpar o localStorage
    localStorage.setItem('favoritePokemonIds', JSON.stringify([]));

    // clicar no botão de mais detalhes
    const buttonMoreDetails = screen.getByRole('link', { name: /more details/i });
    userEvent.click(buttonMoreDetails);

    // clicar em favoritar o pokemon (no caso é o pikachu, pois ele é o primeiro que aparece)
    const checkboxFavorite = screen.getByRole('checkbox', { name: /pokémon favoritado\?/i });
    userEvent.click(checkboxFavorite);

    // ir para a página de favoritos
    const linkFavorite = screen.getByRole('link', { name: /favorite pokémon/i });
    userEvent.click(linkFavorite);

    // verificar se as informações do pikachu são renderizadas
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(screen.getByText(/average weight: 6\.0 kg/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /pikachu sprite/i })).toBeInTheDocument();
  });
});
