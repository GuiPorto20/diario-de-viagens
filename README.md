# Diário de Viagens

Aplicativo React Native (Expo) para registrar lugares que se quer conhecer ou que já foram visitados.
Projeto do 2º bimestre de Programação para Dispositivos Móveis I, FATEC Franca "Dr. Thomaz Novelino".

## Integrantes

- Mateus Gabriel Dos Reis
- Guilherme Porto de Melo Junqueira
- Leonardo Centeno Bonamin

## Funcionalidades

- **Lista de lugares**: miniatura da foto, nome, cidade e status; botão para adicionar.
- **Cadastro**: nome, descrição, rua, número, cidade, estado, status e foto (câmera ou galeria). O endereço é convertido em latitude/longitude com `Location.geocodeAsync`; se não for encontrado, o app avisa e não salva.
- **Detalhes**: todos os dados, foto, mini mapa, editar, marcar como Visitado e remover.
- **Mapa**: marcador com o nome de cada lugar e a localização atual (hook `useLocation`). Tocar no balão do marcador abre os detalhes.
- **Estatísticas**: gráfico de pizza por status (com legenda) e gráfico de barras por cidade, calculados a partir dos lugares cadastrados.
- Fotos tiradas na câmera são salvas na galeria do dispositivo.

## Estrutura

```
App.js                  navegação (abas + pilha)
src/context/            PlacesContext (estado compartilhado dos lugares)
src/hooks/              useLocation (localização atual)
src/components/         PlaceItem, StatusBadge
src/screens/            as 5 telas
src/theme/              cores e constantes de status
```

## Como instalar e executar

Pré-requisitos: Node.js 20 ou superior e o app **Expo Go** no celular (Android ou iOS), com o celular na mesma rede Wi-Fi do computador.

```bash
git clone https://github.com/GuiPorto20/diario-de-viagens.git
cd diario-de-viagens
npm install --legacy-peer-deps
npx expo start
```

Leia o QR Code com o Expo Go (Android) ou com a câmera (iOS). Permita localização, câmera e galeria quando solicitado.

Observações:

- A conversão de endereço em coordenadas usa o serviço do aparelho e exige internet.
- Os lugares ficam em memória: ao fechar o app, a lista é zerada.
