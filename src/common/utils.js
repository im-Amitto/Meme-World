import { toast } from "react-toastify";

export const noop = () => {};

export const showToastr = (type, ...rest) => {
  toast[type](...rest);
};

export const successErrorHandler = (resolve, reject) => {
  const success = (data, status) => resolve(data);
  const err = error => {
    reject && reject(error);
  };
  return {
    success,
    err
  };
};

export const showToastrError = errObj => {
  showToastr("error", errObj.error || errObj.err || "Something went wrong.", null, {
    timeOut: 0,
    extendedTimeOut: 0
  });
};