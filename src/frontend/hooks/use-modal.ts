import { useCallback } from 'react';
import useSWR from 'swr';

import type { ModalProps } from '@src/frontend/components/ui/Modal';

const MODAL_KEY = '@modal' as const;

const initialModalProps: Omit<ModalProps, 'close'> = {
  show: false,
  title: '',
  content: '',
  actionButton: { label: '', onClick: () => {} },
};

export function useModal() {
  const { data: modal, mutate: setModal } = useSWR(MODAL_KEY, {
    fallbackData: initialModalProps,
    fetcher: undefined,
  });

  const closeModal = useCallback(() => {
    setModal((prevModal) => ({ ...prevModal!, show: false }), false);
    setTimeout(() => {
      setModal(initialModalProps, false);
    }, 300);
  }, [setModal]);

  const showModal = useCallback(
    (modalProps: Omit<ModalProps, 'show' | 'close'>) => {
      setModal({ ...modalProps, show: true }, false);
    },
    [setModal],
  );

  return { modal: modal!, showModal, closeModal };
}
