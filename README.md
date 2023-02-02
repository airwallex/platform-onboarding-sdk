# Airwallex Platform Onboarding SDK

## Installation
Option 1: Use @airwallex/platform-onboarding-sdk
Install with Yarn

```bash
yarn add @airwallex/platform-onboarding-sdk
```

Or, with NPM

```bash
npm install @airwallex/platform-onboarding-sdk
```

Option 2: Import as a static resource
```html
<script src=”https://static.airwallex.com/widgets/sdk/onboarding/v1/index.js” />
```

## Initialization
```ts
import { init } from '@airwallex/platform-onboarding-sdk';

await init(options);

// Or
await window.airwallexOnboarding.init(options);
```

| Option         | Type     | Required? | Default value | Description                                                                                                                                                         |
| :------------- | :------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `env`          | `string` | **NO**    | `prod`        | The Airwallex environment you want to integrate your application with. Options include: `staging`, `demo`, `prod`                                                   |
| `langKey`      | `string` | **NO**    | `en`          | Language. Options include: `en`, `zh`                                                                                                                               |
| `clientId`     | `string` | **YES**   | -             | Your unique Client ID issued by Airwallex. You can find the client id on [`Airwallex WebApp - Developer - API Keys`](https://www.airwallex.com/app/account/apiKeys) |
| `authCode`     | `string` | **YES**   | -             | Auth code to authenticate the connected account retrieved from `/api/v1/accounts/{id}/authorize`                                                                    |
| `codeVerifier` | `string` | **YES**   | -             | Serves as proof key for code exchange (see RFC 7636 Section 4). A random string picked by yourself, and used to generate the codeChallenge.                         |

#### Usage/Examples

```ts
await init({
  langKey: 'en',
  env: 'prod',
  authCode: 'x4D7A7wOSQvoygpwqweZpG0GFHTcQfVPBTZoKV7EibgH',
  clientId: 'BIjjMYsYTPuRqnkEloSvvf',
  codeVerifier: '~wh344Lea1FsCMVH39Fn9R2~nqq2uyD4wbvG9XCzWRxd0sZh9MFiF9gSVkM0C-ZvrdtjBFA6Cw1EvCpJcIjaeXg1-BXCfZd25ZmvuYZAqZtjJQA3NAa~7X1sgEfbMZJwQ',
});
```

### Element

Call `createElement(type, options)` to create an element object.

```ts
import { createElement } from '@airwallex/platform-onboarding-sdk';

createElement(options);

// Or
window.AirwallexOnboarding.createElement(options);
```

#### Method parameters

| Parameter | Type                      | Required? | Description                                                                                   |
| :-------- | :------------------------ | :-------- | :-------------------------------------------------------------------------------------------- |
| `type`    | `string`                  | **YES**   | The type of element you are creating. Supported types: `kyc`                                  |
| `options` | `Record<string, unknown>` | **NO**    | Options for creating an Element, which differ for each Element. Refer to the following table. |

#### `options` object properties:

| Element type | Property     | Required? | Default value | Type      | Description                                                                                                                                                                                                                                                                                             |
| :----------- | :----------- | :-------- | :------------ | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `kyc`        | `hideHeader` | **NO**    | `false`       | `boolean` | Used to hide the page's header                                                                                                                                                                                                                                                                          |
|              | `hideNav`    | **NO**    | `false`       | `boolean` | Used to hide the page's navigation, which is heavily tied to the progression of the onboarding exercise. It is important to note that the user can review completed items, and edit if they need to adjust content. In addition, the user has another option to edit the form on the final review page. |

#### `element` object

```ts
export type EVENT_TYPE = 'ready' | 'success' | 'error' | 'cancel'

interface Element {
  /**
   * Element integration `step #3`
   * Mount element to your HTML DOM element
   */
  mount(domElement: string | HTMLElement): void;
  /**
   * Using this function to unmount the element, opposite to mount function
   * The element instance is still kept
   */
  unmount(): void;
  /**
   * Using this function to destory the element instance
   */
  destroy(): void;
  /**
   * Listen to event
   */
  on(eventCode: EVENT_TYPE, handler: (eventData: Record<string, unknown>) => void): void;
}
```

#### Usage/Examples

Create the kyc element

```ts
const element = await createElement({
  type: 'kyc',
  options: {
    hideHeader: true,
    hideNav: true,
  },
});
```

Mount the element to your page

```ts
const containerElement = document.getElementById('onboarding');
element.mount(containerElement);
```

### Element Events

Subscribe to element events to handle life cycles of an element.

#### `ready`

This event will be fired when:
- Consent page is ready, if it is enabled. The event data will be `{ type: 'consent'}`. Use this event to decide when to remove loading status from your page.
- Kyc page is ready. The event data will be `{type: 'kyc', kycStatus: 'INIT'}`, which represents the account's onboarding status. Use `kycStatus` to render your own status pages and handle re-entry scenarios.

Type

```ts
type kycEventData = {
  type: 'kyc',
  kycStatus: 'INIT' | 'SUBMITTED' | 'SUCCESS' | 'FAILURE'
};

type consentEventData = {
  type: 'consent'
};

element.on('ready', (data: kycEventData | consentEventData) => void);
```

Example

```ts
element.on('ready', (data: kycEventData | consentEventData) => {
  // Handle ready event
});
```

#### `success`

This event fires when the onboarding flow is completed successfully.

Type

```ts
element.on('success', () => void);
```

Example

```ts
element.on('success', () => {
  // Handle success event
});
```

#### `cancel`

This event fires when the component is exited by cancellation.

Type

```ts
element.on('cancel', () => void);
```

Example

```ts
element.on('cancel', () => {
  // Handle cancel event
});
```

#### `error`

This event fires when an error occurs within the component.

Type

```ts
type errorCode = 'API_ERROR' | 'SUBMIT_FAILED' | 'UNKNOWN';
type ErrorData = { code: errorCode, message?: string }

element.on('error', (data: ErrorData) => void);
```

Example

```ts
element.on('error', (data: ErrorData) => {
  // Handle error event
});
```
