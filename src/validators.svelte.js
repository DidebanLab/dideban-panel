export const checkerNameRegex = /^[A-Za-z0-9 _-]{1,100}$/;
export const agentNameRegex = /^[A-Za-z0-9 _-]{1,100}$/;

export const checkerTargetRegexes = {
  http: /^(https?:\/\/)(localhost|\d{1,3}(\.\d{1,3}){3}|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/.*)?$/,
  ping: /^(localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|\d{1,3}(\.\d{1,3}){3})$/,
};
