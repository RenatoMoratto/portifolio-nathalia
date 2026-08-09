import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

const sendContactForm = vi.fn();

vi.mock('../services/contact', () => ({
  sendContactForm: (...args: unknown[]) => sendContactForm(...args),
}));

// Echo keys because i18n is not initialized in unit tests.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const { useContactForm } = await import('./useContactForm');

function mountForm(result: {
  current: { formRef: { current: HTMLFormElement | null } };
}) {
  const form = document.createElement('form');
  document.body.appendChild(form);
  result.current.formRef.current = form;
  return form;
}

function fill(
  result: { current: ReturnType<typeof useContactForm> },
  values: { name?: string; email?: string; message?: string },
) {
  act(() => {
    if (values.name !== undefined) result.current.setField('name', values.name);
    if (values.email !== undefined) result.current.setField('email', values.email);
    if (values.message !== undefined) result.current.setField('message', values.message);
  });
}

const submit = async (result: { current: ReturnType<typeof useContactForm> }) => {
  await act(async () => {
    await result.current.handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent);
  });
};

const VALID = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'This message is definitely long enough.',
};

describe('useContactForm validation', () => {
  beforeEach(() => {
    sendContactForm.mockReset();
    sendContactForm.mockResolvedValue({ ok: true });
    document.body.innerHTML = '';
  });

  it('blocks submission and reports every empty field', async () => {
    const { result } = renderHook(() => useContactForm());
    mountForm(result);

    await submit(result);

    expect(result.current.errors.name).toBe('contact.form.name.error.required');
    expect(result.current.errors.email).toBe('contact.form.email.error.required');
    expect(result.current.errors.message).toBe('contact.form.message.error.required');
    expect(sendContactForm).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    fill(result, { ...VALID, email: 'not-an-email' });

    await submit(result);

    expect(result.current.errors.email).toBe('contact.form.email.error.invalid');
    expect(sendContactForm).not.toHaveBeenCalled();
  });

  it('rejects a message shorter than the minimum', async () => {
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    fill(result, { ...VALID, message: 'too short' });

    await submit(result);

    expect(result.current.errors.message).toBe('contact.form.message.error.min');
    expect(sendContactForm).not.toHaveBeenCalled();
  });

  it('treats whitespace-only input as empty', async () => {
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    fill(result, { name: '   ', email: '  ', message: '     ' });

    await submit(result);

    expect(result.current.errors.name).toBe('contact.form.name.error.required');
    expect(sendContactForm).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the user edits that field', async () => {
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    await submit(result);
    expect(result.current.errors.name).toBeTruthy();

    fill(result, { name: 'Ada' });
    expect(result.current.errors.name).toBeUndefined();
  });
});

describe('useContactForm submission', () => {
  beforeEach(() => {
    sendContactForm.mockReset();
    sendContactForm.mockResolvedValue({ ok: true });
    document.body.innerHTML = '';
  });

  it('sends and reports success, then resets the fields', async () => {
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    fill(result, VALID);

    await submit(result);

    expect(sendContactForm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(result.current.status.kind).toBe('success'));
    expect(result.current.values).toEqual({ name: '', email: '', message: '' });
  });

  it('surfaces a send failure instead of swallowing it', async () => {
    sendContactForm.mockResolvedValue({ ok: false, reason: 'send-failed' });
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    fill(result, VALID);

    await submit(result);

    expect(result.current.status).toEqual({ kind: 'error', reason: 'send-failed' });
  });

  it('distinguishes a misconfigured form from a network failure', async () => {
    sendContactForm.mockResolvedValue({ ok: false, reason: 'unconfigured' });
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    fill(result, VALID);

    await submit(result);

    expect(result.current.status).toEqual({ kind: 'error', reason: 'unconfigured' });
  });

  it('keeps the entered values when sending fails', async () => {
    sendContactForm.mockResolvedValue({ ok: false, reason: 'send-failed' });
    const { result } = renderHook(() => useContactForm());
    mountForm(result);
    fill(result, VALID);

    await submit(result);

    expect(result.current.values.message).toBe(VALID.message);
  });
});
