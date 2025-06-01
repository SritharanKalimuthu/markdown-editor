export const getUsername = () => {
  try {
    const userJson = localStorage.getItem("updatedUser") || localStorage.getItem("user");
    const user = JSON.parse(userJson);
    return user ? user.name : "Guest";
  } catch (e) {
    return "Guest";
  }
};

export const getUseremail = () => {
  try {
    const userJson = localStorage.getItem("updatedUser") || localStorage.getItem("user");
    const user = JSON.parse(userJson);
    return user ? user.email : "guest@example.com";
  } catch (e) {
    return "guest@example.com";
  }
};

export const getuserKey = () => {
  try {
    const userJson = localStorage.getItem("updatedUser") || localStorage.getItem("user");
    const user = JSON.parse(userJson);
    return user.userKey;
  } catch (e) {
    return "guest@example.com";
  }
};