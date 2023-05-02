import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';
import pokemonList from '../data';
// import { Pokedex } from '../pages';

describe('Teste o componente <Pokedex.js />', () => {
  test('Teste se a página contém um heading h2 com o texto Encountered Pokémon', () => {
    renderWithRouter(<App />);
    const title = screen.getByRole('heading', { name: /encountered pokémon/i, level: 2 });
    expect(title).toBeInTheDocument();
  });

  test('Teste se é exibido o próximo Pokémon da lista quando o botão Próximo Pokémon é clicado', () => {
    renderWithRouter(<App />);

    pokemonList.forEach((element, index) => {
      expect(screen.getByText(element.name)).toBeInTheDocument();
      const buttonNextPokemon = screen.getByRole('button', { name: /próximo pokémon/i });
      userEvent.click(buttonNextPokemon);
      // outro modo para verificar o nome do pokemon:
      // const pokemonName = screen.getByTestId('pokemon-name');
      // expect(pokemonName).toHaveTextContent(element.name);

      // verificar se ao chegar no ultimo pokemon da lista, ao clicar no botão próximo pokemon, ele retorna para o primeiro pokemon da lista
      if (index === pokemonList.length - 1) {
        expect(screen.getByText(pokemonList[0].name)).toBeInTheDocument();
      }
    });
  });

  test('Teste se é mostrado apenas um Pokémon por vez', () => {
    renderWithRouter(<App />);
    const pokemonName = screen.getAllByTestId('pokemon-name');
    expect(pokemonName).toHaveLength(1);
  });

  test('Teste se a Pokédex tem os botões de filtro', () => {
    renderWithRouter(<App />);

    // testando se existe o botão All
    const buttonAll = screen.getByRole('button', { name: 'All' });
    expect(buttonAll).toBeInTheDocument();

    // gerando a lista com os tipos de pokemon
    const pokemonTypes = [];
    pokemonList.forEach(({ type }) => {
      if (!pokemonTypes.includes(type)) {
        pokemonTypes.push(type);
      }
    });

    // testando se existe um botão para cada tipo de pokemon (outro modo)
    // pokemonTypes.forEach((type) => {
    //   const buttonType = screen.getByRole('button', { name: type }); // O texto do botão deve corresponder ao nome do tipo
    //   expect(buttonType).toBeInTheDocument();
    // });

    // testando se os botões de filtragem por tipo possuem o data-testid=pokemon-type-button e se existe um botão de filtragem para cada tipo de Pokémon, sem repetição
    const buttonsType = screen.getAllByTestId('pokemon-type-button');
    expect(buttonsType).toHaveLength(pokemonTypes.length);
    buttonsType.forEach((button, index) => {
      expect(button).toHaveTextContent(pokemonTypes[index]);
    });

    // A partir da seleção de um botão de tipo, a Pokédex deve circular somente pelos Pokémon daquele tipo
    buttonsType.forEach((button, index) => {
      // clica no botão do tipo
      userEvent.click(button);
      // com Filter: filtra da lista de pokemons aqueles cujo o tipo seja igual ao texto do botão.
      // com ForEach: testa se o nome do pokemon da lista filtrada está renderizado na tela, após isso clica no botão de proximo, até percorrer toda a lista de pokemons filtradas
      pokemonList
        .filter(({ type }) => type === pokemonTypes[index])
        .forEach((filteredPokemon) => {
          expect(screen.getByText(filteredPokemon.name)).toBeInTheDocument();
          const buttonNextPokemon = screen.getByRole('button', { name: /próximo pokémon/i });
          userEvent.click(buttonNextPokemon);
          expect(buttonAll).toBeVisible(); // O botão All precisa estar sempre visível
        });
    });
  });

  test('Teste se a Pokédex contém um botão para resetar o filtro', () => {
    renderWithRouter(<App />);

    // O texto do botão deve ser All;
    const buttonAll = screen.getByRole('button', { name: 'All' });
    expect(buttonAll).toBeInTheDocument();

    // A Pokedéx deverá mostrar os Pokémon normalmente (sem filtros) quando o botão All for clicado;

    // primeiro clica no botão eletric e verifica se o botão de next pokemon foi desabilitado
    const buttonEletric = screen.getByRole('button', {
      name: /electric/i,
    });
    const buttonNextPokemon = screen.getByRole('button', { name: /próximo pokémon/i });
    userEvent.click(buttonEletric);
    expect(buttonNextPokemon).toBeDisabled();

    // em seguida, clica no botão All e verifica se agora todos os pokemons são renderizados, retirando-se o filtro
    userEvent.click(buttonAll);
    pokemonList.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
      userEvent.click(buttonNextPokemon);
    });
  });
});
