import type {Exact} from '../types';

import type {ThemeBase} from './base';
import type {DeepPartial, ThemeShape} from './types';

/**
 * Identity function creator that simply returns the provided theme,
 * but additionally validates the input matches the type exactly
 * and infers all members.
 *
 * TODO: Replace all instances with `satisfies` when we upgrade
 * to TypeScript >=4.9
 *
 * @example
 * ```
 * type ExampleShape = { [key: string]: string }
 * const createExample = createExact<ExampleShape>()
 *
 * const example = createExample({
 *  foo: 'bar',
 * })
 * ```
 *
 * Where `typeof example` is inferred as `{ foo: string }`
 */
function createExact<T extends object>() {
  return <U extends Exact<T, U>>(obj: U) => obj;
}

export const createThemeBase = createExact<ThemeShape>();

export const createThemeVariantPartial = createExact<DeepPartial<ThemeBase>>();