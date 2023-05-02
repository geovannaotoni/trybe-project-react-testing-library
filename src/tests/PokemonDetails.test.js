import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';
import pokemonList from '../data';

describe('Teste o componente <PokemonDetails.js />', () => {
  test('Teste se as informações detalhadas do Pokémon selecionado são mostradas na tela', () => {
    renderWithRouter(<App />);
    // verificar se as informações do pikachu são renderizadas na página de detalhes
    // primeiro clica para filtrar os pokemons eletrics (o pikachu é o único)
    const buttonEletric = screen.getByRole('button', { name: /electric/i });
    userEvent.click(buttonEletric);

    // em seguida, clica no botão mais detalhes, que redireciona para a página /pokemon/25
    const linkMoreDetails = screen.getByRole('link', { name: /more details/i });
    userEvent.click(linkMoreDetails);

    expect(screen.getByTestId('pokemon-name')).toHaveTextContent(/pikachu/i);
    expect(screen.getByTestId('pokemon-type')).toHaveTextContent(/electric/i);
    expect(screen.getByTestId('pokemon-weight')).toHaveTextContent(/average weight: 6\.0 kg/i);
    const img = screen.getByRole('img', { name: /pikachu sprite/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveProperty('src', 'https://archives.bulbagarden.net/media/upload/b/b2/Spr_5b_025_m.png');

    // A página deve conter um texto <name> Details, onde <name> é o nome do Pokémon
    const titleDetails = screen.getByRole('heading', { name: /pikachu details/i });
    expect(titleDetails).toBeInTheDocument();

    // A seção de detalhes deve conter um heading h2 com o texto Summary
    const titleSummary = screen.getByRole('heading', { name: /summary/i });
    expect(titleSummary).toBeInTheDocument();

    // A seção de detalhes deve conter um parágrafo com o resumo do Pokémon específico sendo visualizado.
    const paragraph = screen.getByText(/this intelligent pokémon roasts hard berries with electricity to make them tender enough to eat\./i);
    expect(paragraph).toBeInTheDocument();

    // Não deve existir o link de navegação para os detalhes do Pokémon selecionado;
    const linkDetails = screen.queryByRole('link', { name: /more details/i });
    expect(linkDetails).not.toBeInTheDocument();
  });

  test('Teste se existe na página uma seção com os mapas contendo as localizações do Pokémon', () => {
    const { history } = renderWithRouter(<App />);
    // direcionando para a rota de detalhes do pokemon id 25 (o pikachu)
    act(() => {
      history.push('pokemon/25');
    });

    // deverá existir um heading h2 com o texto Game Locations of <name>; onde <name> é o nome do Pokémon exibido
    const title = screen.getByRole('heading', { name: /game locations of pikachu/i });
    expect(title).toBeInTheDocument();
    // lista de mapas do pikachu
    const { foundAt } = pokemonList[0];
    // A imagem da localização deve ter um atributo alt com o texto <name> location, onde <name> é o nome do Pokémon.
    const img = screen.getAllByRole('img', { name: /pikachu location/i });
    expect(img).toHaveLength(foundAt.length);
    // Todas as localizações do Pokémon devem ser mostradas na seção de detalhes. Devem ser exibidos o nome da localização e uma imagem do mapa em cada localização
    foundAt.forEach(({ location, map }, index) => {
      const em = screen.getByText(location);
      expect(em).toBeInTheDocument();
      expect(img[index]).toHaveAttribute('src', map);
    });
  });

  test('Teste se o usuário pode favoritar um Pokémon através da página de detalhes', () => {
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('pokemon/25');
    });

    // A página deve exibir um checkbox que permite favoritar o Pokémon e o label do checkbox deve conter o texto Pokémon favoritado?
    const checkboxFavorite = screen.getByRole('checkbox', { name: /pokémon favoritado\?/i });
    userEvent.click(checkboxFavorite);
    const starImg = screen.getByRole('img', { name: /pikachu is marked as favorite/i });
    expect(starImg).toBeInTheDocument();
    expect(starImg).toHaveAttribute('src', '/star-icon.svg');

    // Cliques alternados no checkbox devem adicionar e remover respectivamente o Pokémon da lista de favoritos
    userEvent.click(checkboxFavorite);
    expect(starImg).not.toBeInTheDocument();
  });
});
