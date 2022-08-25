/*
Copyright 2022 ByteDance and/or its affiliates.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ExecutionContext } from 'puppeteer-core'

import { elementHandleWrapper } from './element-handle'
import { frameWrapper } from './frame'
import { jsHandleWrapper } from './js-handle'
import { createWrapper, Wrapper } from './wrapper'

// https://github.com/puppeteer/puppeteer/blob/v11.0.0/docs/api.md#class-executioncontext
export const executionContextWrapper: Wrapper<ExecutionContext> = createWrapper<ExecutionContext>(
  'ExecutionContext',
  (executionContext, options) => {
    return {
      evaluate: (pageFunction, ...args) => executionContext.evaluate(pageFunction, ...args),
      evaluateHandle: async (pageFunction, ...args) =>
        elementHandleWrapper.wrap(await executionContext.evaluateHandle(pageFunction, ...args), options) as any,
      frame: () => {
        const frame = executionContext.frame()
        return frame && frameWrapper.wrap(frame, options)
      },
      queryObjects: async (prototypeHandle) =>
        jsHandleWrapper.wrap(await executionContext.queryObjects(prototypeHandle), options),
    }
  },
)