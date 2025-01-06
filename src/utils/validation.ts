export const validateUsername = (username: string): string | null => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!username) {
    return "Tên đăng nhập không được để trống!";
  }
  if (!usernameRegex.test(username)) {
    return "Tên đăng nhập không hợp lệ! (3-20 ký tự, chỉ cho phép chữ cái, số và dấu gạch dưới)";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  const passwordRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!password) {
    return "Mật khẩu không được để trống!";
  }
  if (!passwordRegex.test(password)) {
    return "Mật khẩu phải có ít nhất 4 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email không được để trống!";
  }
  if (!emailRegex.test(email)) {
    return "Email không hợp lệ!";
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return "Xác nhận mật khẩu không được để trống!";
  }
  if (password !== confirmPassword) {
    return "Mật khẩu và xác nhận mật khẩu không khớp!";
  }
  return null;
};
