import {
  Element,
  InitOptions,
  ElementType,
  AirwallexEnv,
  AirwallexScale,
  ElementOptions,
  LoadScriptOptions,
  ElementOptionsTypeMap,
  init as initFn,
  createElement as createElementFn,
} from '../types';

export type { ElementType, LoadScriptOptions, InitOptions, Element, ElementOptions };

declare global {
  interface Window {
    AirwallexScale: AirwallexScale;
  }
}

const ENV_HOST = {
  staging: 'static-staging.airwallex.com/widgets/sdk/scale',
  demo: 'static-demo.airwallex.com/widgets/sdk/scale',
  prod: 'static-prod.airwallex.com/widgets/sdk/scale',
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

  if (window.AirwallexScale) {
    return window.AirwallexScale;
  }

  const MAX_RETRY_COUNT = 3;
  let RETRY_COUNT = 0;
  const sleep = () => new Promise((resolve) => window.setTimeout(resolve, 500));

  const tryToResolve = async (): Promise<AirwallexScale> => {
    const scriptUrl = getGatewayUrl(options?.env || 'prod', options.version);
    const script: HTMLScriptElement =
      document.querySelector(`script[src="${scriptUrl}"], script[src="${scriptUrl}/"]`) || createScript(scriptUrl);

    return new Promise((resolve, reject) => {
      script.addEventListener('load', () => {
        if (window.AirwallexScale) {
          resolve(window.AirwallexScale);
        } else {
          reject(new Error('Failed to load Airwallex Onboarding SDK on load event'));
        }
      });

      script.addEventListener('error', () => {
        reject(new Error('Failed to load Airwallex Onboarding SDK scripts'));
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
  if (!window.AirwallexScale) {
    const errMsg = 'Please loadScript() before init()';
    console.error(errMsg);
    return Promise.reject(new Error(errMsg));
  } else {
    return window.AirwallexScale.init(options);
  }
};

export const createElement: typeof createElementFn = (
  type: ElementType,
  options: ElementOptionsTypeMap[ElementType]
) => {
  if (!window.AirwallexScale) {
    console.error('Please loadScript() before createElement()');
    return null;
  } else {
    return window.AirwallexScale.createElement(type, options);
  }
};
