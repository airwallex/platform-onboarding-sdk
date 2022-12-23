import {
  Element,
  InitOptions,
  ElementType,
  AirwallexEnv,
  AirwallexOnboarding,
  ElementOptions,
  LoadScriptOptions,
  ElementOptionsTypeMap,
  init as initFn,
  createElement as createElementFn,
} from '../types';

export type { ElementType, LoadScriptOptions, InitOptions, Element, ElementOptions };

declare global {
  interface Window {
    AirwallexOnboarding: AirwallexOnboarding;
  }
}

const ENV_HOST = {
  staging: 'static-staging.airwallex.com/widgets/sdk/onboarding',
  demo: 'static-demo.airwallex.com/widgets/sdk/onboarding',
  prod: 'static.airwallex.com/widgets/sdk/onboarding',
};

export const getGatewayUrl = (env: AirwallexEnv, version: string): string =>
  `https://${ENV_HOST[env] || ENV_HOST.prod}/${version}/`;
const STATIC_FILE_NAME = 'index.js';

const createScript = (gatewayUrl: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.src = `${gatewayUrl}${STATIC_FILE_NAME}`;

  const parentDom = document.head || document.body;

  if (!parentDom) {
    throw new Error('Airwallex Onboarding SDK scripts requires a <head> or <body> html element in order to be loaded.');
  }

  parentDom.appendChild(script);

  return script;
};

export const loadScript = async (options: LoadScriptOptions) => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (window.AirwallexOnboarding) {
    return window.AirwallexOnboarding;
  }

  const MAX_RETRY_COUNT = 3;
  let RETRY_COUNT = 0;
  const sleep = () => new Promise((resolve) => window.setTimeout(resolve, 500));

  const tryToResolve = async (): Promise<AirwallexOnboarding> => {
    const scriptUrl = getGatewayUrl(options?.env || 'prod', options.version);
    const script: HTMLScriptElement =
      document.querySelector(`script[src="${scriptUrl}"], script[src="${scriptUrl}/"]`) || createScript(scriptUrl);

    return new Promise((resolve, reject) => {
      script.addEventListener('load', () => {
        if (window.AirwallexOnboarding) {
          resolve(window.AirwallexOnboarding);
        } else {
          reject(new Error('Failed to load Airwallex Onboarding SDK on load event.'));
        }
      });

      script.addEventListener('error', () => {
        reject(new Error('Failed to load Airwallex Onboarding SDK scripts.'));
        script.remove && script.remove();
      });
    });
  };

  while (RETRY_COUNT < MAX_RETRY_COUNT) {
    try {
      return await tryToResolve();
    } catch (error) {
      RETRY_COUNT++;
      await sleep();
    }
  }

  return null;
};

export const init: typeof initFn = (options: InitOptions) => {
  if (!window.AirwallexOnboarding) {
    const errMsg = 'Please loadScript() before init()';
    console.error(errMsg);
    return Promise.reject(new Error(errMsg));
  } else {
    return window.AirwallexOnboarding.init(options);
  }
};

export const createElement: typeof createElementFn = (
  type: ElementType,
  options: ElementOptionsTypeMap[ElementType]
) => {
  if (!window.AirwallexOnboarding) {
    console.error('Please loadScript() before createElement()');
    return null;
  } else {
    return window.AirwallexOnboarding.createElement(type, options);
  }
};
