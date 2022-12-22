# Airwallex Platform Onboarding SDK

## Installation

Install with Yarn

```
yarn add @airwallex/platform-onboarding-sdk
```

Or, with NPM

```
npm install @airwallex/platform-onboarding-sdk
```

## Initialization

```ts
import { loadScript } from '@airwallex/platform-onboarding-sdk';

const sdk = await loadScript({
  env: 'demo', // 'staging' | 'demo' | 'prod'
  version: 'v1',
});
```

```ts
import { init } from '@airwallex/platform-onboarding-sdk';

await sdk.init(options);
```

| Option         | Type     | Description  |
| :------------- | :------- | :----------- |
| `langKey`      | `string` | **Optional** |
| `sandbox`      | `string` | **Optional** |
| `clientId`     | `string` | **Required** |
| `authCode`     | `string` | **Required** |
| `codeVerifier` | `string` | **Required** |

#### Usage/Examples

```ts
await sdk.init({
  clientId: "",
});
```

### Element

```ts
import { createElement } from '@airwallex/platform-onboarding-sdk';

sdk.createElement(options);
```

| Parameter | Type                      | Description                          |
| :-------- | :------------------------ | :----------------------------------- |
| `type`    | `string`                  | **Required**. Supported types: `kyc` |
| `options` | `Record<string, unknown>` | **Optional**.                        |


#### Usage/Examples

```ts
const element = await sdk.createElement({
  type: "kyc",
});
```

### Element Events

Subscribe to element events to handle life cycles of an element
| Event Code | Description                                                      |
| :--------- | :--------------------------------------------------------------- |
| `ready`    | This event fires when element is rendered                        |
| `submit`   | This event fires when submit action is taken                     |
| `success`  | This event fires when submission action is finished successfully |
| `error`    | This event fires when error occurs within the element            |
| `cancel`   | This event fires when the element is exited by cancellation      |

#### Usage/Examples

```javascript
// bind event listener to an element
element.on(EVENT_NAME, callback);
```
