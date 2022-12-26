export type Config = {
  gatewayUrl: string;
  options?: Pick<InitOptions, 'env' | 'langKey'>;
};

/**
 * Indicate which airwallex integration env your merchant site would like to connect with
 */
export type AirwallexEnv = 'staging' | 'demo' | 'prod';

export type AirwallexOnboarding = {
  init: typeof init;
  createElement: typeof createElement;
};

/**
 * Global init option config for Airwallex javascript SDK
 */
export type InitOptions = {
  /**
   * Indicate which airwallex integration env your merchant site would like to connect with
   * If not provide default will be prod which point to [Airwallex Checkout](https://checkout.airwallex.com)
   */
  env?: AirwallexEnv;
  /**
   *  Scoped auth code to exchange for scoped access token to authorize platform to make API call
   */
  authCode: string;
  /**
   * The ID of platform application issued by Airwallex
   */
  clientId: string;
  /**
   * Served as proof key for code exchange in authorization code flow
   */
  codeVerifier: string;
  /**
   * i18n localization config, default is 'en'
   */
  langKey?: 'en' | 'zh';
};

export type Result = {
  success: boolean;
  code?: string;
  message?: string;
};

/**
 * The first method call to init element integration
 */
export declare const init: (options: InitOptions) => Promise<Result>;

/**
 * Create element
 */
export declare function createElement(
  elementType: ElementType,
  options: ElementOptionsTypeMap[ElementType]
): Element | null;

/**
 * Define of error code
 */
export type ERROR_CODE =
  | 'NO_AUTH_CODE'
  | 'UNAUTHORIZED'
  | 'SUBMIT_FAILED'
  | 'CREATE_ELEMENT_ERROR'
  | 'MOUNT_ELEMENT_ERROR'
  | 'UNKNOWN';

/**
 * Event code supported value by element when user interact with the element
 *
 * `ready`: The event fires when a given element resource has loaded.
 *
 * `submit`: The event is raised when submit flow.
 *
 * `success`: The event fires when a intent is confirm with Airwallex
 *
 * `error`: Error events are fired at various targets for different kinds of errors with shopper interaction,
 * refer to `ERROR_CODE` enum.
 *
 * `cancel`: The event fires when shopper click cancel button when interact with the form.
 *
 */
export type EventCode = 'ready' | 'submit' | 'success' | 'error' | 'cancel';

export type ElementType = 'kyc';

/**
 * The event object your page can listen to by below implementation:
 *
 * element.on(eventName: EventCode, (data: any) => /* Your code here *\/ );
 */
export type ElementEvent = {
  /**
   * Event name
   */
  eventName: EventCode;
  /**
   * Event data
   */
  data: any;
};

/**
 * The definition mapping of supported integration element type with it's props options used to customize the element,
 * merchant can check on each element options type for details
 */
export type ElementOptionsTypeMap = {
  kyc: {
    hideHeader: boolean;
    hideNav: boolean;
  };
};

/**
 * Config base options for element integration, support using for ElementType
 */
export type ElementOptions = Record<string, unknown>;

/**
 * Functions and external fields can be used in your integration flow with airwallex element
 *
 * ***IMPORTANT***
 *
 * Once element destroy by call function destroyElement, the element reference should not be used anymore
 */
export type Element = {
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
  on(eventCode: EventCode, handler: (eventData: Record<string, unknown>) => void): void;
};
