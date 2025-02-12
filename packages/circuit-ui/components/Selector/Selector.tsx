/**
 * Copyright 2019, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @jsx jsx */
import React, { Fragment, Ref, HTMLProps } from 'react';
import { css, jsx } from '@emotion/core';
import { Dispatch as TrackingProps } from '@sumup/collector';

import styled, { StyleProps } from '../../styles/styled';
import {
  focusOutline,
  hideVisually,
  disableVisually,
} from '../../styles/style-mixins';
import { uniqueId } from '../../util/id';
import useClickHandler from '../../hooks/use-click-handler';
import deprecate from '../../util/deprecate';

export interface SelectorProps extends HTMLProps<HTMLInputElement> {
  /**
   * Value string for input.
   */
  value: string;
  /**
   * A unique identifier for the input field. If not defined, a randomly generated id is used.
   */
  id?: string;
  /**
   * The name of the selector.
   */
  name?: string;
  /**
   * Whether the selector is selected or not.
   */
  checked?: boolean;
  /**
   * Whether the selector is disabled or not.
   */
  disabled?: boolean;
  /**
   * Whether the user can select multiple options.
   */
  multiple?: boolean;
  /**
   * Removes the default bottom margin from the input.
   */
  noMargin?: boolean;
  /**
   * The ref to the html dom element
   */
  ref?: Ref<HTMLInputElement>;
  /**
   * Additional data that is dispatched with the tracking event.
   */
  tracking?: TrackingProps;
}

type LabelElProps = Pick<SelectorProps, 'disabled' | 'noMargin'>;

const baseStyles = ({ theme }: StyleProps) => css`
  label: selector__label;
  display: block;
  cursor: pointer;
  padding: ${theme.spacings.mega} ${theme.spacings.giga};
  border-radius: ${theme.borderRadius.giga};
  background-color: ${theme.colors.white};
  text-align: center;
  position: relative;
  margin-bottom: ${theme.spacings.mega};

  &::before {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${theme.borderRadius.giga};
    border: ${theme.borderWidth.kilo} solid ${theme.colors.n300};
    transition: border 0.1s ease-in-out;
  }

  &:hover {
    background-color: ${theme.colors.n100};

    &::before {
      border-color: ${theme.colors.n500};
    }
  }

  &:active {
    background-color: ${theme.colors.n200};

    &::before {
      border-color: ${theme.colors.n700};
    }
  }
`;

const disabledStyles = ({ disabled }: LabelElProps) =>
  disabled &&
  css`
    label: selector__label--disabled;
    ${disableVisually()};
  `;

const noMarginStyles = ({ noMargin }: LabelElProps) => {
  if (!noMargin) {
    deprecate(
      [
        'The default outer spacing in the Selector component is deprecated.',
        'Use the `noMargin` prop to silence this warning.',
        'Read more at https://github.com/sumup-oss/circuit-ui/issues/534.',
      ].join(' '),
    );
    return null;
  }
  return css`
    label: selector__label--no-margin;
    margin-bottom: 0;
  `;
};

const SelectorLabel = styled('label')<LabelElProps>(
  baseStyles,
  disabledStyles,
  noMarginStyles,
);

const inputStyles = ({ theme }: StyleProps) => css`
  label: selector__input;
  ${hideVisually()};

  &:focus + label::before {
    ${focusOutline({ theme })};
  }

  &:checked + label {
    background-color: ${theme.colors.p100};

    &::before {
      border: ${theme.borderWidth.mega} solid ${theme.colors.p500};
    }
  }
`;

const SelectorInput = styled('input')<SelectorProps>(inputStyles);

/**
 * A selector allows users to choose between several mutually-exclusive choices
 * accompanied by descriptions, possibly with tabular data.
 */
export const Selector = React.forwardRef(
  (
    {
      children,
      value,
      id,
      name,
      disabled,
      multiple,
      checked,
      onChange,
      tracking,
      className,
      style,
      noMargin,
      ...props
    }: SelectorProps,
    ref: SelectorProps['ref'],
  ) => {
    const inputId = id || uniqueId('selector_');
    const type = multiple ? 'checkbox' : 'radio';
    const handleChange = useClickHandler(onChange, tracking, 'selector');

    return (
      <Fragment>
        <SelectorInput
          type={type}
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onClick={handleChange}
          onChange={() => {
            /**
             * Noop to silence React warning:
             * https://github.com/facebook/react/issues/3070#issuecomment-73311114
             * Change is handled by onClick which has better browser support:
             * https://stackoverflow.com/a/5575369/4620154
             */
          }}
          ref={ref}
          {...props}
        />
        <SelectorLabel
          htmlFor={inputId}
          disabled={disabled}
          className={className}
          style={style}
          noMargin={noMargin}
        >
          {children}
        </SelectorLabel>
      </Fragment>
    );
  },
);

Selector.displayName = 'Selector';
