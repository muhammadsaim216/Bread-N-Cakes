export type ToastType = 'success' | 'error' | 'info';

export interface ToastEventDetail {
  message: string;
  type: ToastType;
}

export const toast = {
  success: (message: string) => {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>('toast-notification', {
        detail: { message, type: 'success' },
      })
    );
  },
  error: (message: string) => {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>('toast-notification', {
        detail: { message, type: 'error' },
      })
    );
  },
  info: (message: string) => {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>('toast-notification', {
        detail: { message, type: 'info' },
      })
    );
  },
};
