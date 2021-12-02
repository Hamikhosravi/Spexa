export const validations = {

  email(str) {
    let pattern = /^\S+@\S+\.\S+$/;
    return pattern.test(str);
  },

  password(str) {
    let pattern = /(?=.*[!@#$%^&*-+_=|><~])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return pattern.test(str);
  },

  testPassword(str) {
    let pattern = /(?=.*[a-z])(?=.*[A-Z]).{2,}/;
    return pattern.test(str);
  },

};
