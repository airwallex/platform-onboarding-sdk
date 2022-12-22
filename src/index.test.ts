import { getGatewayUrl } from '.';

describe('getGatewayUrl', () => {
  it('should return correct url', () => {
    const url = getGatewayUrl('staging', 'v2');
    expect(url).toBe('https://static-staging.airwallex.com/widgets/sdk/onboarding/v2/');
  });
});
