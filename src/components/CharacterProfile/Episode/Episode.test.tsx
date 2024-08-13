import { render } from '@testing-library/react';
import { Episode } from './Episode';
import { IEpisode } from '@src/types/data-contracts';

describe('<Episode />', () => {
  const mockEpisode: IEpisode = {
    id: 1,
    name: 'Test',
    air_date: '2020-02-02T00:00:01.0001',
    episode: 'S1E01',
    characters: [],
    url: 'https://test.test',
    created: '2020-02-02T00:00:01.0001',
  };

  it('should render without crashing', () => {
    render(<Episode episode={mockEpisode} />);
  });
});
