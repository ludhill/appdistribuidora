import { create } from 'zustand';
import { Produto } from '../tipos';

export interface ItemCarrinho extends Produto {
  quantidade: number;
}

interface EstadoCarrinho {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (idProduto: string) => void;
  
  aumentarQuantidade: (idProduto: string) => void;
  diminuirQuantidade: (idProduto: string) => void;
  limparCarrinho: () => void;
}

export const useCarrinhoStore = create<EstadoCarrinho>((set) => ({
  itens: [],

  adicionarAoCarrinho: (produto) =>
    set((estado) => {
      const itemExistente = estado.itens.find((item) => item.id === produto.id);
      if (itemExistente) {
        const itensAtualizados = estado.itens.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
        return { itens: itensAtualizados };
      } else {
        const novoItem: ItemCarrinho = { ...produto, quantidade: 1 };
        return { itens: [...estado.itens, novoItem] };
      }
    }),

    
  aumentarQuantidade: (idProduto) =>
    set((estado) => ({
      itens: estado.itens.map((item) =>
        item.id === idProduto
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ),
    })),

    
  diminuirQuantidade: (idProduto) =>
    set((estado) => {
      const itemAlvo = estado.itens.find((item) => item.id === idProduto);
      if (itemAlvo && itemAlvo.quantidade > 1) {
        return {
          itens: estado.itens.map((item) =>
            item.id === idProduto
              ? { ...item, quantidade: item.quantidade - 1 }
              : item
          ),
        };
      }
      
      return {
        itens: estado.itens.filter((item) => item.id !== idProduto),
      };
    }),

  removerDoCarrinho: (idProduto) =>
    set((estado) => ({
      itens: estado.itens.filter((item) => item.id !== idProduto),
    })),

  limparCarrinho: () => set({ itens: [] }),
}));
