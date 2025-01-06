export const ButtonCustom = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
    >
      {children}
    </button>
  );
};
