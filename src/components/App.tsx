import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Flex } from '@chakra-ui/react';
import { Characters } from './Characters/Characters';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CharacterProfile } from './CharacterProfile/CharacterProfile';
import { ErrorElement } from './ErrorElement/ErrorElement';

const queryClient = new QueryClient();
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Characters />,
    },
    {
      path: '/character/:id',
      element: <CharacterProfile />,
    },
  ].map((entry) => ({ ...entry, errorElement: <ErrorElement /> }))
);

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Flex alignItems="center" justifyContent="center">
        <RouterProvider router={router} />
      </Flex>
    </QueryClientProvider>
  );
};

export default App;
