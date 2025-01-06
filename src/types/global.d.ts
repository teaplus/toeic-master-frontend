// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    authModal: {
      isOpen: boolean;
      onClose: () => void;
      [key: string]: any; // Cho phép thêm thuộc tính khác nếu cần
    };
  }
}
