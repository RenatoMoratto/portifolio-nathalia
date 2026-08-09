import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMobileMenu } from './useMobileMenu';

function mountMenuDom() {
  const trigger = document.createElement('button');
  const panel = document.createElement('div');
  panel.innerHTML =
    '<a href="/">Home</a><a href="/about">About</a><button type="button">CV</button>';
  document.body.append(trigger, panel);

  const [firstLink, lastLink] = Array.from(panel.querySelectorAll('a'));
  const resume = panel.querySelector('button')!;
  return { trigger, panel, firstLink, lastLink, resume };
}

function pressKey(key: string, init: KeyboardEventInit = {}) {
  // Allow assertions on preventDefault.
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    document.dispatchEvent(event);
  });
  return event;
}

function renderOpenMenu(pathname = '/') {
  const dom = mountMenuDom();
  const view = renderHook(({ path }) => useMobileMenu(path), {
    initialProps: { path: pathname },
  });

  view.result.current.panelRef.current = dom.panel;
  view.result.current.triggerRef.current = dom.trigger;
  act(() => view.result.current.toggle());

  return { ...view, ...dom };
}

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  vi.restoreAllMocks();
});

describe('useMobileMenu', () => {
  it('toggles open and closed', () => {
    const { result } = renderOpenMenu();
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('closes on Escape', () => {
    const { result } = renderOpenMenu();

    pressKey('Escape');
    expect(result.current.isOpen).toBe(false);
  });

  it('closes when the route changes', () => {
    const { result, rerender } = renderOpenMenu('/');

    rerender({ path: '/about' });
    expect(result.current.isOpen).toBe(false);
  });

  it('locks body scroll while open and restores it on close', () => {
    document.body.style.overflow = 'auto';
    const { result } = renderOpenMenu();
    expect(document.body.style.overflow).toBe('hidden');

    act(() => result.current.close());
    expect(document.body.style.overflow).toBe('auto');
  });

  it('releases the scroll lock if the panel unmounts while open', () => {
    const { unmount } = renderOpenMenu();
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('moves focus into the panel on open and back to the toggle on close', () => {
    const { result, trigger, firstLink } = renderOpenMenu();
    expect(document.activeElement).toBe(firstLink);

    act(() => result.current.close());
    expect(document.activeElement).toBe(trigger);
  });

  it('does not touch focus when it was never opened', () => {
    const trigger = document.createElement('button');
    const other = document.createElement('input');
    document.body.append(trigger, other);
    other.focus();

    renderHook(() => useMobileMenu('/'));
    expect(document.activeElement).toBe(other);
  });

  it('wraps Tab from the last panel item back to the toggle', () => {
    const { trigger, resume } = renderOpenMenu();
    resume.focus();

    const event = pressKey('Tab');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('wraps Shift+Tab from the toggle to the last panel item', () => {
    const { trigger, resume } = renderOpenMenu();
    trigger.focus();

    const event = pressKey('Tab', { shiftKey: true });
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(resume);
  });

  it('leaves Tab alone in the middle of the cycle', () => {
    const { firstLink } = renderOpenMenu();
    firstLink.focus();

    expect(pressKey('Tab').defaultPrevented).toBe(false);
  });

  it('ignores keys while closed', () => {
    const dom = mountMenuDom();
    const { result } = renderHook(() => useMobileMenu('/'));
    result.current.panelRef.current = dom.panel;
    result.current.triggerRef.current = dom.trigger;

    dom.resume.focus();
    expect(pressKey('Tab').defaultPrevented).toBe(false);
    expect(result.current.isOpen).toBe(false);
  });
});
