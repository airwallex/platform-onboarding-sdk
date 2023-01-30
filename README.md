# Airwallex Platform Onboarding SDK

## Installation

Install with Yarn

```bash
yarn add @airwallex/platform-onboarding-sdk
```

Or, with NPM

```bash
npm install @airwallex/platform-onboarding-sdk
```

## Initialization

```ts
import { init } from '@airwallex/platform-onboarding-sdk';

await init(options);
```

| Option         | Type     | Required? | Default value | Description |
| :------------- | :------- | :----------- | :----------- | :----------- |
| `env`          | `string` | **NO** | `prod` | The Airwallex environment you want to integrate your application with. Options include: `staging`, `demo`, `prod` |
| `langKey`      | `string` | **NO** | `en` | Language. Options include: `en`, `zh` |
| `clientId`     | `string` | **YES** | - | Your unique Client ID issued by Airwallex. You can find the client id on [`Airwallex WebApp - Developer - API Keys`](https://www.airwallex.com/app/account/apiKeys) |
| `authCode`     | `string` | **YES** | - | Auth code to authenticate the connected account retrieved from `/api/v1/accounts/{id}/authorize` |
| `codeVerifier` | `string` | **YES** | - | Serves as proof key for code exchange (see RFC 7636 Section 4). A random string picked by yourself, and used to generate the codeChallenge. |

#### Usage/Examples

```ts
// initialize window.AirwallexOnboarding
await init({
  authCode: "",
  clientId: "",
  codeVerifier: "",
});
```

### Element

```ts
import { createElement } from '@airwallex/platform-onboarding-sdk';

createElement(options);

// Or
window.AirwallexOnboarding.createElement(options);
```

#### Method parameters

| Parameter | Type                      | Required? | Description                         |
| :-------- | :------------------------ | :------- | :----------------------------------- |
| `type`    | `string`                  | **YES**  | The type of element you are creating. Supported types: `kyc` |
| `options` | `Record<string, unknown>` | **NO**   | Options for creating an Element, which differ for each Element. Refer to the following table.                       |

#### `options` object properties:

| Element type | Property     | Required? | Type      | Description                    |
| :----------- | :-------     | :-------- | :-------- | :----------------------------- |
| `kyc`        | `hideHeader` | **NO**    | `boolean` | Used to hide kyc page’s header |
|              | `hideNav`    | **NO**    | `boolean` | Used to hide kyc page’s navigation bar |

#### `Element` Interface

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

```ts
const element = await createElement({
  type: "kyc",
  options: {
    hideHeader: true,
    hideNav: true,
  },
});
```

### Element Events

Subscribe to element events to handle life cycles of an element.

#### `ready`

This event will be fired when:
- Consent page is ready, if it is enabled. The event data will be `{ type: 'consent'}`. Use this event to decide when to remove loading status from your page.
- Kyc page is ready. The event data will be `{type: 'kyc', kycStatus: 'INIT'}`, which represents the account's onboarding status. Use `kycStatus` to render your own status pages and handle re-entry scenarios.

**TS Interface**

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

**Example**

```ts
element.on('ready', (data: kycEventData | consentEventData) => {
  // Handle ready event
});
```

#### `success`

This event fires when the onboarding flow is completed successfully.

**TS Interface**

```ts
element.on(''success'', () => void);
```

**Example**

```ts
element.on('success', () => {
  // Handle success event
});
```

#### `cancel`

This event fires when the component is exited by cancellation.

**TS Interface**

```ts
element.on('cancel', () => void);
```

**Example**

```ts
element.on('cancel', () => {
  // Handle cancel event
});
```

#### `error`

This event fires when an error occurs within the component.

**TS Interface**

```ts
type errorCode = 'API_ERROR' | 'SUBMIT_FAILED' | 'UNKNOWN';
type ErrorData = { code: errorCode, message?: string }

element.on('error', (data: ErrorData) => void);
```

**Example**

```ts
element.on('error', (data: ErrorData) => {
  // Handle error event
});
```
